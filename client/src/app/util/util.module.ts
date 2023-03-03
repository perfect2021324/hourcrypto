import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardDirective } from './directive/clipboard.directive';
import { NoRecordsFound } from './component/no-records-found/no-records-found.component';
import { PageNotFound } from './component/page-not-found/page-not-found';



@NgModule({
  declarations: [
    ClipboardDirective,
    NoRecordsFound,
    PageNotFound
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ClipboardDirective,
    NoRecordsFound,
    PageNotFound
  ]
})
export class UtilModule { }
