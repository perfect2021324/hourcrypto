import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { PageNotFound } from 'src/app/util/component/page-not-found/page-not-found';
import { CreateJobComponent } from './create-job/create-job.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobTodoListComponent } from './job-todo-list/job-todo-list.component';
import { NeedVolunteerComponent } from './need-volunteer/need-volunteer.component';

const routes: Routes = [
  // { path: "view", component: JobListComponent },
  // { path: "view/:filter", component: JobListComponent },
  { path: ":userId/view", canActivate: [AuthGuard], component: JobListComponent },
  { path: ":userId/view/:filter", canActivate: [AuthGuard], component: JobListComponent },
  { path: "create", canActivate: [AuthGuard], component: CreateJobComponent },
  { path: "needVoluteer", component: NeedVolunteerComponent },
  { path: "new", component: JobTodoListComponent },
  { path: "", pathMatch: "full", redirectTo: "u/view" },
  { path: "**", component: PageNotFound },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule { }
