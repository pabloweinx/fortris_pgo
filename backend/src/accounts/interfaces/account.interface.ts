export interface Account extends Document {
  account_name: string;
  category: string;
  tag: string;
  balance: number;
  available_balance: number;
}