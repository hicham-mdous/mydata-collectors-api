import { buildAppSettings } from 'mdo-backend-tools';

/**
 * Taking data from the .env file and building an object with application settings.
 * Basically, each env var name gets camelCased, also, .env file must have variables mentioned in the .env.example
 */
const appSettings = buildAppSettings({
  dirName: __dirname,
  envFile: '../.env',
  envFileExample: '../.env.example',
  defaultNodeEnv: 'development',
});

export default appSettings;
