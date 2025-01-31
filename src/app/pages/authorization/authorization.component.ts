import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {UserService} from "../../services/user.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCardActions, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    NgIf,
  ],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss'
})
export class AuthorizationComponent {
  constructor(
    public userService: UserService,
  ) {
  }

  formLogin = new FormGroup({
    login: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required])
  })

  login() {
    this.userService.login(this.formLogin.value.login as string, this.formLogin.value.password as string)
  }

  isLogin = true;

  toggleForm() {
    this.isLogin = !this.isLogin; // Переключение между формами
  }

  formRegistration = new FormGroup({
    login: new FormControl<string>('', []),
    password1: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    password2: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(6),
    ])
  })

  get RegPassword1() {
    return this.formRegistration.controls.password1 as FormControl
  }

  get RegPassword2() {
    return this.formRegistration.controls.password2 as FormControl
  }

  registration() {
    if (this.formRegistration.value.password1 != this.formRegistration.value.password2) {
      return;
    }

    this.userService.registration(this.formRegistration.value.login as string, this.formRegistration.value.password1 as string);
  }
}
