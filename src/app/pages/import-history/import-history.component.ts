import { Component } from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FilterType, ObjectsTableComponent} from "../../components/objects-table/objects-table.component";
import {ImportHistoryService} from '../../services/import-history.service';
import {History} from '../../models/history';
import {UserService} from '../../services/user.service';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-import-history',
    imports: [
        AsyncPipe,
        ObjectsTableComponent
    ],
  templateUrl: './import-history.component.html',
  styleUrl: './import-history.component.css'
})
export class ImportHistoryComponent {
  columns = [
    { key: 'id', title: 'ID', filterType: FilterType.NUMBER },
    { key: 'fileName', title: 'file name', filterType: FilterType.STRING },
    { key: 'status', title: 'Status', filterType: FilterType.STRING },
    { key: 'userId', title: 'User ID', filterType: FilterType.NUMBER },
    { key: 'login', title: 'User login', filterType: FilterType.STRING },
    { key: 'addedCount', title: 'new rows count', filterType: FilterType.NUMBER },
  ];

  canEdit = (row: History) => false;

  constructor(
    public importHistoryService: ImportHistoryService,
    private http: HttpClient,
    userService: UserService
  ) {
    userService.user$.subscribe(
      (user) => {
        if (user){
          importHistoryService.getAll(user)
        }
        else {
          console.error("Ошибка определения пользователя")
        }
      }
    )
  }

  downloadRow (row: History) {
    console.log('Downloading row:', row);

    this.http
      .get(environment.backendURL + '/api/v1/import-history/download/' + row.id, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          // Создаем ссылку на blob и загружаем файл
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = row.fileName || 'downloaded-file'; // Указываем имя файла
          a.click();
          URL.revokeObjectURL(objectUrl); // Освобождаем память
        },
        error: (err) => {
          console.error('Ошибка скачивания файла', err);
        }
      });
  }

  deleteRow (row: History): void {
    console.log('Deleting row:', row);

    this.http
      .delete(environment.backendURL + '/api/v1/import-history/' + row.id)
      .subscribe();
  }
}
