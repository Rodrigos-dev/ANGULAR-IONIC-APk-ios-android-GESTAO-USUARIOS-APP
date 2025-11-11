import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'custom-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, IonicModule, CommonModule],
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() description: string = '';
  @Input({ required: true }) placeholder: string = '';
  @Input() fill: string = 'outline';
  @Input() disabled: boolean = false;
  @Input() type: string = 'text';
  @Input() autocapitalize: boolean = true;
  @Input() background: string = 'var(--cor-branca)';
  @Input() color: string = 'var(--cor-preta)';
  @Input() borderColor: string = 'var(--cor-preta)';
  @Input() labelPlacement: 'stacked' | 'floating' | '' = '';
  @Input() maxlength: number | null = null;

  value: any = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(value: any): void {
    this.value = value;
    this.onChange(value);
  }
}
