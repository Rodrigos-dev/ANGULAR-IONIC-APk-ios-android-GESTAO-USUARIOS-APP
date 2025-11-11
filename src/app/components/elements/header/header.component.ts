import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'custom-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showActionButton: boolean = false;
  @Input() iconName: string = 'information-circle-outline';
  @Input() iconColor: string = 'var(--cor-preto)';
  @Input() disableIcon: boolean = false;
  @Output() back = new EventEmitter<void>();
  @Output() icon = new EventEmitter<void>();

  emitBack() {
    this.back.emit();
  }

  emitIcon() {
    this.icon.emit();
  }
}
