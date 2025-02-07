import {EventEmitter, Injectable} from '@angular/core';
import { environment } from "../../environments/environment";
import { Client, Message } from '@stomp/stompjs';
import { EventService } from './event.service';
import { VenueService } from './venue.service';
import { TicketService } from './ticket.service';
import { AdminRequestService } from './admin-request.service';
import {ImportHistoryService} from './import-history.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private eventService: EventService
  private venueService: VenueService
  private ticketService: TicketService
  private adminRqService: AdminRequestService
  private importHistoryService: ImportHistoryService

  private client: Client | null

  userUpdateCallback: () => void = () => {}

  constructor(
    eventService: EventService,
    venueService: VenueService,
    ticketService: TicketService,
    adminRqService: AdminRequestService,
    importHistoryService: ImportHistoryService
  ) {
    this.eventService = eventService;
    this.venueService = venueService;
    this.ticketService = ticketService;
    this.adminRqService = adminRqService;
    this.importHistoryService = importHistoryService;
    this.client = null
  }

  private createClient() {
    this.client = new Client({
      brokerURL: environment.wsBackendURL,
      // debug: function (str: any) { console.log(str); },
      connectHeaders: { 'Authorization': localStorage.getItem('authToken') || '', },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame: any) => {
      console.log('Connected: ' + frame);

      this.client?.subscribe('/topic/newEvent', (message: Message)=> {
        this.eventService.update(JSON.parse(message.body));
      });
      this.client?.subscribe('/topic/updatedEvent', (message: Message)=> {
        this.eventService.update(JSON.parse(message.body).modelDto);
      });
      this.client?.subscribe('/topic/removeEvent', (message: Message)=> {
        this.eventService.delete(Number(message.body));
      });
      this.client?.subscribe('/topic/invalidatedEvent', (message: Message)=> {
        this.eventService.getAll();
      });

      this.client?.subscribe('/topic/newVenue', (message: Message)=> {
        this.venueService.update(JSON.parse(message.body));
      });
      this.client?.subscribe('/topic/updatedVenue', (message: Message)=> {
        this.venueService.update(JSON.parse(message.body).modelDto);
      });
      this.client?.subscribe('/topic/removeVenue', (message: Message)=> {
        this.venueService.delete(Number(message.body));
      });
      this.client?.subscribe('/topic/invalidatedVenue', (message: Message)=> {
        this.venueService.getAll();
      });

      this.client?.subscribe('/topic/newTicket', (message: Message)=> {
        this.ticketService.update(JSON.parse(message.body));
      });
      this.client?.subscribe('/topic/updatedTicket', (message: Message)=> {
        this.ticketService.update(JSON.parse(message.body).modelDto);
      });
      this.client?.subscribe('/topic/removeTicket', (message: Message)=> {
        this.ticketService.delete(Number(message.body));
      });
      this.client?.subscribe('/topic/invalidatedTicket', (message: Message)=> {
        this.ticketService.getAll();
      });

      this.client?.subscribe('/topic/updatedAdminRequest', (message: Message)=> {
        this.adminRqService.update(JSON.parse(message.body));
        this.userUpdateCallback();
      });
      this.client?.subscribe('/topic/newAdminRequest', (message: Message)=> {
        this.adminRqService.update(JSON.parse(message.body));
      });

      this.client?.subscribe('/topic/newImport', (message: Message)=> {
        this.importHistoryService.update(JSON.parse(message.body));
      });
      this.client?.subscribe('/topic/removeImport', (message: Message)=> {
        this.importHistoryService.delete(Number(message.body));
      });
    };

    this.client.onStompError = function (frame: { headers: { [x: string]: string; }; body: string; }) {
      console.log('Broker reported error: ' + frame.headers['message']);
      console.log('Additional details: ' + frame.body);
    };
    this.client.onWebSocketError = function (error: any) {
      console.error('Ошибка WebSocket:', error);
    };
  }

  connectWs() {
    if (!this.client) {
      this.createClient()
    }
    if (this.client){
      this.client.activate();
    }
  }

  disconnectWs() {
    this.client?.deactivate().finally();
  }
}
