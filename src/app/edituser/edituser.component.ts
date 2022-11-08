import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit {
  edituserform:any=FormGroup;
  submitted = false;  
  userdata:any=[];
  name:any;
  username:any;
  email:any;
  id:any;
  userlist:any=[];
  constructor(private fb:FormBuilder , private serviceobj:HttpserviceService,private route: ActivatedRoute) {}

  ngOnInit(): void {  
    this.route.queryParams.subscribe((param: Params) => {
      let obj = JSON.parse(JSON.stringify(param));
      this.id = obj.id;
    })
    this.edituserform = this.fb.group({
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
      this.userlist=res.results;
      this.edituserform.patchValue({
            username: this.userlist.username,
            email: this.userlist.email,
            password:this.userlist.password,  
            Confirmpassword:this.userlist.password
          });
      // console.log(this.userlist);
    })
  }
  get f() { return this.edituserform.controls; }
  passwordMatchValidator(password: string): ValidatorFn {
    return (control: any) => {
      console.log(control)
      if (!control || !control.parent) {
        return null;
      }
      return control.parent.get(password).value === control.value ? null : { mismatch: true };
    };
  }
  editUserDetails(){
    this.submitted = true;
    if (this.edituserform.invalid) {
      return;
    } else {
      let obj = this.edituserform.value;
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
          this.edituserform.reset();
        }
      });
      // ,error =>console.error(error));
    }
  }
}
