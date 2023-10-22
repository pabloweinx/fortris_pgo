import { ObjectId } from 'mongodb';
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { BalanceChangeType } from '../interfaces/balance-change-type.enum';
import { AccountDetail } from './account-details.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Account {
  @Expose()
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  account_name: string;

  @Column()
  category: string;

  @Column()
  tags: string;

  @Column()
  balance: number;

  @Column()
  available_balance: number;

  @Exclude()
  @Column(type => AccountDetail)
  details: AccountDetail[];
  
  // Don't want to be stored in the db
  state: BalanceChangeType;

}
