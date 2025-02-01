import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField, MatInput} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-create-object',
  imports: [
    FormsModule, ReactiveFormsModule,
    MatInput, MatButton,
    MatDialogTitle, MatDialogActions,
    NgForOf, NgIf,
    MatFormField, MatSelect, MatOption
  ],
  templateUrl: './create-object.component.html',
  styleUrl: './create-object.component.css'
})
export class CreateObjectComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateObjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { structure: IStruct[], title: string }
  ) {
    this.form = this.fb.group({});
    this.initForm();
  }

  initForm(): void {
    const formGroup: { [key: string]: any } = {};
    for (const param of this.data.structure) {
      formGroup[param.title] = ['', param?.isRequired ? Validators.required : null];
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

  get parameters(): IStruct[] {
    return this.data.structure;
  }

  getInputType(type: IType): string {
    return type.toString()
  }

  protected readonly IType = IType;
}

export interface IStruct {
  title: string,
  type: IType,
  isRequired?: boolean,
  placeholder: string,
  options: string[]
}

export enum IType {TEXT, NUMBER, SELECT}
