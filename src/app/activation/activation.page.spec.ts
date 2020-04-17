import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivationPage } from './activation.page';

describe('ActivationPage', () => {
  let component: ActivationPage;
  let fixture: ComponentFixture<ActivationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
