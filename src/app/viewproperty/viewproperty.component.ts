import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-viewproperty',
  templateUrl: './viewproperty.component.html',
  styleUrls: ['./viewproperty.component.css']
})
export class ViewpropertyComponent implements OnInit {
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
  id: any;
  url: any;
  association: any
  isForm1Submitted: boolean = false;
  getuserproperty: any = [];
  isChecked: boolean = false;
  propertyAddress: any;
  currentUserType:any;
  selectedassociation:any;
  Asscoc:any;
  
  constructor(private formBuilder: FormBuilder, private serviceobj: HttpserviceService, private router: Router,
    private route: ActivatedRoute) { 
      this.serviceobj.loggedInUserType$.subscribe(val => {
        this.currentUserType = val;
        // alert("in pro: " +this.currentUserType)
      })
    }

  ngOnInit() {
    this.route.queryParams.subscribe((param: Params) => {
      let obj = JSON.parse(JSON.stringify(param));
      this.id = obj.id
      this.Asscoc = obj.Asscoc
      // alert(this.id)
    })

    this.PropertyForm = this.formBuilder.group({
      objectId: [this.id],
      propertyAddress: ['', Validators.required],
      propertyPostCode: ['', Validators.required],
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
      checkbox:[''],
      gasMeterType: [''],
      readOneGas: [''],
      gasMeterSrNo: [''],
      gasCard: [''],
      gasInType: [''],
      gasDebtOutstanding: [''],
      previousOwnerName: ['', Validators.required],
      forwardingAddress: [''],
      propertyImage: this.formBuilder.array(['', Validators.required]),
      sectionFinished:['']

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
      prepayElectric:[''],
      prepayGas:[''],
      visitDate:[''],
      comments:[''],
      supplierInfoSectionFinished:['']
    });

    this.tenantform = this.formBuilder.group({
      tenantName: ['', Validators.required],
      tenantDateMoveIn: ['', Validators.required],
      finalMeterRead: ['', Validators.required],
      tenantDetailsAdded: ['', Validators.required],
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
      alert(this.getuserproperty.association);
      this.PropertyForm.patchValue({
        association: this.getuserproperty.association,
      });
      // let obj1=(JSON.stringify(result));
      // this.propertyAddress="hgh"
      // alert(JSON.stringify(this.getuserproperty))
      let reshma = JSON.parse(JSON.stringify(this.getuserproperty));
      this.propertyImagePreview=reshma.propertyImage;
      if (reshma.gasMeterType != "") {
        this.isChecked = true;
        this.checkboxEvent();
      }
      //  alert(JSON.parse(JSON.stringify(result)));
      //  alert(obj1.propertyAddress)
      //  console.log(result);
      //  this.getuserproperty=result.result;

      //  if (result.status=="success") {
      //  this.getuserproperty=result.re
      // }
    })
    if(this.currentUserType==1){
      this.PropertyForm.disable();
      this.supplierForm.disable();
      this.tenantform.disable();
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

  
  // ************************Tenant Details***********************************************************
 
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
    // this.PropertyForm.get('img').setValue(this.files);       
    let formdata: FormData = new FormData();
    formdata.append('file', this.files[this.files.length - 1], this.files[this.files.length - 1].name)
    this.serviceobj.fileupload(formdata).subscribe((result: any) => {
      // console.log(JSON.stringify(result));
      let sss = JSON.parse(JSON.stringify(result));

      this.propertyImage = this.PropertyForm.get("propertyImage") as FormArray;
      this.propertyImage.push(new FormControl(sss.path));
      this.propertyImagePreview.push(sss.path);
      // alert(sss.path)
      var x = document.getElementById("drpzone") as HTMLInputElement | null;;
      if (x?.style.display === "none") {
        x.style.display = "block";

      } else if (x?.style.display === "block") {
        x.style.display = "none";
      }
    });
  }

  onRemove(sss: any) {
    // console.log(event);
    this.propertyImagePreview.splice(this.propertyImagePreview.indexOf(sss), 1);
    this.files.splice(this.propertyImagePreview.indexOf(sss), 1);
  }
}
