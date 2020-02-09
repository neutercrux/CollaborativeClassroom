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
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NotesEditorComponent } from './notes-editor/notes-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CodeEditorComponent,
    FileExplorerComponent,
    MainPageComponent,
    NotesEditorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
