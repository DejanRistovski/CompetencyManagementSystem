import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {DrawerService} from "./_services/drawer.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  title = 'competency-management-frontend';
  width$ = this.drawerService.width$;

  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild('drawerContainer', { read: ViewContainerRef }) container!: ViewContainerRef;

  constructor(private drawerService: DrawerService) {}

  ngAfterViewInit(): void {
    this.drawerService.setSidenav(this.drawer);
    this.drawerService.setViewContainerRef(this.container);
  }
}
