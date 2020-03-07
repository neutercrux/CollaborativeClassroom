import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { RegisterComponent } from './register/register.component'


const routes: Routes = [
  { path: '' , component: LoginComponent},
  { path: 'login' , component: LoginComponent},
  { path: 'mainPage' , component: MainPageComponent},
  { path: 'register' , component: RegisterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
