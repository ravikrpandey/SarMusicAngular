import { Injectable } from "@angular/core";
import { environment } from "../environment/environment";
import { Observable, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";

export const SERVER_API_URL = environment.serverUrl;

const routes = {
  createUser: () => `${SERVER_API_URL}/api/loginUser`,
  createArtist: () => `${SERVER_API_URL}/api/createArtist`,
  getAllArtist: () => `${SERVER_API_URL}/api/getAllArtists`,
  getArtistById: (artistId: string) => `${SERVER_API_URL}/api/getArtistById/${artistId}`,
  createAlbum: () => `${SERVER_API_URL}/api/createAlbum`,
  getAllAlbum: () => `${SERVER_API_URL}/api/geAllAlbum`,
  createSong: () => `${SERVER_API_URL}/api/createSong`,
  getAllSongs: () => `${SERVER_API_URL}/api/getAllSong`,
  songsByAlbumId: (albumId: string) => `${SERVER_API_URL}/api/getSongsByAlbumId/${albumId}`,

}

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: HttpClient) { }

  createUser(data: any): Observable<any> {
    return this.http.post<any>(routes.createUser(), data)
      .pipe(
        catchError(this.handleError)
      );
  }

  createArtist(artistData: any): Observable<any> {
    return this.http.post<any>(routes.createArtist(), artistData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllArtist(): Observable<any[]> {
    return this.http.get<any[]>(routes.getAllArtist())
      .pipe(
        catchError(this.handleError)
      );
  }

  getArtistById(artistId: string): Observable<any> {
    return this.http.get<any>(routes.getArtistById(artistId))
      .pipe(
        catchError(this.handleError)
      );
  }

  //===============Album=========
  createAlbum(albumData:any): Observable<any> {
    return this.http.post<any>(routes.createAlbum(), albumData)
    .pipe(
      catchError(this.handleError)
    );
  };

  getAllAlbum(): Observable<any[]> {
    return this.http.get<any[]>(routes.getAllAlbum())
    .pipe(
      catchError(this.handleError)
    )
  };
  
  createSong(songData: any): Observable<any> {
    return this.http.post<any>(routes.createSong(), songData)
  };

  getAllSongs(): Observable<any[]> {
    return this.http.get<any[]>(routes.getAllSongs())
  }

  songsByAlbumId(albumId: string): Observable<any> {
    return this.http.get<any>(routes.songsByAlbumId(albumId))
    .pipe(
      catchError(this.handleError)
    )
  };

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
