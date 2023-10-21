import { Optional } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { BalanceChangeType } from './interfaces/balance-change-type.enum';

@Entity()
export class Account {
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

  @Optional()
  state: BalanceChangeType
}
