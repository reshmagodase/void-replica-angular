import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-association',
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.css']
})
export class AssociationComponent implements OnInit {
  submitted = false;
  form:any=FormGroup;
  loading = false;
  association:any;
  constructor(private fb: FormBuilder, private serviceobj:HttpserviceService,private router: Router) {} 

  ngOnInit(): void {
    this.form = this.fb.group({
      association: ['', Validators.required ],
    });
  }get f() { return this.form.controls; }

  addassociation() {
    this.submitted = true;
    if (this.form.invalid) 
    {
      return;
    }
    let obj = this.form.value;
    this.serviceobj.addassociation(obj).subscribe((result:any) => {
    console.log(result);
    if (result.status=="success") {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Association added Successfully!',
        showConfirmButton: false,
        timer: 1500
      })
      this.submitted=false;
      this.form.reset();
    }
    },
  )};
}
