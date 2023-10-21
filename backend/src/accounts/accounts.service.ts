import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { BalanceChangeType } from './interfaces/balance-change-type.enum';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) { }

  async findAll(): Promise<Account[]> {
    return this.accountsRepository.find();
  }

  async randomlyUpdateAccountBalance(): Promise<Account> {
    const allAccountIds = await this.accountsRepository.find({ select: ['_id'] });

    if (!allAccountIds.length) {
      throw new Error("There are no accounts available");
    }

    const randomAccountId = allAccountIds[Math.floor(Math.random() * allAccountIds.length)]._id;
    const randomAccount = await this.accountsRepository.findOne({ where: {_id: randomAccountId}});

    if (!randomAccount) {
      throw new Error(`You could not get the account with ID: ${randomAccountId}`);
    }

    const oldBalance = randomAccount.balance;
    // random change between -20 and 20
    const change = (Math.random() < 0.5 ? -1 : 1) * Math.random() * 20;

    if (randomAccount.balance + change > 0) {
      randomAccount.balance += change;
    }
    else {
      randomAccount.balance = 0;
    }

    await this.accountsRepository.save(randomAccount);

    let state: BalanceChangeType;
    if (randomAccount.balance > oldBalance) {
      state = BalanceChangeType.INCREASED;
    } else if (randomAccount.balance < oldBalance) {
      state = BalanceChangeType.DECREASED;
    } else {
      state = BalanceChangeType.UNCHANGED;
    }
    randomAccount.state = state;

    console.debug(randomAccount);
    return randomAccount;
  }
}