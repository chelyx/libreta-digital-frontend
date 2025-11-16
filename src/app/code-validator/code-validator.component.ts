import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import jsQR from 'jsqr';
import { ApiService } from 'src/core/service/api.service';
import { User } from 'src/core/models/user';
import { Curso } from 'src/core/models/curso';
import { UUID } from 'crypto';
import { WizardService } from 'src/core/service/wizard.service';

@Component({
  selector: 'app-code-validator',
  templateUrl: './code-validator.component.html',
  styleUrls: ['./code-validator.component.scss']
})
export class CodeValidatorComponent implements OnInit, OnDestroy {
  @Input() curso: Curso = {} as Curso;
  @Output() completed = new EventEmitter<User[]>();
  @ViewChild('video', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  token: string = '';
  cursoSeleccionado: UUID | '' = '';
  scanning: boolean = false;
  validatedStudents: User[] = [];
  notEnrolledStudents: User[] = [];
  absentStudents: User[] = [];
  lastValidated: any = null;

  videoStream: MediaStream | null = null;
  scanInterval: any = null;
  isReading = false;

  saving: boolean = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private wizard: WizardService
  ) {}

  ngOnInit(): void {
    this.toggleScanner();
    this.absentStudents = this.curso.alumnos.slice(); // copia inicial de todos los alumnos
    this.wizard.asistencias.forEach(a => {
      console.log(a)
      this.validatedStudents.push(a);
      this.absentStudents = this.absentStudents.filter(s => s.auth0Id !== a.auth0Id);
    });
  }

  async toggleScanner() {
    if (this.scanning) {
      this.stopScanner();
    } else {
      this.scanning = true;
      this.isReading = false;
      setTimeout(() => this.startScanner(), 100);
    }
  }

async startScanner() {
  const video = this.videoElement?.nativeElement;
  const canvas = this.canvasElement?.nativeElement;

  if (!video || !canvas) {
    console.error('Video o canvas no están listos', video, canvas);
    return;
  }

  try {
    this.videoStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    video.srcObject = this.videoStream;
    video.setAttribute('playsinline', 'true'); // iOS
    video.muted = true;

    // Esperar metadata y reproducción (tu navegador pedirá permiso en este punto)
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = async () => {
        try {
          await video.play();
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      // Safety fallback: si no llega onloadedmetadata en 1s (raro), intentamos continuar
      setTimeout(() => {
        if (video.readyState >= 2) resolve();
      }, 1000);
    });

    const context = canvas.getContext('2d');
    if (!context) {
      console.error('No se pudo obtener el contexto del canvas');
      return;
    }

    // --- Aquí viene el cambio clave: no detenemos la cámara al detectar, solo pausamos la lectura ---
    this.isReading = (video.readyState === video.HAVE_ENOUGH_DATA);

    // Si aún no hay frames suficientes, esperamos a que llegue el primer ready state correcto
    if (!this.isReading) {
      const wait = setInterval(() => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          clearInterval(wait);
          this.isReading = true;
        }
      }, 100);
    }

    // Iniciamos el loop de escaneo (similar al tuyo)
    if (this.scanInterval) clearInterval(this.scanInterval);
    this.scanInterval = setInterval(() => {
      // Si está pausado para procesamiento o no hay frames, no hacemos nada
      if (!this.isReading || video.readyState !== video.HAVE_ENOUGH_DATA) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrData = jsQR(imageData.data, imageData.width, imageData.height);

      if (qrData) {
        // NO llamar a this.stopScanner() aquí — mantenemos la cámara abierta
        this.isReading = false; // pausamos lecturas mientras validamos

        try {
          const url = new URL(qrData.data);
          this.token = url.searchParams.get('code') || '';
        } catch {
          this.token = qrData.data;
        }

        this.validateToken(); // validación asíncrona. cuando termine reanudamos lectura.
      }
    }, 300);

    this.snackBar.open('Apunta la cámara al código QR', 'Cerrar', { duration: 2000 });
  } catch (err) {
    console.error('Error al abrir la cámara:', err);
    this.snackBar.open('No se pudo abrir la cámara', 'Cerrar', { duration: 3000 });
    this.scanning = false;
    this.isReading = false;
  }
}

stopScanner() {
  if (this.scanInterval) {
    clearInterval(this.scanInterval);
    this.scanInterval = null;
  }

  if (this.videoStream) {
    this.videoStream.getTracks().forEach(track => track.stop());
    this.videoStream = null;
  }

  this.scanning = false;
  this.isReading = false;
}

validateToken() {
  if (!this.token ) {
    this.snackBar.open('Por favor ingrese un token', 'Cerrar', { duration: 3000 });
    this.isReading = true; // reanudar lectura si no había token
    return;
  }

  this.apiService.validateCode(this.token).subscribe({
    next: (response: User) => {
      console.log('Token validado:', response);
      if(!this.alumnoPerteneceCurso(response.auth0Id)) {
        this.notEnrolledStudents.push(response);
        this.snackBar.open('El alumno no pertenece al curso seleccionado', 'Cerrar', { duration: 3000 });
      } else {
        this.validatedStudents.push(response);
        this.absentStudents = this.absentStudents.filter(s => s.auth0Id !== response.auth0Id);
        this.snackBar.open('Token validado correctamente', 'Cerrar', { duration: 2000 });
      }
      this.token = '';
      // Reanudar lectura tras un pequeño delay para evitar re-lecturas dobles
      setTimeout(() => this.isReading = true, 1200);
    },
    error: (err) => {
      console.error('Error validando token', err);
      this.snackBar.open('Error al validar el token', 'Cerrar', { duration: 3000 });

      // Reanudar lectura para permitir reintento
      setTimeout(() => this.isReading = true, 1200);
    }
  });
}

  alumnoPerteneceCurso(alumnoId: string): boolean {
    return this.curso.alumnos.some(alumno => alumno.auth0Id === alumnoId);
  }

  remove(user: User) {
    this.validatedStudents = this.validatedStudents.filter(s => s.auth0Id !== user.auth0Id);
    this.absentStudents.push(user)
  }

  save(): void {
    if (!this.curso) return;

    this.saving = true;
    const lista = this.validatedStudents.map((user) => ({
      alumnoId: user.auth0Id,
      presente: true,
      fecha: new Date(this.curso.fecha)
    }));

   const listaAusentes = this.absentStudents.map((user) => ({
      alumnoId: user.auth0Id,
      presente: false,
      fecha: new Date(this.curso.fecha)
    }));

    console.log('Datos a enviar:', [...lista, ...listaAusentes]);

    this.apiService.saveAsistencia(this.curso.id, [...lista, ...listaAusentes]).subscribe({
      next: (res: any) =>{
        this.saving = false
        this.snackBar.open('Alumnos registrados correctamente', '',{ duration: 3000 });
        this.completed.emit(this.validatedStudents);
      },
      error: (err) => { console.error(err); this.saving = false; }
    });
  }

  get hasAnyStudents() {
    return this.validatedStudents.length > 0 ||
          this.absentStudents.length > 0 ||
          this.notEnrolledStudents.length > 0;
  }


  ngOnDestroy(): void {
    this.stopScanner();
  }
}
