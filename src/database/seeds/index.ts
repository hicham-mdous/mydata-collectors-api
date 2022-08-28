import { seedRunner } from 'mdo-backend-tools';

import appSettings from '../../appSettings';
import knexHandle from '../../knexHandle';

import { filesToSeed } from './filesToSeed.json';
import { cleanTable } from './cleanTable.json';

const seedFiles: any = filesToSeed;

/**
 * Seeding runner - removes all records from the tables mentioned in the filesToSeed.json and then inserts new records again
 * @returns
 */
const seed = () => {
  // WIN: return seedRunner(`file://${__dirname.replace('/', '\\')}`, seedFiles, knexHandle, { ...appSettings, cleanTable });
  return seedRunner(__dirname, seedFiles, knexHandle, { ...appSettings, cleanTable });
};

export { seed };
