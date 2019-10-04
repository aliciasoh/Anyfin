import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Rate } from '../models/rate.model';

@Injectable({
  providedIn: 'root'
})
export class RatesService {

  constructor(
    private http: HttpClient
  ) { }

  getAllRates(){
    return this.http.get<Rate[]>(environment.rateBaseURL + '/latest?base=SEK');
  }
}
