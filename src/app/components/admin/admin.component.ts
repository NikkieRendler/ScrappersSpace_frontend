import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { Resource, CompanyData } from './admin-interfaces';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  resourcesList: Resource[] = [];
  validateForm: FormGroup;
  resourcesFormArray: FormArray;
  constructor(private fb: FormBuilder, private service: AdminService) {

  }

  ngOnInit() {
    this.resourcesFormArray = this.fb.array([]);

    this.service.getResources().subscribe(resources => {
      this.resourcesList.push(...resources);
      this.resourcesList.map(resource => {
        this.addField(resource);
      });
    });

    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      registrationCountry: [null, [Validators.required]],
      companyType: [null, [Validators.required]],
      motto: [null, [Validators.required]],
      description: [null, [Validators.required]],
      resources: [this.resourcesFormArray],
      remember: [true]
    });


  }

  addField(resource: Resource): void {
    const newGroup = this.fb.group({
      link: [''],
      contentAmount: [0],
      name: [resource.resource],
      resource: [resource._id],
      icon: [resource.icon]
    });
    this.resourcesFormArray.push(newGroup);
  }

  submitForm(data): void {
    const CompanyToAdd = {
      name: data.name,
      registrationCountry: data.registrationCountry,
      companyType: data.companyType,
      description: data.description,
      motto: data.motto,
      resources: data.resources.value.map((resource: Resource) => {
        return {
          resource: resource.resource,
          link: resource.link,
          contentAmount: resource.contentAmount
        };
      })
    };
    this.service.addCompany(CompanyToAdd).subscribe(res => {
      console.log(res);
    });
  }

}
