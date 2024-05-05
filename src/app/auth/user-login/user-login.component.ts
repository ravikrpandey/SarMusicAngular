import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ) {}

  mobileNumber: string = '';
  type: string = '';
  otp: string = '';
  loader:boolean=true;

  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-success'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  submit() {
    this.loader=false;
    const userData: any = {
      mobileNumber: this.mobileNumber,
      otp: this.otp
    }
    this.loginService.createUser(userData).subscribe((res: any) => {
      if (res.code == 403) {
        this.openSnackBar(res.message, 'close', res.status);
        alert("Error");
      } else {
      localStorage.setItem('mobileNumber', this.mobileNumber);
      this.type = res.data;
      console.log(res.data,'this.type======')
      localStorage.setItem('type', this.type);
        this.router.navigate(['/main/stream']);
        this.openSnackBar(res.message, 'close', res.status);
      }
    });
  }
}


