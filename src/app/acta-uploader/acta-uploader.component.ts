import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/core/service/api.service';

@Component({
  selector: 'app-acta-uploader',
  templateUrl: './acta-uploader.component.html',
  styleUrls: ['./acta-uploader.component.scss']
})
export class ActaUploaderComponent {

  @Output() completed = new EventEmitter<string>();

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;

  file: File | null = null;

  preview: string | null = null;

  showCamera = false;
  mediaStream: MediaStream | null = null;


  constructor(private apiService: ApiService, private  cdr: ChangeDetectorRef, private snackBar: MatSnackBar) {}

  // --- Selección desde archivo ---
  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if(!this.file) return
    this.generatePreview(this.file);
  }

  restart() {
  this.preview = null;
  this.file = null;

  this.showCamera = false;

  if (this.mediaStream) {
    this.mediaStream.getTracks().forEach(t => t.stop());
    this.mediaStream = null;
  }

  this.cdr.detectChanges(); // por si algo quedó atravesado
}

  // --- Abrir cámara ---
  async openCamera() {
    console.log('Abriendo cámara');
    this.showCamera = true;
    this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.videoRef.nativeElement.srcObject = this.mediaStream;
  }

  closeCamera() {
    console.log('Cerrando cámara');
    this.showCamera = false;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
  }

  // --- Tomar foto desde la cámara ---
  takePhoto() {
    const video = this.videoRef.nativeElement;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(blob => {
      if (!blob) return;

      // Simulamos un archivo real
      this.file = new File([blob], "acta.jpg", { type: "image/jpeg" });

      this.generatePreview(this.file);
      this.closeCamera();
      this.cdr.detectChanges();
    }, 'image/jpeg', 0.9);
  }

  // --- Preview ---
  generatePreview(file: File) {
    console.log('Generando preview');
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
      this.cdr.detectChanges();  // 👈 agregá esto
    };
    reader.readAsDataURL(file);
    console.log(this.preview);
  }



  // --- Subir al backend ---
  upload() {
    if(!this.file) return;
    const formData = new FormData();
    formData.append('file', this.file);

    // this.http.post('http://localhost:8080/uploadActa', formData, { responseType: 'text' })
    //   .subscribe(url => this.completed.emit(url));
    this.apiService.uploadActa(formData).subscribe(res => {
 console.log(res)
 this.snackBar.open('Imagen cargada correctamente', 'Cerrar', {
            duration: 3000
          });
    }
    )
  }
}
