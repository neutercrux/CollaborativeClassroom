import { Component, Inject, OnInit } from '@angular/core';
import { Note } from '../note'
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.css']
})
export class NoteDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NoteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Note) {}  

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
