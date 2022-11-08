import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpserviceService } from '../services/httpservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUserType: any;
  sss: any;
  public sessionStorage = sessionStorage;
  constructor(private serviceobj: HttpserviceService, private route:Router) { }
  ngOnInit(): void {
    this.serviceobj.loggedInUserType$.subscribe(val => {
      this.currentUserType = val;
    })
  }
}
