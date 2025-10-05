import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, User } from '@auth0/auth0-angular';
import { ApiService } from 'src/core/service/apiService';
import { UserService } from 'src/core/service/userService';

@Component({
  selector: 'app-code-generator',
  templateUrl: './code-generator.component.html',
  styleUrls: ['./code-generator.component.scss']
})
export class CodeGeneratorComponent {
  qrUrl: string = '';
  genaratedCode: string = '';
  urlValidate = "/validate?code=";

  loading: boolean = false;
  qrGenerated: boolean = false;
 constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
  ) {
    this.onGenerate();
  }

  onGenerate() {
    this.loading = true; // activamos el loading
    this.apiService.generateCode().subscribe({
      next: (res) => {
        this.loading = false; // desactivamos el loading
        this.genaratedCode = res.code;
        this.qrUrl =  window.location.origin + this.urlValidate + res.code;
        this.snackBar.open('QR generado exitosamente', 'Cerrar', { duration: 3000 });
        this.qrGenerated = true;
      },
      error: () =>
      { this.loading = false; // desactivamos el loading
        this.genaratedCode = 'Error al generar el código'
      }
    });
  }

   copyToClipboard() {
    navigator.clipboard.writeText(this.genaratedCode);
    this.snackBar.open('Enlace copiado al portapapeles', 'Cerrar', { duration: 3000 });
  }

}
