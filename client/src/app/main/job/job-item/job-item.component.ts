import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import { CurrentUser } from 'src/app/currentuser';
import { Job } from 'src/types/Job';
import { JobService } from '../job.service';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss'],
})
export class JobItemComponent implements OnInit {

  constructor(private domSanitizer: DomSanitizer, private jobService: JobService, private currentUser: CurrentUser, private mapService: MapService, private changeDetector: ChangeDetectorRef) { }
  beforeSafeUrl!: SafeUrl
  afterSafeUrl!: SafeUrl
  locationUrl!: SafeUrl
  currentUserCryptoAddress = this.currentUser.getCryptoAddress()

  dataUrlPrefix = "data:@file/*;base64,"
  pollEndsIn !: number
  @Input("ind") ind: number = -1
  @Input("job") job!: Job

  // @Input("upvote") upvote!: Function
  // @Input("downvote") downvote!: Function
  // @Input("validateAndSendCredits") validateAndSendCredits!: Function
  // @Input("updateTip") updateTip!: Function
  // @Input("postComment") postComment!: Function

  updateTip = this.jobService.updateTip
  validateAndSendCredits = this.jobService.validateAndSendCredits

  tip!: FormControl
  tipItem!: { givenBy: string, amount: number, status: string }
  pollIntervalId!: any
  comment!: FormControl
  showComments = false
  showAddress = false
  showTipInput = false


  ngOnInit(): void {
    this.tip = new FormControl(0)
    this.tipItem = {
      givenBy: "",
      amount: 0,
      status: ""
    }

    this.beforeSafeUrl = this.sanitizeUrl(this.dataUrlPrefix + this.job.proofOfWork.before)
    this.afterSafeUrl = this.sanitizeUrl(this.dataUrlPrefix + this.job.proofOfWork.after)
    this.locationUrl = this.sanitizeUrl(this.mapService.getStaticImageUri(this.job.coords))


    this.comment = new FormControl("")
    if (this.job.status.valueOf() === "done") this.pollEndsIn = -1
    if (this.job.status.valueOf() !== "done") this.pollEndsIn = this.pollEndsIn = moment(this.job?.endAt).diff(moment(), "s")
    this.pollIntervalId = this.job.status.valueOf() !== "done" && this.pollEndsIn > 0 ? setInterval(async () => {
      this.pollEndsIn = moment(this.job?.endAt).diff(moment(), "s")
      if (this.pollEndsIn === 0) {
        clearInterval(this.pollIntervalId)
        //await this.validateAndSendCredits(this.job._id, this.job?.hours)
      }
      if (this.pollEndsIn < 0 && this.pollIntervalId) clearInterval(this.pollIntervalId)
    }, 1000) : null
  }
  sanitizeUrl(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url)
  }
  toggleComments() {
    this.showComments = !this.showComments
  }
  toggleTipInput() {
    this.showTipInput = !this.showTipInput
  }
  toggleAddress() {
    this.showAddress = !this.showAddress
  }
  sendTip = () => {
    if (this.tip.valid && this.tip.value > 0) {
      this.updateTip({ jobId: this.job._id ?? "", tip: this.tip.value }).then((res: any) => {
        if (res?.status) {
          this.tipItem = {
            givenBy: res?.givenBy,
            amount: res?.amount,
            status: res?.satus
          }
          this.showTipInput = false
        }
      })
    }
  }

  upvote(id: String) {
    this.jobService.upvote(id)
  }
  downvote(id: String) {
    this.jobService.downvote(id)
  }
  flagvote(id: String) {
    this.jobService.flagvote(id)
  }
  async postComment(data: { jobId: String, comment: String }) {
    let job = await this.jobService.postComment(data)
    if (job && this.job) this.job = job
    this.comment.setValue("")
    this.changeDetector.detectChanges()
  }
  isUserVotedUp() {
    return this.currentUser.getId() ? (this.job.votes.up?.map(acc => acc._id).includes(this.currentUser.getId() ?? "X")) : false
  }
  isUserVotedDown() {
    return this.currentUser.getId() ? (this.job.votes.down?.map(acc => acc._id).includes(this.currentUser.getId() ?? "X")) : false
  }
  isUserVotedFlag() {
    return this.currentUser.getId() ? (this.job.votes.flag?.map(acc => acc._id).includes(this.currentUser.getId() ?? "X")) : false
  }
}
