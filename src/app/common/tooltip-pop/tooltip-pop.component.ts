import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
@Component({
  selector: 'app-tooltip-pop',
  templateUrl: './tooltip-pop.component.html',
  styleUrls: ['./tooltip-pop.component.scss'],
})
export class TooltipPopComponent implements OnInit {
  msg:string;
  title:string;
  constructor(private popoverController: PopoverController,
    private navParams: NavParams) { }

  ngOnInit() {
    // console.table(this.navParams);
  }

  async closePop() {
    // const onClosedData: string = "Close data wrapped up!";
    await this.popoverController.dismiss();
  }
}
