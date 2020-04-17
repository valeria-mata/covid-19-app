import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiagnosePage } from './diagnose.page';

describe('DiagnosePage', () => {
  let component: DiagnosePage;
  let fixture: ComponentFixture<DiagnosePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
