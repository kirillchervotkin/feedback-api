import { DataSource } from 'typeorm';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import { dataBaseConstants } from './database.constants';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: "postgres",
        host: dataBaseConstants.host,
        port: dataBaseConstants.port,
        username: dataBaseConstants.username,
        password: dataBaseConstants.password,
        database: dataBaseConstants.username,
        entities: [Feedback],
        synchronize: true,
    });
      return dataSource.initialize();
    },
  },
];