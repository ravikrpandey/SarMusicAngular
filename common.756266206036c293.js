"use strict";(self.webpackChunksar_music=self.webpackChunksar_music||[]).push([[76],{1807:(p,u,n)=>{n.d(u,{H:()=>c});var r=n(8810),s=n(9437),l=n(4438),g=n(1626);const o="https://clean-pink-sheath-dress.cyclic.app/";let c=(()=>{class e{constructor(t){this.http=t}createUser(t){return this.http.post(`${o}/api/loginUser`,t).pipe((0,s.W)(this.handleError))}createArtist(t){return this.http.post(`${o}/api/createArtist`,t).pipe((0,s.W)(this.handleError))}getAllArtist(){return this.http.get(`${o}/api/getAllArtists`).pipe((0,s.W)(this.handleError))}getArtistById(t){return this.http.get((e=>`${o}/api/getArtistById/${e}`)(t)).pipe((0,s.W)(this.handleError))}updateArtisById(t,d){return this.http.put((e=>`${o}/api/updateArtist/${e}`)(d),t)}deleteArtist(t){return this.http.delete((e=>`${o}/api/deleteArtist/${e}`)(t))}deleteAlbumById(t){return this.http.delete((e=>`${o}/api/deleteAlbum/${e}`)(t))}createAlbum(t){return this.http.post(`${o}/api/createAlbum`,t).pipe((0,s.W)(this.handleError))}updateAlbumById(t,d){return this.http.put((e=>`${o}/api/updateAlbum/${e}`)(t),d)}getAlbumById(t){return this.http.get((e=>`${o}/api/getAlbumById/${e}`)(t))}getAllAlbum(){return this.http.get(`${o}/api/geAllAlbum`).pipe((0,s.W)(this.handleError))}createSong(t){return this.http.post(`${o}/api/createSong`,t)}getAllSongs(){return this.http.get(`${o}/api/getAllSong`)}songsByAlbumId(t){return this.http.get((e=>`${o}/api/getSongsByAlbumId/${e}`)(t)).pipe((0,s.W)(this.handleError))}getSongById(t){return this.http.get((e=>`${o}/api/getSongById/${e}`)(t))}updateSongById(t,d){return this.http.patch((e=>`${o}/api/updateSong/${e}`)(t),d)}addToLikedSongs(t){return this.http.post(`${o}/api/createsongPlayList`,t)}handleError(t){return console.error("An error occurred:",t),(0,r.$)(t)}static#t=this.\u0275fac=function(d){return new(d||e)(l.KVO(g.Qq))};static#e=this.\u0275prov=l.jDH({token:e,factory:e.\u0275fac,providedIn:"root"})}return e})()},3836:(p,u,n)=>{n.d(u,{w:()=>s});var i=n(5351),r=n(4438);let s=(()=>{class l{constructor(o){this.data=o}static#t=this.\u0275fac=function(a){return new(a||l)(r.rXU(i.Vh))};static#e=this.\u0275cmp=r.VBU({type:l,selectors:[["app-confirm-dialog"]],decls:10,vars:3,consts:[[1,"mat-mdc-dialog-container",2,"border-radius","20px"],["mat-dialog-title",""],["mat-dialog-content",""],["mat-dialog-actions","","align","end"],["mat-button","",2,"background-color","#12ec12","border-radius","5px",3,"mat-dialog-close"],["mat-button","","cdkFocusInitial","",2,"background-color","red","margin-left","10px","border-radius","5px",3,"mat-dialog-close"]],template:function(a,c){1&a&&(r.j41(0,"div",0)(1,"h2",1),r.EFF(2,"Confirmation"),r.k0s(),r.j41(3,"div",2),r.EFF(4),r.k0s(),r.j41(5,"div",3)(6,"button",4),r.EFF(7,"Cancel"),r.k0s(),r.j41(8,"button",5),r.EFF(9,"Confirm"),r.k0s()()()),2&a&&(r.R7$(4),r.SpI(" ",c.data.message,"\n"),r.R7$(2),r.Y8G("mat-dialog-close",!1),r.R7$(2),r.Y8G("mat-dialog-close",!0))},dependencies:[i.tx,i.BI,i.E7,i.Yi],styles:["mat-dialog-actions[_ngcontent-%COMP%]{justify-content:flex-end}mat-dialog-actions[_ngcontent-%COMP%]   button.cancel-button[_ngcontent-%COMP%]{background-color:#fff;color:#f44336;border:1px solid #f44336}mat-dialog-actions[_ngcontent-%COMP%]   button.confirm-button[_ngcontent-%COMP%]{background-color:#4caf50;color:#fff}"]})}return l})()}}]);