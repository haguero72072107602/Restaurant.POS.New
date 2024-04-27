import {Component} from '@angular/core';
import {ICellRendererParams} from "ag-grid-community";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {User} from '@models/user.model';


@Component({
  selector: 'app-have-keycard',
  templateUrl: './have-keycard.component.html',
  styleUrls: ['./have-keycard.component.css']
})

export class HaveKeycardComponent implements ICellRendererAngularComp {

  params!: ICellRendererParams;
  user: null | User = null;

  public visible: boolean | undefined = true;

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;

    this.user = this.params!.data! as User;
    this.visible = this.user.keyCard;

  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.params = params;
    return true;
  }


}
