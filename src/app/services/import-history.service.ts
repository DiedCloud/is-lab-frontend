import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../environments/environment';
import {History} from '../models/history';
import {IUser, UserType} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ImportHistoryService {
  user!: IUser

  constructor(private http: HttpClient) {
  }

  private _model = new BehaviorSubject<History[]>([]);

  get model() {
    return this._model.asObservable();
  }

  getAll(user: IUser) {
    this.user = user
    const url = this.user.userType === UserType.ADMIN ? '/api/v1/import-history/admin' : '/api/v1/import-history'
    this.http
      .get<History[]>(environment.backendURL + url)
      .subscribe((data) => {
        this._model.next(data);
      });
  }

  update(history: History) {
    let model = [...this._model.value];

    // да, на беке новый импорт отправляется всем...
    if (this.user.id != history.id && this.user.userType != UserType.ADMIN) {
      return
    }

    let index = model.findIndex((hb) => hb.id === history.id);
    if (index === -1) {
      model.push(history);
    } else {
      model[index] = history;
    }

    this._model.next(model);
  }

  delete(venueId: number) {
    let model = [...this._model.value];
    let index = model.findIndex((hb) => hb.id === venueId);
    if (index !== -1) {
      model.splice(index, 1);
      this._model.next(model);
    }
  }
}
