import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EquipmentStep5SummaryPage } from './equipment-step5-summary.page';
import { RouterTestingModule } from '@angular/router/testing';
import { MobileService } from '../../../app/services/mobile.service';
import { IonicStorageModule } from '@ionic/storage';

describe('EquipmentStep5SummaryPage', () => {
  let component: EquipmentStep5SummaryPage;
  let fixture: ComponentFixture<EquipmentStep5SummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentStep5SummaryPage ],
      imports: [
        RouterTestingModule,
        IonicStorageModule.forRoot(),
        IonicModule.forRoot()
      ],
      providers: [
        MobileService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EquipmentStep5SummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
