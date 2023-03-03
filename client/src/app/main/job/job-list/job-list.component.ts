import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppStore } from 'src/app/app.store';
import { Job } from 'src/types/Job';
import { JobService } from '../job.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit, OnDestroy {

  constructor(private jobService: JobService, private route: ActivatedRoute, public store: AppStore) { }
  jobs !: Job[]
  errors = []
  filter!: string
  userId!: string
  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      this.filter = params["filter"]
      this.userId = params["userId"]

      await this.jobService.getJobs({
        totalRecords: this.store.getPaginator().length,
        userId: this.userId,
        filter: this.filter
      })
      this.jobs = this.jobService.fetchLoadedJobs()
    })
  }
  ngOnDestroy(): void {
    if (this.store.getPaginator().display) this.store.setPaginator({ display: false })
  }
  closeWindow() {
    window.close()
  }
}
