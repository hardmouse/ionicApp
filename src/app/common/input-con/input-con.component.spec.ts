import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InputConComponent } from './input-con.component';

describe('InputConComponent', () => {
  let component: InputConComponent;
  let fixture: ComponentFixture<InputConComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputConComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InputConComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
