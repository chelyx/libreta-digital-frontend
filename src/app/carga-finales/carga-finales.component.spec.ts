import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaFinalesComponent } from './carga-finales.component';

describe('CargaFinalesComponent', () => {
  let component: CargaFinalesComponent;
  let fixture: ComponentFixture<CargaFinalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaFinalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaFinalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
