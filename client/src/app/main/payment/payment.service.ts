import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";



@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    constructor(private httpClient: HttpClient) { }

    redeemHours(redeem: any) {
        let status = ""
        return this.httpClient.post<any>(`${environment.HT_API_URL}/payment/payout`, {
            amount: redeem.amount,
            payTo: redeem.payTo,
            mode: "paypal",
            purpose: "redeem"
        })
    }
}