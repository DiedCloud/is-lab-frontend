import { Component } from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FilterType, ObjectsTableComponent} from "../../components/objects-table/objects-table.component";
import {ImportHistoryService} from '../../services/import-history.service';
import {History} from '../../models/history';
import {UserService} from '../../services/user.service';

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
    { key: 'status', title: 'Status', filterType: FilterType.STRING },
    { key: 'userId', title: 'User ID', filterType: FilterType.NUMBER },
    { key: 'login', title: 'User login', filterType: FilterType.STRING },
    { key: 'addedCount', title: 'new rows count', filterType: FilterType.NUMBER },
  ];

  canEdit = (row: History) => false;

  stub(row: History) {
    console.log("NO ACTION")
  }

  constructor(
    public importHistoryService: ImportHistoryService,
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
}
