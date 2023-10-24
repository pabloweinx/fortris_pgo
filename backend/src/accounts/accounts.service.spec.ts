import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { BSON } from 'mongodb';

describe('AccountsService', () => {
  let service: AccountsService;
  let mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        { provide: getRepositoryToken(Account), useValue: mockRepository }
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an account with details for a given id', async () => {
    const accountId = '5f50c31f2f6b1a24f83efb90';
    const mockAccount = new Account();
    mockRepository.findOne.mockResolvedValue(mockAccount);

    expect(await service.getAccountWithDetails(accountId)).toBe(mockAccount);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { _id: new BSON.ObjectId(accountId) } });
  });
});
