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
}

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})



export class CompaniesComponent implements OnInit {
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
    console.log('TCL: CompaniesComponent -> ngOnInit -> data', data);
    data.map(company => {
        company.address.map((address, index) => {
          this.markers.push({ lat: company.address[index].lat, lng: company.address[index].lng, alpha: 1, link: company.resources, name: company.name });
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

  selectMarker(event) {
    this.selectedMarker = {
      lat: event.latitude,
      lng: event.longitude
    };
  }

}
