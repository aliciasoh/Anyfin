import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(
    private http: HttpClient
    ) { }

  getAllCountries(){
    return this.http.get<Country[]>(environment.countryBaseURL + '/all');
  }

}
