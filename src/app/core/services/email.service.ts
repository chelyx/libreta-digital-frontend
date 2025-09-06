import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private initialized = false;

  private ensureInit() {
    if (!this.initialized) {
      emailjs.init({ publicKey: environment.emailjs.publicKey });
      this.initialized = true;
    }
  }

  /**
   * Envía notificación de nota de final al alumno.
   * Los nombres de variables deben coincidir con los de tu Template en EmailJS.
 
  sendGrade(to_email: string, to_name: string, materia: string, mesaFecha: string, nota: number) {
    this.ensureInit();
    const params = {
      to_email,
      to_name,
      materia,
      mesa_fecha: mesaFecha,
      nota: String(nota)
    };
    // Devuelve una Promise<EmailJSResponseStatus>
    return emailjs.send(environment.emailjs.serviceId, environment.emailjs.templateId, params);
  }  */
sendGrade(
  to_email: string,
  to_name: string,
  materia: string,
  mesaFecha: string,
  nota: string | number   // 👈 acá el cambio
) {
  this.ensureInit();

  const params = {
    to_email,
    to_name,
    materia,
    mesa_fecha: mesaFecha,
    nota: String(nota)   // siempre lo mandamos como string a EmailJS
  };

  return emailjs.send(
    environment.emailjs.serviceId,
    environment.emailjs.templateId,
    params
  );
}


}
