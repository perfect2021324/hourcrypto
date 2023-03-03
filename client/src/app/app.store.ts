import { Injectable } from "@angular/core";




@Injectable({
    providedIn: "root"
})
export class AppStore {

    //init
    private loading = false
    private paginator: { display: boolean, length: number, pageIndex: number, pageSize: number, pageSizeOptions: Array<number> } = { display: false, length: 50, pageIndex: 0, pageSize: 10, pageSizeOptions: [5, 10, 20] }

    //setters
    setLoading(loading: boolean, delay?: number) {
        let timeout = setTimeout(() => {
            this.loading = loading
        }, delay ?? 0)
    }

    setPaginator(paginator: { display: boolean } | { display: boolean, length: number } | { pageIndex: number } | { display: boolean, length: number, pageIndex: number, pageSize: number, pageSizeOptions: Array<number> }) {
        this.paginator = { ...this.paginator, ...paginator }
        if (!this.paginator.display) this.paginator.length = 50 // reset to defaults
    }


    //getters
    getLoading() {
        return this.loading
    }
    getPaginator() {
        return this.paginator
    }
}