import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-editclient',
  templateUrl: './editclient.component.html',
  styleUrls: ['./editclient.component.css']
})
export class EditclientComponent implements OnInit {
  editclientform:any=FormGroup;
  submitted = false;  
  userdata:any=[];
  name:any;
  username:any;
  email:any;
  id:any;
  clientlist:any=[];
  associationlist:any=[];
  associatedUserlist:any=[];
  getuserlist:any=[];

  constructor(private fb:FormBuilder , private serviceobj:HttpserviceService,private route: ActivatedRoute) {}

  ngOnInit(): void {  
    this.route.queryParams.subscribe((param: Params) => {
      let obj = JSON.parse(JSON.stringify(param));
      this.id = obj.id;
    })

    this.editclientform = this.fb.group({
      objectId: [this.id],
      username: ['', Validators.required ],
      email: ['', [Validators.required ,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,5}$')]],
      password:['', [Validators.required ,Validators.minLength(6)]],
      Confirmpassword: ['', [Validators.required ,this.passwordMatchValidator('password')]],
      relatedAssociation:[''],
      associatedUser:[''],
      address:[''],
      clientName:[''],
      tel:[''],
      contractDate:[''],
      notes:[''],
    });
    
    let body={
      objectId:this.id,
    }
    this.serviceobj.getuserdetails1(body).subscribe((res:any) =>{
      this.clientlist=res.results;
     console.log(this.clientlist)
      this.editclientform.patchValue({
        username: this.clientlist.username,
        email: this.clientlist.email,
        password:this.clientlist.password,
        Confirmpassword:this.clientlist.password,
        relatedAssociation:this.clientlist.relatedAssociation,
        associatedUser:this.clientlist.associatedUser,
        address:this.clientlist.address,
        clientName:this.clientlist.clientName,
        tel:this.clientlist.tel,
        contractDate:this.clientlist.contractDate,
        notes:this.clientlist.notes
      });
    })

    // let body1= {
    //   type: sessionStorage.getItem("type")
    // }
    this.serviceobj.getassociation().subscribe((result: any) => {
      // this.associationlist = result.results;
      // console.log(this.associationlist);
    })
    let data= {
      type: sessionStorage.getItem("type")
    }
    this.serviceobj.getAccountdetails(data).subscribe((result: any) => {
      console.log(result)
      this.associatedUserlist=result.associatedUser;
      this.associationlist=result.relatedAssociation;
    })
  }
  get f() { return this.editclientform.controls; }

  passwordMatchValidator(password: string): ValidatorFn {
    return (control: any) => {
      console.log(control)
      if (!control || !control.parent) {
        return null;
      }
      return control.parent.get(password).value === control.value ? null : { mismatch: true };
    };
  }

  editClientDetails(){
    this.submitted = true;
    if (this.editclientform.invalid) {
      return;
    } else {
      let obj = this.editclientform.value;
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
          this.editclientform.reset();
        }
      });
      // ,error =>console.error(error));
    }
  }
}
