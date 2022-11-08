import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {

  clientlist:any=[];
  constructor(private serviceobj:HttpserviceService, private router:Router) { }

  ngOnInit(): void {
    let body= {
      type: sessionStorage.getItem("type")
    }
    this.serviceobj.getclientlist(body).subscribe((res:any) =>{
      this.clientlist=res.response;
    })
  }
  
  deleteClient(id:any){
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
          if (result.status=="success"){
            let body= {
              type: sessionStorage.getItem("type")
            }
            this.serviceobj.getclientlist(body).subscribe((res:any) =>{
              this.clientlist=res.response;
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

  editClient(id:any){
    this.router.navigateByUrl('editclient?id=' +id);
  }
}
