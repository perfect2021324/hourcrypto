import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/util/service/alert.service';
import { environment } from 'src/environments/environment';
import { Alert } from 'src/types/Alert';
import { Job } from 'src/types/Job';
import { JobService } from '../job.service';


@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.scss']
})
export class CreateJobComponent implements OnInit {

  constructor(private fbuilder: FormBuilder, private router: Router, private jobService: JobService) {
  }
  files: { before: any, after: any } = { before: null, after: null }
  job!: Job
  jobForm!: FormGroup
  zoom!: number
  geo!: any
  initJobForm() {
    this.jobForm = this.fbuilder.group({
      description: ["", [Validators.required, Validators.minLength(5)]],
      hours: ["", [Validators.required, Validators.min(1)]],
      before: [null, [Validators.required]],
      after: [null, [Validators.required]]
    })
    this.zoom = environment.defaults.zoom
    this.geo = {
      coords: {
        latitude: 0,
        longitude: 0,
      },
      address: ""
    }
  }
  ngOnInit(): void {
    this.initJobForm()
  }
  onBeforeFileSelected(event: Event) {
    const file = (<HTMLInputElement>event.target).files ? (<HTMLInputElement>event.target).files?.item(0) : null;
    this.files.before = file;
  }
  onAfterFileSelected(event: Event) {
    const file = (<HTMLInputElement>event.target).files ? (<HTMLInputElement>event.target).files?.item(0) : null;
    this.files.after = file
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
  async submitForm() {
    if (!(this.geo?.coords?.latitude && this.geo?.coords?.longitude && this.geo?.address)) AlertService.toast("Please select location", 400)
    if (this.jobForm.valid && this.geo?.coords?.latitude && this.geo?.coords?.longitude && this.geo.address) {
      let formdata = new FormData()
      formdata.append('description', this.jobForm.get('description')?.value)
      formdata.append('hours', this.jobForm.get('hours')?.value)
      formdata.append('before', this.files.before, 'before')
      formdata.append('after', this.files.after, 'after')
      formdata.append('latitude', this.geo.coords.latitude)
      formdata.append('longitude', this.geo.coords.longitude)
      formdata.append('address', this.geo.address)
      //   formdata.append('latitude', "41.0895249")
      // formdata.append('longitude', "-73.8419063")
      // formdata.append('address', "this adress")
      await this.jobService.postJob(formdata)
      this.clearForm()
      //this.router.navigate(['main','job','view'])
    }

  }
}
