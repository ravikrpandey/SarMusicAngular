
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environment/environment';
export const SERVER_API_URL = environment.serverUrl;

interface LoginResponse {
  code: number;
  message: string;
  data: any;
  token: string;
  mobileNumber: string;
  userData: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(loginData: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${SERVER_API_URL}/api/loginUser`,loginData )
      .pipe(
        tap(response => {
          if (response.code === 200) {
            let userData = response.data;
            this.setToken(response.token, userData.mobileNumber, userData);
          }
        })
      );
  }

  setToken(token: string, mobileNumber: string, userData: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('mobileNumber', mobileNumber);
    localStorage.setItem('type', userData.type);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('mobileNumber');
    localStorage.removeItem('type');
    this.router.navigate(['/auth']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserData(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }
}
