import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { log } from 'console';

import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-artist-create',
  templateUrl: './artist-create.component.html',
  styleUrls: ['./artist-create.component.scss']
})
export class ArtistCreateComponent {

    myForm: any;

    activeUser: any;
    TotalSale: any;
    startDate: any;
    endDate: any;
    startDateCustom: any = null;
    endDateCustom: any = null;
    filData: any = 'today';
    showCustomDateFilters: boolean = false;
    constructor( private router: Router, private toastr: ToastrService) { }
  
    // ngOnInit() {
    //   this.myForm = new FormGroup({
    //     name: new FormControl('Sammy'),
    //     email: new FormControl(''),
    //     message: new FormControl('')
    //   });
    // }
  
    // onSubmit(myForm: any) {
    //  let val=this.myForm.value;
    //  console.log(val);
     
    // }


    
  ngOnInit(): void {
    // Get the current date
    const today = new Date();

    // Get tomorrow's date by adding one day to the current date
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Format the current date and tomorrow's date as 'YYYY-MM-DD' (assuming you want this format)
    const formattedStartDate = today.toISOString().split('T')[0];
    const formattedEndDate = tomorrow.toISOString().split('T')[0];

    // Create the queryParams object with default values
    const queryParams = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      type: this.filData
    };
   
  }

  activeUserDetailClick() {
    this.router.navigate(['/home/customer'], { queryParams: { callFrom: 'activeUsers', startDate: this.startDate, endDate: this.endDate } });
  }

  averageSessionDetailClick() {
    this.router.navigate(['/home/customer'], { queryParams: { callFrom: 'averageSessionData', startDate: this.startDate, endDate: this.endDate } });
  }

  retentionRateData() {
    const navigationExtras: NavigationExtras = {
      queryParams: { callFrom: 'retentionRateData', startDte: this.startDate, endDate: this.endDate },
      skipLocationChange: true,
    };
    this.router.navigate(['/home/retentionRate'],  navigationExtras);
  }

  repeateCustemerData() {
    this.router.navigate(['/home/customer'], { queryParams: { callFrom: 'repeatCustomerData', startDate: this.startDate, endDate: this.endDate }});
  }

  searchByDateCustom() {

  }

  orderFilterClick(type: string) {
    switch (type) {
      case 'totalCourses':
        this.router.navigate(['/home/order'], { queryParams: { type: 'totalCourses', dateFilterType: this.filData, callFrom: 'dashboard', filterType: JSON.stringify(['COURSE']), startDate: this.startDate, endDate: this.endDate } });
        break;
      case 'totalProducts':
        this.router.navigate(['/home/order'], { queryParams: { type: 'totalProducts', dateFilterType: this.filData, callFrom: 'dashboard', filterType: JSON.stringify(['PRODUCT']), startDate: this.startDate, endDate: this.endDate } });
        break;
      case 'totalConsultations':
        this.router.navigate(['/home/order'], { queryParams: { type: 'totalConsultations', dateFilterType: this.filData, callFrom: 'dashboard', filterType: JSON.stringify(['VASTU CONSULTATION', 'NUMEROLOGY CONSULTATION']), startDate: this.startDate, endDate: this.endDate } });
        break;
      case 'totalReports':
        this.router.navigate(["home/reports"], { queryParams: { type: 'totalReports', dateFilterType: this.filData, callFrom: 'dashboard', filterType: JSON.stringify(['REPORT']), startDate: this.startDate, endDate: this.endDate } });
        break;
      case 'totalEvents':
        this.router.navigate(['/home/order'], { queryParams: { type: 'totalEvents', dateFilterType: this.filData, callFrom: 'dashboard', filterType: JSON.stringify(['EVENT']), startDate: this.startDate, endDate: this.endDate } });
        break;
      case 'totalRevenue':
        this.router.navigate(['/home/order'], { queryParams: { type: 'totalRevenue', dateFilterType: this.filData, callFrom: 'dashboard', filterType: JSON.stringify(['COURSE', 'REPORT', 'PRODUCT', 'PACKAGE', 'VASTU CONSULTATION', 'NUMEROLOGY CONSULTATION', 'EVENT']), startDate: this.startDate, endDate: this.endDate } });
        break;
      case 'totalRepeatCustomer':
        this.router.navigate(['/home/customer'], { queryParams: { callFrom: 'totalRepeatCustomer', startDate: this.startDate, endDate: this.endDate } });
        break;
      default:
        break;

    }
  }

  openReportList() {
    this.router.navigate(['/home/new-dashboard/downloadReportList'], { queryParams: { dateFilterType: this.filData, callFrom: 'dashboard', startDate: this.startDate, endDate: this.endDate } });
  }

  formatDate() {

  }

  searchByDate(filter = '') {
   
    }


  customData(cus: any) {
    this.showCustomDateFilters = true;
    this.filData = cus;
  }



  }


