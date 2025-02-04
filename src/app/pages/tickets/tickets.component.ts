import {Component, OnInit} from '@angular/core';
import {FilterType, ObjectsTableComponent} from "../../components/objects-table/objects-table.component";
import {MatButton} from "@angular/material/button";
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {CreateObjectComponent, IStruct, IType} from '../../components/create-object/create-object.component';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TicketService} from '../../services/ticket.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {Color, Ticket, TicketType} from '../../models/ticket';
import {catchError, of} from 'rxjs';
import {UserService} from '../../services/user.service';
import {IUser, UserType} from '../../models/user';
import {EventService} from '../../services/event.service';
import {VenueService} from '../../services/venue.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {UploadExcelComponent} from '../../components/upload-excel/upload-excel.component';

@Component({
  selector: 'app-tickets',
  imports: [
    ObjectsTableComponent,
    AsyncPipe,
    FormsModule, ReactiveFormsModule,
    MatButton, MatLabel, MatInput, MatFormField, UploadExcelComponent
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

  objectStructure: IStruct[]

  canEdit = (row: Ticket) =>
    row.ownerId === this.currentUser?.id || this.currentUser?.userType === UserType.ADMIN;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public ticketService: TicketService,
    public eventService: EventService,
    public venueService: VenueService,
    private http: HttpClient,
    private userService: UserService
  ) {
    ticketService.getAll()
    this.venueService.getAll()
    this.eventService.getAll()

    this.objectStructure = [
      { title: 'name', type: IType.TEXT, isRequired: true },

      { title: 'coordinates', type: IType.OBJECT, isRequired: true,
        structure: [
          { title: 'x', type: IType.NUMBER, isRequired: true },
          { title: 'y', type: IType.NUMBER, isRequired: true },
        ]
      },

      { title: 'creationDate', type: IType.DATE, isRequired: true, placeholder: 'Enter creation date' },

      { title: 'person', type: IType.OBJECT, isRequired: true,
        structure: [
          { title: 'eyeColor', type: IType.SELECT, isRequired: true, options: Object.keys(Color).filter(key => isNaN(Number(key))) },
          { title: 'hairColor', type: IType.SELECT, isRequired: true, options: Object.keys(Color).filter(key => isNaN(Number(key))) },
          { title: 'location', type: IType.OBJECT, isRequired: true,
            structure: [
              { title: 'x', type: IType.NUMBER, isRequired: true },
              { title: 'y', type: IType.NUMBER, isRequired: true },
              { title: 'z', type: IType.NUMBER, isRequired: true },
            ]
          },
          { title: 'birthday', type: IType.DATE, isRequired: true },
          { title: 'height', type: IType.NUMBER, isRequired: true },
          { title: 'weight', type: IType.NUMBER, isRequired: true },
        ]
      },

      { title: 'eventId', type: IType.SELECT_OBJECT, isRequired: true,
        objectOptions: this.eventService.model},

      { title: 'price', type: IType.NUMBER, isRequired: true},
      { title: 'type', type: IType.SELECT, isRequired: true,  placeholder: 'Enter type',
        options: Object.keys(TicketType).filter(key => isNaN(Number(key))) },
      { title: 'discount', type: IType.NUMBER, isRequired: true},
      { title: 'number', type: IType.NUMBER, isRequired: true},
      { title: 'comment', type: IType.TEXT},

      { title: 'venueId', type: IType.SELECT_OBJECT, isRequired: true,
        objectOptions: this.venueService.model}
    ];
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
        catchError((error) => {
          console.error('Error creating ticket:', error);
          return of(null); // Возвращаем Observable, чтобы поток не обрывался
        })
      )
      .subscribe((id) => {
        if (id) {
          console.log(`Object created with ID: ${id}`);
          // this.router.navigate([`/ticket/${id}`]).finally(); TODO ?
        } else {
          console.warn('Navigation was skipped due to an error or invalid response.');
        }
      });
  }

  saveObject(row: Ticket) {
    console.log('Saved row:', row);
    // Обновляем данные
    this.http
      .put(environment.backendURL + '/api/v1/ticket/' + row.id, row)
      .subscribe();
  }

  deleteObject(row: Ticket): void {
    console.log('Deleting row:', row);

    this.http
      .delete(environment.backendURL + '/api/v1/ticket/' + row.id)
      .subscribe();
  }

  countNumberSum(){
    this.http
      .get(environment.backendURL + '/api/v1/ticket/total-number')
      .subscribe(res => {alert("Total number is: " + res)});
  }

  substringForm = new FormGroup({
    "str": new FormControl("", Validators.required),
  });
  findAllBySubstring(){
    const str = this.substringForm.get('str')?.getRawValue()
    console.log(str)

    const params = new HttpParams().set('substring', str);
    this.http
      .get<Ticket[]>(environment.backendURL + '/api/v1/ticket/find-by-substring', {params})
      .subscribe({
        next: (res) => {
          const p = document.getElementById('substring-result');
          if (!p) {
            console.error('Элемент с id "substring-result" не найден.');
            return;
          }

          p.innerText =  res.map(ticket => JSON.stringify(ticket)).join('\n');
        },
        error: (err) => {
          console.error('Ошибка при получении данных:', err);
        }
      });
  }

  prefixForm = new FormGroup({
    "prefix": new FormControl("", Validators.required),
  });
  findAllByPrefix() {
    const prefix = this.prefixForm.get('prefix')?.getRawValue()
    console.log(prefix)

    const params = new HttpParams().set('prefix', prefix);
    this.http
      .get<Ticket[]>(environment.backendURL + '/api/v1/ticket/find-by-prefix', {params})
      .subscribe({
        next: (res) => {
          const p = document.getElementById('prefix-result');
          if (!p) {
            console.error('Элемент с id "prefix-result" не найден.');
            return;
          }

          p.innerText =  res.map(ticket => JSON.stringify(ticket)).join('\n');
        },
        error: (err) => {
          console.error('Ошибка при получении данных:', err);
        }
      });
  }

  vipForm = new FormGroup({
    "id": new FormControl("", [Validators.required, Validators.min(1)]),
  });
  cloneAsVIP() {
    const id = this.vipForm.get('id')?.getRawValue()
    console.log(id)
    this.http
      .post(environment.backendURL + '/api/v1/ticket/duplicate-vip/' + id, {})
      .subscribe();
  }
}
