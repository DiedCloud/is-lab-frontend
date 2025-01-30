import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Venue} from '../models/venue';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VenueService {
  constructor(private http: HttpClient) {
  }

  private _model = new BehaviorSubject<Venue[]>([]);

  get model() {
    return this._model.asObservable();
  }

  getAll() {
    this.http
      .get<Venue[]>(environment.backendURL + '/api/v1/venue')
      .subscribe((data) => {
        this._model.next(data);
      });
  }

  update(venue: Venue) {
    let model = [...this._model.value];
    let index = model.findIndex((hb) => hb.id === venue.id);
    if (index === -1) {
      model.push(venue);
    } else {
      model[index] = venue;
    }
    this._model.next(model);
  }

  delete(venueId: number) {
    let model = this._model.value;
    let index = model.findIndex((hb) => hb.id === venueId);
    if (index !== -1) {
      model.splice(index, 1);
      this._model.next(model);
    }
  }
}
