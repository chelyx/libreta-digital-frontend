import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/core/service/apiService';

@Component({
  selector: 'app-code-validator',
  templateUrl: './code-validator.component.html',
  styleUrls: ['./code-validator.component.scss']
})
export class CodeValidatorComponent {
  scannedToken: string = '';
  manualToken: string = '';
  tokenValidated: boolean = false;
  scanning = false;
  user: { name: string, picture: string, nickname:string} | null = null;

  constructor(private snackBar: MatSnackBar, private apiService: ApiService) {
    const code = sessionStorage.getItem('pendingCode');
    if (code) {
      this.validateToken(code);
      sessionStorage.removeItem('pendingCode');
    }
  }

  onScanSuccess(token: string) {
    this.scannedToken = token;
    this.validateToken(token);
  }

  validateToken(token: string) {
     this.apiService.validateCode(token).subscribe({
      next: (res) => {
        this.user = { name: res.name, picture: res.picture, nickname: res.nickname };
        this.snackBar.open('Código validado exitosamente', 'Cerrar', { duration: 3000 });
        this.tokenValidated = true;
      },
      error: (err) =>{
        if (err.status === 403) {
          alert('Solo los profesores pueden validar códigos.');
        }
        this.tokenValidated = false;
    }});
  }

  submitManualToken() {
    this.validateToken(this.manualToken);
  }

  reset() {
    this.scannedToken = '';
    this.manualToken = '';
    this.tokenValidated = false;
    this.scanning = false;
  }


}
