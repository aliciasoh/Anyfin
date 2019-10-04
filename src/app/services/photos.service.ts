import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  constructor(
  ) { }

  getCountryPhoto(country){
    return "url(" + environment.photoBaseURL + "/1600x900/?" + encodeURIComponent(country.replace(/[()]/g," ")) + ")";
  }
}
