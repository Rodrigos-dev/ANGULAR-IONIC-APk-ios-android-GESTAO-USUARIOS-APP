import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule, IonInput } from '@ionic/angular';
import { maskUtils } from 'src/app/shareds/utils/masks';
import { maskSafeUtils } from 'src/app/shareds/utils/masks-safe';

type CustomMaskType = 'cpfCnpj' | 'telephone' | 'postalCode' | 'none';

@Component({
  selector: 'custom-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, IonicModule, CommonModule],
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @ViewChild(IonInput, { static: false }) ionInput?: IonInput;
  @Input() name: string = '';
  @Input() description: string = '';
  @Input({ required: true }) placeholder: string = '';
  @Input() fill: string = 'outline';
  @Input() disabledString: string = 'false';
  @Input() type: string = 'text';
  @Input() startButtonIcon: string = '';
  @Input() endButtonIcon: string = '';
  @Input() autocapitalize: boolean = true;
  @Input() clearInput: boolean = false;
  @Input() background: string = 'var(--cor-branco)';
  @Input() color: string = 'var(--cor-preto)';
  @Input() borderColor: string = 'var(--cor-preto)';
  @Input() labelPlacement: 'stacked' | 'floating' | '' = '';
  @Input() maxlength: number | null = null;
  @Input() noteColor: string = 'var(--cor-verde-medio)';
  @Input() noteText: string | null = null;
  @Input() showConter: boolean = true;
  @Output() inputChanged = new EventEmitter<string>();
  @Input() isSensitive: boolean = false;

  @Input() maskType: CustomMaskType = 'none';

  value: any = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  disabled = !!this.disabledString;
  shouldHideValue: boolean = false;
  internalUnmaskedValue: string = '';

  ngOnInit(): void {
    if (this.isSensitive) {
      this.shouldHideValue = true;
    }
  }

  toggleVisibility(): void {
    this.shouldHideValue = !this.shouldHideValue;

    const fullyMaskedValue = this.applyMask(this.internalUnmaskedValue);
    this.value = this.getDisplayValue(
      fullyMaskedValue,
      this.internalUnmaskedValue
    );
  }

  writeValue(value: any): void {
    if (value) {
      // 1. Limpa e armazena o valor para uso interno
      const unmasked = maskUtils.unmask(value);
      this.internalUnmaskedValue = unmasked;

      // 2. Define o valor de exibição com base no estado (escondido ou não)
      this.value = this.getDisplayValue(value, unmasked);
    } else {
      this.value = '';
      this.internalUnmaskedValue = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private applyMask(value: string): string {
    if (!value) return '';

    const unmasked = maskUtils.unmask(value);

    switch (this.maskType) {
      case 'cpfCnpj':
        // Lógica de escolha de CPF ou CNPJ baseada no tamanho
        if (unmasked.length <= 11) {
          return maskUtils.maskCpf(unmasked);
        }
        return maskUtils.maskCnpj(unmasked);

      case 'telephone':
        return maskUtils.maskTelephone(unmasked);

      case 'postalCode':
        return maskUtils.maskPostalCode(unmasked);

      case 'none':
      default:
        // Para inputs comuns (email, nome), retorna o valor bruto
        return value;
    }
  }

  private generatePartialMask(unmaskedValue: string): string {
    // Lógica de escolha de CPF ou CNPJ baseada no tamanho
    if (unmaskedValue.length <= 11) {
      return maskSafeUtils.maskCpfSafe(unmaskedValue);
    }
    return maskSafeUtils.maskCnpjSafe(unmaskedValue);
  }

  private getDisplayValue(rawValue: string, unmaskedValue: string): string {
    if (this.isSensitive && this.shouldHideValue) {
      return this.generatePartialMask(unmaskedValue);
    }

    return this.applyMask(rawValue);
  }

  onInputChange(valueDigited: any): void {
    const rawValue = valueDigited;

    // Se não tiver máscara, apenas passa o valor bruto e encerra
    if (this.maskType === 'none') {
      this.value = rawValue;
      this.onChange(rawValue);
      this.inputChanged.emit(rawValue);
      this.onTouched();
      return;
    }

    // 1. Limpa o valor (para enviar ao ngModel)
    const unmasked = maskUtils.unmask(rawValue);
    this.internalUnmaskedValue = unmasked; // Atualiza o valor limpo interno

    // 2. Aplica a máscara para exibição (respeitando o toggle)
    // O rawValue aqui é o valor que o usuário está digitando (com pontuação que ele acabou de digitar)
    const maskedValue = this.getDisplayValue(rawValue, unmasked);

    // 3. Atualiza o valor de EXIBIÇÃO
    this.value = maskedValue;

    // 4. Notifica o Angular/Formulário APENAS com o valor LIMPO
    this.onChange(unmasked);

    // 5. Emite seu evento personalizado
    this.inputChanged.emit(unmasked);
    this.onTouched();
  }

  focus() {
    setTimeout(() => {
      this.ionInput?.setFocus();
    });
  }
}
