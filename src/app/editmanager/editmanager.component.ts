import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-editmanager',
  templateUrl: './editmanager.component.html',
  styleUrls: ['./editmanager.component.css']
})
export class EditmanagerComponent implements OnInit {
  editmanagerform:any=FormGroup;
  submitted = false;  
  userdata:any=[];
  name:any;
  username:any;
  email:any;
  id:any;
  managerlist:any=[];
  constructor(private fb:FormBuilder , private serviceobj:HttpserviceService,private route: ActivatedRoute) {}

  ngOnInit(): void {  
    this.route.queryParams.subscribe((param: Params) => {
      let obj = JSON.parse(JSON.stringify(param));
      this.id = obj.id;
    })

    this.editmanagerform = this.fb.group({
      objectId: [this.id],
      username: ['', Validators.required ],
      email: ['', [Validators.required ,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,5}$')]],
      password:['', [Validators.required ,Validators.minLength(6)]],
      Confirmpassword: ['', [Validators.required ,this.passwordMatchValidator('password')]],
    });
    
    let body={
      objectId:this.id,
    }
    this.serviceobj.getuserdetails1(body).subscribe((res:any) =>{
      this.managerlist=res.results;
      console.log(this.managerlist);
      this.editmanagerform.patchValue({
        username: this.managerlist.username,
        email: this.managerlist.email,
        password:this.managerlist.password,
        Confirmpassword:this.managerlist.password,
      });
    })

  }
  get f() { return this.editmanagerform.controls; }
  passwordMatchValidator(password: string): ValidatorFn {
    return (control: any) => {
      console.log(control)
      if (!control || !control.parent) {
        return null;
      }
      return control.parent.get(password).value === control.value ? null : { mismatch: true };
    };
  }

  editManagerDetails(){
    this.submitted = true;
    if (this.editmanagerform.invalid) {
      return;
    } else {
      let obj = this.editmanagerform.value;
      this.serviceobj.edituser(obj).subscribe((result: any) => {
       console.log(result)
        if (result.status == "success") {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'User Updated Successful!',
            showConfirmButton: false,
            timer: 2000
          })
          this.submitted=false;
          this.editmanagerform.reset();
        }
      });
      // ,error =>console.error(error));
    }
  }
}
