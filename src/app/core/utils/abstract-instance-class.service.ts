import {Injectable, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";

@Injectable()
export abstract class AbstractInstanceClass implements OnInit, OnDestroy {
  public sub$: Subscription[] = [];

  ngOnInit(): void {
    //this.operationService.resetInactivity(true);
  }

  ngOnDestroy(): void {
    this.sub$.map(sub => sub.unsubscribe());
  }

}
