import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppStore } from 'src/app/app.store';
import { AlertService } from 'src/app/util/service/alert.service';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/types/ApiResponse';
import { Job } from 'src/types/Job';
import { TransactionService } from '../transaction/transaction.service';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private URL!: string;
  constructor(private httpClient: HttpClient, private transactionService: TransactionService, private store: AppStore) { }
  jobs: Job[] = []

  async getJobs(params: {}) {
    this.store.setLoading(true)
    this.URL = `${environment.HT_API_URL}/job/all`
    let res = await this.httpClient.post<ApiResponse>(this.URL, params).toPromise()
    this.jobs = res.payload ?? []
    this.store.setLoading(false)
  }
  // getCurrentUserJobs(params: {}) {
  //   this.store.setLoading(true)
  //   this.URL = `${environment.HT_API_URL}/job/currentuser/all`
  //   this.httpClient.post<ApiResponse>(this.URL, {}).subscribe((res: ApiResponse) => {
  //     res.payload && res.payload.length > 0 && Object.assign(this.jobs, res.payload)
  //     this.store.setLoading(false)
  //     if (this.jobs.length > this.store.getPaginator().pageSize) this.store.setPaginator({ display: true })
  //   })
  // }
  /**
   * 
   * @returns fetches real time jobs
   */
  fetchLoadedJobs() {
    this.jobs.length > this.store.getPaginator().pageSize ? this.store.setPaginator({ display: true, length: this.jobs.length }) : this.store.setPaginator({ display: false })
    return this.jobs
  }

  async postJob(formdata: any) {
    this.store.setLoading(true)
    let job!: Job;

    try {
      let res = await this.httpClient.post<ApiResponse>(`${environment.HT_API_URL}/job`, formdata).toPromise()
      this.store.setLoading(false)
      const { payload, responseCode, responseMessage } = res
      if (responseMessage) AlertService.toast(responseMessage, responseCode)
      job = payload
    } catch (error: any) {
      const { payload, responseCode, responseMessage } = error?.error
      AlertService.toast(responseMessage, responseCode)
    }
    if (job?._id !== undefined) this.jobs.push(job)
  }
  upvote = (id: String) => {
    let formData: FormData = new FormData()
    formData.append("_id", id.valueOf())

    this.httpClient.patch<ApiResponse>(`${environment.HT_API_URL}/job/vote/up`, formData).subscribe((res) => {
      if (res.payload._id != undefined) {
        let job: Job = res.payload
        let oldInd = this.jobs.map((item, ind, jobs) => {
          return item._id
        }).indexOf(id)

        this.jobs[oldInd] = job
      }
    }, (err) => AlertService.toast(err.error.responseMessage, err.error.responseCode)
    )

  }
  downvote = (id: String) => {
    let formData: FormData = new FormData()
    formData.append("_id", id.valueOf())
    this.httpClient.patch<ApiResponse>(`${environment.HT_API_URL}/job/vote/down`, formData).subscribe((res) => {
      if (res.payload?._id != undefined) {
        let job: Job = res.payload
        let oldInd = this.jobs.map((item, ind, jobs) => {
          return item._id
        }).indexOf(id)

        this.jobs[oldInd] = job
      }
    }, (err) => AlertService.toast(err.error.responseMessage, err.error.responseCode)
    )
  }
  flagvote = (id: String) => {
    let formData: FormData = new FormData()
    formData.append("_id", id.valueOf())
    this.httpClient.patch<ApiResponse>(`${environment.HT_API_URL}/job/vote/flag`, formData).subscribe((res) => {
      if (res.payload?._id != undefined) {
        let job: Job = res.payload
        let oldInd = this.jobs.map((item, ind, jobs) => {
          return item._id
        }).indexOf(id)

        this.jobs[oldInd] = job
      }
    }, (err) => AlertService.toast(err.error.responseMessage, err.error.responseCode)
    )
  }
  postComment = async (data: { jobId: String, comment: String }): Promise<Job> => {
    let res!: ApiResponse
    let formData: FormData = new FormData()
    formData.append("jobId", data.jobId.valueOf())
    formData.append("comment", data.comment.valueOf())
    try {
      res = await this.httpClient.patch<ApiResponse>(`${environment.HT_API_URL}/job/comment`, formData).toPromise()
    } catch (err: any) {
      AlertService.toast(err.error.responseMessage, err.error.responseCode)
    }
    // let oldInd = this.jobs.map((item, ind, jobs) => {
    //   return item._id
    // }).indexOf(data.jobId)

    // this.jobs[oldInd] = job
    return res.payload
  }
  updateTip = async (data: { jobId: String, tip: Number }) => {
    let formData: FormData = new FormData()
    formData.append("jobId", data.jobId.valueOf())
    formData.append("tip", data.tip.valueOf() + "")
    let res = await this.httpClient.patch<ApiResponse>(`${environment.HT_API_URL}/job/tip`, formData).toPromise()
    let tipItem = res.payload
    return tipItem
  }

  getJobById = async (jobId: String) => {
    let job!: Job
    try {
      let params = {
        _id: jobId.valueOf()
      }
      let res = await this.httpClient.get<ApiResponse>(`${environment.HT_API_URL}/job`, { params: params }).toPromise()
      if (res.payload?._id) {
        job = res.payload
      }
    }
    catch (err) {
      console.error(err)
    }
    return job
  }
  validateAndSendCredits = async (jobId: String, amount: Number) => {
    let job!: Job
    if (jobId && amount) {
      try {
        job = await this.getJobById(jobId)
        if (job?._id && job._account && job.status.valueOf() !== "done") {
          await this.transactionService.transferHours({ amount: amount, debitAccount: "SYSTEM", creditAccount: job._account.cryptoAddress, createdBy: "SYSTEM" })
        }
        //settle tips
        await this.httpClient.post(`${environment.HT_API_URL}/job/tip/settlement`, { jobId: job._id }).toPromise()

        //job completed
        let res = await this.httpClient.patch<ApiResponse>(`${environment.HT_API_URL}/job/status`, { jobId: job._id, status: "done" }).toPromise()
        job = res.payload
      }
      catch (err) {
        console.debug(err)
      }
    }

  }
}
