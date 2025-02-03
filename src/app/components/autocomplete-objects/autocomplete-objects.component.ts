import {Component, Input} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {MatLabel} from "@angular/material/input";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {map, Observable, startWith} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-autocomplete-objects',
  imports: [
    MatFormField, ReactiveFormsModule,
    MatAutocomplete, MatAutocompleteTrigger, MatOption,
    MatInput, MatLabel,
    AsyncPipe
  ],
  templateUrl: './autocomplete-objects.component.html',
  styleUrl: './autocomplete-objects.component.css'
})
export class AutocompleteObjectsComponent{
  myControl = new FormControl('');
  @Input() title!: string
  @Input() placeholder: string = ''
  @Input() isRequired: boolean = false
  @Input() options: { id?: number, name: string}[] = [{id: 1, name: 'One'}, {id: 2, name: 'Two'}, {id: 3, name: 'Three'}];
  @Input() fillControl!: (titleKey: string, value: { id?: number, name: string}) => void
  filteredOptions: Observable<string[]>;

  constructor() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.myControl.statusChanges.subscribe(
      (status) => {
        this.options.map(option => {
          if (status === 'VALID' && (option.id + ': ' + option.name) == this.myControl.getRawValue()){
            this.fillControl(this.title, option)
            return
          }
        })
      }
    )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options
      .map(option => (option.id + ': ' + option.name))
      .filter(option => option.toLowerCase().includes(filterValue));
  }
}
