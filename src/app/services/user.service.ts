import {HttpClient} from "@angular/common/http";
import {catchError, Observable, tap} from "rxjs";
import {IUser} from "../models/user";
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
  ) {
  }

  public user: IUser|null|undefined = undefined

  proceedAuthRequest(url: string): Observable<string> {
    return this.http.post(url, {
      username: this.user?.login,
      password: this.user?.password
    }, { responseType: 'text' }).pipe(
      catchError(err => {
        console.log(err);
        return '';
      })
    )
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
