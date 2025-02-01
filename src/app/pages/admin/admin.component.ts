import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import {AdminRequest, IUser} from '../../models/user';
import {CommonModule} from '@angular/common';
import {environment} from '../../../environments/environment';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {UserService} from '../../services/user.service';
import {AdminRequestService} from '../../services/admin-request.service';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {FilterType, ObjectsTableComponent} from '../../components/objects-table/objects-table.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    ObjectsTableComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  currentUser: IUser | null = null

  columns = [
    {key: 'id', title: 'ID', filterType: FilterType.NUMBER},
    {key: 'userId', title: 'User ID', filterType: FilterType.NUMBER},
    {key: 'login', title: 'login', filterType: FilterType.STRING},
    {key: 'requestDate', title: 'Request Date', filterType: FilterType.STRING},
    {key: 'status', title: 'Status', filterType: FilterType.STRING},
    {key: 'comment', title: 'Comment', filterType: FilterType.STRING}
  ];

  constructor(
    public adminRqService: AdminRequestService,
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {
    adminRqService.getAll()
  }

  ngOnInit() {
    this.userService.user$.subscribe((res) => {
      this.currentUser = res
    })
  }

  approve(row: AdminRequest) {
    this.http
      .put(environment.backendURL + '/api/v1/admin/approve/' + row.id, row)
      .subscribe();
  }

  decline(row: AdminRequest): void {
    this.http
      .delete(environment.backendURL + '/api/v1/admin/decline/' + row.id)
      .subscribe();
  }

  openMainPanel() {
    this.router.navigate(['']).finally();
  }

  updateAll() {
    this.adminRqService.getAll();
  }
}
