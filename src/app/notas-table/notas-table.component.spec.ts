import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasTableComponent } from './notas-table.component';

describe('NotasTableComponent', () => {
  let component: NotasTableComponent;
  let fixture: ComponentFixture<NotasTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotasTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
