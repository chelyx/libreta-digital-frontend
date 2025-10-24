import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaTableComponent } from './asistencia-table.component';

describe('AsistenciaTableComponent', () => {
  let component: AsistenciaTableComponent;
  let fixture: ComponentFixture<AsistenciaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsistenciaTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
