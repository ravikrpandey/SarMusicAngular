import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  // Method to get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Method to check if the token is valid and not expired
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decode the token and check if it's expired
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      return decodedToken.exp > currentTime; // true if token is still valid
    } catch (error) {
      return false;
    }
  }

  // canActivate method to control route access
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isLoggedIn()) {
      return true; // Allow navigation if user is logged in
    } else {
      this.router.navigate(['/auth']); // Redirect to login if not logged in or token is invalid
      return false;
    }
  }
}
