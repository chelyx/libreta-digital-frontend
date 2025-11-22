import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActaUploaderComponent } from './acta-uploader.component';

describe('ActaUploaderComponent', () => {
  let component: ActaUploaderComponent;
  let fixture: ComponentFixture<ActaUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActaUploaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActaUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
