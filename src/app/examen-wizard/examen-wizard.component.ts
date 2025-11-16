import { Component, Input, OnInit } from '@angular/core';
import { Curso, ExamenEstadoDto } from 'src/core/models/curso';
import { ApiService } from 'src/core/service/api.service';

@Component({
  selector: 'app-examen-wizard',
  templateUrl: './examen-wizard.component.html',
  styleUrls: ['./examen-wizard.component.scss']
})
export class ExamenWizardComponent implements OnInit {
  @Input() cursos: Curso[] = [];
  currentStep = 0;
  estado: ExamenEstadoDto | null = null;

   selectedCourse: any = null;

     constructor(
       private apiService: ApiService
     ) {}

    ngOnInit() {
    // this.loadEstado();
  }

  loadEstado() {
    this.apiService.getEstadoExamen(this.selectedCourse.id).subscribe(estado => {
      this.estado = estado;

     if (!estado.asistenciaCargada) this.currentStep = 1;
      else if (!estado.notasCargadas) this.currentStep = 2;
      else this.currentStep = 3; // por si agregás un paso final
    });
  }

  onCourseSelected(course: any) {
    this.selectedCourse = course;
    this.currentStep = 1;
    //no se si es util el load estados. TODO: check
    // this.loadEstado();
  }

  onGradesComplete() {
    this.currentStep = 3;
  }

  onAttendanceComplete() {
    this.currentStep = 2;
  }

  // // por si necesitás volver atrás
  // goBack() {
  //   if (this.currentStep > 1) this.currentStep--;
  // }

  sendToBFA() {

  }
}
