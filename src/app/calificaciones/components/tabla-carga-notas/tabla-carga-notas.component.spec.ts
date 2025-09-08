import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCargaNotasComponent } from './tabla-carga-notas.component';

describe('TablaCargaNotasComponent', () => {
  let component: TablaCargaNotasComponent;
  let fixture: ComponentFixture<TablaCargaNotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaCargaNotasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaCargaNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
