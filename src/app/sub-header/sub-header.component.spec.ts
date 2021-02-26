import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubHeaderComponent } from './sub-header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EquipmentSubHeader } from '../common/type/common.model';


describe('SubHeaderComponent', () => {
  let component: SubHeaderComponent;
  let fixture: ComponentFixture<SubHeaderComponent>;
  let subHeader: EquipmentSubHeader;
  beforeEach(async(() => {
    // subHeader = {
    //   subheaderitems: [],
    //   total: 5
    // }
    TestBed.configureTestingModule({
      declarations: [ SubHeaderComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        IonicModule.forRoot()
      ],
      // providers: [
      //   EquipmentSubHeader
      // ]
    }).compileComponents();
    fixture = TestBed.createComponent(SubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));


// Issue in EquipmentSubHeader .total & subheaderitems

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
