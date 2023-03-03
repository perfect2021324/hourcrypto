import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Sanitizer, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'
import 'node_modules/mapbox-gl'
import { environment } from 'src/environments/environment';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  template: `
  <div class="modal"  [id]="modalId" tabindex="-1" aria-labelledby="modalId + 'Label'" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content p-0">
        <div class="modal-header">
          <h5 class="modal-title" [attr.id]="modalId + 'Label'"> {{location ?? 'Where did you work?'}}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="position:relative; width:100%; height:20rem; overflow: hidden;">
        <div #geoMapRef id="{{mapId}}" style="position:absolute; top:0; left:0; width:100%; height:100%;"> </div>
        </div>
        <div *ngIf="!readOnly" class="modal-footer">
          <button type="button" class="btn btn-secondary" (click)="flyToCurrentLocation()"> Current location </button>
          <button type="button" class="btn btn-secondary" (click)="resetMap()"> Reset </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" (click)="onMapClose()">Save</button>
        </div>
      </div>
    </div>
  </div>
  
  `,
  styles: [
  ]
})
export class MapComponent implements OnInit, AfterViewInit {

  constructor(private mapService: MapService) { }

  @Input() mapId: any
  @Input("latitude") latitude: any
  @Input("longitude") longitude: any
  @Input("zoom") zoom: number | undefined
  @Input() modalId: any
  @Input("readOnly") readOnly: boolean = true
  @Output("locationSelected") locationSelected = new EventEmitter()
  geoMap!: mapboxgl.Map
  @Input("location") location!: string | undefined
  @ViewChild("geoMapRef") geoComponent!: ElementRef
  ngOnInit(): void {
    if (!(this.longitude && this.latitude)) {
      this.getCurrentOrDefaultLocation().then(r => {
        this.latitude = r?.latitude
        this.longitude = r?.longitude
        this.initGeoMap(r)
      })
    }
    else setTimeout(()=> {
      this.initGeoMap({ latitude: this.latitude, longitude: this.longitude })
    }, 0)
    // this.mapService.getAddress(this.geo.coords).then(addr => {
    //   this.address = addr
    // }).catch(err => console.error(err))
  }
  ngAfterViewInit(): void {
     //this.geoComponent.nativeElement.style.opacity = 1
  }

  getCurrentOrDefaultLocation() {
    return new Promise<{ latitude: number, longitude: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude })
      }, () => {
        resolve({ latitude: environment.defaults.latitude, longitude: environment.defaults.longitude })
      })
    })
  }

  flyToCurrentLocation() {
    this.getCurrentOrDefaultLocation().then(r => {
      let curLoc = { latitude: r.latitude, longitude: r.longitude }
      this.flyTo(curLoc)
      this.markMap(curLoc)
    })
  }

  flyTo(coords: { latitude: number, longitude: number }) {
    let lnglat: mapboxgl.LngLatLike = [coords.longitude, coords.latitude]
    this.geoMap.flyTo({ center: lnglat, zoom: this.zoom ?? environment.defaults.zoom })
  }

  markMap(coords: { latitude: number, longitude: number }) {
    let lnglat: mapboxgl.LngLatLike = [coords.longitude, coords.latitude]
    this.latitude = coords.latitude;
    this.longitude = coords.longitude;

    this.mapService.getAddress(coords).then((location) => {
      this.location = location
    })
    const marker = new mapboxgl.Marker().
      setLngLat(lnglat).
      // setPopup(new mapboxgl.Popup().
      //   setHTML("<strong> some place </strong>").
      //   setLngLat([point.longitude, point.latitude])).
      addTo(this.geoMap)

    marker.togglePopup()
    this.geoMap.flyTo({ center: lnglat, zoom: this.zoom ?? environment.defaults.zoom })
  }

  initGeoMap(coords: { latitude: number, longitude: number }) {
    let lnglat: mapboxgl.LngLatLike = [coords.longitude, coords.latitude]
    let options = {
      accessToken: environment.mapbox.accessToken,
      container: this.mapId,
      style: `mapbox://styles/mapbox/${environment.mapbox.styleType}`,
      center: lnglat,
      zoom: this.zoom ?? environment.defaults.zoom
    }
    this.geoMap = new mapboxgl.Map(options)
    this.geoMap.flyTo({ center: lnglat })
    if (!this.readOnly) {
      this.geoMap.once("click", e => {
        this.markMap({ longitude: e.lngLat.lng, latitude: e.lngLat.lat })
      })
      this.geoMap.addControl(new mapboxgl.NavigationControl())
    }
    if (this.readOnly) {
      this.markMap(coords)
    }
  }

  resetMap() {
    this.geoMap?.remove()
    this.initGeoMap({ latitude: this.latitude, longitude: this.longitude })
    this.location = undefined
  }

  onMapClose() {
    console.log("mar cords")
    console.log(this.latitude)
    console.log(this.longitude)

    if (!this.readOnly) {
      if (this.latitude && this.longitude) this.locationSelected.emit({ latitude: this.latitude, longitude: this.longitude, location: this.location })
    }
  }
}
