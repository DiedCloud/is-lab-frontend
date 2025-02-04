import {Component, OnInit} from '@angular/core';
import {FilterType, ObjectsTableComponent} from '../../components/objects-table/objects-table.component';
import {Router} from '@angular/router';
import {CreateObjectComponent, IType} from '../../components/create-object/create-object.component';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {VenueService} from '../../services/venue.service';
import {HttpClient} from '@angular/common/http';
import {AsyncPipe} from '@angular/common';
import {Venue, VenueType} from '../../models/venue';
import {environment} from '../../../environments/environment';
import {catchError, of} from 'rxjs';
import {UserService} from '../../services/user.service';
import {IUser, UserType} from '../../models/user';
import {UploadExcelComponent} from '../../components/upload-excel/upload-excel.component';

@Component({
  selector: 'app-venues',
  imports: [
    ObjectsTableComponent,
    MatButton,
    AsyncPipe,
    UploadExcelComponent
  ],
  templateUrl: './venues.component.html',
  styleUrl: './venues.component.css'
})
export class VenuesComponent implements OnInit {
  currentUser: IUser | null = null

  columns = [
    { key: 'name', title: 'Name', filterType: FilterType.STRING },
    { key: 'capacity', title: 'Capacity', filterType: FilterType.NUMBER },
    { key: 'type', title: 'Type', filterType: FilterType.STRING }
  ];

  objectStructure = [
    { title: 'name', type: IType.TEXT, isRequired: true, placeholder: 'Enter name' },
    { title: 'capacity', type: IType.NUMBER, isRequired: true, placeholder: 'Enter capacity' },
    { title: 'type', type: IType.SELECT, placeholder: 'Enter type', options: Object.values(VenueType).filter(key => isNaN(Number(key))) }
  ];

  canEdit = (row: Venue) =>
    row.ownerId === this.currentUser?.id || this.currentUser?.userType === UserType.ADMIN;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public venueService: VenueService,
    private http: HttpClient,
    private userService: UserService
  ) {
    venueService.getAll()
  }

  ngOnInit() {
    this.userService.user$.subscribe((res) => {this.currentUser = res})
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
        catchError((error) => {
          console.error('Error creating venue:', error);
          return of(null); // Возвращаем Observable, чтобы поток не обрывался
        })
      )
      .subscribe((id) => {
        if (id) {
          console.log(`Object created with ID: ${id}`);
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
      .put(environment.backendURL + '/api/v1/venue/' + row.id, row)
      .subscribe();
  }

  deleteObject(row: Venue): void {
    console.log('Deleting row:', row);

    this.http
      .delete(environment.backendURL + '/api/v1/venue/' + row.id)
      .subscribe();
  }
}
