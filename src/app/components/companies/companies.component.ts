import { Component, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/companies.service';
import { CompanyDataToDisplay, CompanyWithLocation } from '../admin/admin-interfaces';
import { HostListener } from '@angular/core';

interface Marker {
  lat: number;
  lng: number;
  alpha: number;
  link: any[];
  name: string;
  icon?: any;
}

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})



export class CompaniesComponent implements OnInit {
  displayVacanciesList = [];
  latitude = 50.4340271;
  longitude = 30.5429637;
  markers: Marker[] = [];
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

    this.service.getCompaniesLocation('Киев').subscribe(data => {
      data.map(company => {
        company.icon ? console.log(company) : null;

        company.address.map((address, index) => {
          this.markers.push({
            lat: company.address[index].lat,
            lng: company.address[index].lng,
            alpha: 1,
            link: company.resources,
            name: company.name,
            icon: this.checkForIcon(company)
          });
        });
      });
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

  checkForIcon(company: CompanyWithLocation) {
    if (company.icon) {
      return { url: company.icon, scaledSize: { height: 25, width: 25 } };
    }
  }

  selectMarker(event, selectedMarker: Marker) {
    const markerToUse = this.markers.find(i => i.name === selectedMarker.name);
    console.log("TCL: CompaniesComponent -> selectMarker -> markerToUse", markerToUse);
  }

}
