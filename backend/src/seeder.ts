// seeder.ts
import { createConnection } from 'typeorm';
import { Account } from './accounts/account.entity';

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

  // Datos de ejemplo
  // @TODO: random BTC between 0 and, e.g. 40, with decimals and no truncation neither round
  const accounts = [
    { balance: 100, available_balance: 95, currency: 'BTC' },
    { balance: 200, available_balance: 190, currency: 'BTC' },
    // ... puedes agregar más datos de ejemplo aquí
  ];

  await accountRepository.save(accounts);

  console.log('Datos sembrados con éxito!');
  await connection.close();
}

seed().catch(error => console.error(error));