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
  updateArtisById: (artistId: string) => `${SERVER_API_URL}/api/updateArtist/${artistId}`,
  deleteArtisById: (artistId: string) => `${SERVER_API_URL}/api/deleteArtist/${artistId}`,

  createAlbum: () => `${SERVER_API_URL}/api/createAlbum`,
  getAllAlbum: () => `${SERVER_API_URL}/api/geAllAlbum`,
  getAlbumById: (albumId: string) => `${SERVER_API_URL}/api/getAlbumById/${albumId}`,
  deleteAlbumById: (albumId: string) => `${SERVER_API_URL}/api/deleteAlbum/${albumId}`,
  updateAlbumById: (albumId: number) => `${SERVER_API_URL}/api/updateAlbum/${albumId}`,
  // ============== song ===============
  createSong: () => `${SERVER_API_URL}/api/createSong`,
  getAllSongs: () => `${SERVER_API_URL}/api/getAllSong`,
  songsByAlbumId: (albumId: string) => `${SERVER_API_URL}/api/getSongsByAlbumId/${albumId}`,
  getSongById: (songId: number) => `${SERVER_API_URL}/api/getSongById/${songId}`,
  updateSongById: (songId: number) => `${SERVER_API_URL}/api/updateSong/${songId}`,

  // add song list == playlist creation
  addToLikedSongs: () => `${SERVER_API_URL}/api/createsongPlayList`

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

  // ===============Artist==============
  createArtist(artistData: any): Observable<any> {
    return this.http.post<any>(routes.createArtist(), artistData)
      .pipe(
        catchError(this.handleError)
      );
  };

  getAllArtist(): Observable<any[]> {
    return this.http.get<any[]>(routes.getAllArtist())
      .pipe(
        catchError(this.handleError)
      );
  };

  getArtistById(artistId: string): Observable<any> {
    return this.http.get<any>(routes.getArtistById(artistId))
      .pipe(
        catchError(this.handleError)
      );
  };

  updateArtisById(artistDataForUpdate: any, artistId: any): Observable<any> {
    return this.http.put<any>(routes.updateArtisById(artistId), artistDataForUpdate)
  };

  deleteArtist(id: any): Observable<any> {
    return this.http.delete<any>(routes.deleteArtisById(id))
  };

  deleteAlbumById(albumId: any): Observable<any> {
    return this.http.delete<any>(routes.deleteAlbumById(albumId))
  };


  //=============== Album =================
  createAlbum(albumData:any): Observable<any> {
    return this.http.post<any>(routes.createAlbum(), albumData)
    .pipe(
      catchError(this.handleError)
    );
  };

  updateAlbumById(albumId: number, dataToUpdate: any): Observable<any> {
    return this.http.put<any>(routes.updateAlbumById(albumId), dataToUpdate)
  };
  
  getAlbumById(albumId: any) {
    return this.http.get<any>(routes.getAlbumById(albumId))
  };

  getAllAlbum(): Observable<any[]> {
    return this.http.get<any[]>(routes.getAllAlbum())
    .pipe(
      catchError(this.handleError)
    )
  };
  

  //================ Song =================
  createSong(songData: any): Observable<any> {
    return this.http.post<any>(routes.createSong(), songData)
  };

  getAllSongs(): Observable<any[]> {
    return this.http.get<any[]>(routes.getAllSongs())
  };

  songsByAlbumId(albumId: string): Observable<any> {
    return this.http.get<any>(routes.songsByAlbumId(albumId))
    .pipe(
      catchError(this.handleError)
    )
  };

  getSongById(songId: any): Observable<any> {
    return this.http.get<any>(routes.getSongById(songId))
  };

  updateSongById(songId: number, songDataToUpdate: any) {
    return this.http.patch<any>(routes.updateSongById(songId), songDataToUpdate)
  };

  //============= Liked Song Playlist =================
  addToLikedSongs(likedSongDetails: any): Observable<any> {
    return this.http.post<any>(routes.addToLikedSongs(), likedSongDetails)
  };


  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
