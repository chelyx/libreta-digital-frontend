import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorCursoComponent } from './buscador-curso.component';

describe('BuscadorCursoComponent', () => {
  let component: BuscadorCursoComponent;
  let fixture: ComponentFixture<BuscadorCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscadorCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscadorCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
