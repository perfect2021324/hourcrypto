import { Component } from "@angular/core";




@Component({
    selector: "app-page-not-found",
    template: `
        <section class="position-fixed d-block w-100 h-100">
            <img class="img-fluid position-absolute w-100 h-100" src="/assets/404-man-hole.gif" alt="Page not found!"/>
        </section>
    `
})
export class PageNotFound { }