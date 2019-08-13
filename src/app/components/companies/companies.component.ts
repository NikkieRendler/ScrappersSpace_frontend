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
    console.log("TCL: CompaniesComponent -> onResize -> this.innerWidth", this.innerWidth)
  }
  onResize(event) {
    this.innerWidth = window.innerWidth;
    console.log("TCL: CompaniesComponent -> onResize -> this.innerWidth", this.innerWidth)
  }
  ngOnInit() {

    this.service.getCompanies().subscribe(data => {
      data.map((company, index) => {
        this.companiesList.splice(index, 1, company);
      });
      if (!this.companiesList.some(company => company === null)) {
        this.loading = false;
      }
    });
  }

}
