import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnAuthGuard } from '../un-auth.guard';
import { PageNotFound } from '../util/component/page-not-found/page-not-found';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  { path: "login", canActivate: [UnAuthGuard], component: LoginComponent },
  { path: "register", canActivate: [UnAuthGuard], component: RegisterComponent },
  { path: "", pathMatch: "full", redirectTo: "login" },
  { path: "**", component: PageNotFound },
]
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
export const authComponents = [LoginComponent, RegisterComponent]