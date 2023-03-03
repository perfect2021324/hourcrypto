import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { JobService } from 'src/app/main/job/job.service';
import { CurrentUser } from 'src/app/currentuser';
import { Job } from 'src/types/Job';
import { JobTodo } from 'src/types/JobTodo';
import { JobTodoService } from '../jobTodo.service';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-job-todo-item',
  templateUrl: './job-todo-item.component.html',
  styleUrls: ['./job-todo-item.component.scss']
})
export class JobTodoItemComponent implements OnInit {
  proofImage: any
  timeTaken!: FormControl
  currentSafeUrl!: SafeUrl
  locationUrl!: SafeUrl
  job!: Job
  constructor(private jobTodoService: JobTodoService, private jobService: JobService, private currentUser: CurrentUser, private router: Router, private domSanitizer: DomSanitizer, private mapService: MapService) { }
  dataUrlPrefix = "data:@file/*;base64,"

  @Input("ind") ind: number = -1
  @Input("jobTodo") jobTodo!: JobTodo

  // @Input("upvote") upvote!: Function
  // @Input("downvote") downvote!: Function
  // @Input("validateAndSendCredits") validateAndSendCredits!: Function

  // pollEndsIn !: number
  // pollIntervalId!: any
  comment!: FormControl
  showCommets = false


  ngOnInit(): void {
    this.currentSafeUrl = this.sanitizeUrl(this.dataUrlPrefix + this.jobTodo.current)
    this.locationUrl = this.sanitizeUrl(this.mapService.getStaticImageUri(this.jobTodo.coords))


    this.comment = new FormControl("")
    this.timeTaken = new FormControl(0)
    // if (this.job.status.valueOf() === "done") this.pollEndsIn = -1
    // if (this.job.status.valueOf() !== "done") this.pollEndsIn = this.pollEndsIn = moment(this.job?.endAt).diff(moment(), "s")
    // console.debug(`${this.job._id} endsIn ${this.pollEndsIn}`)
    // this.pollIntervalId = this.job.status.valueOf() !== "done" && this.pollEndsIn > 0 ? setInterval(async () => {

    //   this.pollEndsIn = moment(this.job?.endAt).diff(moment(), "s")
    //   console.debug("endsIn" + this.pollEndsIn)
    //   if (this.pollEndsIn === 0) {
    //     clearInterval(this.pollIntervalId)
    //     console.debug("inter" + this.pollIntervalId)
    //     console.count("interval")
    //     //await this.validateAndSendCredits(this.job._id, this.job?.hours)
    //   }
    //   if (this.pollEndsIn < 0 && this.pollIntervalId) clearInterval(this.pollIntervalId)
    // }, 1000) : null
  }
  sanitizeUrl(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url)
  }
  toggleComments() {
    this.showCommets = this.showCommets ? false : true
  }
  currentUserCryptoAddr(): any {
    return this.currentUser.getCryptoAddress()
  }
  collectProofImage(event: Event) {
    const file = (<HTMLInputElement>event.target).files ? (<HTMLInputElement>event.target).files?.item(0) : null
    this.proofImage = file
  }
  markAsTaken() {
    this.jobTodoService.markAsTaken(this.jobTodo._id).subscribe((res: JobTodo) => {
      this.jobTodo = res
    })
  }
  markAsWorkDone() {
    let formdata = new FormData()
    formdata.append("jobTodoID", this.jobTodo._id ? this.jobTodo._id.valueOf() : "")
    formdata.append("timeTaken", this.timeTaken.value)
    formdata.append("proof", this.proofImage)
    let job !: Job
    this.jobTodoService.markAsWorkDone(formdata).subscribe(res => {
      job = res
      formdata.append("jobID", job._id?.valueOf() ?? "")
      if (formdata.has("timeTaken")) formdata.delete("timeTaken")
      this.jobTodoService.registerJobWithJobTodo(formdata).subscribe(res => {
        this.jobTodo = res
      })
    })
  }
  showJob(jobID: String) {
    this.jobService.getJobById(jobID).then(res => {
      this.job = res
    })
  }
}
