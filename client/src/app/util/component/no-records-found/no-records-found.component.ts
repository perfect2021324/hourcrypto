import { Component } from "@angular/core";




@Component(
    {
        selector: "app-no-records-found",
        template: `
            <section class="position-fixed d-block w-100 h-100">
                <img class="img-fluid position-absolute w-100 h-100" src="/assets/doodle.jpg" alt="No records found!"/>
            </section>
        `
    }
)
export class NoRecordsFound {

}