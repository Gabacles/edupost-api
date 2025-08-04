# EduPost API

The **EduPost API** is a backend service built with **NestJS** that provides user authentication, profile management, and post publishing functionalities. The API uses **JWT Authentication** and role validations to protect sensitive routes.

## Architecture

The project follows a modular architecture with three main modules:

1. **Auth**: Responsible for user authentication.
   - **Login**: Route for user authentication.
   - **Register**: Route for new user registration.

2. **User**: Responsible for user management, including CRUD operations.
   - **Create**: Creates a new user.
   - **Read**: Retrieves a specific user.
   - **Update**: Updates an existing user.
   - **Delete**: Removes a user.
   - **List**: Lists all users.

3. **Post**: Responsible for post-related operations.
   - **Post CRUD**: Create, read, update, and delete posts.
   - **Search**: Route to search for posts based on a query string.
   - **Role Validation**: Some post routes have additional role validation, allowing only users with specific permissions to access them.

## Technologies

- **NestJS**: Main framework for building the API.
- **Passport**: Used to implement JWT-based authentication.
- **bcryptjs**: Used for encrypting user passwords.
- **typeorm**: ORM for interacting with the PostgreSQL database.
- **pg**: PostgreSQL driver.
- **Jest**: Unit testing framework.

## Initial Setup

1. Install dependencies:

```bash
$ npm install
```

2. Create a .env file from the .env.example file:

```bash
$ cp .env.example .env
```

3. Fill in the environment variables as needed (Database, JWT Secret, etc.).

4. To run the application, execute the following command:

```bash
# development
$ npm run start:dev

# watch mode
$ npm run start:debug

# production mode
$ npm run start:prod
```
This will start the API on port 3000 by default.

## Database
The project uses PostgreSQL with Docker for data persistence. You can run a PostgreSQL instance with the following command:

```bash
$ docker run --name edupost-db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=edupost -p 5432:5432 -d postgres
```
This creates a database named edupost and makes it available on port 5432.

## Directory Structure
```bash
src/
|-- auth/            # Authentication module
|-- user/            # User module
|-- post/            # Post module
|-- common/          # Common utilities and files
|-- main.ts          # Application entry point
```

## APIs
[Access the Swagger documentation](https://edupost-latest.onrender.com/swagger)

## Role Validation
Some Post routes require the user to have the appropriate role. This is enforced using custom Guards along with Passport.

## Example of Role Guard Usage
If a post requires a specific role, the Guard will check if the authenticated user has the necessary role to access the route. Otherwise, it will return a 403 (Forbidden) error.

## Running Tests
The project's tests are executed with Jest. To run the tests, simply execute the following command:

```bash
$ npm run test
```