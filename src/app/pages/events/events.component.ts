import {Component, OnInit} from '@angular/core';
import {FilterType, ObjectsTableComponent} from '../../components/objects-table/objects-table.component';
import {MatButton} from '@angular/material/button';
import {CreateObjectComponent, IType} from '../../components/create-object/create-object.component';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {EventService} from '../../services/event.service';
import {HttpClient} from '@angular/common/http';
import {Event} from '../../models/event';
import {environment} from '../../../environments/environment';
import {catchError, of, tap} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {UserService} from '../../services/user.service';
import {IUser} from '../../models/user';

@Component({
  selector: 'app-events',
  imports: [
    ObjectsTableComponent,
    MatButton,
    AsyncPipe
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  currentUser: IUser | null = null
  columns = [
    { key: 'name', title: 'Name', filterType: FilterType.STRING },
    { key: 'minAge', title: 'Minimum Age', filterType: FilterType.NUMBER },
    { key: 'ticketsCount', title: 'Tickets Count', filterType: FilterType.NUMBER }
  ];

  objectStructure = [
    { title: 'name', type: IType.TEXT, isRequired: true, placeholder: 'Enter name' },
    { title: 'minAge', type: IType.NUMBER, isRequired: true, placeholder: 'Enter minimum visitor\'s age' },
    { title: 'ticketsCount', type: IType.NUMBER, isRequired: true, placeholder: 'Enter number of available tickets'}
  ];

  canEdit = (row: Event) => row.ownerId === this.currentUser?.id;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public eventService: EventService,
    private http: HttpClient,
    private userService: UserService
  ) {
    eventService.getAll()
  }

  ngOnInit() {
    this.userService.user$.subscribe((res) => {this.currentUser = res})
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateObjectComponent, {
      width: '400px',
      data: { structure: this.objectStructure, title: 'Event' }
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
      .post<number>(environment.backendURL + '/api/v1/event', newObject)
      .pipe(
        tap((id) => {
          console.log(`Object created with ID: ${id}`);
        }),
        catchError((error) => {
          console.error('Error creating event:', error);
          return of(null); // Возвращаем Observable, чтобы поток не обрывался
        })
      )
      .subscribe((id) => {
        if (id) {
          // this.router.navigate([`/event/${id}`]).finally();
        } else {
          console.warn('Navigation was skipped due to an error or invalid response.');
        }
      });
  }

  saveObject(row: Event) {
    console.log('Saved row:', row);
    // Обновляем данные
    this.http
      .put(environment.backendURL + '/api/v1/event/' + row.id, row) // TODO поля?
      .subscribe();
  }

  deleteObject(row: Event): void {
    console.log('Deleting row:', row);

    this.http
      .delete(environment.backendURL + '/api/v1/event/' + row.id)
      .subscribe();
  }
}
