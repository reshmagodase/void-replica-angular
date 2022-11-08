import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.css']
})
export class ManagersComponent implements OnInit {
  managerlist:any=[];
  constructor(private serviceobj:HttpserviceService, private router:Router ) { }

  ngOnInit(): void {
    let body= {
      type: sessionStorage.getItem("type")
    }
    this.serviceobj.getmanagerlist(body).subscribe((res:any) =>{
      this.managerlist=res.response;
    })
  }

  deleteManager(id:any){
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
        let body={
          objectId:id
        }
        this.serviceobj.deleteUser(body).subscribe((result:any) =>{
          console.log(result);      
          if (result.status=="success") {
            let body={
              type: sessionStorage.getItem("type")
            }
            this.serviceobj.getmanagerlist(body).subscribe((res:any) =>{
              this.managerlist=res.response;
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

  editManager(id:any){
    this.router.navigateByUrl('editmanager?id=' +id);
  }
}
