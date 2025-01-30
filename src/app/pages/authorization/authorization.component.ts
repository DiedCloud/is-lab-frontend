import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {UserService} from "../../services/user.service";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCardActions, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {WebSocketService} from '../../services/web-socket.service';

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
    private router: Router,
    public userService: UserService,
    public webSocketService: WebSocketService
  ) {
  }

  private sendAuth(url: string) {
    this.userService.proceedAuthRequest(url)
      .subscribe(
        (res: any) => {
          localStorage.setItem('authToken', res);

          if (this.userService.user)
            localStorage.setItem('login', this.userService.user.login);

          this.webSocketService.connectWs();

          this.router.navigate(['']).then(r => {
            if (!r) {
              console.error("redirect went wrong...");
            }
          });
        }
      );
  }

  formLogin = new FormGroup({
    login: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required])
  })

  login() {
    this.userService.user = {
      login: this.formLogin.value.login as string,
      password: this.formLogin.value.password as string
    }

    this.sendAuth(environment.backendURL + '/auth/login');
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

    this.userService.user = {
      login: this.formRegistration.value.login as string,
      password: this.formRegistration.value.password1 as string
    }

    this.sendAuth(environment.backendURL + '/auth/registration');
  }
}
