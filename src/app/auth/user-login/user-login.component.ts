import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoginService } from 'src/app/services/login.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {
  email: string = '';
  fullName: string = '';
  mobileNumber: string = '';
  otp: string = '';
  otpSent: boolean = false;
  loader: boolean = true;

  resendCountdown: number = 60;
  countdownSubscription: Subscription | null = null;
  canResendOtp: boolean = true; // Initially, OTP can be sent

  constructor(
    private router: Router,
    private loginService: LoginService,
    private loginAuthService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.loginAuthService.isLoggedIn()) {
      this.router.navigate(['/main/stream']);
    }
  }

  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-success'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  // Send OTP method
  sendOtp() {
    if (!this.canResendOtp) return;

    const userData = { email: this.email, fullName: this.fullName, mobileNumber: this.mobileNumber };
    this.loginService.loginOrRegister(userData).subscribe(
      (res: any) => {
        this.otpSent = true;
        this.canResendOtp = false;
        this.startCountdown();
        this.openSnackBar(`OTP sent on email ${this.trimEmail(this.email)} successfully`, 'close', 'success');
      },
      (err) => {
        this.openSnackBar('Error sending OTP', 'close', 'error');
      }
    );
  }

  // Login method
  submit() {
    const loginData = {
      email: this.email,
      fullName: this.fullName,
      mobileNumber: this.mobileNumber,
      otp: this.otp
    };

    this.loginAuthService.login(loginData).subscribe(
      (res: any) => {
        if (res.code === 200) {
          this.router.navigate(['/main/stream']);
          this.openSnackBar(res.message, 'close', 'success');
        } else {
          this.openSnackBar(res.message, 'close', 'error');
        }
      },
      (err) => {
        this.openSnackBar('Login failed', 'close', 'error');
      }
    );
  }

  // Start countdown timer
  startCountdown() {
    this.resendCountdown = 60; // Reset countdown to 3 minutes
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        this.canResendOtp = true;
        if (this.countdownSubscription) {
          this.countdownSubscription.unsubscribe();
        }
      }
    });
  }

  // Trim email to show only beginning and end
  trimEmail(email: string): string {
    const [first, domain] = email.split('@');
    return `${first.slice(0, 2)}***@${domain}`;
  }

  ngOnDestroy() {
    // Unsubscribe from countdown when component is destroyed
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
}
