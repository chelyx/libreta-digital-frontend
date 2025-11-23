import { Injectable } from '@angular/core';
import { UUID } from 'crypto';
import { Curso } from '../models/curso';
import { NotaDto, NotaResponse } from '../models/notas';

export interface WizardState {
  currentStep: number;
  cursoId: Curso;
  asistencias: any[];
  notas: NotaResponse[];
}

const STORAGE_KEY = 'wizard-final-examen';

@Injectable({ providedIn: 'root' })
export class WizardService {

  private state: WizardState = {
    currentStep: 0,
    cursoId: {} as Curso,
    asistencias: [],
    notas: []
  };

  constructor() {
    this.loadState();
  }

  private saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  private loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) this.state = JSON.parse(saved);
  }

  // ---------- GETTERS ----------
  getState() {
    return this.state;
  }

  get currentStep() { return this.state.currentStep; }
  get cursoId() { return this.state.cursoId; }
  get asistencias() { return this.state.asistencias; }
  get notas() { return this.state.notas; }

  // ---------- SETTERS ----------
  setStep(step: number) {
    this.state.currentStep = step;
    this.saveState();
  }

  setCurso(cursoId: Curso) {
    this.state.cursoId = cursoId;
    this.state.asistencias = [];
    this.state.notas = [];
    this.saveState();
  }

  setAsistencias(list: any[]) {
    this.state.asistencias = list;
    this.state.notas = [];
    this.saveState();
  }

  setNotas(list: NotaResponse[]) {
    this.state.notas = list;
    this.saveState();
  }

  reset() {
    this.state = {
      currentStep: 0,
      cursoId: {} as Curso,
      asistencias: [],
      notas: []
    };
    this.saveState();
  }
}
