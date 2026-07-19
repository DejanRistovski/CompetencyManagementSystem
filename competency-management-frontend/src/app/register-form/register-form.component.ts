import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../_services/auth.service";
import {SignUpInfo} from "../_model/signUpInfo.model";
import {SpinnerLoaderService} from "../_services/spinner-loader.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {
  signUpForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private spinnerLoaderService: SpinnerLoaderService,
              private router: Router) {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]]
    });
  }

  register() {
    if (this.signUpForm.valid && this.signUpForm.get('password')?.value === this.signUpForm.get('repeatPassword')?.value) {
      const signUpInfo: SignUpInfo = {
        firstName: this.signUpForm.get('firstName')?.value,
        lastName: this.signUpForm.get('lastName')?.value,
        email: this.signUpForm.get('email')?.value,
        password: this.signUpForm.get('password')?.value
      }

      this.spinnerLoaderService.show();
      this.authService.register(signUpInfo).subscribe(response => {
        this.spinnerLoaderService.hide();
        this.router.navigate(['/login']);
      });
    }
  }
}
