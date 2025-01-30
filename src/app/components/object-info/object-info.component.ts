import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-object-info',
  imports: [
    NgIf,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatButton,
    MatInput,
    FormsModule
  ],
  templateUrl: './object-info.component.html',
  styleUrl: './object-info.component.css'
})
export class ObjectInfoComponent {
  constructor(private userService: UserService) {}

  @Input() data: any; // Объект, который передается в компонент

  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  get objectEntries(): { key: string; value: any }[] {
    return this.isObject(this.data)
      ? Object.entries(this.data).map(([key, value]) => ({ key, value }))
      : [];
  }

  currentUserLogin: string | null = null; // Логин текущего пользователя
  ngAfterInit() {
    if (this.userService.user){
      this.currentUserLogin = this.userService.user.login; // Логин текущего пользователя
    }
  }

  isEditing = false; // Режим редактирования
  editableData: any = {}; // Копия данных для редактирования

  ngOnChanges(): void {
    this.editableData = { ...this.data }; // Создаем копию данных при изменении входных
  }

  get isOwner(): boolean {
    return this.data?.owner?.login === this.currentUserLogin;
  }

  @Output() saveEmitter = new EventEmitter<any>(); // Событие для сохранения
  @Output() deleteEmitter = new EventEmitter<any>(); // Событие для удаления

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.editableData = { ...this.data }; // Сбрасываем изменения при выходе из редактирования
    }
  }

  saveChanges(): void {
    this.saveEmitter.emit(this.editableData); // Передаем измененные данные наверх
    this.isEditing = false;
  }

  delete(): void {
    this.deleteEmitter.emit(); // Передаем вызов наверх, в удаление
  }
}
