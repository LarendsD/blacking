import { DataSource } from 'typeorm';
import getDataSourceConfig from './common/config/database.config';

export const dataSource = new DataSource(getDataSourceConfig());
