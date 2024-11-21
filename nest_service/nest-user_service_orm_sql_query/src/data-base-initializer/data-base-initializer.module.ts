import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DataSource, DataSourceOptions } from 'typeorm';

@Module({})
export class DataBaseInitializerModule {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const DBName = this.configService.get<string>('DB_NAME');
  
    const dataSource = new DataSource({
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
    } as DataSourceOptions);
  
    await dataSource.initialize();
  
    const result = await dataSource.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DBName}';`
    );
  
    if (result.length === 0) {
      await dataSource.query(`CREATE DATABASE "${DBName}" WITH ENCODING 'UTF8';`);
      console.log(`Database "${DBName}" created successfully.`);
    } else {
      console.log(`Database "${DBName}" already exists.`);
    }
  
    await dataSource.destroy();
  }
  
}
