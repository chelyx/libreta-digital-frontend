import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TomaDeAsistenciaComponent } from './toma-de-asistencia.component';

describe('TomaDeAsistenciaComponent', () => {
  let component: TomaDeAsistenciaComponent;
  let fixture: ComponentFixture<TomaDeAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TomaDeAsistenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TomaDeAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
