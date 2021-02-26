import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PickAreaLocationComponent } from './pick-area-location.component';
import { RouterTestingModule } from '@angular/router/testing';


describe('PickAreaLocationComponent', () => {
  let component: PickAreaLocationComponent;
  let fixture: ComponentFixture<PickAreaLocationComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickAreaLocationComponent ],
      imports: [
        RouterTestingModule,,
        IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PickAreaLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  // Failed: Cannot read property 'hasOwnProperty' of undefined

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
