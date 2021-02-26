import { Component, OnInit } from '@angular/core';
import { SubscribableService } from '../services/subscribable.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  constructor(
    public subs:SubscribableService
  ) {
    this.subs.Mode = "";
  }

  ngOnInit() {
  }

}
