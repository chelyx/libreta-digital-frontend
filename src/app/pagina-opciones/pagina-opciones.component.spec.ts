import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaOpcionesComponent } from './pagina-opciones.component';

describe('PaginaOpcionesComponent', () => {
  let component: PaginaOpcionesComponent;
  let fixture: ComponentFixture<PaginaOpcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaOpcionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaOpcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
