interface Config {
   databaseSettings: {
      username: string,
      password: string,
      host: string,
      port: number,
      database: string
   };
   telegram_token: string,
   secret: string
}

let config: Config = {
   databaseSettings:  {
      username: 'username',
      password: 'password',
      host: 'host',
      port: 5432,
      database: 'database',
   },
   telegram_token: 'telegeam token',
   secret: 'token'
}

export default config;