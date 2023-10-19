import { Injectable } from '@nestjs/common';

@Injectable()
export class ExchangeRateService {
    calculateNewExchangeRate(): number {
        return Math.random() * (12000 - 5000) + 5000;
    }
}

