import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Account } from '../interfaces/account.interface';
import { environment } from 'src/environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch accounts correctly', () => {
    const dummyAccounts: Account[] = [
      {
        _id: '1',
        account_name: `Personal account 1`,
        category: 'Personal',
        tags: 'Something',
        balance: 20,
        available_balance: 18,
        details: []
      },
      {
        _id: '2',
        account_name: `Personal account 2`,
        category: 'Personal',
        tags: 'Something',
        balance: 30,
        available_balance: 20,
        details: []
      }
    ];

    service.getAccounts().subscribe(accounts => {
      expect(accounts.length).toBe(2);
      expect(accounts).toEqual(dummyAccounts);
    });

    const req = httpMock.expectOne(environment.API_URL + '/accounts');
    expect(req.request.method).toBe('GET');
    req.flush(dummyAccounts);
  });
});
