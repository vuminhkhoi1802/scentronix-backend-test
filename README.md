# Server Priority API

## Overview

The Server Priority API is a NestJS-based application that evaluates a list of web servers and returns the online server with the lowest priority. This project showcases the integration of various technologies including NestJS, TypeScript, Axios for HTTP requests, and ReDoc for API documentation.

## Features

- Evaluate a list of web servers to find the online server with the lowest priority using a GET request.
- Parallel HTTP requests with timeout handling.
- Comprehensive logging using NestJS Logger.
- Swagger integration for API documentation.
- Unit tests for services and controllers using Jest and Axios Mock Adapter.

## Tech Stack

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- **Axios**: A promise-based HTTP client for making HTTP requests.
- **Jest**: A delightful JavaScript testing framework with a focus on simplicity.
- **axios-mock-adapter**: Axios adapter for handling HTTP requests in tests.

## Project Structure
```markdown
src
├── controllers
│ ├── findServer.controller.ts
│ ├── findServer.controller.spec.ts
├── interfaces
│ ├── server.interface.ts
├── services
│ ├── findServer.service.ts
│ ├── findServer.service.spec.ts
├── app.module.ts
├── main.ts
|── app.controller.ts
|── app.service.ts
|── app.controller.spec.ts
```


## Getting Started

### Prerequisites

- Node.js (>= 16.x)
- npm (>= 8.x)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/vuminhkhoi1802/scentronix-backend-test.git
cd server-priority-app
```

2. Install the dependencies:
```bash
npm install

# To start the application, run:
npm run start
#Or
npm run start:dev

#The server will be running on http://localhost:4000 by default.
```

### Alternative Approach
Make sure you have `Docker` and `Docker Compose` installed on your machine.

- Using Docker:

```bash
# Build the Docker image
docker build -t scentronix-backend-test .

# Run the Docker container
docker run -p 4000:4000 scentronix-backend-test
````
- Using Docker Compose:

```bash
# Build the Docker image
docker compose build # or docker-compose build
# Run the Docker container
docker compose up # or docker-compose up
```

### API Documentation

- Swagger UI: `http://localhost:4000/api`

### Testing
```shell
curl --location 'http://localhost:4000/servers/find' \
--header 'accept: application/json' \
--header 'Content-Type: application/json' \
--data '[
  {
    "url": "https://does-not-work.perfume.new",
    "priority": 1
  },
  {
    "url": "https://gitlab.com",
    "priority": 4
  },
  {
    "url": "http://app.scnt.me",
    "priority": 3
  },
  {
    "url": "https://offline.scentronix.com",
    "priority": 2
  }
]
'
```
-> Result:
```json
{
  "url": "https://gitlab.com",
  "priority": 4
}
```

## Test Coverage
| File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
|----------------------------|---------|----------|---------|---------|-------------------|
| All files                  |   79.22 |      100 |   93.33 |   78.12 |                   |
| src                        |   44.82 |      100 |      75 |   39.13 |                   |
| app.controller.ts          |     100 |      100 |     100 |     100 |                   |
| app.module.ts              |       0 |      100 |     100 |       0 | 1-11              |
| app.service.ts             |     100 |      100 |     100 |     100 |                   |
| main.ts                    |       0 |      100 |       0 |       0 | 1-19              |
| src/controllers            |     100 |      100 |     100 |     100 |                   |
| findServer.controller.ts   |     100 |      100 |     100 |     100 |                   |
| src/interfaces             |     100 |      100 |     100 |     100 |                   |
| server.interface.ts        |     100 |      100 |     100 |     100 |                   |
| src/services               |     100 |      100 |     100 |     100 |                   |
| findServer.service.ts      |     100 |      100 |     100 |     100 |                   |


## Logic
### Service Layer
The FindServerService handles the core logic of the application:
- `checkServerStatus`: Sends an HTTP GET request to check if the server is online. If the response status is between 200-299, it is considered online.
- `findServer`:
  + Receives a list of servers and their priorities.
  + Checks the status of each server in parallel.
  + Filters out the offline servers.
  + Returns the online server with the lowest priority or throws an error if no servers are online.
  
### Controller Layer

The FindServerController handles incoming HTTP requests and delegates the logic to the FindServerService.

- `findServer`:
  + Accepts urls and priorities as query parameters.
  + Validate the incoming request body using Yup schema library.
  + Logs the incoming request.
  + Calls the service to find the server with the lowest priority.

### Unit Tests
Unit tests are written using Jest and axios-mock-adapter for mocking HTTP requests.

To run the tests, use:

```bash
npm run test:cov -> For Test Coverage report
```

### Test Structure
- Service Tests: Test the core logic of FindServerService.
- Controller Tests: Test the FindServerController to ensure it correctly processes input and handles service responses.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.
