import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'data-picker',
  templateUrl: './data-picker.page.html',
  styleUrls: ['./data-picker.page.scss'],
})
export class DatePickerComponent implements OnInit {

  Yr = 365*24*3600*1000;
  nowDate = new Date();
  @Input() autoDateConstraint: boolean = true;

  @Input() pickerFormat: string = 'DD MM YYYY';

  @Input() date: Date;

  @Output() dateChange = new EventEmitter<Date>();

  @Input() min: Date = new Date( this.nowDate.getTime() - 100*this.Yr);

  @Input() max: Date = new Date( this.nowDate.getTime() + 100*this.Yr);

  @ViewChild('dateTime') dateTime: IonDatetime;

  constructor() {
  }

  get stringDate(): string {
      return DatePickerComponent.date2str(this.date);
  }

  set stringDate(val: string) {
      this.date = new Date(val);
      this.dateChange.emit(this.date);
  }

  ngOnInit() {
      if (this.autoDateConstraint) {
          let Y = 365*24*3600*1000;
          let now = new Date();
          let minDate = new Date(now.getTime() - 100*Y),
              maxDate = new Date(now.getTime() + 100*Y);
          if(!this.min) this.setMin(minDate);
          if(!this.max) this.setMax(maxDate);
      }
  }

  open() {
      this.dateTime.open();
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes[ 'min' ] && this.min) this.setMin(this.min);
      if (changes[ 'max' ] && this.max) this.setMax(this.max);
  }

  setMin(min: Date) {
      this.min = min;
      this.dateTime.min = DatePickerComponent.date2str(this.min);
  }

  setMax(max: Date) {
      this.max = max;
      this.dateTime.max = DatePickerComponent.date2str(this.max);
  }

  private static date2str(date: Date) {
    if (date) {
      return date.toLocaleString();
    } else {
      return "";
    }
  }

}
