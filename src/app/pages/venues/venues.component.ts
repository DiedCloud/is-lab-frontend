import {Component} from '@angular/core';
import {FilterType, ObjectsTableComponent} from '../../components/objects-table/objects-table.component';
import {Router} from '@angular/router';
import {CreateObjectComponent} from '../../components/create-object/create-object.component';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {VenueService} from '../../services/venue.service';
import {HttpClient} from '@angular/common/http';
import {AsyncPipe} from '@angular/common';
import {Venue} from '../../models/venue';
import {environment} from '../../../environments/environment';
import {catchError, of, tap} from 'rxjs';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-venues',
  imports: [
    ObjectsTableComponent,
    MatButton,
    AsyncPipe
  ],
  templateUrl: './venues.component.html',
  styleUrl: './venues.component.css'
})
export class VenuesComponent {
  columns = [
    { key: 'name', title: 'Name', filterType: FilterType.STRING },
    { key: 'capacity', title: 'Capacity', filterType: FilterType.NUMBER },
    { key: 'type', title: 'Type', filterType: FilterType.STRING }
  ];

  objectStructure = {
    name: { type: 'text', required: true, placeholder: 'Enter name' },
    capacity: { type: 'number', required: true, placeholder: 'Enter capacity' },
    type: { type: 'text', placeholder: 'Enter type' }
  };

  canEdit = (row: Venue) => row.ownerId === this.userService.user?.id;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public venueService: VenueService,
    private http: HttpClient,
    private userService: UserService
  ) {
    venueService.getAll()
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateObjectComponent, {
      width: '400px',
      data: { structure: this.objectStructure, title: 'Venue' }
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
      .post<number>(environment.backendURL + '/api/v1/venue', newObject)
      .pipe(
        tap((id) => {
          console.log(`Object created with ID: ${id}`);
        }),
        catchError((error) => {
          console.error('Error creating venue:', error);
          return of(null); // Возвращаем Observable, чтобы поток не обрывался
        })
      )
      .subscribe((id) => {
        if (id) {
          // this.router.navigate([`/venue/${id}`]).finally();
        } else {
          console.warn('Navigation was skipped due to an error or invalid response.');
        }
      });
  }

  saveObject(row: Venue) {
    console.log('Saved row:', row);
    // Обновляем данные
    this.http
      .put(environment.backendURL + '/api/v1/venue/' + row.id, row) // TODO поля?
      .subscribe();
  }

  deleteObject(row: Venue): void {
    console.log('Deleting row:', row);

    this.http
      .delete(environment.backendURL + '/api/v1/venue/' + row.id)
      .subscribe();
  }
}
