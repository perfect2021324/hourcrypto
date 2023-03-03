import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/types/ApiResponse';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private httpClient: HttpClient) { }
  getCurrentUserTrasanctions = async () => {
    let res = await this.httpClient.get<ApiResponse>(`${environment.HT_API_URL}/transaction`).toPromise()
    return res.payload
  }
  transferHours = async (data: { amount: Number, debitAccount: String, creditAccount: String, createdBy: String }): Promise<ApiResponse> => {
    let res!: ApiResponse
    let formData = new FormData()
    if (data?.amount && data?.creditAccount && data?.debitAccount && data?.createdBy) {
      formData.append("amount", data.amount.valueOf() + "")
      formData.append("debitAccount", data.debitAccount.valueOf())
      formData.append("creditAccount", data.creditAccount.valueOf())
      formData.append("createdBy", data.createdBy.valueOf())

      res = await this.httpClient.post<ApiResponse>(`${environment.HT_API_URL}/transaction`, formData).toPromise()
    }
    return res
  }

}
