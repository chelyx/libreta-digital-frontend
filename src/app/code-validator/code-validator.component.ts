import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import QrScanner from 'qr-scanner';
import { ApiService } from 'src/core/service/apiService';

@Component({
  selector: 'app-code-validator',
  templateUrl: './code-validator.component.html',
  styleUrls: ['./code-validator.component.scss']
})
export class CodeValidatorComponent implements OnInit, OnDestroy {
  @ViewChild('video', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;

  token: string = '';
  scanning: boolean = false;
  validatedStudents: any[] = [];
  lastValidated: any = null;
  qrScanner!: QrScanner;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  async toggleScanner() {
    if (this.scanning) {
      this.stopScanner();
    } else {
      await this.startScanner();
    }
  }

  async startScanner() {
    this.scanning = true;
    const video = this.videoElement.nativeElement;

   this.qrScanner = new QrScanner(
    video,
    result => this.validateToken(result),
    {
      preferredCamera: 'environment'  // fuerza cámara trasera
    }
);

    try {
      await this.qrScanner.start();
      this.snackBar.open('Apunta la cámara al código QR', 'Cerrar', { duration: 3000 });
    } catch (err) {
      console.error(err);
      this.snackBar.open('Error al abrir la cámara', 'Cerrar', { duration: 3000 });
      this.scanning = false;
    }
  }

  stopScanner() {
    if (this.qrScanner) {
      this.qrScanner.stop();
    }
    this.scanning = false;
  }

  validateToken(result: QrScanner.ScanResult) {
    console.log('QR Code detected:', result);

    this.onValidate(this.token.trim()); //TODO use result
  }

  validateManual() {
    if (!this.token || this.token.trim() === '') {
      this.snackBar.open('Por favor ingrese un token', 'Cerrar', { duration: 3000 });
      return;
    }
    this.onValidate(this.token.trim());
  }

  onValidate(token:string){
     this.apiService.validateCode(token).subscribe({
      next: (response: any) => {
        this.validatedStudents.push(response);
        this.lastValidated = response;

        // Limpiar input
        this.token = '';

        // Resaltar temporalmente
        setTimeout(() => this.lastValidated = null, 3000);

        this.snackBar.open('Token validado correctamente', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Error al validar el token', 'Cerrar', { duration: 3000 });
      }
    });
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }
}
