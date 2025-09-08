import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorMateriaMesaComponent } from './selector-materia-mesa.component';

describe('SelectorMateriaMesaComponent', () => {
  let component: SelectorMateriaMesaComponent;
  let fixture: ComponentFixture<SelectorMateriaMesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectorMateriaMesaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectorMateriaMesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
