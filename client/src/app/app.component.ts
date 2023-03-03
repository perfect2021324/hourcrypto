import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare let $: any
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'crypto-client';
  constructor(private router: Router) { }
  ngOnInit(): void {
    // force angular to re redender all components in the route tree
    // even if the leaf component changed in total route
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
  }
}
