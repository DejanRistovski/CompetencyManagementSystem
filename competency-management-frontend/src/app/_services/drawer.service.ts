import {Injectable, TemplateRef, ViewContainerRef} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private sidenav!: MatDrawer;
  private container!: ViewContainerRef;

  private _width = new BehaviorSubject<string>('30%');
  width$ = this._width.asObservable();

  setSidenav(sidenav: MatDrawer) {
    this.sidenav = sidenav;
  }

  setViewContainerRef(container: ViewContainerRef) {
    this.container = container;
  }

  open(template: TemplateRef<any>, width: string, context?: any) {
    this.container.clear();

    this.container.createEmbeddedView(template, context);

    this._width.next(width);
    return this.sidenav.open();
  }

  close(){
    this.container.clear();
    return this.sidenav.close();
  }
}
