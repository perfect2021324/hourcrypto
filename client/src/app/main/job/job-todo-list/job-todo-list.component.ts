import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobTodo } from 'src/types/JobTodo';
import { JobTodoService } from '../jobTodo.service';

@Component({
  selector: 'app-job-todo-list',
  templateUrl: './job-todo-list.component.html',
  styleUrls: ['./job-todo-list.component.scss']
})
export class JobTodoListComponent implements OnInit {

  constructor(private jobTodoService: JobTodoService, private route: ActivatedRoute) { }

  jobsTodo: JobTodo[] = []
  totalJobsTodo: number = 0

  ngOnInit(): void {
    this.initJobsTodo()
  }
  initJobsTodo(){
    this.pullJobs(0,5)
  }
  loadMoreJobs(){
    this.pullJobs(this.jobsTodo.length, 10)
  }
  pullJobs(fromRecord?: number, noOfRecords?: number){
    let params = { fromRecord: fromRecord, noOfRecords: noOfRecords }
    this.jobTodoService.getJobsTodo(params).subscribe((res: any) => {

      if (res && res?.status === "success") {
        if (res.meta?.totalRecords) this.totalJobsTodo = res.meta.totalRecords
        if (this.totalJobsTodo > 0 && Object.create(res.data).length > 0) this.jobsTodo = [...this.jobsTodo, ...res.data]
      }
    }, (err) => console.error(err))
  }
}
