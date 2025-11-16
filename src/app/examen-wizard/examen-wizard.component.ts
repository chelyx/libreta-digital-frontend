import { Component, Input, OnInit } from '@angular/core';
import { User } from '@auth0/auth0-angular';
import { Curso, ExamenEstadoDto } from 'src/core/models/curso';
import { ApiService } from 'src/core/service/api.service';
import { WizardService } from 'src/core/service/wizard.service';

@Component({
  selector: 'app-examen-wizard',
  templateUrl: './examen-wizard.component.html',
  styleUrls: ['./examen-wizard.component.scss']
})
export class ExamenWizardComponent implements OnInit {
  @Input() cursos: Curso[] = [];
  currentStep = 0;
  estado: ExamenEstadoDto | null = null;

   selectedCourse: Curso = {} as Curso;

     constructor(
       private apiService: ApiService,
       private wizard: WizardService
     ) {}

    ngOnInit() {
    // this.loadEstado();
    }

  onCourseSelected(course: Curso) {
    this.selectedCourse = course;
    this.wizard.setCurso(course);
    this.currentStep = 1;
  }


  onAttendanceComplete(lista: any) {
    this.currentStep = 2;
    this.wizard.setAsistencias(lista);
  }

  onGradesComplete(notas:any) {
    this.currentStep = 3;
    this.wizard.setNotas(notas);
  }

  sendToBFA() {

  }

  goToStep(step: number) {
    this.currentStep = step;
    if(step === 0) {
       this.selectedCourse = this.wizard.cursoId
    }
  }
}
