## What is this

A centralized service for my personal projects that require a service to either hide the api/auth tokens or require storage due to api limitations from third party api keys

## Database

MongoDB currently provides database storage option for the service - future implementations may include PostgreSQL if it is necessary but for now Mongo is the sole db provider. A list of collections for the mongo database can be found in Collections.ts

## Development

Run npm run start and package.json will automatically run tsc and run from index.js after typescript is compiled. Env variable needs to be added with NODE_ENV set to "development"

A development secret key (which is just a random string) is hard coded in authService and is not the same as the secret key that will be used by the service

## Things to do

Figure out how to get it to production mode and deploying it
