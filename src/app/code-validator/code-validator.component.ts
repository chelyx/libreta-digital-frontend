import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

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
validated: boolean = false;
studentData: any = null;
stream: MediaStream | null = null;

constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  async toggleCamera(): Promise<void> {
    if (this.scanning) {
      this.stopCamera();
    } else {
      await this.startCamera();
    }
  }

  async startCamera(): Promise<void> {
    try {
      this.scanning = true;
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      setTimeout(() => {
        if (this.videoElement) {
          this.videoElement.nativeElement.srcObject = this.stream;
        }
      }, 100);

      this.snackBar.open('Cámara activada - Escanea el código QR', 'Cerrar', { duration: 3000 });
    } catch (err) {
      console.error('Error opening camera:', err);
      this.snackBar.open('Error al abrir la cámara', 'Cerrar', { duration: 3000 });
      this.scanning = false;
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.scanning = false;
  }

  validateToken(): void {
    if (!this.token || this.token.trim() === '') {
      this.snackBar.open('Por favor ingrese un token', 'Cerrar', { duration: 3000 });
      return;
    }

    // Cambiá esta URL por la de tu backend
    this.http.post('http://localhost:8080/api/validate-token', { token: this.token }).subscribe({
      next: (response: any) => {
        this.validated = true;
        this.studentData = response;
        this.snackBar.open('Token validado correctamente', 'Cerrar', { duration: 3000 });
      },
      error: (error: any) => {
        this.snackBar.open('Error al validar el token', 'Cerrar', { duration: 3000 });
      }
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}
