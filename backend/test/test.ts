import { UserProfile } from '../src/users-profile/entities/user-profile.entity';
import { User } from '../src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import { newDb } from 'pg-mem';

/*const testingFunc = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    username: 'postgres',
    password: 'postgres',
    entities: [User, UserProfile],
  });

  await dataSource.initialize();
  await dataSource.synchronize();

  const repo = dataSource.getRepository(UserProfile);

  const profiles = JSON.parse(
    fs.readFileSync(`${__dirname}/__fixtures__/usersProfiles.json`, 'utf-8'),
  );

  await repo.save(profiles);

  return repo.find();
};*/

const testingFuncPGmem = async () => {
  const db = newDb({ autoCreateForeignKeyIndices: true });

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });

  db.public.registerFunction({
    name: 'version',
    implementation: () =>
      'PostgreSQL 15.2, compiled by Visual C++ build 1914, 64-bit',
  });

  const dataSource: DataSource = await db.adapters.createTypeormConnection({
    type: 'postgres',
    username: 'postgres',
    password: 'postgres',
    entities: [User, UserProfile],
  });

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  await dataSource.initialize();
  await dataSource.synchronize();

  const repo = dataSource.getRepository(UserProfile);

  const profiles = JSON.parse(
    fs.readFileSync(`${__dirname}/__fixtures__/usersProfiles.json`, 'utf-8'),
  );

  const entity = repo.create(profiles);
  await repo.save(entity);

  return repo.find();
};

testingFuncPGmem().then((result) => console.log(result));
