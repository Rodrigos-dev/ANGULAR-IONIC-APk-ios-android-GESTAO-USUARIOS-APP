import {
  Component,
  EventEmitter,
  inject,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
} from '@angular/core';
import { ModalService } from 'src/app/nativos/modalController';
import { ImageZoomComponent } from '../../component/image-zoom/image-zoom.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'custom-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SwiperComponent {
  private modalService = inject(ModalService);

  @Input({ required: true }) images: string[] = [];
  @Input() height: string = '220px';
  @Input() iconName: string = '';
  @Input() iconColor: string = 'var(--cor-branco)';
  @Input() iconHeight: string = '20px';
  @Input() disabledIconDelete: boolean = false;
  @Output() clickedIcon = new EventEmitter<any>();
  alt: string = '';
  src!: string;
  errorLoadImage: boolean = false;

  openZoom(imagem: string) {
    this.modalService.open(ImageZoomComponent, { images: [imagem] });
  }

  errorImage() {
    this.errorLoadImage = true;
  }

  iconClick(event: Event, image: string, index: number) {
    event.stopPropagation();
    this.clickedIcon.emit({ image, index });
  }
}
