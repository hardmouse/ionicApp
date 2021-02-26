import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EquipmentAddFlowPage } from './equipment-add-flow.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage';

describe('EquipmentAddFlowPage', () => {
  let component: EquipmentAddFlowPage;
  let fixture: ComponentFixture<EquipmentAddFlowPage>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentAddFlowPage ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        IonicStorageModule.forRoot(),
        IonicModule.forRoot()],

    }).compileComponents();

    fixture = TestBed.createComponent(EquipmentAddFlowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

// DO NOT OPEN

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });


});