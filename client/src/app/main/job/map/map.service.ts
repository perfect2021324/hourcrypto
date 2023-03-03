import { HttpClient } from "@angular/common/http";
import { Injectable, Sanitizer } from "@angular/core";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: "root"
})
export class MapService {
    constructor(private httpClient: HttpClient, private sanitizer: Sanitizer) { }

    async getAddress(coords: { latitude: any, longitude: any }) {
        let res
        try {
            res = await this.reverseGeoCoding(coords).toPromise()
        } catch (error) {
            console.debug(error)
        }
        let location = res?.features[0].place_name
        return location
    }

    private reverseGeoCoding(coords: { latitude: any, longitude: any }) {
        let uri = environment.mapbox.baseUrl + environment.mapbox.reverseGeocodingApi.
            replace("{endpoint}", environment.mapbox.endpoint).
            replace("{longitude},{latitude}", `${coords.longitude},${coords.latitude}`)
        console.debug(uri)
        return this.httpClient.get<any>(uri, {
            params: {
                access_token: environment.mapbox.accessToken,
                //types: "locality"
            }
        })
    }

    getStaticImageUri(coords: { latitude: any, longitude: any }) {
        let uri = ""
        if (!(environment?.mapbox?.accessToken && coords?.longitude && coords?.latitude && environment?.mapbox?.styleType && environment?.mapbox?.endpoint && environment?.defaults?.zoom)) return uri
        try {
            uri = environment.mapbox.baseUrl + environment.mapbox.staticImageApi.
                replace("{style_type}", environment.mapbox.styleType).
                replace("{longitude},{latitude}", `${coords.longitude},${coords.latitude}`).
                replace("{zoom}", environment.defaults.zoom + "").
                replace("{access_token}", environment.mapbox.accessToken)
        }
        catch (err) {
            console.trace(err)
        }
        return uri
    }
}