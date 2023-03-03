import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/types/ApiResponse';
import { CurrentUser } from '../currentuser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private currentUser: CurrentUser) { }

  async register(formData: FormData): Promise<ApiResponse> {
    let res = await this.httpClient.post<ApiResponse>(`${environment.HT_API_URL}/auth/register`, formData).toPromise()
    return res
  }

  async login(formData: FormData): Promise<ApiResponse> {
    let res: any
    try {
      res = await this.httpClient.post<ApiResponse>(`${environment.HT_API_URL}/auth/login`, formData).toPromise()
    }
    catch (err: any) {
      console.debug(err?.message)
      // display alert
    }
    return res
  }
}
