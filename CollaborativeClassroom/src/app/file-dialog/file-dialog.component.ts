import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-file-dialog',
  templateUrl: './file-dialog.component.html',
  styleUrls: ['./file-dialog.component.css']
})
export class FileDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FileDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string) {}  

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
