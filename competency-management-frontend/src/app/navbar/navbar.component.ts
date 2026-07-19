import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MatSelectionList, MatSelectionListChange} from "@angular/material/list";
import {AuthService} from "../_services/auth.service";
import {filter} from "rxjs";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {

  @ViewChild('selectionList') selectionList?: MatSelectionList;

  constructor(private router: Router, protected authService: AuthService) {}

  ngAfterViewInit() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const route = e.urlAfterRedirects.split('/')[1];
        setTimeout(() => {
          this.selectOption(route);
        });
      });
  }

  onSelectionChange(event: MatSelectionListChange) {
    const selectedValue = event.options[0].value;
    localStorage.setItem('route', selectedValue);

    switch (selectedValue) {
      case 'my-profile':
        this.router.navigate(['/my-profile']);
        break;
      case 'skill-dashboard':
        this.router.navigate(['/skill-dashboard']);
        break;
      case 'users-dashboard':
        this.router.navigate(['/users-dashboard']);
        break;
      case 'job-postings':
        this.router.navigate(['/job-postings']);
        break;
    }
  }

  selectOption(value: string) {
    this.selectionList?.deselectAll();
    const option = this.selectionList?.options.find(o => o.value === value);
    if (option) {
      option._setSelected(true);
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

}
