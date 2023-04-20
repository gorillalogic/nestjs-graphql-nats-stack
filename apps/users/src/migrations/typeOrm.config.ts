import { DataSource, DataSourceOptions } from 'typeorm';
import { migrationsConfig } from '../config/configuration';

console.log(process.env);

export default new DataSource(migrationsConfig());