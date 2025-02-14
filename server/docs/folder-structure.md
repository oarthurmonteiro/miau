```
src/
├── application/
│   ├── auth/
│   └── users/
│   └── ...
├── domain/
│   └── user/
│   └── ...
├── infrastructure/
│   ├── prisma/
│   └── auth/
│   └── ...
├── routes/
│   └── ...
└── server.ts
```

## 📂 `src/`

This is the root folder of the project's source code.

## 📂 `application/` (Application Layer)

This layer contains use cases (Application Services).
Here, services orchestrate the application rules logic, call the repositories, entities and other necessary services.

💡 Role of the application layer:

- It does not contain complex business rules (these are in the domain).
- Orchestrates flows by calling repositories and entities.
- It does not depend on specific frameworks (the infrastructure takes care of that).

## 📂 `domain/` (Domain Layer)

This is the most important layer, as it defines what the entities are in each context in the system.
Here, we find the entities, aggregates and pure business rules.

💡 Role of the domain layer:

- Defines the essential rules of the business.
- It does not depend on databases, frameworks or external technologies.
- Contains entities and aggregates, protecting the invariant rules of the system.

## 📂 `infrastructure/` (Infrastructure Layer)

Here are concrete implementations of persistence, authentication, external services, etc.
This layer deals with specific frameworks and technologies.

💡 Role of the infrastructure layer:

- Implement technical details without polluting the domain.
- Connect the domain to the external world (database, external APIs, etc).
- Facilitate replacements: We can replace Prisma with another ORM without affecting the domain.

## 📂 `routes/` (Interface Layer / API)

Here are the API controllers, which expose the services via HTTP.
Each route receives the request, calls the application service, and returns a response.

💡 Role of the interface layer:

- Does not contain business rules (only calls application services).
- Converts HTTP requests to application commands.
- Returns the formatted response (JSON, HTTP error, etc).

## 📜 `server.ts`

This file configures the Hono server, registering the routes and starting the API.

💡 Role of server.ts

- Configure Hono and add routers.
- Defines global middlewares (e.g. logs, CORS, authentication).
- Starts the server on the desired port.
