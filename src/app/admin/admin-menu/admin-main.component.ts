// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-admin-main',
//   templateUrl: './admin-main.component.html',
//   styleUrls: ['./admin-main.component.scss']
// })
// export class AdminMainComponent {
 
// }






import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
// import Swal from 'sweetalert2';
// import { AuthService } from '../@auth/authmaterials/auth.service';
// import { SidebarService } from '../service/sidebar.service';
// import { TopLoaderService } from '../service/top-loader.service';
import { switchMap, timer } from 'rxjs';
// import { BatteryAlertComponent } from './battery-alert/battery-alert.component';
// import { BatteryAlertService } from '../service/battery-alert.service';
// import { MatDialog } from '@angular/material/dialog';
// import { UserService } from '../service/user.service';
// import { CompanyService } from '../service/company.service';

// @Component({
//   selector: 'app-admin',
//   templateUrl: './admin.component.html',
//   styleUrls: ['./admin.component.css'],
// })

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class AdminMainComponent implements OnInit, AfterContentChecked, DoCheck {
  showAndProfile: boolean = false;
  showList: boolean = false;
  classList: any;
  isRemarkActive: boolean = true;
  nextElementSibling: any;
  navIndexvalue: any = null;
  progres: any;
  currentRoute: any;
  subscription: any;
  userData: any;
  roles: any;



  constructor(private changeDref: ChangeDetectorRef, private router: Router, private activatedRoute: ActivatedRoute) {

    let i = Number(localStorage.getItem('index'));
    this.navIndexvalue = i;
    let clip: any = document.getElementById('clip');
    // this.companyService.getAll().subscribe((result) => {
    //   this.roles = result.data;
    // }, (err) => {
    //   console.error(err);
    // });
  }

  toggleaccordian: boolean = false;
  toggleAccordian(event: any, index: any, name: any) {
  }

  navData: any;
  nav1: any[] = [];

  ngOnInit(): void {

    this.navData = [
      {
        "moduleName": "Dashboard",
        "route": "list-dashboard",
        "read": true,
        "write": true,
        "delete": true,
        "access": true,
        "subModules": []
      },
      {
        "moduleName": "Artists",
        "route": null,
        "read": true,
        "write": true,
        "delete": true,
        "access": true,
        "subModules": [
          {
            "moduleName": "All Artists",
            "route": "artist/list",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },
          {
            "moduleName": "Add Artists",
            "route": "artist/create",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },

        ]
      },

      {
        "moduleName": "Albums",
        "route": null,
        "read": true,
        "write": true,
        "delete": true,
        "access": true,
        "subModules": [
          {
            "moduleName": "All Albums",
            "route": "album/list",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },
          {
            "moduleName": "Add Album",
            "route": "album/create",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },

        ]
      },

      {
        "moduleName": "Songs",
        "route": null,
        "read": true,
        "write": true,
        "delete": true,
        "access": true,
        "subModules": [
          {
            "moduleName": "All Songs",
            "route": "song/list",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },
          {
            "moduleName": "Add Songs",
            "route": "song/create",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },
        ]
      },

      {
        "moduleName": "PlayLists",
        "route": null,
        "read": true,
        "write": true,
        "delete": true,
        "access": true,
        "subModules": [
          {
            "moduleName": "All PlayLists",
            "route": "roles-and-access/user",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },
          {
            "moduleName": "Add PlayLists",
            "route": "roles-and-access/assign-roles",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },
        ]
      },
      {
        "moduleName": "Reports",
        "route": null,
        "read": true,
        "write": true,
        "delete": true,
        "access": true,
        "subModules": [
          {
            "moduleName": "Songs",
            "route": "roles-and-access/user",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },
          {
            "moduleName": "Visitors",
            "route": "roles-and-access/assign-roles",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },
          {
            "moduleName": "Statics",
            "route": "roles-and-access/dealer",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },

        ]
      },
      {
        "moduleName": "MailBox",
        "route": null,
        "read": true,
        "write": true,
        "delete": true,
        "access": true,
        "subModules": [
          {
            "moduleName": "Inbox",
            "route": "roles-and-access/user",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },
          {
            "moduleName": "Composes",
            "route": "roles-and-access/assign-roles",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },
          {
            "moduleName": "View",
            "route": "roles-and-access/dealer",
            "read": true,
            "write": true,
            "delete": true,
            "access": true
          },

        ]
      },
      {
        "moduleName": "Events",
        "route": null,
        "read": true,
        "write": true,
        "delete": true,
        "access": true,
        "subModules": []
      },
    ];
    // this.userData = this.userService.user;
    window.addEventListener('click', (event) => {
      this.showAndProfile = false;
      event.stopPropagation();
    });
    window.addEventListener('click', (event) => {
      event.stopPropagation();
      this.showList = false;
    });
    this.event();
  }

  checkAccess(subModules:any, route:any) {
    if(this.roles) {
      var userRole = this.userData.role_id;
      var userDataAccess = JSON.parse(this.roles.find((r:any) => r.role_id === userRole).access).map((m:any) => m.replace(/^\.\//, ''));
      if(route == null) {
        return subModules.map((m:any) => m.route.replace(/^\.\//, '')).some((s:any) =>  userDataAccess.includes(s));
      }
      return userDataAccess.includes(route.replace(/^\.\//, ''));
    }
    return false;
  }

  ngDoCheck(): void {

    let url = this.router.url;
    this.currentRoute = url;

  }

  ngAfterContentChecked(): void {
    // this.lodaerService.showHideLoader().subscribe(
    //   (res) => {
    //     this.progres = res;
    //   }
    // );
    // this.changeDref.detectChanges();
  }

  navToggel(index: any, nav: any) {
    console.log("nav", nav);
    if(nav.moduleName === 'Dashboard'){
      localStorage.removeItem('filterType')
    }
    let clip: any = document.getElementById('clip');
    if (this.navIndexvalue == index) {
      this.navIndexvalue = null;
    } else {
      this.navIndexvalue = index;
      localStorage.setItem("index", index);
      localStorage.setItem("navAccess", JSON.stringify(nav));
    }

  }
  toggleProfile(e: any) {
    e.stopPropagation();
    this.showAndProfile = !this.showAndProfile;

  }
  proflieCLick(e: any) {
    e.stopPropagation();
    this.showAndProfile = false;


  }
  logoutCLick(e: any) {
    e.stopPropagation();
    this.showAndProfile = false;

  }

  showDropdown(e: any) {
    e.stopPropagation();
    this.showList = !this.showList;
  }
  profile() {
    // Swal.fire("Coming Soon..");
  }
  logOut() {
    // this._authService.logOut();
    localStorage.removeItem('filterType');
  }

  MyDatadata: any;
  newArr: any;
  event() {
    let data = {
      userType: "Admin"
    };
    this.subscription = timer(0, 10 * 5000).pipe(
      //   switchMap(() => this.battery.postNoti(data))).subscribe((res:any)=>{
      //    this.MyDatadata=res.data
      //    this.newArr=this.MyDatadata.map(i=>i.id)
      //     if(res.data.length>=1){
      //      if (this.dialog.openDialogs.length>0)
      //      {


      //     }else{
      //     const dialogRef = this.dialog.open(BatteryAlertComponent, {
      //       width: '550px',
      //        disableClose: true ,
      //       data:{name:this.MyDatadata}
      //     });
      //     dialogRef.afterClosed().subscribe(result => {
      //       console.log('The dialog was closed');
      //     });
      //   }
      //   }else{
      //     return ;
      //   }
      //   })
      // }



    );
  }
}
  


