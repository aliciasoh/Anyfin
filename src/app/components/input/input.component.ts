import { Component, OnInit } from '@angular/core';
import { CountriesService } from 'src/app/services/countries.service';
import { Country } from 'src/app/models/country.model';
import { PhotosService } from 'src/app/services/photos.service';
import { ViewEncapsulation } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RatesService } from 'src/app/services/rates.service';
import { Rate } from 'src/app/models/rate.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InputComponent implements OnInit {

  countriesData: Country[];
  ratesData: Rate[];
  fromCurrency;
  fromCurrencyThumbnail;
  fromAmount;
  toAmount;
  toCurrency;
  fromExchangeRate;
  toExchangeRate;
  selectedCountry;

  isToggled;
  toggleFromExchangeRate;
  toggleToExchangeRate;

  isLoaded;


  constructor(
    private countriesService: CountriesService,
    private photosService: PhotosService,
    private ratesService: RatesService,
    public dialog: MatDialog
  ) {
   }

  ngOnInit() {
    this.isLoaded = false;
    forkJoin(
      this.countriesService.getAllCountries(),
      this.ratesService.getAllRates(),
    ).subscribe(([countryData, rateData]) => {
      this.ratesData = rateData;
      this.filterRates(this.ratesData);
      this.filterAllCountry(countryData);
      this.isLoaded = true;
    });
  }

  filterRates(ratesData){
    let sekRate = ratesData['rates']['SEK'];
    let filteredRates = {};
    Object.keys(ratesData['rates']).forEach(eachCurrency=>{
      filteredRates[eachCurrency] = (ratesData['rates'][eachCurrency]/sekRate);
    })
    this.ratesData['rates'] = filteredRates;
  }

  filterAllCountry(countryData){
    let arr = [];
    countryData.forEach(country =>{
      country.currencies.forEach(eachCurrency => {
        if(this.ratesData['rates'].hasOwnProperty(eachCurrency.code) && eachCurrency.code.includes(country.alpha2Code) && !arr.includes(country)){
          country.currencies = eachCurrency;
          arr.push(country);
        }
      });
      if(country.alpha3Code == "CHN"){
        this.populateInitial(country);
      }
    })
    this.countriesData = arr;
  }

  populateInitial(country){
    this.setBackgroundImage(country.name);
    this.selectedCountry = country;
    this.fromAmount = (1000).toFixed(2);
    this.fromExchangeRate = 1;
    this.fromCurrency = "SEK";
    this.fromCurrencyThumbnail = "https://restcountries.eu/data/swe.svg";
    this.toCurrency = country.currencies.code;
    this.toExchangeRate = this.ratesData['rates'][country.currencies.code];
    this.toAmount = (this.fromAmount * (this.toExchangeRate)).toFixed(2);
    this.isToggled = false;
    this.toggleFromExchangeRate = this.fromExchangeRate.toFixed(2);
    this.toggleToExchangeRate = this.toExchangeRate.toFixed(2);
  }

  populateOnChange(country){
    this.setBackgroundImage(country.name);
    this.selectedCountry = country;
    this.toExchangeRate =this.ratesData['rates'][country.currencies.code];
    this.toAmount = (this.fromAmount * (this.toExchangeRate)).toFixed(2);
    this.toggleFromExchangeRate = this.fromExchangeRate.toFixed(2);
    this.toggleToExchangeRate = this.toExchangeRate.toFixed(2);
  }

  setBackgroundImage(country){
    document.getElementsByClassName('bg')[0]['style'].backgroundImage = this.photosService.getCountryPhoto(country.toLowerCase());
  }

  onChange($event) {
    this.populateOnChange($event);
  }

  toggleRate(){
    if(this.isToggled){
      this.toggleToExchangeRate = (1/this.toggleFromExchangeRate).toFixed(2);
      this.toggleFromExchangeRate = 1;
      this.isToggled = false;
    }
    else{
      this.toggleFromExchangeRate = (1/this.toggleToExchangeRate).toFixed(2);
      this.toggleToExchangeRate = 1;
      this.isToggled = true;
    }
  }

  inputKeyUp($event){
    switch ($event.srcElement.classList[0]){
      case "to-amount-input":
        this.fromAmount = (this.toAmount * (1/this.toExchangeRate)).toFixed(2);
        break;
      case "from-amount-input":
        this.toAmount = (this.fromAmount * this.toExchangeRate).toFixed(2);
        break;
    }
  }

  learnMore(country) {
    this.dialog.open(ModalComponent, {
      width: '300px',
      data: country
    });
  }

}
