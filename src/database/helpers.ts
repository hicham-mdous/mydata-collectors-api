import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { pick } from 'lodash';

/**
 * In this file you can add standard field names, functions that add standard fields and other helpers to simplify DB tables creation in migrations
 */

export const FIELDS = {
  ID: 'id',
  APP_ID: 'app_id',
  DISPLAY_NAME: 'display_name',
  ORG_ID: 'org_id',
  ROLE_ID: 'role_id',
  USER_ID: 'user_id',
  DESCRIPTION: 'description',
  STATUS_ID: 'status_id',
};

export const STATUSES = {
  DISABLED: 0,
  ACTIVE: 100,
  REMOVED: 1000000,
};

export const createSeedsFromCsv = (args) => {
  const { fileName, pickFields } = args || {};

  const csvData = fs.readFileSync(fileName, { encoding: 'utf8', flag: 'r' });

  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });

  const items = records.map((record) => ({
    ...pick(record, pickFields),
  }));

  return items;
};
