# Sequelize Migrations Guide

This document provides instructions for creating, running, and managing database migrations in your project using Sequelize CLI.

---

## Prerequisites

Before working with migrations, make sure you have the following installed:

1. **Node.js**: Ensure that Node.js is installed on your system.
2. **Sequelize CLI**: Ensure Sequelize CLI is installed globally or locally in your project.

To install Sequelize CLI globally, run:

```bash
npm install -g sequelize-cli
```

If you are using a local installation, refer to `npx` in all Sequelize CLI commands.

---

## Migration Workflow

### 1. Create a New Migration

To create a new migration file, use the following command:

```bash
npm run migration:create --name <migration_name>
```

Replace `<migration_name>` with a meaningful name for your migration (e.g., `add-users-table`).

---

### 2. Write the Migration

Navigate to the newly created migration file in the `src/database/migrations` directory. Define the changes you want to make to the database.

For example, a migration to add a `users` table might look like this:

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
```

---

### 3. Run Migrations

To apply migrations and update the database schema, run:

```bash
npm run migrate
```

This command executes all pending migrations in the order they were created.

---

### 4. Check Migration Status

To see the status of migrations (which migrations have been applied), run:

```bash
npm run migrate:status
```

---

### 5. Undo the Last Migration

If you need to revert the most recent migration, use:

```bash
npm run migrate:undo
```

---

### 6. Undo All Migrations

To revert all migrations and return the database to its initial state, use:

```bash
npm run migrate:undo:all
```

---

### 7. Run Specific Migrations

To run migrations up to a specific migration, use:

```bash
npm run migrate:to -- <migration_name>
```

To undo migrations down to a specific migration, use:

```bash
npm run migrate:undo:to -- <migration_name>
```

Replace `<migration_name>` with the name of the migration file.

---

## Seeders

In addition to migrations, seeders can be used to populate the database with initial or test data

### 1. Run Seeders

To run all seeders, use:

```bash
npm run seed
```

### 2. Undo Seeders

To undo all seeders, use:

```bash
npm run seed:undo
```

---

## Notes

- Ensure that your `.env` file contains the correct database connection settings before running migrations or seeders.
- Always back up your database before performing operations that modify the schema or data.

---

Happy coding!
