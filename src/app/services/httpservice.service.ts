import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpserviceService {

  type:any;
  baseUrl=environment.baseurl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
  };
  constructor(private http:HttpClient) { }
  // public loggedInUserType=new BehaviorSubject<any>(this.data);
  public send :Subject<any>= new BehaviorSubject<any>(null);
  loggedInUserType$ : Observable<any> = this.send.asObservable();
  // public send = new Subject<any>();
  // notifyObservable$ = this.loggedInUserType.asObservable();
  public sendData(data: any){
    // console.log("in servicee: "+data)
    this.send.next(data);
  }

  checklogin(body:any): Observable <any>
  {    
    return this.http.post(`${environment.baseurl}login` ,body);
  }  
  
  changePassword(body:any):Observable<any>{
    return this.http.post(`${environment.baseurl}changePassword` ,body);
  }

  updateuser(body:any):Observable<any>{
    return this.http.post(`${environment.baseurl}editUser`,body);
  }

  // getclientlist(body:any):Observable<any>{
  //   console.log("in service");
  //   return this.http.post(`${environment.baseurl}clients` ,body);
  // }
  getuserdetails(body:any):Observable<any>{
    return this.http.get(`${environment.baseurl}api/users?type=${body.type}`);
  }
  getuserdetails1(id:any):Observable<any>{
    return this.http.post(`${environment.baseurl}getUser`,id);
  }

  getclientlist(body:any):Observable<any>{
    return this.http.get(`${environment.baseurl}api/clients?type=${body.type}`);
  }
  
  getmanagerlist(body:any):Observable<any>{
    return this.http.get(`${environment.baseurl}api/managers?type=${body.type}`);
  }
  addassociation(body:any): Observable <any>
  {    
    return this.http.post(`${environment.baseurl}addAssociation`  ,body);
  } 
  createaccount(body:any): Observable <any>
  {    
    return this.http.post(`${environment.baseurl}register`,body);
  } 
  getsearch(body:any):Observable<any>{
    // console.log("service");
    return this.http.get(`${environment.baseurl}api/propertylisting?type=${body.type}&search=${body.search}&association=${body.association}&userId=${body.userId}`);
  }
  // getpropertylist(body:any):Observable<any>{
  //   // console.log("service");
  //   return this.http.get(`${environment.baseurl}api/propertylisting?type=${body.type}`);
  // }

  getpropertylist(body:any):Observable<any>{
    // console.log("service");
    return this.http.get(`${environment.baseurl}api/propertylisting?type=${body.type}&association=${body.association}&userId=${body.userId}`);
  }
  getusername():Observable<any>{
    return this.http.post(`${environment.baseurl}users`,{});
  }
  getassociation():Observable<any>{
    return this.http.post(`${environment.baseurl}associations`,{});
  }

  getassociation1(body:any):Observable<any>{
    return this.http.get(`${environment.baseurl}api/property?type=${body.type}`);
  }
  getAccountdetails(body:any):Observable<any>{
    return this.http.get(`${environment.baseurl}api/editAccount*?type=${body.type}`);
  }
  // addTenantDetails(body:any): Observable <any>
  // {    
  //   return this.http.post(`${environment.baseurl}addProperty`  ,body);
  // } 
  addproperty(body:any): Observable <any>
  {    
    return this.http.post(`${environment.baseurl}addProperty`  ,body);
  } 
  editproperty(body:any): Observable <any>
  {    
    return this.http.post(`${environment.baseurl}editProperty`  ,body);
  } 
  edituser(body:any): Observable <any>
  {    
    return this.http.post(`${environment.baseurl}editUser`  ,body);
  } 
  addSupplierDetails(body:any): Observable <any>
  {    
    return this.http.post(`${environment.baseurl}editProperty`  ,body);
  } 
  addTenantDetails(body:any): Observable <any>
  {    
    return this.http.post(`${environment.baseurl}editProperty`  ,body);
  } 

  deleteUser(id:any):Observable<any>{
    return this.http.post(`${environment.baseurl}deleteUser`,id);
  }
  deleteProperty(id:any):Observable<any>{
    return this.http.post(`${environment.baseurl}deleteProperty`,id);
  }
  fileupload(body:any): Observable <any>
  {    
    return this.http.post(`${environment.baseurl}fileUpload`  ,body);
  } 

  getuserproperty(id:any):Observable<any>{
    return this.http.post(`${environment.baseurl}getProperty`,id);
  }
}
