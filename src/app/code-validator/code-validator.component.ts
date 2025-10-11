import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import jsQR from 'jsqr';

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
scanningInterval: any = null;

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
          const video = this.videoElement.nativeElement;
          video.srcObject = this.stream;
          video.play();

          // Iniciar escaneo continuo
          this.scanningInterval = setInterval(() => {
            this.scanQRCode();
          }, 300);
        }
      }, 100);

      this.snackBar.open('Apunta la cámara al código QR', 'Cerrar', { duration: 3000 });
    } catch (err) {
      console.error('Error opening camera:', err);
      this.snackBar.open('Error al abrir la cámara', 'Cerrar', { duration: 3000 });
      this.scanning = false;
    }
  }

  scanQRCode(): void {
    if (!this.videoElement || !this.canvasElement) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      console.log('[v0] QR Code detected:', code.data);
      this.token = code.data;
      this.stopCamera();
      this.validateToken();
    }
  }

  stopCamera(): void {
    if (this.scanningInterval) {
      clearInterval(this.scanningInterval);
      this.scanningInterval = null;
    }

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
