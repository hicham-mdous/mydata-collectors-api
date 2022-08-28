# Email Microservice API

This is the project with all the functionality regarding sending emails.

## Quickstart

This is what you need to do to start the app locally in dev mode:

```
> npm install
# This one is done just once
> cp .env.example .env
# Now edit .env file specifying variables: local DB info and redis info if you need it to use
# Now let's start it
npm run dev
```

## Usage

### Development

```
> npm run dev
```

### Productions

```
# Building the source code, need to be done during deployment
> npm run build
# Starting the project
> npm run start
```

### Unit tests

At this moment there is no tests ready.

```
npm run test
```

### Production

```
npm start
```

### With Docker

You need to have Docker installed locally.

```
npm run docker
```

## Project structure

The project has the following structure (it is a folder structure as well):

- `app` - this is the layer where the BE receives requests from outside world
- `app/graphql` - this is the app's layer that receives GraphQL queries and mutations
- `app/graphql/types` - GraphQL types are defined in this folder. Each entity should be in its own file
- `app/graphql/resolvers` - GraphQL resolvers are defined here. All queries and mutations regarding one entity should be in its own file
- `boundary` - this is were all our interfaces between layers are stored along with constansts used accross the project
- `core` - Business logic files are implemented in this folder. Business logic operates with input data verification and validation, work with gateways (db, etc). For each entity create its own file with all the CRUD operations. Then add the file into local `/src/core/index.ts` file
- `core/validators` - files with validations functions. One file per each `core` file
- `gateways` - classes that work with database (in this case) or 3rd party API should be implemented in this folder. One file per entity with implementation all CRUD operations. If you need to write a query to db that works with several tables create a separate file and write methods there. Then add the file into local `src/gateways/index.ts` file
- `utils` - these are utils that will be moved to a npm package later but at this moment this is helpers that used in app, core and gateways.

## Common GraphQL types you should use

### Result

Location: `app/graphql/types/result.js`

This is the type that must be used (implemented) for every query and mutation when returning data to the client. Here is what basically it send to the client on each response:

```
{
  code: 0, // 0 - OK, <0 - error
  data: [{ id: 1, etc: '' }], // the `data` should be always an array no matter what
  errors: [
    {
      name: 'form-field',
      messages: ['Form field related error message']
    },
    {
      name: '',
      messages: ['If name is empty here it means this is a generic error not related to any of form fields']
    },
  ]
}
```

### Pagination and sorting

Location: `app/graphql/types/paginationAndSotring.js`

This is the type that must be used for all queries that return and array of data to specify how many records to return, page number and sorting

## Naming convenctions

### File names

All the files you create should comply with the following naming convenctions:

- files that have class implementation must be in PascalCase; One class per file;
- files that export functions or variables should be in camelCase; Can be many functions or constants definitions per file;
- files that represent GrapQL types definitions must be located in the `src/app/graphql/types` folder and must have suffix `Types`;
- files that represent GrapQL resolvers must be located in the `src/app/graphql/resolvers` folder and must have suffix `Resolvers`;
- files that represent business logic should be located in the `src/core` folder and must have suffix `Core`;
- files that represent a gateway shoul be located in the `src/gateways` folder and myst have suffix `Gw`;

### Class names, variables, constants

- each class name be in PascalCase. It must match the name of the file;
- variables must be in camelCase;
- constants and enums that are defined in the `src/boundary` folder must be in upper case format like `SOME_TYPES`;

### GraphQL types names, queries and mutations

- all types names must be in PascalCase
- input types with mutation data must have `Input` suffix
- input types that are used in queries that return list of records must have `Filter` suffix
- input types that are used in mutations to define what to update must have `Where` suffix
- types that are returned by any query or mutation must implement `Result` interface and must have `Result` suffix

## Developement Guidelines

This is the guidelines you need to use not only when developing but also when code reviewing.

In order to create a new functionality you will need to:

- create a GraphQL types file in the `app/graphql/types` folder.
- create a resolver file in the `app/graphql/resolvers` folder. In this file you need to have link to GraphQL queries and mutations to implementations in the `core` file. Most likely the file does not exist at this moment. So you need to return here later.
- create a core file in the `core` folder. This file must have suffix `Core` and also must be referenced in the `core/index.ts` file. The core needs validators (optionally) and gateways, so you will return to the file as soon as they are ready. At this time just create class with all methods you need (list, get, create, etc) to implemented require API methods. Now they are just empty functions. Look for example in the `core/EmailMicroserviceCore.ts`.
- create validators in the `src/core/validators` folder. One validator file per one `core` but it can have multiple validators inside. The `checkit` should be used to do incoming data validation and gateways to do some checks in the database if needed.
- create one or several gateways in the `src/gateways` folder. The basic rule is one file per each DB table or 3rd part API. If you need to work with several tables create a dedicated gateway file for the purpose. Each gateway must have the `Gw` suffix and be referenced in the `src/gateways/index.ts` file. Please note that at this level we use caching. When listing data we run SQL query to get a list of `id`s and then use data loader function to read data from the database by these `id`s. When creating, updating and removing data please do not forget to call `this.loader.clear()` method to clear cache for the record.
- come back to the `core` you have created to finish implementation,
- come back to the `app` files you created earlier to fill missing pieces.
- create sample GraphQL queries in the `sampleQueries` folder. Look at how it is organized and follow the pattern.

I highly recommend to reference Knex manual when working on your gateways: [Knex Query Builder](http://knexjs.org/#Builder). Note that we have our wrapper around it which is located in the `utils/database.js` file. Keep the link handy at all times until you know everything by heart :)

As for caching, we use our wrapper around `dataloader` (https://www.npmjs.com/package/dataloader) and `redis-dataloader` (https://www.npmjs.com/package/redis-dataloader) libraries and it is located in the `utils/cache.js` file.

## User authorization

The service is expected to work with user information and restrict access to the data from unauthorized users as well as do not let users of one organization to query data from another organization.

The application needs the following information about user at most times:

- userId - user ID fromt the `user` table.
- orgId - organization ID from the `user` table and it is reference to the `organization` table.
- roleId - user's role ID - reference to the `role` table.
- email - user's email, comes fromt the Auth0 and also in our database.
- name - user's name, comes from the Auth0.

All the information comes from the `foundation` service in the form of JWT token.

In order to work with GraphQL playground locally you need to get the token and use it in the query headers.

### How it works

Here is how the user authorization works in the whole application including frontend and all backend services

- users go to the application
- they get redirected to Auth0 website for entering login/password
- they get redirected back to the application
- the application requests bearer token from the Auth0
- the application sends userSignIn GraphQL mutation request with this token to the foundation service via gateway
- the foundation service uses the Auth0 token to request user information from the Auth0 service: `https://<auth0Domain>/userinfo` where `auth0Domain` comes from the `.env` file and the `AUTH0_DOMAIN` variable.
- in response it gets user's email
- then it searches our database for a user by email address
- then it creates a JWT token with the userId, orgId, roleId, email, name and expiration time data and signs it with secret key taken from the `TOKEN_SECRET` variable in the `.env` file. IMPORTANT: the secret must be the same in the configuration of all services (foundation, reports, etc).
- the frontend app receives the generated token and saves it in the `localStorage` under the name `__t`
- each time the frontend applciation does request to the backend servces it sends the token in the `authorization` header of HTTP request
- each backend service gets this token and verifies it. After verification we get the user information and then sets it to the all cores and gateways which in turn must use this in the queries.

### How to get JWT token and use it in the GraphQL playground locally

- open myp2 application in DEV environment: https://myp2_dev.mydigitaloffice.com/
- authorize
- when you are back in the app open Dev Tools and in the `localStorage` locate an item called `__t`. Copy its value.
- go the local GraphQL playground (http://api.local.myperspective.io:3999/graphql - if you have gateway running, and http://api.local.myperspective.io:4001/graphql - just for reports service)
- click on the "HTTP HEADERS" title in the bottom left corner and paste this:

```
{
  "authorization": "here-comes-the-token-you-copied-from-the-frontend-app"
}
```

Now you are good to run your queries.

## GraphQL types creation

Guidelines for GraphQL types to be provided.

## Resolvers guidelines

Guidelines for GraphQL Resolvers to be provided.

## Core guidelines

Guidelines for Core classes to be provided.

## Gateway guidelines

Guidelines for Gateway classes to be provided.

## Libraries, Frameworks & Tools

- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Knex.js](http://knexjs.org/#Builder)
- [GraphQL](https://graphql.org/)
- [Redis](https://redis.io/download)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Docker](https://www.docker.com/)
