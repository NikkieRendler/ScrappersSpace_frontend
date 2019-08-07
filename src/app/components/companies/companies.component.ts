import { Component, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/companies.service';
import { CompanyData } from '../admin/admin-interfaces';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  companiesList: CompanyData[];

  constructor(private service: CompaniesService) { }

  ngOnInit() {
    this.service.getCompanies().subscribe(data => {
      this.companiesList = data;
      console.log("TCL: CompaniesComponent -> ngOnInit -> this.companiesList", this.companiesList)

    })
  }

}
