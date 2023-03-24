import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-casestudy',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public sessionStorage = sessionStorage;
  constructor(private router: Router) {
    //toolbar title if session storage is empty and browser refreshed
    if(!this.sessionStorage.getItem("title")){
      window.location.pathname == '/'
      ? this.sessionStorage.setItem("title", "home")
      : this.sessionStorage.setItem("title", window.location.pathname.substring(1));
    }
  }
  //else toolbar title reset when menu item clicked
  setTitle():void {
    this.sessionStorage.setItem("title", this.router.getCurrentNavigation()?.extras.state?.title);
  } //setTitle
}
