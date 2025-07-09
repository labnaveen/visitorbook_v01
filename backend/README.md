# README

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for?

- Quick summary
- Version
  1.1
- [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up?

- Summary of set up
- Configuration
- Dependencies
  1. Run "npm install" command, it will install all dependency of your project.
- Database configuration
  1. Change Database credentials in pm2.config.json and ./config/config.json files.
  2. Run "npx sequelize-cli db:migrate" for run migrations.
  3. Run "npx sequelize-cli db:seed:all" for run the seeders.
- How to run
  1. Run command "pm2 start pm2.config.json --env local". You can change your env name according your need.
- Deployment instructions

### Contribution guidelines

- Writing tests
- Code review
- Other guidelines

### Who do I talk to?

- Repo owner or admin
- Other community or team contact

### Some importent commands for migrations and seeders.

1. If you do not intalled sequelize-cli, run the command "npm install --save-dev sequelize-cli".
2. Create a file called .sequelizerc on the root ... and add below code inside the file and remove the <!---->:
<!-- 'use strict';
const path = require('path');
module.exports = {
    'config': path.resolve('config','config.json'),
    'models-path': path.resolve('src','models'),
    'migrations-path': path.resolve('database','migrations'),
    'seeders-path': path.resolve('database','seeders')
} -->
3. This command will generate below files/folders for migrations and seeders purpose "npx sequelize-cli init":
   1. config, contains config file, which tells CLI how to connect with database.
   2. models, contains all models for your project.
   3. migrations, contains all migration files.
   4. seeders, contains all seed files.
4. This command will generate your migration file "npx sequelize-cli migration:generate --name <migration-name>".
5. This command will generate your seeder file "npx sequelize-cli seed:generate --name <seeder-name>".
6. Run "npx sequelize-cli db:migrate --env database1" for run migrations in main database and run "npx sequelize-cli db:migrate --env database2" for run migrations in archive database.
7. Run "npx sequelize-cli db:seed:all" for run the seeders.
