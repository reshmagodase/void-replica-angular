import { Component } from '@angular/core';
import { HttpserviceService } from './services/httpservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sss:any;
  title = 'void-replica-frontend';
  constructor(private serviceobj:HttpserviceService){}
  
  ngOnInit(){
    this.sss = sessionStorage.getItem('type');
    this.serviceobj.sendData(this.sss);
  }
}
