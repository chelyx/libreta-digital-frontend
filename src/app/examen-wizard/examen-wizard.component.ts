import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@auth0/auth0-angular';
import { Curso, ExamenEstadoDto } from 'src/core/models/curso';
import { NotaDto, NotaResponse } from 'src/core/models/notas';
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
  cursosFinales: Curso[] = [];

  constructor(
    private apiService: ApiService,
    private wizard: WizardService,
    private snackBar: MatSnackBar
  ) {}

    ngOnInit() {
    // this.loadEstado();
      this.cursosFinales = this.cursos.filter(c => c.esFinal);
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

  onGradesComplete(notas:NotaResponse[]) {
    this.currentStep = 3;
    this.wizard.setNotas(notas);
  }

  onActaUploaded(url: string) {
    this.currentStep = 4;
    //this.wizard.setActaUrl(url);
  }

  sendToBFA() {
    let notasIds = this.wizard.notas.map(n => n.id)
    this.apiService.registrarBFA(notasIds).subscribe({
      next: () => {
        this.snackBar.open('Datos enviados a BFA correctamente.');
        this.wizard.setStep(0);
        this.currentStep = 0;
        this.selectedCourse = {} as Curso;
      },
      error: (err) => {
        console.error('Error enviando datos a BFA:', err);
      }
    });
  }

  goToStep(step: number) {
    this.currentStep = step;
    if(step === 0) {
       this.selectedCourse = this.wizard.cursoId
    }
  }
}
