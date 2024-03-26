import { Injectable } from "@angular/core";
import { environment } from "../environment/environment";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

export const SERVER_API_URL = environment.serverUrl;

const routes = {
  createUser: () => `${SERVER_API_URL}/api/loginUser`,
}



@Injectable({
  providedIn: 'root'
})

export class LoginService {
  constructor(private http: HttpClient) { }

  createUser(data: any): Observable<any> {
    return this.http.post<any>(routes.createUser(), data);
  }

}
