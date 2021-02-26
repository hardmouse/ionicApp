import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
@Component({
  template: ''
})
export abstract class CleanupBasePage implements OnDestroy {
    protected destroyed = new Subject<void>();
  
    
    cleanup() {
      this.destroyed.next();
      this.destroyed.complete();
    }

    ngOnDestroy(){
      
     }
  }