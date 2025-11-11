import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'custom-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class ToggleComponent {
  @Output() toggled = new EventEmitter<boolean>();

  onToggleChange(event: CustomEvent<{ checked: boolean }>) {
    this.toggled.emit(event.detail.checked);
  }
}
