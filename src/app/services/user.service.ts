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
    webSocketService.userUpdateCallback = () => {this.validateUser()}
  }

  private _user = new BehaviorSubject<IUser | null>(null);

  public checkNotNullUser() {
    return this._user.getValue() != null;
  }

  public user$ = this._user.asObservable();

  private sendAuth(url: string, login: string, password: string, requestAdmin: boolean = false) {
    let obj = {username: login, password: password}
    if (requestAdmin) {
      Object.assign(obj, {...obj, requestAdmin: requestAdmin})
    }
    this.http.post(url, obj, { responseType: 'text' }).subscribe({
      error: (err) => {
        console.log(err);
        return '';
      },
      next: (res: any) => {
        localStorage.setItem('authToken', res);
        localStorage.setItem('login', login);

        this.webSocketService.connectWs();

        this.router.navigate(['']).then(r => { if (!r) { console.error("redirect went wrong..."); } });
        this.validateUser();
      }
    });
  }

  login(login: string, password: string) {
    this.sendAuth(environment.backendURL + '/auth/login', login, password);
  }

  registration(login: string, password: string, requestAdmin: boolean) {
    this.sendAuth(environment.backendURL + '/auth/registration', login, password, requestAdmin);
  }

  requestAdmin() {
    this.http.post(environment.backendURL + '/api/v1/admin/request-admin-role', {}).subscribe();
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
