import { Component, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/companies.service';
import { CompanyDataToDisplay, CompanyWithLocation, Vacancy, City } from '../admin/admin-interfaces';
import { HostListener } from '@angular/core';

interface Marker {
  lat: number;
  lng: number;
  alpha: number;
  vacancies: Vacancy[];
  website: any;
  name: string;
  icon?: any;
}

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})



export class CompaniesComponent implements OnInit {
  selectedValue: City = { city: "Київ", lat: 50.45466, lng: 30.5238 };
  citiesList: City[] = [];
  displayVacanciesList = [];
  // latitude = 50.4340271;
  // longitude = 30.5429637;
  markers: Marker[] = [];
  companiesAmount: number;
  mapType = 'roadmap';
  innerWidth: number;
  loading = true;
  companiesList: CompanyDataToDisplay[] = [null, null, null];
  selectedMarker: { lat: any; lng: any; };

  constructor(private service: CompaniesService) {
    this.getScreenSize();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
  }
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit() {
    this.service.getCitiesList().subscribe(data => {
      this.citiesList = data;
      this.fetchCompaniesLocationByCity(this.citiesList[0]);
    });

    this.service.getCompanies().subscribe(data => {
      data.map((company, index) => {
        this.companiesList.splice(index, 1, company);
      });
      if (!this.companiesList.some(company => company === null)) {
        this.loading = false;
        window.scrollTo(0, 0);
      }
    });
  }

  // loadSelectedCity(city: City) {
  //   this.fetchCompaniesLocationByCity(city);
  // }

  fetchCompaniesLocationByCity(city: City) {
    console.log("TCL: CompaniesComponent -> fetchCompaniesLocationByCity -> city", city)
    this.service.getCompaniesLocation(city.city).subscribe(data => {
      this.markers.length = 0;
      this.companiesAmount = data.amount;
      data.companies.map(company => {
        company.address.map((address, index) => {
          this.markers.push({
            lat: company.address[index].lat,
            lng: company.address[index].lng,
            alpha: 1,
            vacancies: company.vacancies,
            website: { url: `https://s2.googleusercontent.com/s2/favicons?domain_url=${company.website}`, scaledSize: { height: 27, width: 27 } },
            name: company.name,
            icon: this.checkForIcon(company)
          });
        });
      });
      this.selectedValue.lat = city.lat;
      this.selectedValue.lng = city.lng;
    });
  }

  checkForIcon(company: CompanyWithLocation) {
    if (company.icon) {
      return { url: company.icon, scaledSize: { height: 30, width: 30 } };
    }
  }

  selectMarker(event, selectedMarker: Marker) {
    const markerToUse = this.markers.find(i => i.name === selectedMarker.name);
    console.log("TCL: CompaniesComponent -> selectMarker -> markerToUse", markerToUse);
  }

}
