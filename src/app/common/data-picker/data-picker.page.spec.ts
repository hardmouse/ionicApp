import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatePickerComponent } from './data-picker.page';
import { IonDatetime } from '@ionic/angular';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;
  
  let Y = 365*24*3600*1000;
  let now = new Date();
  let min: Date = new Date(now.getTime() - 100*Y);

  let max: Date = new Date(now.getTime() - 100*Y);
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatePickerComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        IonDatetime
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
