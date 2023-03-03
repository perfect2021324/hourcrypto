import { UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  toggled = false;
  subtoggled = false;
  _hasBackgroundImage = true;
  menus = [
    {
      title: 'Upload New Job',
      icon: 'fa fa-book',
      active: false,
      type: 'simple',
      url:'main/job/create'
    },
    {
      title: 'View Jobs',
      icon: 'fa fa-shopping-cart',
      active: false,
      type: 'dropdown',
      drop: true,
      submenus: [
        {
          title:'All Jobs',
          url:'main/job/u/view'
        },
        {
          title: 'New Jobs',
          type: 'n',
          url:'main/job/create'
        },
        {
          title: 'Flagged Jobs',
          type: 'n'
        },
        {
          title: 'My Jobs',
          type: 'dropdown',
          active: false,
          submenu: [
            {
              title: 'All My Jobs',
              url: ""
            },
            {
              title: 'Completed Jobs',
            },
            {
              title: 'Pending Jobs',
            },
            {
              title: 'Approved Jobs',
            },
            {
              title: 'Denied Jobs',
            },
          ],
        },
      ],
    },
    {
      title: 'View Transactions',
      icon: 'fa fa-chart-line',
      active: false,
      type: 'dropdown',

      submenus: [
        {
          title: "All",
          url:'main/transaction/view',
        },
        {
          title: 'My Transactions',
          type: 'dropdown',
          active: false,
          submenu: [
            {
              title: 'All',
              url: ""
            },
            {
              title: 'Hours Sent',
            },
            {
              title: 'Hours Received',
            }
          ],
        },
        {
          title: 'World Transactions',
          type: 'dropdown',
          active: false,
          submenu: [
            {
              title: 'All',
              url: ""
            },
            {
              title: 'Hours Sent',
            },
            {
              title: 'Hours Received',
            },
            {
              title: 'Hours Redeemed',
            },
            {
              title: 'Hours Converted',
            },
          ],
        },
      ],
    }
  ];

  rightmenus = [
    {
      title: 'My Account',
      icon: 'fa fa-book',
      active: false,
      type: 'simple',
      url:''
    },
    {
      title: 'Use Your Hours',
      icon: 'fa fa-shopping-cart',
      active: false,
      type: 'dropdown',
      drop: true,
      submenus: [
        {
          title:'Send to User',
          url:'main/job/u/view'
        },
        {
          title: 'Redeem to Cash',
          type: 'n',
          url:'main/job/create'
        },
        {
          title: 'Convert to Crypto',
          type: 'n'
        },
      ]
    },
    {
      title: 'Buy Hours',
      icon: 'fa fa-book',
      active: false,
      type: 'simple',
      url:''
    },
    {
      title: 'Earn Hours',
      icon: 'fa fa-book',
      active: false,
      type: 'simple',
      url:''
    },
  ]
  constructor() {}

  toggle() {
    this.toggled = !this.toggled;
  }
  subtoggle() {
    this.subtoggled = !this.subtoggled;
  }

  getMenuList() {
    return this.menus;
  }
  getRightMenuList(){
    return this.rightmenus;
  }
  get hasBackgroundImage() {
    return this._hasBackgroundImage;
  }

  set hasBackgroundImage(hasBackgroundImage) {
    this._hasBackgroundImage = hasBackgroundImage;
  }
}
