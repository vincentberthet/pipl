# Pipl Analytics

## Setup Project

Run the following commands to install all dependencies and setup project:

```bash
make install
```

## Running the CLI Application

To run the CLI application, you will first need to build the project with the following command line:

```bash
make build
```

Then you can run the CLI using the following command:
```bash
./pipl-analytics
```

Note: You will need to rebuild the project every time you pull the code to update the command line application.

## Development mode

To run the services in development mode, run the following command:

```bash
make dev
```

Development mode will start the web application at the following address: `http://localhost:3000`, it will alos build the libraries in watch mode to rebuild them when code changes.

## Deployment

To deploy the application to AWS, run the following command:

```bash
make deploy
```