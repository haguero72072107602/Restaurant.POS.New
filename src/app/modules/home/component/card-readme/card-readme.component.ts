import {Component, inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-card-readme',
  templateUrl: './card-readme.component.html',
  styleUrls: ['./card-readme.component.css']
})
export class CardReadmeComponent {
  public textReadme: string | undefined;


  constructor(private http: HttpClient, private dialogRef: MatDialogRef<CardReadmeComponent>) {
    this.readFileReadme()
  }

  readFileReadme() {
    this.http.get('assets/readme.md', {responseType: 'text'}).subscribe((data: any) => {
      this.textReadme = data;
    });
  }

  onClose() {
    this.dialogRef.close()
  }


}
