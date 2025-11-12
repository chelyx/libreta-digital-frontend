import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Certificate, ValidationResult } from './certificate.model';

@Injectable({
providedIn: 'root'
})
export class CertificateValidatorService {

private mockCertificates: Certificate[] = [
{
code: 'SIRCA-2024-001',
holderName: 'Juan Pérez García',
issueDate: new Date('2024-01-15'),
      expirationDate: new Date('2026-01-15'),
      issuer: 'SIRCA - Sistema de Registro y Control Académico',
      course: 'Desarrollo Full Stack con Angular',
      status: 'valid'
    },
    {
      code: 'SIRCA-2023-458',
      holderName: 'María González López',
      issueDate: new Date('2023-06-20'),
      expirationDate: new Date('2024-06-20'),
      issuer: 'SIRCA - Sistema de Registro y Control Académico',
      course: 'Ciberseguridad Avanzada',
      status: 'expired'
    },
    {
      code: 'SIRCA-2024-789',
      holderName: 'Carlos Rodríguez Martínez',
      issueDate: new Date('2024-03-10'),
      issuer: 'SIRCA - Sistema de Registro y Control Académico',
      course: 'Machine Learning con Python',
      status: 'valid'
    },
    {
      code: 'SIRCA-2022-100',
      holderName: 'Ana Martínez Silva',
      issueDate: new Date('2022-05-10'),
      issuer: 'SIRCA - Sistema de Registro y Control Académico',
      course: 'Gestión de Proyectos',
      status: 'revoked'
    }
  ];

  constructor() { }

  validateCertificate(code: string): Observable<ValidationResult> {
    return of(this.performValidation(code)).pipe(delay(1000));
  }

  private performValidation(code: string): ValidationResult {
    const trimmedCode = code.trim().toUpperCase();

    if (!this.isValidFormat(trimmedCode)) {
      return {
        isValid: false,
        message: 'Formato de código inválido',
        errors: ['El código debe tener el formato: SIRCA-YYYY-XXX']
      };
    }

    const certificate = this.mockCertificates.find(
      cert => cert.code.toUpperCase() === trimmedCode
    );

    if (!certificate) {
      return {
        isValid: false,
        message: 'Certificado no encontrado en SIRCA',
        errors: ['No existe un certificado con este código en el sistema']
      };
    }

    if (certificate.status === 'revoked') {
      return {
        isValid: false,
        certificate,
        message: 'Certificado revocado',
        errors: ['Este certificado ha sido revocado por SIRCA']
      };
    }

    if (certificate.status === 'expired' || this.isExpired(certificate)) {
      return {
        isValid: false,
        certificate,
        message: 'Certificado expirado',
        errors: ['Este certificado ha expirado y ya no es válido']
      };
    }

    return {
      isValid: true,
      certificate,
      message: 'Certificado válido y registrado en SIRCA'
    };
  }

  private isValidFormat(code: string): boolean {
    const regex = /^SIRCA-\d{4}-\d{3}$/;
    return regex.test(code);
  }

  private isExpired(certificate: Certificate): boolean {
    if (!certificate.expirationDate) return false;
    return new Date() > certificate.expirationDate;
  }
}
