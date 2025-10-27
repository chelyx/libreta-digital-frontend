import { type ComponentFixture, TestBed } from "@angular/core/testing"

import { HistorialNotasComponent } from "./historial-notas.component"

describe("HistorialNotasComponent", () => {
  let component: HistorialNotasComponent
  let fixture: ComponentFixture<HistorialNotasComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorialNotasComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HistorialNotasComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
