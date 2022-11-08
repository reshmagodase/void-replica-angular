import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-propertyedit',
  templateUrl: './propertyedit.component.html',
  styleUrls: ['./propertyedit.component.css']
})
export class PropertyeditComponent implements OnInit {
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
  submittedDate: boolean = false; // hidden by default

  propertyImagePreview: any = [];
  associationlist: any = [];
  id: any;
  url: any;
  association: any
  isForm1Submitted: boolean = false;
  getuserproperty: any = [];
  isChecked: boolean = false;
  propertyAddress: any;
  currentUserType: any;
  selectedassociation: any;
  Asscoc: any;
  pattern1 = "^[A-Z0-9]+\\s[A-Z0-9]{3}$";
  showimagePath: any = "";
  username1: any;
  minimumDate: any;
  isDateLess: boolean = false;
  constructor(private formBuilder: FormBuilder, private serviceobj: HttpserviceService, private router: Router,
    private route: ActivatedRoute) {
    this.serviceobj.loggedInUserType$.subscribe(val => {
      this.currentUserType = val;
      // alert("in pro: " +this.currentUserType)
    })
  }
  ngOnInit() {
    this.username1 = sessionStorage.getItem("username");
    this.route.queryParams.subscribe((param: Params) => {
      let obj = JSON.parse(JSON.stringify(param));
      this.id = obj.id
      this.Asscoc = obj.Asscoc
    })
    this.PropertyForm = this.formBuilder.group({
      objectId: [this.id],
      username: this.username1,
      propertyAddress: ['', Validators.required],
      propertyPostCode: ['', [Validators.required, Validators.pattern(this.pattern1)]],
      voiddate: ['', Validators.required],
      association: [''],
      // checked: [false, Validators.requiredTrue],
      costCentre: ['', Validators.required],
      electricMeterType: ['', Validators.required],
      electricMeterSrNo: ['', Validators.required],
      electricCard: ['', Validators.required],
      readOne: ['', Validators.required],
      inType: ['', Validators.required],
      electricDebtOutstanding: [''],
      // img:[''],
      comments: [''],
      gasCheckbox: [''],
      gasMeterType: [''],
      readOneGas: [''],
      gasMeterSrNo: [''],
      gasCard: [''],
      gasInType: [''],
      gasDebtOutstanding: [''],
      previousOwnerName: ['', Validators.required],
      forwardingAddress: [''],
      propertyImage: this.formBuilder.array(['', Validators.required]),
      sectionFinished:[false, Validators.requiredTrue],
    });

    // this.PropertyForm.controls['propertyAddress'].disable();
    // this.PropertyForm.controls['association'].disable();
    // this.PropertyForm.controls['propertyAddress'].disable();

    this.supplierForm = this.formBuilder.group({
      MPAN: [''],
      MPANSupplier: [''],
      MPRN: [''],
      MPRNSupplier: [''],
      keySentTo: [''],
      prepayElectric: [''],
      prepayGas: [''],
      visitDate: [''],
      comments: [''],
      supplierInfoSectionFinished: [false]
    });
    this.tenantform = this.formBuilder.group({
      tenantName: ['', Validators.required],
      tenantDateMoveIn: ['', Validators.required],
      finalMeterRead: ['', Validators.required],
      tenantDetailsAdded: ['', Validators.required],
      tenantsectionFinished: [''],
    });

    this.serviceobj.getassociation().subscribe((result: any) => {
      this.associationlist = result.results;
    })
    let body = {
      objectId: this.id
    }
    this.serviceobj.getuserproperty(body).subscribe((result: any) => {
      console.log(result);
      this.getuserproperty = result.results;
      this.minimumDate = this.getuserproperty.voiddate;

      if(this.getuserproperty.sectionFinished=="on"){this.getuserproperty.sectionFinished=true}else{this.getuserproperty.sectionFinished=false}
      this.PropertyForm.patchValue({
        association: this.getuserproperty.association,
        sectionFinished: this.getuserproperty.sectionFinished,
      });
      let reshma = JSON.parse(JSON.stringify(this.getuserproperty));
      this.propertyImagePreview = reshma.propertyImage;
      if (reshma.gasMeterType != "") {
        this.isChecked = true;
        this.checkboxEvent();
      }
    })
    if (this.currentUserType == 1) {
      this.PropertyForm.disable();
      this.supplierForm.disable();
    }
  }
  get f() { return this.PropertyForm.controls; }
  get f1() { return this.tenantform.controls; }
  asdf(event: any) {
    if (event.target.value == "In Debt") {
      this.PropertyForm.controls['electricDebtOutstanding'].setValidators(Validators.required);
    } else {
      this.PropertyForm.controls['electricDebtOutstanding'].setValidators(Validators.maxLength(200));
    }
    this.PropertyForm.controls['electricDebtOutstanding'].updateValueAndValidity();
  }
  // *********************************Property Details*************************************************

  updatePropertyDetails() {
    console.log("hgh:" + JSON.stringify(this.PropertyForm.value))
    this.submitted = true;
    if (this.PropertyForm.invalid) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please fill the Mandatory fields!!',
      })
      return;
    } else {
      console.log(this.PropertyForm.value.sectionFinished)
      if (this.PropertyForm.value.sectionFinished == true) {
        this.PropertyForm.patchValue({ sectionFinished: "on" });
      } else {
        this.PropertyForm.patchValue({ sectionFinished: "off" });
      }
      let obj = this.PropertyForm.value;
      this.serviceobj.editproperty(obj).subscribe((result: any) => {
        this.submitted = false;
        this.isForm1Submitted = true;
        if (result.status == "success") {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Void Property Details Save Successfully!',
            showConfirmButton: false,
            timer: 2000
          })
        }
      });
      // ,error =>console.error(error));
    }
  }
  // *******************************************************************************************  
  selectassociation(e: any) {
    // console.log(e.target.value)
    // alert(this.association = e.target.value);
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
    // if (!this.isForm1Submitted) {
    //   Swal.fire({
    //     position: 'center',
    //     icon: 'error',
    //     // title: 'Oops...',
    //     title: 'Please save Void property form!',
    //     // footer: '<a href="">Why do I have this issue?</a>'
    //   });
    //   return;
    // }
    if (this.PropertyForm.invalid) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please fill the Mandatory fields in Void Property Details!',
      })
      return;
    }
    else {
      if (this.supplierForm.value.supplierInfoSectionFinished == true) {
        this.supplierForm.patchValue({ supplierInfoSectionFinished: "on" });
      } else {
        this.supplierForm.patchValue({ supplierInfoSectionFinished: "off" });
      }
      let obj = this.supplierForm.value;
      this.serviceobj.addSupplierDetails(obj).subscribe((result: any) => {
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
  onDateEvent(){
    const voiddate = new Date(this.PropertyForm.value.voiddate);
    const tenantDateMoveIn = new Date(this.tenantform.value.tenantDateMoveIn);
    if (voiddate < tenantDateMoveIn) {
      this.isDateLess = false;
      this.submittedDate=false;
    } else {
      this.isDateLess = true;
      this.submittedDate=true;
    }
  }

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
      let obj = this.tenantform.value
      this.serviceobj.addTenantDetails(obj).subscribe((result: any) => {
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
    this.serviceobj.fileupload(formdata).subscribe((result: any) => {
      let sss = JSON.parse(JSON.stringify(result));
      this.propertyImage = this.PropertyForm.get("propertyImage") as FormArray;
      this.propertyImage.push(new FormControl(sss.path));
      this.propertyImagePreview.push(sss.path);

      var x = document.getElementById("drpzone") as HTMLInputElement | null;
      if (x?.style.display === "none") {
        x.style.display = "block";
      } else if (x?.style.display === "block") {
        x.style.display = "none";
      }
    });
  }
  onRemove(sss: any) {
    this.propertyImagePreview.splice(this.propertyImagePreview.indexOf(sss), 1);
    this.files.splice(this.propertyImagePreview.indexOf(sss), 1);
  }
  cancleDropzone() {
    var x = document.getElementById("drpzone") as HTMLInputElement | null;;
    if (x?.style.display === "none") {
      x.style.display = "block";

    } else if (x?.style.display === "block") {
      x.style.display = "none";
    }
  }
  onView(sss: any) {
    this.showimagePath = sss;
  }
}
