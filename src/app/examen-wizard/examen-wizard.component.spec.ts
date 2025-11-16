import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenWizardComponent } from './examen-wizard.component';

describe('ExamenWizardComponent', () => {
  let component: ExamenWizardComponent;
  let fixture: ComponentFixture<ExamenWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamenWizardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamenWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
