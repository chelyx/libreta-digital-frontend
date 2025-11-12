import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificateValidatorService } from './certificate-validator.service';
import { ValidationResult } from './certificate.model';

@Component({
selector: 'app-certificate-validator',
standalone: true,
imports: [CommonModule, FormsModule],
templateUrl: './certificate-validator.component.html',
styleUrls: ['./certificate-validator.component.scss']
})
export class CertificateValidatorComponent {
// <CHANGE> Separar DNI y código de validación en dos variables
documentNumber: string = '';
validationCode: string = '';
validationResult: ValidationResult | null = null;
isLoading: boolean = false;
hasSearched: boolean = false;

constructor(private validatorService: CertificateValidatorService) {}

  validateCertificate(): void {
    // <CHANGE> Validar usando el código de validación, no el DNI
    if (!this.validationCode.trim()) {
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    this.validationResult = null;

    this.validatorService.validateCertificate(this.validationCode)
      .subscribe({
        next: (result: ValidationResult) => {
          this.validationResult = result;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error validando certificado:', error);
          this.isLoading = false;
        }
      });
  }

  reset(): void {
    this.documentNumber = '';
    this.validationCode = '';
    this.validationResult = null;
    this.hasSearched = false;
    this.isLoading = false;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
