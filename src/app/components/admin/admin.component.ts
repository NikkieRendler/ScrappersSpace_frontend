import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
  resourcesForm: FormGroup;

  constructor(private fb: FormBuilder, private service: AdminService) {

  }

  ngOnInit() {
    this.service.getResources().subscribe(resources => {
      this.resourcesList.push(...resources)
      console.log("TCL: AdminComponent -> constructor -> this.resourcesList", this.resourcesList)
      this.resourcesList.map(resource => {
        this.addField(resource)
      })
      console.log(this.resourcesForm.controls);
      
    })
    this.resourcesForm = this.fb.group({})

    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      registrationCountry: [null, [Validators.required]],
      companyType: [null, [Validators.required]],
      motto: [null, [Validators.required]],
      description: [null, [Validators.required]],
      resources: this.resourcesForm,
      remember: [true]
    });



  }

  addField(resource: Resource): void {

    this.resourcesForm.addControl(
      resource.resource,
      new FormControl(null, Validators.required)
    )
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      console.log(this.validateForm.controls[i].value)
    }
  }

}
