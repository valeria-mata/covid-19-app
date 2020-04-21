import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecommendationsPage } from './recommendations.page';

describe('RecommendationsPage', () => {
  let component: RecommendationsPage;
  let fixture: ComponentFixture<RecommendationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
