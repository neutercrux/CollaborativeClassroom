import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Graph } from '../graph';
import * as Plotly from '../../../node_modules/plotly.js/dist/plotly.js';
import {
  Config,
  Data,
  Layout
} from 'plotly.js';

@Component({
  selector: 'app-graph-dialog',
  templateUrl: './graph-dialog.component.html',
  styleUrls: ['./graph-dialog.component.css']
})
export class GraphDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<GraphDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Graph) {}  

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.plotGraph()
  }

  deleteData(): void {
    this.dialogRef.close(false);
  }

  plotGraph()
  {
    const trace = {
        x: this.data.array,
        autobinx: true,
        type: 'histogram',
        xbins: { 
          end: 7, 
          size: 1, 
          start: -0
      
        }
    };
    const data = [trace];
    Plotly.newPlot('myPlotlyDiv', data,
    {
      autoexpand: "true",
      autosize: "true",
      width: window.innerWidth - 200, //we give initial width, so if the
                                      //graph is rendered while hidden, it   
                                      //takes the right shape
      margin: {
      autoexpand: "true",
      margin: 0
      },
      offset: 0,
      type: "scattergl",
      title: name, //Title of the graph
      hovermode: "closest",
      xaxis: {
      linecolor: "black",
      linewidth: 2,
      mirror: true,
      title: "Line number",
      automargin: true
      },
      yaxis: {
      linecolor: "black",
      linewidth: 2,
      mirror: true,
      automargin: true,
      title: 'No of students'
          }
      },
      { //this is where the configuration is defined
      responsive: true, //important to keep graph responsive
      scrollZoom: true
      });
  }

}
