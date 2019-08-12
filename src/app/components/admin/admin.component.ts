import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { Resource, CompanyData } from './admin-interfaces';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  resourcesList: Resource[] = [];
  validateForm: FormGroup;
  resourcesFormArray: FormArray;
  constructor(private fb: FormBuilder, private service: AdminService, private message: NzMessageService) {

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
      logo: [null, [Validators.required]],
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
      link: [null],
      contentAmount: [0],
      name: [resource.resource],
      resource: [resource._id],
      icon: [resource.icon]
    });
    this.resourcesFormArray.push(newGroup);
  }

  submitForm(data): void {
    const presentResources = [];
    data.resources.value.forEach((resource: Resource) => {
      if (resource.link !== null && resource.link !== '') {
        presentResources.push({
          resource: resource.resource,
          link: resource.link,
          contentAmount: +resource.contentAmount
        });
      }
    });
    const CompanyToAdd = {
      name: data.name,
      logo: data.logo,
      registrationCountry: data.registrationCountry,
      companyType: data.companyType,
      description: data.description,
      motto: data.motto,
      resources: presentResources
    };
    this.service.addCompany(CompanyToAdd).subscribe(res => {
      if (res) {
        this.message.create('success', 'Company added');
        this.validateForm.reset();
        this.resourcesFormArray.reset();
      }
    });
  }

}
