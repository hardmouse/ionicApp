import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EquipmentStep3DescriptionPage } from './equipment-step3-description.page';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage';
import { MediaCapture } from '@ionic-native/media-capture/ngx';

import { Media  } from '@ionic-native/media/ngx';
import { File  } from '@ionic-native/File/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

describe('EquipmentStep3DescriptionPage', () => {
  let component: EquipmentStep3DescriptionPage;
  let fixture: ComponentFixture<EquipmentStep3DescriptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentStep3DescriptionPage ],
      imports: [
        RouterTestingModule,
        IonicStorageModule.forRoot(),
        IonicModule.forRoot()],
      providers: [
        MediaCapture,
        File,
        Media,
        StreamingMedia,
        PhotoViewer
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EquipmentStep3DescriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
