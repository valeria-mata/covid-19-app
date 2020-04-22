import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendDiagnosePage } from './send-diagnose.page';

describe('SendDiagnosePage', () => {
  let component: SendDiagnosePage;
  let fixture: ComponentFixture<SendDiagnosePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendDiagnosePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SendDiagnosePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
