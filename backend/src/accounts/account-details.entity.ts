import { Expose } from 'class-transformer';
import {
  PrimaryGeneratedColumn,
  Column,
  ObjectId,
} from 'typeorm';

export class AccountDetail {

  @Column('timestamp')
  confirmed_date: Date;

  @Column({ type: 'varchar'/* , length: 6, unique: true */ })
  order_id: string;

  @Column({ length: 6/*,  unique: true */ })
  order_code: string;

  @Column('int')
  transaction_type: number;  // 1: Payment received, 2: Payment sent => Taken from the Enum Balanchangetype

  @Column('float')
  amount: number;

  @Column('float')
  balance: number;
}
