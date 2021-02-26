import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TooltipPopComponent } from './tooltip-pop.component';
import { NavParams } from '@ionic/angular';

describe('TooltipPopComponent', () => {
  let component: TooltipPopComponent;
  let fixture: ComponentFixture<TooltipPopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TooltipPopComponent ],
      imports: [
        IonicModule.forRoot()
      ],
      providers: [
        NavParams
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
