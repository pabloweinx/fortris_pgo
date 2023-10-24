import { createConnection } from 'typeorm';
import { Account } from './src/accounts/account.entity';
import { fakerEN as faker } from '@faker-js/faker';

async function seed() {
  const connection = await createConnection({
    type: 'mongodb',
    host: '127.0.0.1',
    port: 27017,
    database: 'fortris_pgo',
    entities: [Account],
    synchronize: true,
  });

  const accountRepository = connection.getMongoRepository(Account);

  const generateRandomAccountDetails = () => {
    const detailsCount = Math.floor(Math.random() * 15) + 1;
    const details = [];

    for (let i = 0; i < detailsCount; i++) {
      details.push({
        confirmed_date: faker.date.past().toISOString(),
        order_id: faker.string.alphanumeric(6),
        order_code: faker.string.alphanumeric(6),
        transaction_type: Math.random() > 0.5 ? 1 : 2,
        amount: +(Math.random() * 20),
        balance: +(Math.random() * 20),
      });
    }

    return details;
  };

  const accounts = [];

  for (let i = 0; i < 20; i++) {
    const account = {
      account_name: `Personal account ${i + 1}`,
      category: faker.helpers.arrayElement(['Personal', 'Business', 'Savings', 'Joint']),
      tags: faker.word.sample(5),
      balance: +(Math.random() * 20),
      available_balance: +(Math.random() * 20),
      details: generateRandomAccountDetails(),
    };

    accounts.push(account);
  }

  await accountRepository.save(accounts);

  console.log('Data seeded successfuly!');
  await connection.close();
}

seed().catch(error => console.error(error));