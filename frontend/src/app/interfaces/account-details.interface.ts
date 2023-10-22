import { BalanceChangeType } from "./balance-change-type.enum";

export interface AccountDetails {
    _id: string;
    confirmed_date: Date;
    order_id: string;
    order_code: string;
    transaction_type: BalanceChangeType;  // 1: Payment received, 2: Payment sent => Taken from the Enum Balanchangetype
    amount: number;
    balance: number;
}