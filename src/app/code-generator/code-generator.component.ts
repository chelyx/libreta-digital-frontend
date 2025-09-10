import { Component } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { ApiService } from 'src/core/service/apiService';
import { UserService } from 'src/core/service/userService';

@Component({
  selector: 'app-code-generator',
  templateUrl: './code-generator.component.html',
  styleUrls: ['./code-generator.component.scss']
})
export class CodeGeneratorComponent {
  code: string = '';
  genaratedCode: string = '';
 constructor(
    private apiService: ApiService,
  ) {

  }

  onGenerate() {
    this.apiService.generateCode().subscribe({
      next: (res) => {
        this.genaratedCode = `${res.code}`;
      },
      error: () => this.genaratedCode = 'Error al generar el código'
    });
  }


}
