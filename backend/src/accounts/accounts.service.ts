import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { BalanceChangeType } from '../interfaces/balance-change-type.enum';
import { BSON } from 'mongodb';
import { fakerEN as faker } from '@faker-js/faker';
import { AccountDetail } from './account-details.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>
  ) { }

  async findAll(): Promise<any> {
    return this.accountsRepository.find({});
  }

  async getAccountWithDetails(id: string): Promise<Account> {
    const _id = new BSON.ObjectId(id);
    return this.accountsRepository.findOne({ where: { _id } });
  }

  async randomlyUpdateAccountBalance(): Promise<Account> {
    const allAccountIds = await this.accountsRepository.find({ select: ['_id'] });

    if (!allAccountIds.length) {
      throw new Error("There are no accounts available");
    }

    const randomAccountId = allAccountIds[Math.floor(Math.random() * allAccountIds.length)]._id;
    const randomAccount = await this.accountsRepository.findOne({ where: { _id: randomAccountId } });

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

    // We calculate the state of the balance update, but will be populater later to prevent save it to the db 
    let state: BalanceChangeType;
    if (randomAccount.balance > oldBalance) {
      state = BalanceChangeType.INCREASED;
    } else if (randomAccount.balance < oldBalance) {
      state = BalanceChangeType.DECREASED;
    } else {
      state = BalanceChangeType.UNCHANGED;
    }

    // Create a new movement detail each time a balance update is generated
    const detail: AccountDetail = {
      confirmed_date: new Date(),
      order_id: faker.string.alphanumeric(6),
      order_code: faker.string.alphanumeric(6),
      transaction_type: state,
      amount: change,
      balance: randomAccount.balance // The new balance after the transaction.
    };

    if (randomAccount.details) {
      randomAccount.details.unshift(detail);
    } else {
      randomAccount.details = [detail];
    }

    await this.accountsRepository.save(randomAccount);

    // This is the previously-calculated state of the detail aka movement aka transaction
    randomAccount.state = state;
    return randomAccount;
  }

  async save(account: Account): Promise<Account> {
    return await this.accountsRepository.save(account);
  }
}