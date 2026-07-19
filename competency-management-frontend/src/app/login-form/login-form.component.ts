import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../_services/auth.service";
import {SpinnerLoaderService} from "../_services/spinner-loader.service";
import {LoginInfo} from "../_model/loginInfo.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private spinnerLoaderService: SpinnerLoaderService,
              private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit() {
  }

  login() {
    if (this.loginForm.valid) {
      const loginInfo: LoginInfo = {
        email: this.loginForm.get("email")?.value,
        password: this.loginForm.get("password")?.value
      }

      this.spinnerLoaderService.show();
      this.authService.login(loginInfo).subscribe(next => {
        this.spinnerLoaderService.hide();
        this.router.navigate(['/skill-dashboard']);
      });
    }
  }
}
