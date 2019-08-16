import { Component, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/companies.service';
import { CompanyData } from '../admin/admin-interfaces';
import { HostListener } from "@angular/core";


@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})


export class CompaniesComponent implements OnInit {
  innerWidth: number;
  loading = true;
  companiesList: CompanyData[] = [null, null, null];

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

    this.service.getCompanies().subscribe(data => {
      data.map((company, index) => {
        // company.resourcesByTypes = [];
        // const resourceNames = [];
        // company.resources.map(resource => {
        //   if (!resourceNames.includes(resource.type)) {
        //     resourceNames.push(resource.type);
        //   }
        // });
        // resourceNames.forEach(resourceName => {
        //   company.resourcesByTypes.push({ type: resourceName, resources: [] });
        // });
        // console.log(company.name, company.resourcesByTypes);

        this.companiesList.splice(index, 1, company);
      });
      if (!this.companiesList.some(company => company === null)) {
        this.loading = false;
        window.scrollTo(0, 0);
      }
    });
  }

}
