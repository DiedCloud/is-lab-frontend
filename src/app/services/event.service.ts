import {HttpClient} from '@angular/common/http'
import {BehaviorSubject} from 'rxjs'
import {Event} from '../models/event'
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) {
  }

  private _model = new BehaviorSubject<Event[]>([]);

  get model() {
    return this._model.asObservable();
  }

  getAll() {
    this.http
      .get<Event[]>(environment.backendURL + '/api/v1/event')
      .subscribe((data) => {
        this._model.next(data);
      });
  }

  update(event: Event) {
    let model = [...this._model.value];
    let index = model.findIndex((hb) => hb.id === event.id);
    if (index === -1) {
      model.push(event);
    } else {
      model[index] = event;
    }
    this._model.next(model);
  }

  delete(eventId: number) {
    let model = this._model.value;
    let index = model.findIndex((hb) => hb.id === eventId);
    if (index !== -1) {
      model.splice(index, 1);
      this._model.next(model);
    }
  }
}
