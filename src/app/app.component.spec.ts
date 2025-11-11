import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      //declarations: [AppComponent],
      imports: [
        IonicModule.forRoot(),
        AppComponent, // <-- Adicione o componente aqui, pois ele é standalone
      ],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct message from getMessage', () => {
    expect(component.getMessage()).toBe('Hello Jest!');
  });

  it('should add numbers correctly', () => {
    expect(component.add(2, 3)).toBe(5);
  });
});
