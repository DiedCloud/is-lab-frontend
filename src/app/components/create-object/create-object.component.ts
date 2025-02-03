import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {AutocompleteObjectsComponent} from '../autocomplete-objects/autocomplete-objects.component';
import {MatFormField, MatLabel, MatHint} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepickerToggleIcon
} from '@angular/material/datepicker';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-create-object',
  imports: [
    FormsModule, ReactiveFormsModule, MatFormField,
    MatButton,
    MatDialogTitle, MatDialogActions,
    NgForOf, NgIf, AsyncPipe,
    AutocompleteObjectsComponent,
    MatInput, MatLabel, MatOption, MatSelect, MatHint,
    MatDatepickerInput, MatDatepickerToggle, MatDatepicker, MatDatepickerToggleIcon, MatIcon
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-object.component.html',
  styleUrl: './create-object.component.css'
})
export class CreateObjectComponent {
  form: FormGroup;

  constructor(
    private dialog: MatDialog,
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

  openCreateDialog(structure: IStruct[] | undefined, titleKey: string): void {
    if (!structure){
      console.warn('structure undefined')
      return
    }
    const dialogRef = this.dialog.open(CreateObjectComponent, {
      width: '400px',
      data: { structure: structure, title: titleKey }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        const control = this.form.get(titleKey);
        if (control) {
          control.patchValue(result);
        } else {
          console.warn(`Поле ${titleKey} не найдено в форме.`);
        }
      }
    });
  }

  fillControl(titleKey: string, val: { id?: number, name: string}) {
    const control = this.form.get(titleKey);
    if (control) {
      control.patchValue(val.id);
    }
  }

  protected readonly IType = IType;
}

export interface IStruct {
  title: string,
  type: IType,
  isRequired?: boolean,
  placeholder?: string,
  options?: string[],
  objectOptions?: Observable<{ id?: number, name: string}[]>
  structure?: IStruct[]
}

export enum IType {TEXT, NUMBER, SELECT, OBJECT, SELECT_OBJECT, DATE}
