import {Component, Input} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatProgressBar} from '@angular/material/progress-bar';
import {NgIf} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-upload-excel',
  imports: [
    MatCard,
    MatIcon,
    MatButton,
    MatProgressBar,
    NgIf
  ],
  templateUrl: './upload-excel.component.html',
  styleUrl: './upload-excel.component.css'
})
export class UploadExcelComponent {
  selectedFile: File | null = null;
  loading = false;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  @Input() urlPath!: string

  uploadFile() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.loading = true;

    this.http.post(environment.backendURL + this.urlPath, formData)
      .pipe(
        catchError((error: HttpErrorResponse) =>  {
          return throwError(() => new Error(error.message || 'Ошибка загрузки файла'));
        }))
      .subscribe({
        next: (data: any) => {
          this.snackBar.open('Файл успешно загружен!', 'Закрыть', { duration: 3000 });
          console.log('Ответ от сервера:', data);
          this.loading = false;
          this.selectedFile = null;
        },
        error: (error: any) => {
          this.snackBar.open('Ошибка загрузки файла', 'Закрыть', { duration: 3000 });
          console.error('Ошибка:', error);
          this.loading = false;
        }
    });
  }
}
