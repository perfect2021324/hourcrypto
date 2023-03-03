import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  template: `
  <div class="modal" [id]="modalId" tabindex="-1" aria-labelledby="modalId + 'Label'" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" [attr.id]="modalId + 'Label'">Pick a location</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <agm-map style="height: 350px;" ([latitude])="googleMap.coords?.lat" [longitude]="googleMap.coords?.lng" [zoom]="googleMap.zoom" (mapClick) ="onMapClick($event)">
            <agm-marker [latitude]="googleMap.coords?.lat" [longitude]="googleMap.coords?.lng" [markerDraggable]=true> 
              <agm-info-window *ngIf="address">
                {{address}}
              </agm-info-window>
            </agm-marker>
          </agm-map>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [
  ]
})
export class MapComponent implements OnInit {

  constructor(private mapService: MapService) { }

  googleMap!: any
  @Input("modalId") modalId:any
  @Input("latitude") lat: any
  @Input("longitude") lng: any
  @Input("readOnly") readOnly: boolean | undefined
  @Output("mapClick") mapClick = new EventEmitter()
  address!:string
  ngOnInit(): void {
    this.googleMap = {
      zoom: 2,
      coords: {
        lat: this.lat ? this.lat : 0,
        lng: this.lng ? this.lng : 0
      }
    }
    this.mapService.getAddress(this.googleMap.coords).then(addr => {
      this.address = addr
    }).catch(err => console.error(err))
    this.readOnly = this.readOnly == undefined ?  true : false
  }
  onMapClick(event: any) {
    if(!this.readOnly) {
      this.googleMap.coords = event?.coords
      this.mapService.getAddress(this.googleMap.coords).then(addr => {
        this.address = addr
      }).catch(err => console.error(err))

      this.mapClick.emit(event)
    }
  }
}
