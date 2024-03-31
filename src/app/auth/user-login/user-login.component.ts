import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {
  mobileNumber: string = '';
  otp: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService
  ) {}

  submit() {
    const userData: any = {
      mobileNumber: this.mobileNumber,
      otp: this.otp
    }
    
    console.log("userData", userData);
    this.loginService.createUser(userData).subscribe((res: any) => {
      if (res.code == 403) {
        this.toastr.error(res.body.message, 'Error');
        alert("Error");
      } else {
      localStorage.setItem('mobileNumber', this.mobileNumber);
        this.router.navigate(['/main/stream']);
        this.toastr.success('User approved successfully!', 'Success');
        alert("User approved successfully!");
      }
      console.log('User Data : ', res.code);
    });

    console.log('Mobile Number:', this.mobileNumber);
    console.log('OTP:', this.otp);
  }
}
