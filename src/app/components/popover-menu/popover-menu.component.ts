import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  IonPopover,
  IonList,
  IonItem,
  IonIcon,
} from '@ionic/angular/standalone';

export interface PopoverMenuItem {
  label?: string;
  name?: string;
  icon?: string;
  color?: string;
  route?: string;
  style?: { [key: string]: string };
  action?: () => void;
}

@Component({
  selector: 'app-popover-menu',
  standalone: true,
  imports: [IonIcon, IonItem, IonList, IonPopover, CommonModule],
  templateUrl: './popover-menu.component.html',
  styleUrls: ['./popover-menu.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PopoverMenuComponent {
  /** Controla abertura e evento do popover */
  @Input() isOpen = false;
  @Input() event!: Event;

  /** Lista de itens do menu */
  @Input() items: PopoverMenuItem[] = [];

  /** Evento disparado ao fechar o popover */
  @Output() closed = new EventEmitter<void>();

  /** Evento disparado ao navegar */
  @Output() selected = new EventEmitter<PopoverMenuItem>();

  /** Fecha o popover */
  closeMenu() {
    this.closed.emit();
  }

  /** Executa ação e fecha */
  onSelect(item: PopoverMenuItem) {
    if (item.action) item.action();
    this.selected.emit(item);
    this.closeMenu();
  }
}
