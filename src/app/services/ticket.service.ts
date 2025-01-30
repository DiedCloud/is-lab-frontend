import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../environments/environment';
import {Ticket} from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(private http: HttpClient) {
  }

  private _model = new BehaviorSubject<Ticket[]>([]);

  get model() {
    return this._model.asObservable();
  }

  getAll() {
    this.http
      .get<Ticket[]>(environment.backendURL + '/api/v1/ticket')
      .subscribe((data) => {
        this._model.next(data);
      });
  }

  update(ticket: Ticket) {
    let model = [...this._model.value];
    let index = model.findIndex((hb) => hb.id === ticket.id);
    if (index === -1) {
      model.push(ticket);
    } else {
      model[index] = ticket;
    }
    this._model.next(model);
  }

  delete(ticketId: number) {
    let model = this._model.value;
    let index = model.findIndex((hb) => hb.id === ticketId);
    if (index !== -1) {
      model.splice(index, 1);
      this._model.next(model);
    }
  }
}
