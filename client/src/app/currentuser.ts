import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { AccountDetails } from "src/types/Account";
import { ApiResponse } from "src/types/ApiResponse";
import { AlertService } from "./util/service/alert.service";



@Injectable({
    providedIn: 'root'
})
export class CurrentUser {

    private _id !: string | undefined
    private cryptoAddress !: string | undefined
    private wallet!: number
    private email!: string | undefined
    private status!: string | undefined
    private firstName!: string | undefined
    private lastName!: string | undefined
    private displayName!: string | undefined
    private displayPicture!: Buffer | undefined
    private ssn!: string | undefined
    private createdAt!: Date | undefined
    private updatedAt!: Date | undefined
    private token!: string

    constructor(private router: Router, private httpClient: HttpClient) { }

    getId = () => this._id
    getCryptoAddress = () => this.cryptoAddress
    getWallet = () => this.wallet
    getEmail = () => this.email
    getStatus = () => this.status
    getFirstName = () => this.firstName
    getLastName = () => this.lastName
    getDisplayName = () => this.displayName
    getDisplayPicture = () => this.displayPicture
    getSsn = () => this.ssn
    getCreatedAt = () => this.createdAt
    getUpdateAt = () => this.updatedAt
    getToken = () => this.token
    setToken = (token: string) => {
        this.setLocalStorageToken(token)
        this.token = token
    }
    getLocalStorageToken = () => localStorage.getItem("token")
    private setLocalStorageToken = (token: string) => localStorage.setItem("token", token)

    getCurrentUser = async () => {
        await this.isLoggedIn()
        return {
            _id: this._id,
            cryptoAddress: this.cryptoAddress,
            wallet: this.wallet,
            email: this.email,
            status: this.status,
            firstName: this.firstName,
            lastName: this.lastName,
            displayName: this.displayName,
            displayPicture: this.displayPicture,
            snn: this.ssn,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }

    setCurrentUser = (account: AccountDetails) => {

        this._id = account._id.valueOf()
        this.cryptoAddress = account.cryptoAddress.valueOf()
        this.wallet = account.wallet?.valueOf()
        this.email = account.email.valueOf()
        this.status = account.status.valueOf()
        this.firstName = account.firstName?.valueOf()
        this.lastName = account.lastName?.valueOf()
        this.displayName = account.displayName?.valueOf()
        this.displayPicture = account.displayPicture
        this.ssn = account.ssn?.valueOf()
        this.createdAt = account.createdAt
        this.updatedAt = account.updatedAt
    }

    reset() {
        this._id = undefined
        this.cryptoAddress = undefined
        this.wallet = 0
        this.email = undefined
        this.status = undefined
        this.firstName = undefined
        this.lastName = undefined
        this.displayName = undefined
        this.displayPicture = undefined
        this.ssn = undefined
        this.createdAt = undefined
        this.updatedAt = undefined
    }

    /**
     * 
     * @param params {path: true | false}
     * @description if sepecified, then it will fetch only those
     */
    private fetchAccount = async (projection?: {}, query?: {}) => {
        try {
            let res = await this.httpClient.post<ApiResponse>(`${environment.HT_API_URL}/auth/account`, { projection: projection ?? {} }, { params: query ?? {} }).toPromise()
            // console.debug({ account: res.payload })
            if (res.payload?.token && res.payload?.cryptoAddress && res.payload.wallet >= 0 && res.payload?.email && res.payload?.status) {
                this.wallet = res.payload.wallet
                this._id = res.payload._id
                this.cryptoAddress = res.payload.cryptoAddress
                this.email = res.payload.email
                this.status = res.payload.status
                this.firstName = res.payload.firstName
                this.lastName = res.payload.lastName
                this.displayName = res.payload.displayName
                this.displayPicture = res.payload.displayPicture
                this.ssn = res.payload.ssn
                this.createdAt = res.payload.createdAt
                this.updatedAt = res.payload.updatedAt
                this.token = res.payload.token
            }
        } catch (err) {
            console.error(err)
            this.logout()
        }
    }

    private fetchWallet = async () => {
        this.httpClient.get<ApiResponse>(`${environment.HT_API_URL}/auth/account/wallet`).subscribe(res => {
            if (res.payload?.cryptoAddress && res.payload?.wallet && res.payload.wallet >= 0 && this.cryptoAddress === res.payload.cryptoAddress) {
                this.wallet = res.payload.wallet
                // console.debug({ wallet: this.wallet, cryptoAddress: this.cryptoAddress })
            }
        }, (err: Error) => {
            this.logout() // if loggedIn, will logout in case of error
            throw err
        })
    }
    private refresh = async () => {
        await this.fetchAccount()
    }
    refreshWallet = async () => {
        await this.fetchWallet()
    }
    isLoggedIn = async () => {
        if (!this.getLocalStorageToken()) return false
        if (!this.token) await this.refresh()
        if (!!this.token && this.getLocalStorageToken() === this.token) return true
        return false
    }
    logout = () => {
        localStorage.removeItem("token")
        // this.setLocalStorageToken("")
        this.reset()
        this.router.navigate(["main", "auth", "login"])
        AlertService.toast("Logged Off Successfully", 200)
    }
}