import { NgModule } from '@angular/core';

import { JobRoutingModule } from './job-routing.module';
import { JobComponent } from './job.component';
import { JobItemComponent } from './job-item/job-item.component';
import { JobListComponent } from './job-list/job-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { CreateJobComponent } from './create-job/create-job.component';
import { ReactiveFormsModule } from '@angular/forms';
import { JobService } from './job.service';
import { MapComponent } from './map/map.component';
import { MapService } from './map/map.service';
import { NeedVolunteerComponent } from './need-volunteer/need-volunteer.component';
import { JobTodoItemComponent } from './job-todo-item/job-todo-item.component';
import { JobTodoListComponent } from './job-todo-list/job-todo-list.component';
import { UtilModule } from 'src/app/util/util.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [JobComponent, JobItemComponent, JobListComponent, CreateJobComponent, MapComponent, NeedVolunteerComponent, JobTodoItemComponent, JobTodoListComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    JobRoutingModule,
    UtilModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [
    JobService,
    MapService
  ]
})
export class JobModule { }
