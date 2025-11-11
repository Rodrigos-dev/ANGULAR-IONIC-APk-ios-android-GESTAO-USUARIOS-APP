import { Storage } from './storage.service';
import { TestBed } from '@angular/core/testing';

describe('Storage', () => {
  let service: Storage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Storage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
