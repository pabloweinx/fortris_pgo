import { Controller, Get } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from './account.entity';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll(): Promise<Account[]> {
    return this.accountsService.findAll();
  }
}
