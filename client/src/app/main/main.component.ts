import { AfterViewInit, Component, DoCheck, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { AppStore } from '../app.store';
import { CurrentUser } from '../currentuser';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SidebarService } from './main.service';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],

  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class MainComponent implements OnInit {
  menus: any = [];
  rightmenus: any = [];

  constructor(public currentUser: CurrentUser, public store: AppStore, public sidebarservice: SidebarService, public router: Router) {
    this.menus = sidebarservice.getMenuList();
    this.rightmenus = sidebarservice.getRightMenuList();
  }

  // getSideBarState() {
  //   return this.sidebarservice.getSidebarState();
  // }

  toggle(currentMenu: any) {
    if (currentMenu.type === 'dropdown') {
      this.menus.forEach( (element: any) => {

        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
        }
      });
    }
  }

  globalSearch(value: String){
    let searchVal: any[] = [];
    let filtered: any [] = [];
    let origin: any[] = this.menus;
    this.menus.map((item: any, index: number) => {
      searchVal.push(item);
      if(item.type === "dropdown"){
        item.submenus.map((item1: any, index1: number) => {
          searchVal.push(item1);
          if(item1.type === 'dropdown'){
            item1.submenu.map((item2: any, index2: number) => {
              searchVal.push(item2)
            })
          }
        })
      }
    });

    searchVal.map((item : any, index: number) => {
      if (item.title.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
        filtered.push(item);
      }
    })
    if(value){
      this.menus = filtered
    } else if(!value) {
      this.menus = this.sidebarservice.getMenuList();
    }
  }

  righttoggle(currentMenu: any) {
    if (currentMenu.type === 'dropdown') {
      this.rightmenus.forEach( (element: any) => {

        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
        }
      });
    }
  }

  subtoggle(currentMenu: any) {
    console.log(currentMenu)
    currentMenu.active = !currentMenu.active;
  }

  navigateURL(url: string) {
    this.router.navigateByUrl(url);
  }

  getState(currentMenu: any) {

    if (currentMenu.active) {
      return 'down';
    } else {
      return 'up';
    }
  }


  isLoggedIn: boolean = false
  wallet!: number
  cryptoAddress!: string | undefined
  async ngOnInit(): Promise<void> {
    this.isLoggedIn = await this.currentUser.isLoggedIn()
    this.wallet = this.currentUser.getWallet()
    this.cryptoAddress = this.currentUser.getCryptoAddress()
  }
  controlPage(event: PageEvent) {
    this.store.setPaginator({ pageIndex: event.pageIndex, pageSize: event.pageSize })
  }

  logout() {
    this.currentUser.logout()
  }
}
