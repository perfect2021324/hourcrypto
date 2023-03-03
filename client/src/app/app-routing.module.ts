import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PageNotFound } from './util/component/page-not-found/page-not-found';

const routes: Routes = [
  { path: "main", component: MainComponent, loadChildren: () => import("./main/main-routing.module").then(m => m.MainRoutingModule).catch(e => console.error(e)) },
  { path: "", pathMatch: "full", redirectTo: "main" },
  { path: "**", component: PageNotFound },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
