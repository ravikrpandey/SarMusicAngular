import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';

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
      mobile_number: this.mobileNumber,
      otp: this.otp
    }

    console.log("userData", userData);
    this.loginService.createUser(userData).subscribe((res: any) => {
      if (res.code == 403) {
        this.toastr.error(res.body.message, 'Error');
        alert("Error");
      } else {
        this.toastr.success('User approved successfully!', 'Success');
        alert("User approved successfully!");
        this.router.navigate(['/dashboard'])
      }
      console.log('User Data : ', res.code);
    });

    console.log('Mobile Number:', this.mobileNumber);
    console.log('OTP:', this.otp);
  }
}
