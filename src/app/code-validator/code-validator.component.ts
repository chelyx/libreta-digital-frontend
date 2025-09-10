import { Component } from '@angular/core';
import { ApiService } from 'src/core/service/apiService';

@Component({
  selector: 'app-code-validator',
  templateUrl: './code-validator.component.html',
  styleUrls: ['./code-validator.component.scss']
})
export class CodeValidatorComponent {
code: string = '';
  result: string = '';
  constructor( private apiService: ApiService,) { }
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
