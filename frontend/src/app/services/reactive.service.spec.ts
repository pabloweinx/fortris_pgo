import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveService } from './reactive.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
class MockSocket {
  on(eventName: string, callback: any) {
    if (eventName === 'connect') {
      callback();
    }
  }
}

describe('ReactiveService', () => {
  let service: ReactiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReactiveService,
        { provide: MockSocket, useClass: MockSocket }
      ]
    });

    service = TestBed.inject(ReactiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
