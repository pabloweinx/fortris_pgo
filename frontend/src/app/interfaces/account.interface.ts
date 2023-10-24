import { AccountDetails } from "./account-details.interface";
import { BalanceChangeType } from "./balance-change-type.enum";

export interface Account {
    _id: string,
    account_name: string;
    category: string;
    tags: string;
    balance: number;
    available_balance: number;
    balance_dollar?: number;
    available_balance_dollar?: number;
    state?: BalanceChangeType;
    details: AccountDetails[]
}