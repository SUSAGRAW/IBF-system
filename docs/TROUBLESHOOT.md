## Description

This guide is giving some additional tips for troubleshooting when setting up the IBF-system. However, start with the main [README](../README.md) file.

### Expected behaviour after 
To check if everything starts up correctly:
- All containers mentioned in the docker-compose file /IBF-system/docker-compose.yml should be up and running. Check e.g. via `docker container ls`
- Application should load and respond properly on http://localhost:4200
- Check the logs of `ibf-api-service` via `docker-compose logs -f ibf-api-service`. Is it saying that the Nest application started successfully?
- Can you visit the Swagger UI API documentation on http://localhost:3000/docs and try one of the GET endpoints?

### Problem with existing database
If there is a problem with your existing database schema, you can always try to start clean by recreating it:
- Access the database via e.g. DBeaver
- Alternatively, access it via commandline using 
    - `docker-compose exec ibf-local-db bash`
    - `psql -U <chosen local-db-username>`
- Throw away schema via `drop schema "IBF-app" cascade;`
- Recreate schema: `create schema "IBF-app";`
- Exit the database again
- Restart the ibf-api-service: `docker-compose restart ibf-api-service` or `docker-compose up -d ibf-api-service`
- This will automatically run migration-scripts upon restart, which involves an "initial migration script" which creates all necessary tables.
- Wait until done. Check via `docker-compose logs -f ibf-api-service`
- As always (see main [README](../README.md))
    - Run the seed-script
    - Run pipeline or mock-endpoint


### Supporting docker commands
These below commands come in handy when you face such issue:
1 The Docker compose command starts and runs your entire app:
    docker-compose up

2 For dev environment we can use:
    docker-compose -f docker-compose.yml -f docker-compose.override.yml up

3 Execute this will create a container named ibf-api-service and start a Bash session:
    docker-compose exec ibf-api-service bash

4 Execute this command will run the ibf-pipeline for all countries:
    docker-compose exec ibf-pipeline python3 runPipeline.py

5 To run seed script:
    docker-compose exec ibf-api-service npm run seed

6 Detached mode (-d) run command in the background:
    docker-compose up -d ibf-api-service:

7 Create the Docker image from the Dockerfile in this folder through:
    docker build -t ibf-api-service

8 To check the logs of IBF-api-service:
    docker-compose logs -f ibf-api-service

9 To restart the IBF-api-service in docker:
    docker-compose restart ibf-api-service

10 To install the IBF-api-services:
    docker-compose exec ibf-api-service npm install 


### docker help
You can refer this official docker document [here](https://docs.docker.com/engine/reference/commandline/compose_exec/)