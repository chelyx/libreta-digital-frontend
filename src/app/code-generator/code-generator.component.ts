import { Component } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { ApiService } from 'src/service/apiService';

@Component({
  selector: 'app-code-generator',
  templateUrl: './code-generator.component.html',
  styleUrls: ['./code-generator.component.scss']
})
export class CodeGeneratorComponent {
  code: string = '';
  result: string = '';
  User: User | undefined;
 constructor(
    private apiService: ApiService
  ) {

  }

  onGenerate() {
    this.apiService.generateCode().subscribe({
      next: (res) => {
        this.result = `Código generado ${res.code}`;
      },
      error: () => this.result = 'Error al generar el código'
    });
  }

  onValidate() {
    this.apiService.validateCode(this.code).subscribe({
      next: (res) => {
        this.result = res ? `✅ ${res.name}` : '❌ Código inválido';
      },
      error: (err) =>{
        if (err.status === 403) {
          alert('Solo los profesores pueden validar códigos.');
        }
        this.result = 'Error en la validación'}
    });
  }
}
