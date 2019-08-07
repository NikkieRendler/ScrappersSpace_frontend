import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { Resource } from './admin-interfaces';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  resourcesList: Resource[] = [];
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
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
      console.log(this.resourcesFormArray);
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
      amount: [0],
      id: [resource._id],
      name: [resource.resource],
      icon: [resource.icon]
    });
    this.resourcesFormArray.push(newGroup);
  }

  submitForm(): void {
    console.log(this.validateForm);

  }

}
