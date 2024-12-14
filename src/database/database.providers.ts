import { DataSource } from 'typeorm';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import config from 'src/config'; 

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: "postgres",
        host: config.databaseSettings.host,
        port: config.databaseSettings.port,
        username: config.databaseSettings.username,
        password: config.databaseSettings.password,
        database: config.databaseSettings.database,
        entities: [Feedback],
        synchronize: false  
    });
      return dataSource.initialize();
    },
  },
];