import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountDetail } from './account-details.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from './account.entity';

describe('AccountsController', () => {
  let controller: AccountsController;
  let mockAccountsService = {
    getAccountWithDetails: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        { provide: AccountsService, useValue: mockAccountsService },
        { provide: getRepositoryToken(AccountDetail), useValue: {} }
      ]
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an account for a given id', async () => {
    const accountId = 'someId';
    const mockAccount = new Account();
    mockAccountsService.getAccountWithDetails.mockResolvedValue(mockAccount);

    expect(await controller.getAccount(accountId)).toBe(mockAccount);
    expect(mockAccountsService.getAccountWithDetails).toHaveBeenCalledWith(accountId);
  });
});
