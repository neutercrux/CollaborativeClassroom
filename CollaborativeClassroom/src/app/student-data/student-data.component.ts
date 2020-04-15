import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { StudentDataService } from '../student-data.service'

@Component({
  selector: 'app-student-data',
  templateUrl: './student-data.component.html',
  styleUrls: ['./student-data.component.css']
})
export class StudentDataComponent implements OnInit {

  @ViewChild('fileImportInput',{static:false}) fileImportInput: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  public csvRecords: CSVRecord[] = [];
  public dataArr = []
  public dataSource;
  displayedColumns: string[] = ['position','name','email','usn'];
  response: any;
  constructor(private router: Router,private studentData: StudentDataService) { }

  ngOnInit() {
  }

  updateData(event){
    event.preventDefault();
    console.log(this.dataArr[0].name)
    this.studentData.update(this.dataArr).subscribe(data => {
      this.response = JSON.parse(JSON.stringify(data));
      console.log(this.response);
    })
  }

  isCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any){      
    let headers = csvRecordsArr[0].split(',');       
    let headerArray = [];            
      
    for (let j = 0; j < headers.length; j++) {        
      headerArray.push(headers[j]);      
    }        
    return headerArray;
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) 
  {     
    // console.log(csvRecordsArray)
    for (let i = 1; i < csvRecordsArray.length; i++) {         
      let data = csvRecordsArray[i].split(',');         
      // FOR EACH ROW IN CSV FILE IF THE NUMBER OF COLUMNS         
      // ARE SAME AS NUMBER OF HEADER COLUMNS THEN PARSE THE DATA        
    
      if (data.length == headerLength) {            
          var csvRecord: CSVRecord = new CSVRecord();      
          // console.log(data)                                     
          csvRecord.name = data[0].trim();  
          csvRecord.email = data[1].trim();         
          csvRecord.usn = data[2].trim();      
          this.dataArr.push(csvRecord);          
      }       
    }   
    console.log(this.dataArr)
    return this.dataArr; 
  } 
  fileChangeListener($event: any): void {  
    // console.log('changed---')   
    var text = [];     
    var files = $event.srcElement.files;          

    if (this.isCSVFile(files[0])) {   
      // console.log("It is CSV")      
      var input = $event.target;         
      var reader = new FileReader();          
      reader.readAsText(input.files[0]);         

      reader.onload = (data) => {            
        let csvData = String(reader.result);            
        let csvRecordsArray = csvData.split(/\r\n|\n/)           
        let headersRow = this.getHeaderArray(csvRecordsArray);             
        this.csvRecords =  
            this.getDataRecordsArrayFromCSVFile(csvRecordsArray,                                    
            headersRow.length); 
        this.dataSource = new MatTableDataSource<CSVRecord>(this.dataArr);
        this.dataSource.paginator = this.paginator;
     
      }               
      reader.onerror = function() {            
          alert('Unable to read ' + input.files[0]);          
      };     
      // console.log('----CSV RECORDS------',this.csvRecords) 
    } 
    else{          
      alert("Please import valid .csv file.");          
      this.fileReset();      
    } 
  } 
  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }
  returnMainPage(event){
    event.preventDefault()
    this.router.navigate(['/dashboard'])
  }
}

export class CSVRecord {

  public name: any;
  public email: any;
  public usn: any;

  constructor() {

  }
  
}
