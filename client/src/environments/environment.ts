// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


//static url ==== /styles/v1/{username}/{style_id}/static/{overlay}/{lon},{lat},{zoom},{bearing},{pitch}|{bbox}|{auto}/{width}x{height}{@2x}
export const environment = {
  production: false,
  mapbox: {
    accessToken: "pk.eyJ1IjoiZGF2ZTM2MDAiLCJhIjoiY2w5a3l4Mmx6MDFpODN3cWFtcHdxeW4yZiJ9.NQgAoK85Z6iC7z1UxA0I9Q",
    styleType: "satellite-streets-v11",
    baseUrl: "https://api.mapbox.com",
    geocodingApi: "/geocoding/v5/{endpoint}/{search_text}.json",
    reverseGeocodingApi: "/geocoding/v5/{endpoint}/{longitude},{latitude}.json",
    staticImageApi: "/styles/v1/mapbox/{style_type}/static/{longitude},{latitude},{zoom},0.00,0.00/450x250@2x?access_token={access_token}",
    endpoint: "mapbox.places"
  },
  defaults: {
    latitude: 0,
    longitude: 0,
    zoom: 15
  },
  HT_API_URL: "http://localhost:3001"
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
