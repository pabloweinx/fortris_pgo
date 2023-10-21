import { BalanceChangeType } from "./balance-change-type.enum";

export interface Account {
    _id: any, // @TODO: type this!
    account_name: string;
    category: string;
    tag: string;
    balance: number;
    available_balance: number;
    state?: BalanceChangeType
}