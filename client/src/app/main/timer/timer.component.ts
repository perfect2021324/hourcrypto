import { Component, OnInit } from '@angular/core';
import { TimerService } from './timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  constructor(private tservice: TimerService) { }

  timestamp = this.tservice.getCurrentTs()
  ngOnInit(): void {
  }
  intervalId = setInterval(() => {
    this.timestamp = this.tservice.getCurrentTs()
  },1000)
}
