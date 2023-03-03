import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Job } from 'src/types/Job';
import { JobTodo } from 'src/types/JobTodo';
import { JobTodoService } from '../jobTodo.service';

@Component({
  selector: 'app-need-volunteer',
  templateUrl: './need-volunteer.component.html',
  styleUrls: ['./need-volunteer.component.scss']
})
export class NeedVolunteerComponent implements OnInit {

  constructor(private fbuilder: FormBuilder, private router: Router, private jobTodoService: JobTodoService) {
  }
  alerts = [{ status: "", message: "" }]
  files: { current: any } = { current: null }
  job!: Job
  jobForm!: FormGroup
  zoom!: number
  geo!: any
  initJobForm() {
    this.jobForm = this.fbuilder.group({
      description: '',
      voluteers: 0
    })
    this.zoom = environment.defaults.zoom
    this.geo = {
      coords: {
        latitude: 0,
        logitude: 0,
      },
      address: ""
    }
  }
  ngOnInit(): void {
    this.initJobForm()
    this.alerts.pop() // to remove initilized array
  }
  onCurrentFileSelected(event: Event) {
    const file = (<HTMLInputElement>event.target).files ? (<HTMLInputElement>event.target).files?.item(0) : null;
    console.debug(file)
    this.files.current = file;
  }
  locationSelected(geo: any) {
    console.debug(geo)
    this.geo.coords.latitude = geo?.latitude
    this.geo.coords.longitude = geo?.longitude
    this.geo.address = geo?.location
    console.debug(this.geo)
  }
  clearForm() {
    this.initJobForm()
  }
  submitForm() {
    console.debug(this.geo?.coords)
    if (!this.jobForm.valid) this.alerts = [{ status: "danger", message: "Please fill all the input fields" }]
    if (!this.files?.current) this.alerts = [...this.alerts, { status: "danger", message: "Please select file" }]
    if (!(this.geo?.coords?.latitude && this.geo?.coords?.longitude && this.geo?.address)) this.alerts = [...this.alerts, { status: "danger", message: "Please select location" }]
    if (this.jobForm.valid && this.files?.current && this.geo?.coords?.latitude && this.geo?.coords?.longitude && this.geo.address) {
      let formdata = new FormData()
      formdata.append('description', this.jobForm.get('description')?.value)
      formdata.append('voluteers', this.jobForm.get('voluteers')?.value)
      formdata.append('current', this.files.current, 'current')
      formdata.append('latitude', this.geo.coords.latitude)
      formdata.append('longitude', this.geo.coords.longitude)
      formdata.append('address', this.geo.address)

      this.jobTodoService.needVolunteer(formdata).subscribe((res: JobTodo) => {
        if (res?._id) {
          this.clearForm()
          this.router.navigate(['main', 'job', 'new'])
        }
      })
    }
  }

}
