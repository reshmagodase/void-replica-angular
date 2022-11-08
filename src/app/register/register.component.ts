import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  submitted = false;
  registerform:any=FormGroup
  loading = false;
  success=true;
  isLoggedIn=true;
  username :any;
  error = '';
  associationlist:any=[];
  associatedUserlist:any=[];
  selectvalue:any;
  constructor(private fb: FormBuilder, private serviceobj:HttpserviceService,private router: Router, private route: ActivatedRoute) {} 

  ngOnInit(): void {
    this.registerform = this.fb.group({     
      type: ['', Validators.required ],
      username: ['', Validators.required ],
      email: ['', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,5}$')]],
      password:['', [Validators.required ,Validators.minLength(6)]],
      Confirmpassword: ['', [Validators.required ,this.passwordMatchValidator('password')]],
      relatedAssociation:[''],
      associatedUser:[''],
      address:[''],
      clientName:[''],
      tel:[''],
      contractDate:[''],
      notes:[''],
    }
    );
    let data= {
      type: sessionStorage.getItem("type")
    }
    this.serviceobj.getAccountdetails(data).subscribe((result: any) => {
      console.log(result)
      this.associatedUserlist=result.associatedUser;
      this.associationlist=result.relatedAssociation;
    })
  }
  get f() { return this.registerform.controls; }
  passwordMatchValidator(password: string): ValidatorFn {
    return (control: any) => {
      console.log(control)
      if (!control || !control.parent) {
        return null;
      }
      return control.parent.get(password).value === control.value ? null : { mismatch: true };
    };
  }
  
  addDetails(registerform:any) {
    this.submitted = true;
    if (registerform.invalid) 
    {   
        return;
    }else{
      if(this.registerform.valid){}
      let obj = this.registerform.value;
      this.serviceobj.createaccount(obj).subscribe((result:any) => {
        if(result.status == "success"){
          this.submitted = false;
          this.registerform.reset(); 
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'User Registration successfull!',
            showConfirmButton: false,
            timer: 2000
          })
        }
        else{
          alert("Invalid Credential..");
        }     
      })
    }   
  }
}
