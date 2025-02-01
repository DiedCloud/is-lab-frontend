import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from '@angular/material/table';
import {NgForOf, NgIf} from '@angular/common';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-objects-table',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef,
    MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
    NgForOf, NgIf,
    MatPaginator, MatSortHeader, MatSort,
    ReactiveFormsModule, MatInput, MatButton, FormsModule
  ],
  templateUrl: './objects-table.component.html',
  styleUrl: './objects-table.component.css'
})
export class ObjectsTableComponent<T extends object> implements AfterViewInit, OnChanges {
  columns: Array<{ key: string, title: string, filterType?: FilterType }> = []; // Колонки с ключами и названиями
  @Input() set setColumns(columns: Array<{ key: string, title: string, filterType?: FilterType }>) {
    this.columns = [...columns, {key: "actions", title: "Actions"}]
  }

  // Источник данных
  @Input() set dataSource(data: T[]) {
    if (!this.data) {
      this.data = new MatTableDataSource<T>(data);
    } else {
      this.data.data = data;
    }
    this.initializeFilters();
  }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  data = new MatTableDataSource<T>();
  filters: { [key: string]: FormControl } = {};

  get displayedColumns(): string[] {
    return this.columns.map(col => col.key);
  }

  ngAfterViewInit(): void {
    this.data.sort = this.sort;
    this.data.paginator = this.paginator;
    this.data._updateChangeSubscription(); // обновить сортировку и пагинацию
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource'] && changes['dataSource'].currentValue) {
      this.data.data = changes['dataSource'].currentValue;
    }
  }

  initializeFilters(): void {
    this.filters = this.columns.reduce((acc, col) => {
      acc[col.key] = new FormControl('');
      return acc;
    }, {} as { [key: string]: FormControl });

    // Подписка на изменения фильтров
    Object.keys(this.filters).forEach(key => {
      this.filters[key].valueChanges.subscribe(() => this.applyFilters());
    });
  }

  applyFilters(): void {
    const filterValues = Object.keys(this.filters).reduce((acc, key) => {
      acc[key] = this.filters[key].value;
      return acc;
    }, {} as { [key: string]: string });

    this.data.filterPredicate = (data: T, filter: string) => {
      const filters = JSON.parse(filter);
      return this.columns.every(column => {
        const value = (data as any)[column.key];
        const filterValue = filters[column.key];
        if (!filterValue) return true;

        if (column.filterType == FilterType.STRING) {
          // Фильтрация строк: начинается с / содержит
          return filterValue.startsWith('^')
            ? value?.toString().toLowerCase().startsWith(filterValue.substring(1).toLowerCase())
            : value?.toString().toLowerCase().includes(filterValue.toLowerCase());
        } else if (column.filterType == FilterType.NUMBER) {
          // Фильтрация чисел: диапазон
          const [min, max] = filterValue.split('-').map((v: string) => parseFloat(v.trim()));
          return (!isNaN(min) ? value >= min : true) && (!isNaN(max) ? value <= max : true);
        }

        return true;
      });
    };
    this.data.filter = JSON.stringify(filterValues);
    if (this.data.paginator) {
      this.data.paginator.firstPage(); // <- Сбросить пагинацию при изменении фильтра
    }
  }

  protected readonly FilterType = FilterType;

  // Удаление строк
  @Input() canEdit: (row: T) => boolean = () => true; // Предикат на проверку прав

  @Output() rowDelete = new EventEmitter<T>(); // Событие для удаления
  deleteRow(row: T) {
    this.rowDelete.emit(row);
  }

  // Изменение строк TODO check
  @Output() rowSave = new EventEmitter<any>(); // Событие для сохранения

  editingRow: T | null = null; // Будет ссылкой. Для проверки режима редактирования
  editableData: T | null = null; // Копия данных для редактирования

  toggleEdit(row: T): void {
    if (this.editingRow === row && this.editableData) {
      Object.assign(row, this.editableData); // Восстановление данных при нажатии "Cancel"
      this.editableData = null;
      this.editingRow = null;
    } else {
      this.editableData = { ...row }; // Запоминаем при входе в редактирование
      this.editingRow = row;
    }
  }

  saveRow(row: T): void {
    this.rowSave.emit({...row}); // Передаем измененные данные наверх
    this.editingRow = null;
  }
}

export enum FilterType {STRING, NUMBER}
