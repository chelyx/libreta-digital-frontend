import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeValidatorComponent } from './code-validator.component';

describe('CodeValidatorComponent', () => {
  let component: CodeValidatorComponent;
  let fixture: ComponentFixture<CodeValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeValidatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
