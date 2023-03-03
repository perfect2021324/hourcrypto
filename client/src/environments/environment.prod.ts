export const environment = {
  production: true,
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
    latitude: 43.000000,
    longitude: -75.000000,
    zoom: 15
  }
}
