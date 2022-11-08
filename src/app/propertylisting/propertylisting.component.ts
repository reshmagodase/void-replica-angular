import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-propertylisting',
  templateUrl: './propertylisting.component.html',
  styleUrls: ['./propertylisting.component.css']
})
export class PropertylistingComponent implements OnInit {

  usernamelist: any = [];
  propertylist: any = [];
  p: any;
  searchForm: any = FormGroup;
  date: any;
  createdBy: any;
  createdFrom: any;
  datepipe: any;
  latest_date: any

  currentPage: any=0;
  endPageLimit: any;
  maxPages: any;

  btnNames: any = [];
  count: any = [];
  date1: any;
  currentUserType: any;
  sss: any;

  userlist: any = [];
  constructor(private serviceobj: HttpserviceService, private formBuilder: FormBuilder, private router: Router) { }
  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      createdBy: [''],
      status: [''],
      propertyAddress: [''],
      propertyPostCode: [''],
      createdFrom: [''],
      createdTo: [''],
      uniqueNo: [''],
      costCentre: [''],
    });

    // this.serviceobj.getusername().subscribe((result: any) => {
    //   console.log(result)
    //   this.usernamelist = result.results;
    // })
    let body = {
      type: sessionStorage.getItem("type"),
      association: sessionStorage.getItem("association"),
      userId: sessionStorage.getItem("id"),
    }
    this.serviceobj.getpropertylist(body).subscribe((result: any) => {
      this.userlist = result.addedBy;
      console.log(this.userlist);
      this.propertylist = result.response;
      this.endPageLimit = result.pages;
      this.maxPages = result.pages;

      this.count = result.count;
      this.setButt222();
    })
    
    this.serviceobj.loggedInUserType$.subscribe(val => {
      this.currentUserType = val;
    })
  }

  changeUser(e: any) {
    console.log(e.target.value)
  }
  onChangePage(pageOfItems: Array<any>) {
    this.propertylist = pageOfItems;
  }
  OnPageChange(sss: any) {
    this.p = sss;
  }
  extractUsername(obj: any) {
    try {
      let a = JSON.parse(JSON.stringify(obj));
      return a.username;
    } catch {
      return "";
    }
  }
  extractassociation(obj: any) {
    try {
      let a = JSON.parse(JSON.stringify(obj));
      return a.association;
    } catch {
      return "";
    }
  }
  // *****************************************************************************
  searchClick() {
    var createdfrom = this.searchForm.value.createdFrom;
    this.searchForm.value.createdFrom = (new Date(createdfrom).getTime()) / 1000;

    var createdTo = this.searchForm.value.createdTo;
    this.searchForm.value.createdTo = (new Date(createdTo).getTime()) / 1000;

    let data = JSON.stringify(this.searchForm.value);
    let body = {
      type: sessionStorage.getItem("type"),
      search: data,
      association: sessionStorage.getItem("association"),
      userId: sessionStorage.getItem("id"),
    }
    this.serviceobj.getsearch(body).subscribe((result: any) => {
      console.log("search result:", result);
      this.propertylist = result.response;
      this.endPageLimit = result.pages;
      this.maxPages = result.pages;
      this.count = result.count;
      console.log(JSON.stringify(this.propertylist));
      this.setButt222();
    })
  }
  // ***********************************************************************************
  deleteUser(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let body = {
          objectId: id
        }
        this.serviceobj.deleteProperty(body).subscribe((result: any) => {
          console.log(result);
          if (result.status == "success") {
            let body = {
              type: sessionStorage.getItem("type")
            }
            this.serviceobj.getpropertylist(body).subscribe((result: any) => {
              this.propertylist = result.response;
              console.log(JSON.stringify(result.response));
            })
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Record Has Been Deleted',
              showConfirmButton: false,
              timer: 2000
            })
          }
        })
      }
    })
  }
  // *****************************************************************************
  editProperty(id: any) {
    this.router.navigateByUrl('propertyedit?id=' + id);
  }
  viewProperty(id: any) {
    alert("view alert")
    this.router.navigateByUrl('viewproperty?id=' + id);
  }
  // *****************************************************************************
  isCurrentpage(name: any) {
    if (this.currentPage == name) {
      return true;
    } else {
      return false
    }
  }

  btnClick(name: any) {
    if (name == "First") {
      this.currentPage = 1;

    } else if (name == "Last") {
      this.currentPage = this.endPageLimit;

    } else {
      this.currentPage = name;
    }
    // let data = JSON.stringify(this.searchForm.value);
    // let body = {
    //   type: sessionStorage.getItem("type"),
    //   search: data,
    // }

  var data = JSON.stringify(this.searchForm.value);
  this.searchForm.value.page=this.currentPage;
  var data = JSON.stringify(this.searchForm.value);
    let body = {
      type: sessionStorage.getItem("type"),
      search: data,
      association: sessionStorage.getItem("association"),
      userId: sessionStorage.getItem("id"),
    }
    this.serviceobj.getsearch(body).subscribe((result: any) => {
      this.propertylist = result.response;
      this.endPageLimit = result.pages;
      this.maxPages = result.pages;
      this.setButt222();
    })
  }

  setButt222(){
    var btnNameStartLimit;
    var btnNameEndLimit;

    // btnNameStartLimit = this.currentPage - 4;
    // btnNameEndLimit = this.currentPage + 5;
    if (this.maxPages > 5) {
      btnNameStartLimit = this.currentPage - 2;
      btnNameEndLimit = this.currentPage+5;

    } else {
      btnNameStartLimit = 1;
      btnNameEndLimit = this.maxPages;
    }

    this.btnNames = [];
    this.btnNames.push("First");
    var i;
    for (i = btnNameStartLimit; i <= btnNameEndLimit; i++) {
      if (i > 0 && i<=this.maxPages) {
        this.btnNames.push(i);
      }
    }
      this.btnNames.push("Last");
  }
}
