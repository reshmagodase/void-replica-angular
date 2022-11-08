import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PropertyComponent } from './property/property.component';
import { AssociationComponent } from './association/association.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ClientsComponent } from './clients/clients.component';
import { UsersComponent } from './users/users.component';
import { EdituserComponent } from './edituser/edituser.component';
import { EditclientComponent } from './editclient/editclient.component';
import { EditmanagerComponent } from './editmanager/editmanager.component';
import { PropertyeditComponent } from './propertyedit/propertyedit.component';
import { PropertylistingComponent } from './propertylisting/propertylisting.component';
import { RegisterComponent } from './register/register.component';
import { ViewpropertyComponent } from './viewproperty/viewproperty.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { AuthGuard } from './guard/auth.guard';
import { ManagersComponent } from './managers/managers.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSpinnerModule } from "ngx-spinner";
import { SpinnerInterceptor } from './services/spinner.interceptor';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    PropertyComponent,
    AssociationComponent,
    ChangepasswordComponent,
    ClientsComponent,
    UsersComponent,
    EdituserComponent,
    EditclientComponent,
    EditmanagerComponent,
    PropertyeditComponent,
    PropertylistingComponent,
    RegisterComponent,
    ViewpropertyComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    ManagersComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDropzoneModule,
    NgxSpinnerModule
    
  ],
  providers: [
    [AuthGuard],   
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
   },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
