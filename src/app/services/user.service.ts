import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError} from "rxjs";
import {IUser} from "../models/user";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {WebSocketService} from './web-socket.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private webSocketService: WebSocketService,
    private router: Router,
  ) {
  }

  public user: IUser|null|undefined = undefined

  private sendAuth(url: string) {
    this.http.post(url, {
      username: this.user?.login,
      password: this.user?.password
    }, { responseType: 'text' }
    ).subscribe({
      error: (err) => {
        console.log(err);
        return '';
      },
      next: (res: any) => {
        localStorage.setItem('authToken', res);

        if (this.user)
          localStorage.setItem('login', this.user.login);

        this.webSocketService.connectWs();

        this.router.navigate(['']).then(r => {
          if (!r) {
            console.error("redirect went wrong...");
          }
        });
      }
    });
  }

  login(login: string, password: string) {
    this.user = { login: login, password: password }
    this.sendAuth(environment.backendURL + '/auth/login');
    this.validateUser();
  }

  registration(login: string, password: string) {
    this.user = { login: login, password: password }
    this.sendAuth(environment.backendURL + '/auth/registration');
    this.validateUser();
  }

  validateUser() {
    return this.http.get<IUser>(environment.backendURL + "/auth/whoAmI")
      .subscribe(
      {
        next: (res) => {
          this.user = res;
          localStorage.setItem('login', this.user.login);
          console.log(this.user);
          return true;
        }
      });
  }

  logout() {
    return this.http.delete(environment.backendURL + "/auth/logout").pipe(
      catchError(err => {
        console.log(err);
        return '';
      })
    )
  }
}
