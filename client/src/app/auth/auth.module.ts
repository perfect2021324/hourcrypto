import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { authComponents, AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { UtilModule } from '../util/util.module';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [
    AuthComponent,
    authComponents,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    UtilModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule { }
