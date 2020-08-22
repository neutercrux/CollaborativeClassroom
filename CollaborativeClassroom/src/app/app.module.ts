import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule} from '@angular/material/menu';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';

import { CodeEditorComponent } from './code-editor/code-editor.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RegisterComponent } from './register/register.component';
import { NgxPubSubModule } from '@pscoped/ngx-pub-sub';
import { StudentCodeEditorComponent } from './student-code-editor/student-code-editor.component';
import { DashboardComponent } from './dashboard/dashboard.component'
import { StudentDataComponent } from './student-data/student-data.component';
import { DiffMatchPatch } from './ng-diff-match-patch';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatDialogModule, MatTooltipModule, MatBadgeModule } from '@angular/material'
import { FileDialogComponent } from './file-dialog/file-dialog.component';
import { DoubtComponent } from './doubt/doubt.component';
import { DoubtService } from './doubt.service';

PlotlyModule.plotlyjs = PlotlyJS;

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'left',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CodeEditorComponent,
    MainPageComponent,
    RegisterComponent,
    StudentCodeEditorComponent,
    DashboardComponent,
    StudentDataComponent,
    DoubtComponent,
    NoteDialogComponent,
    FileDialogComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatMenuModule,
    NotifierModule.withConfig(customNotifierOptions),
    NgxPubSubModule,
    PlotlyModule
  ],
  entryComponents: [
    StudentCodeEditorComponent,
    NoteDialogComponent,
    FileDialogComponent
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    DiffMatchPatch,DoubtService,
    MatTooltipModule,
    MatBadgeModule,
    NgxPubSubModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
