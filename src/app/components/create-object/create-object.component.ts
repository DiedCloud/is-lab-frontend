import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';

@Component({
  selector: 'app-create-object',
  imports: [
    FormsModule,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    MatDialogTitle,
    MatDialogActions
  ],
  templateUrl: './create-object.component.html',
  styleUrl: './create-object.component.css'
})
export class CreateObjectComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateObjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { structure: any, title: string }
  ) {
    this.form = this.fb.group({});
    this.initForm();
  }

  initForm(): void {
    const formGroup: { [key: string]: any } = {};
    for (const key in this.data.structure) {
      if (this.data.structure.hasOwnProperty(key)) {
        formGroup[key] = [
          '',
          this.data.structure[key]?.required ? Validators.required : null
        ];
      }
    }
    this.form = this.fb.group(formGroup);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value); // Возвращаем данные и закрываем диалог
    }
  }

  close(): void {
    this.dialogRef.close(); // Закрыть окно без сохранения
  }

  get objectKeys(): string[] {
    return Object.keys(this.data.structure);
  }

  getInputType(key: string): string {
    const type = this.data.structure[key]?.type || 'text';
    return type === 'number' ? 'number' : 'text';
  }

  getPlaceholder(key: string): string {
    return this.data.structure[key]?.placeholder || `Enter ${key}`;
  }

}
