import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {
  PropertyForm: any = FormGroup;
  supplierForm: any = FormGroup;
  tenantform: any = FormGroup;
  submitted = false;
  submitted3 = false;
  isShown: boolean = false; // hidden by default
  checked: any;
  isShowDivIf = false;
  selectedValue: string = '';
  selectVal: string = '';
  selectvalue: string = '';
  selectmeterTypeVal: string = '';
  selectdebtvalue: string = '';
  files: File[] = [];
  propertyImage: any = FormArray;
  propertyImagePreview: any = [];
  associationlist: any = [];
  assoclist: any = [];
  id: any;
  url: any;
  selectedassociation: any = "";
  showimagePath: any = "";
  selectMeterType:string='';
  isForm1Submitted: boolean = false;
  // pattern1="^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$";
  pattern1 = "^[A-Z0-9]+\\s[A-Z0-9]{3}$";
  currentUserType: any;
  saveValue:any="";
  username1:any;
  uname:any;
  constructor(private formBuilder: FormBuilder, private serviceobj: HttpserviceService, private router: Router) { }
  ngOnInit() {
    this.uname=sessionStorage.getItem("username");
    this.username1= sessionStorage.getItem("id");
    this.serviceobj.getassociation().subscribe((result: any) => {
      this.associationlist = result.results;
    })
    let body = {
      type: sessionStorage.getItem("type")
    }
    this.serviceobj.getassociation1(body).subscribe((result: any) => {
      console.log(result)
      this.assoclist = result.associations;
      var associationObjId = sessionStorage.getItem("association");
      for (let i = 0; i <= this.assoclist.length; i++) {
        if (associationObjId == this.assoclist[i]._id) {
          this.selectedassociation = this.assoclist[i].association
          this.PropertyForm.patchValue({
            association: associationObjId,
          });
        }
      }
    });
      this.PropertyForm = this.formBuilder.group({
      username:this.uname,
      userId:this.username1,
      propertyAddress: ['', Validators.required],
      propertyPostCode: ['', [Validators.required, Validators.pattern(this.pattern1)]],
      voiddate: ['', Validators.required],
      association: [''],
      // checked: [false, Validators.requiredTrue],
      costCentre: ['', Validators.required],
      electricMeterType: ['', Validators.required],
      readOne: ['', Validators.required],
      electricMeterSrNo: ['', Validators.required],
      electricCard: ['', Validators.required],
      inType: ['', Validators.required],
      electricDebtOutstanding: [''],
      comments: [''],
      gasMeterType: [''],
      readOneGas: [''],
      gasMeterSrNo: [''],
      gasCard: [''],
      gasInType: [''],
      gasDebtOutstanding: [''],
      previousOwnerName: ['', Validators.required],
      forwardingAddress: [''],
      sectionFinished:[false, Validators.requiredTrue],
      propertyImage: this.formBuilder.array([]),
      // acceptTerms: [false, Validators.requiredTrue]
    });
    this.tenantform = this.formBuilder.group({
      tenantName: ['', Validators.required],
      tenantDateMoveIn: ['', Validators.required],
      finalMeterRead: ['', Validators.required],
      tenantDetailsAdded: ['', Validators.required],
    });
    this.serviceobj.loggedInUserType$.subscribe(val => {
      this.currentUserType = val;
    })
  }

  get f() { return this.PropertyForm.controls; }
  get f1() { return this.tenantform.controls; }

  inTypeEvent(event: any) {
    if (event.target.value == "In Debt") {
      this.PropertyForm.controls['electricDebtOutstanding'].setValidators(Validators.required);
    } else {
      this.PropertyForm.controls['electricDebtOutstanding'].setValidators(Validators.maxLength(200));
    }
    this.PropertyForm.controls['electricDebtOutstanding'].updateValueAndValidity();
  }
  eventCheck(event:any){
    console.log(event.checked)
  }
  changeevent(event: any) {
    if (event.target.value == "In Debt") {
      this.PropertyForm.controls['gasDebtOutstanding'].setValidators(Validators.required);
    } else {
      this.PropertyForm.controls['gasDebtOutstanding'].setValidators(Validators.maxLength(200));
    }
    this.PropertyForm.controls['gasDebtOutstanding'].updateValueAndValidity();
  }
  // *********************************Property Details*************************************************
  savePropertyDetails() {
    let obj = this.PropertyForm.value;
    this.submitted = true;
    if (this.PropertyForm.invalid) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please fill the Mandatory fields!!',
      })
      return;
    } else {
      if(this.PropertyForm.value.sectionFinished==true){
        this.PropertyForm.patchValue({sectionFinished:"on"});
        }else{
        this.PropertyForm.patchValue({sectionFinished:"off"});
      }
      let obj = this.PropertyForm.value;
      this.serviceobj.addproperty(obj).subscribe(result => {
        this.id = result.id;
        console.log("id :" + this.id);
        this.isForm1Submitted = true;
        console.log(result);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Void Property Details Saved Successfully!',
          showConfirmButton: false,
          timer: 2000
        })
        this.router.navigateByUrl('propertyedit?id=' + this.id+"&Asscoc="+this.selectedassociation);
      });
      // ,error =>console.error(error));
    }
  }
  // *******************************************************************************************  
  selectassociation(e: any) {
    // console.log(e.target.value)
    // alert(this.association=e.target.value);
  }

  checkboxEvent() {
    var x = document.getElementById("myDIV") as HTMLInputElement | null;;
    if (x?.style.display === "none") {
      x.style.display = "block";
      this.PropertyForm.controls['gasMeterType'].setValidators(Validators.required);
      this.PropertyForm.controls['readOneGas'].setValidators(Validators.required);
      this.PropertyForm.controls['gasMeterSrNo'].setValidators(Validators.required);
      this.PropertyForm.controls['gasCard'].setValidators(Validators.required);
      this.PropertyForm.controls['gasInType'].setValidators(Validators.required);
      this.PropertyForm.controls['gasDebtOutstanding'].setValidators(Validators.required);

    } else if (x?.style.display === "block") {
      x.style.display = "none";
      this.PropertyForm.controls['gasMeterType'].setValidators(Validators.maxLength(200));
      this.PropertyForm.controls['readOneGas'].setValidators(Validators.maxLength(200));
      this.PropertyForm.controls['gasMeterSrNo'].setValidators(Validators.maxLength(200));
      this.PropertyForm.controls['gasCard'].setValidators(Validators.maxLength(200));
      this.PropertyForm.controls['gasInType'].setValidators(Validators.maxLength(200));
      this.PropertyForm.controls['gasDebtOutstanding'].setValidators(Validators.maxLength(200));

    }
    this.PropertyForm.controls['gasMeterType'].updateValueAndValidity();
    this.PropertyForm.controls['readOneGas'].updateValueAndValidity();
    this.PropertyForm.controls['gasMeterSrNo'].updateValueAndValidity();
    this.PropertyForm.controls['gasCard'].updateValueAndValidity();
    this.PropertyForm.controls['gasInType'].updateValueAndValidity();
    this.PropertyForm.controls['gasDebtOutstanding'].updateValueAndValidity();
  }
// ************************SupplierDetails*******************************************************
  saveSupplierDetails() {
    this.submitted = true;
    if (!this.isForm1Submitted) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please save Void property form!',
      });
      return;
    }
    if (this.PropertyForm.invalid) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please fill the Mandatory fields in Void Property Details!',
      })
      return;
    }
    else {
      let obj = this.supplierForm.value;
      this.serviceobj.addSupplierDetails(obj).subscribe((result) => {
        console.log(result);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Supplier Info/Card Info Saved Successfully!',
          showConfirmButton: false,
          timer: 2000
        })
      });
    }
  }

// ************************Tenant Details***********************************************************
  saveTenantDetails() {
    this.submitted = true;
    if (this.PropertyForm.invalid) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please fill the Mandatory fields in Void Property Details!',
      })
      return;
    }
    else {
      this.submitted3 = true;
      if (this.tenantform.invalid) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Please fill the Mandatory fields!',
        })
        return;
      }
      // let body= {
      //   username: sessionStorage.getItem("type"),
      //   obj : this.tenantform.value
      //   // alert(JSON.stringify(obj));
      // } 
      let obj = this.tenantform.value
      this.serviceobj.addTenantDetails(obj).subscribe((result) => {
        console.log(result);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'New Tenant Details Saved Successfully!',
          showConfirmButton: false,
          timer: 2000
        })
      });
    }
  }
  addimg() {
    var x = document.getElementById("drpzone") as HTMLInputElement | null;;
    if (x?.style.display === "none") {
      x.style.display = "block";
    } else if (x?.style.display === "block") {
      x.style.display = "none";
    }
  }

  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
    let formdata: FormData = new FormData();
    formdata.append('file', this.files[this.files.length - 1], this.files[this.files.length - 1].name)
    this.serviceobj.fileupload(formdata).subscribe((result) => {
      let aaa = JSON.parse(JSON.stringify(result));
      this.propertyImage = this.PropertyForm.get("propertyImage") as FormArray;
      this.propertyImage.push(new FormControl(aaa.path));
      this.propertyImagePreview.push(aaa.path);
      
      var x = document.getElementById("drpzone") as HTMLInputElement | null;;
      if (x?.style.display === "none") {
        x.style.display = "block";
      } else if (x?.style.display === "block") {
        x.style.display = "none";
      }
    });
  }

  onRemove(sss: any) {
    this.propertyImage.removeAt(this.propertyImagePreview.indexOf(sss));
    this.propertyImagePreview.splice(this.propertyImagePreview.indexOf(sss), 1);
    this.files.splice(this.propertyImagePreview.indexOf(sss), 1);
  }
  
  onView(sss:any){
    this.showimagePath=sss;
  }

  cancleDropzone(){
    var x = document.getElementById("drpzone") as HTMLInputElement | null;;
    if (x?.style.display === "none") {
      x.style.display = "block";
    } else if (x?.style.display === "block") {
      x.style.display = "none";
    }
  }
  
}
