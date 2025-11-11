import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-input-select',
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectComponent),
      multi: true,
    },
  ],
})
export class InputSelectComponent {
  @Input() value: any = null; // Inicializado como null (sem seleção)
  @Input() options: SelectOption[] = []; // O Array de opções
  @Input() placeholder: string = 'Selecione uma opção'; // Texto do placeholder
  @Input() name: string = ''; // O atributo 'name' para o formulário
  @Input() multiple: boolean = false;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  isDisabled: boolean = false;

  // Funções placeholder do CVA
  onChange = (_: any) => {};
  onTouched = () => {};

  // 1. Recebe o valor do FormGroup (preenche o input)
  writeValue(value: any): void {
    // Garante que o valor interno é atualizado
    this.value = value;
  }

  // 2. Registra a função que será chamada no FormGroup quando o valor interno mudar
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // 3. Registra a função que marca o controle como 'touched'
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // 4. Habilita/desabilita o controle
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(valueDigited: any): void {
    const newValue = valueDigited;
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}
