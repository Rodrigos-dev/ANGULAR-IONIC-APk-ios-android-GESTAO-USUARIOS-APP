import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'custom-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ButtonComponent {
  @Input() title: string = '';
  @Input() fill: 'default' | 'clear' | 'solid' | 'outline' = 'default';
  @Input() shape: 'undefined' | 'round' = 'undefined';
  @Input() size: 'default' | 'small' | 'large' = 'default';
  @Input() type: 'reset' | 'button' | 'submit' = 'button';
  @Input() iconOnlyName: string = '';
  @Input() startIconName: string = '';
  @Input() endIconName: string = '';
  @Input() backgroundColor: string = '';
  @Input() fontColor: string = 'darkslateblue';
  @Input() disabled: boolean = false;
  @Input() strong: boolean = false;
  @Input() mode: 'md' | 'ios' = 'md';
  @Input() fontSize: string = '14px';
  @Input() expand: 'block' | 'full' | '' = '';
  @Input() width: string = '';
  @Input() borderColor: string = '';
  @Input() loading: boolean = false;

  @Output() buttonClick = new EventEmitter<any>();

  click() {
    this.buttonClick.emit();
  }
}
