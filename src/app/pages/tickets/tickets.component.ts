import {Component, OnInit} from '@angular/core';
import {FilterType, ObjectsTableComponent} from "../../components/objects-table/objects-table.component";
import {MatButton} from "@angular/material/button";
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {CreateObjectComponent, IType} from '../../components/create-object/create-object.component';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {TicketService} from '../../services/ticket.service';
import {AsyncPipe} from '@angular/common';
import {Ticket, TicketType} from '../../models/ticket';
import {catchError, of, tap} from 'rxjs';
import {UserService} from '../../services/user.service';
import {IUser} from '../../models/user';

@Component({
  selector: 'app-tickets',
  imports: [
    ObjectsTableComponent,
    MatButton,
    AsyncPipe
  ],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {
  currentUser: IUser | null = null

  columns = [
    { key: 'id', title: 'ID', filterType: FilterType.NUMBER },
    { key: 'name', title: 'Name', filterType: FilterType.STRING },
    // TODO Coordinates
    { key: 'creationDate', title: 'Creation Date', filterType: FilterType.STRING },
    // TODO Person
    { key: 'eventId', title: 'event ID', filterType: FilterType.NUMBER }, // TODO link to event
    { key: 'price', title: 'Price', filterType: FilterType.STRING },
    { key: 'type', title: 'Type', filterType: FilterType.STRING },
    { key: 'discount', title: 'Discount', filterType: FilterType.STRING },
    { key: 'number', title: 'Ticker number', filterType: FilterType.NUMBER },
    { key: 'comment', title: 'Comment', filterType: FilterType.STRING },
    { key: 'venueId', title: 'venue ID', filterType: FilterType.NUMBER }, // TODO link to venue
  ];

  objectStructure = [
    { title: 'name', type: IType.TEXT, isRequired: true, placeholder: 'Enter name' },
    // TODO coordinates
    { title: 'creationDate', type: IType.NUMBER, isRequired: true, placeholder: 'Enter creation date' },
    // TODO Person
    { title: 'eventId', type: IType.NUMBER, isRequired: true,  placeholder: 'Choose event'}, // TODO linking event
    { title: 'price', type: IType.NUMBER, isRequired: true,  placeholder: 'Enter price'},
    { title: 'type', type: IType.SELECT, isRequired: true,  placeholder: 'Enter type', options: Object.values(TicketType).filter(key => isNaN(Number(key))) },
    { title: 'discount', type: IType.NUMBER, isRequired: true,  placeholder: 'Enter discount'},
    { title: 'number', type: IType.NUMBER, isRequired: true,  placeholder: 'Enter number'},
    { title: 'comment', type: IType.TEXT,  placeholder: 'Enter comment'},
    { title: 'venueId', type: IType.NUMBER, isRequired: true,  placeholder: 'Choose venue'}// TODO linking venue
  ];

  canEdit = (row: Ticket) => row.ownerId === this.currentUser?.id;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public ticketService: TicketService,
    private http: HttpClient,
    private userService: UserService
  ) {
    ticketService.getAll()
  }

  ngOnInit() {
    this.userService.user$.subscribe((res) => {this.currentUser = res})
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateObjectComponent, {
      width: '400px',
      data: { structure: this.objectStructure, title: 'Ticket' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createObject(result);
      }
    });
  }

  createObject(newObject: any): void {
    console.log('Созданный объект:', newObject);

    this.http
      .post<number>(environment.backendURL + '/api/v1/ticket', newObject)
      .pipe(
        tap((id) => {
          console.log(`Object created with ID: ${id}`);
        }),
        catchError((error) => {
          console.error('Error creating ticket:', error);
          return of(null); // Возвращаем Observable, чтобы поток не обрывался
        })
      )
      .subscribe((id) => {
        if (id) {
          // this.router.navigate([`/ticket/${id}`]).finally();
        } else {
          console.warn('Navigation was skipped due to an error or invalid response.');
        }
      });
  }

  saveObject(row: Ticket) {
    console.log('Saved row:', row);
    // Обновляем данные
    this.http
      .put(environment.backendURL + '/api/v1/venue/' + row.id, row) // TODO поля?
      .subscribe();
  }

  deleteObject(row: Ticket): void {
    console.log('Deleting row:', row);

    this.http
      .delete(environment.backendURL + '/api/v1/ticket/' + row.id)
      .subscribe();
  }
}
