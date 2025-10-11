import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import jsQR from 'jsqr';
import { ApiService } from 'src/core/service/apiService';

@Component({
  selector: 'app-code-validator',
  templateUrl: './code-validator.component.html',
  styleUrls: ['./code-validator.component.scss']
})
export class CodeValidatorComponent implements OnInit, OnDestroy {
  @ViewChild('video', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  token: string = '';
  scanning: boolean = false;
  validatedStudents: any[] = [];
  lastValidated: any = null;

  videoStream: MediaStream | null = null;
  scanInterval: any = null;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  async toggleScanner() {
    if (this.scanning) {
      this.stopScanner();
    } else {
      this.scanning = true;

      // Esperamos que Angular renderice el video
      setTimeout(() => this.startScanner(), 50);
    }
  }

  async startScanner() {
    if (!this.videoElement || !this.canvasElement) {
      console.error('Video o canvas no están listos');
      return;
    }

    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      const video = this.videoElement.nativeElement;
      video.srcObject = this.videoStream;
      video.setAttribute('playsinline', 'true'); // iOS
      video.muted = true;
      await video.play();

      const canvas = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d');
      if (!context) return;

      // Escaneo continuo
      this.scanInterval = setInterval(() => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            this.token = code.data;
            this.validateToken();
          }
        }
      }, 300);

      this.snackBar.open('Apunta la cámara al código QR', 'Cerrar', { duration: 3000 });
    } catch (err) {
      console.error('Error al abrir la cámara:', err);
      this.snackBar.open('No se pudo abrir la cámara', 'Cerrar', { duration: 3000 });
      this.scanning = false;
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
  }

  validateToken() {
    if (!this.token || this.token.trim() === '') {
      this.snackBar.open('Por favor ingrese un token', 'Cerrar', { duration: 3000 });
      return;
    }

    this.apiService.validateCode(this.token).subscribe({
      next: (response: any) => {
        this.validatedStudents.push(response);
        this.lastValidated = response;

        // Limpiar input para el siguiente QR
        this.token = '';

        // Resaltar temporalmente
        setTimeout(() => this.lastValidated = null, 3000);

        this.snackBar.open('Token validado correctamente', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error al validar el token', 'Cerrar', { duration: 3000 });
      }
    });
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }
}
