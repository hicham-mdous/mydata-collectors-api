import { buildKnexConfig } from 'mdo-backend-tools';
import appSettings from './appSettings';

/**
 * Creating configuration for Knex library
 */
const knexConfig = buildKnexConfig(`${__dirname}/database`, appSettings);

export default knexConfig;
