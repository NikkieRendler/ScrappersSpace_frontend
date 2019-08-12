import { Component, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/companies.service';
import { CompanyData } from '../admin/admin-interfaces';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  loading = true;
  companiesList: CompanyData[] = [null, null, null];

  constructor(private service: CompaniesService) { }

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
