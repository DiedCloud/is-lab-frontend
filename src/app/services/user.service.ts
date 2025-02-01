import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, catchError} from "rxjs";
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

  private _user = new BehaviorSubject<IUser | null>(null);
  public user$ = this._user.asObservable();

  private sendAuth(url: string, login: string, password: string) {
    this.http.post(url, {
      username: login,
      password: password
    }, { responseType: 'text' }
    ).subscribe({
      error: (err) => {
        console.log(err);
        return '';
      },
      next: (res: any) => {
        localStorage.setItem('authToken', res);
        localStorage.setItem('login', login);

        this.webSocketService.connectWs();

        this.router.navigate(['']).then(r => { if (!r) { console.error("redirect went wrong..."); } });
      }
    });
  }

  login(login: string, password: string) {
    this.sendAuth(environment.backendURL + '/auth/login', login, password);
    this.validateUser();
  }

  registration(login: string, password: string) {
    this.sendAuth(environment.backendURL + '/auth/registration', login, password);
    this.validateUser();
  }

  validateUser() {
    return this.http.get<IUser>(environment.backendURL + "/auth/whoAmI").subscribe({
      next: (res) => {
        this._user.next(res);
        localStorage.setItem('login', res.login);
      },
      error: () => {
        this._user.next(null); // если ошибка, очищаем пользователя
      }
    });
  }

  logout() {
    return this.http.delete(environment.backendURL + "/auth/logout").pipe(
      catchError(err => {
        console.log(err);
        return '';
      })
    ).subscribe({
      next: () => {
        localStorage.clear();
        this._user.next(null);

        this.webSocketService.disconnectWs();

        this.router.navigate(['authorization']).finally();
        window.location.reload();
      }
    });
  }
}
