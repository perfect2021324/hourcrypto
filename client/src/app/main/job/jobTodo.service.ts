import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Job } from "src/types/Job";
import { JobTodo } from "src/types/JobTodo";



@Injectable({
    providedIn: 'root'
})
export class JobTodoService {
    constructor(private httpClient: HttpClient) { }
    URL: string = ""

    needVolunteer(formdata: any) {
        this.URL = `${environment.HT_API_URL}/jobTodo`
        return this.httpClient.post<JobTodo>(this.URL, formdata)
    }
    getJobsTodo(params: {}) {
        this.URL = `${environment.HT_API_URL}/jobTodo/all`
        return this.httpClient.get<any>(this.URL, { params: params })
    }
    markAsTaken(jobTodoID?: String) {
        this.URL = `${environment.HT_API_URL}/jobTodo/take`
        let data = { jobTodoID: jobTodoID }
        let formdata = new FormData()
        formdata.append("jobTodoID", jobTodoID?.valueOf() ? jobTodoID.valueOf() : "")
        return this.httpClient.patch<JobTodo>(this.URL, formdata)
    }
    markAsWorkDone(formdata: FormData) {
        this.URL = `${environment.HT_API_URL}/jobTodo/workDone`
        return this.httpClient.patch<Job>(this.URL, formdata)
    }
    registerJobWithJobTodo(formdata: FormData) {
        this.URL = `${environment.HT_API_URL}/jobTodo/status`
        return this.httpClient.patch<JobTodo>(this.URL, formdata)
    }
}