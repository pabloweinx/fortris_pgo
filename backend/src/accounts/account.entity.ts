import { ObjectId } from 'mongodb';
import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Account {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  account_name: string;

  @Column()
  balance: number;

  @Column()
  available_balance: number;

  @Column()
  currency: string;
}
