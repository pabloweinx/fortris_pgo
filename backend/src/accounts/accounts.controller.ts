import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from './account.entity';
import { ObjectId } from 'mongodb';
import { AccountDetail } from './account-details.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    @InjectRepository(AccountDetail) private readonly accountDetailRepository: Repository<AccountDetail>
  ) { }

  @Get()
  findAll(): Promise<Account[]> {
    return this.accountsService.findAll();
  }

  @Get(':id')
  async getAccount(@Param('id') id: string): Promise<Account> {
    return this.accountsService.getAccountWithDetails(id);
  }

  @Post()
  async createAccountWithDetails(@Body() accountData: Account): Promise<Account> {
    return await this.accountsService.save(accountData);
  }

}
