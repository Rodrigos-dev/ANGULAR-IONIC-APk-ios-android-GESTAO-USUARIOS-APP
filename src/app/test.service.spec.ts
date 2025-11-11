import { TestService } from './test.service';

describe('TestService', () => {
  let service: TestService;

  beforeEach(() => {
    service = new TestService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return message', () => {
    expect(service.getMessage()).toBe('Hello Jest!');
  });

  it('should add numbers', () => {
    expect(service.add(2, 3)).toBe(5);
  });
});
