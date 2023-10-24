## Senior Developer Test by Pablo García Ojeda

## Intro
This repository contains the source code for the technical test for the Senior Developer position at Fortris Corporation.

For the sake of simplicity and speed, I've adopted the monorepo approach, ensuring that both the frontend and backend are intertwined, even in functionalities and semantics implemented concurrently. I've endeavored to make commits as atomic as possible and to utilize best practices wherever feasible.

The project is built using Angular 16, Nestjs 10, and MongoDB. Below, I provide installation and startup instructions for the project. I aim for these instructions to be as generic as possible, but it's worth noting that having developed this on the MacOSX Ventura operating system, some commands might not be necessary for Windows OS where most procedures are GUI-based. However, they should remain compatible for both Mac and Linux systems.

# Installation instructions (step-by-step):

## Pre-requisites

- Git (I used v2.22.0)
- Node.js v18.14.2 or above (this will include the npm & npx commands)
- ts-node (if not provided by node, please install with ```npm i -g ts-node``` )
  
There's no need to have installed the CLI of the frameworks Angular and Nest, but if you want to add functionalities to the project, I encouraged you to install:

- Angular CLI with ```npm i -g @angular/cli```
- Nest.js CLI with ```npm i -g @nestjs/cli```
 

## Repository

- Open a terminal in your operating system
- Navigate to your favorite folder
- Clone the repo. To clone into an existing empty folder, add a dot (.) at the end of the command. Otherwise, it will create a new folder with the project's name:
    - If you prefer SSH:
  ``` 
  git clone git@github.com:pabloweinx/fortris_pgo.git
  ````

  - If you prefer HTTP:
  ``` 
  git clone https://github.com/pabloweinx/fortris_pgo.git
  ````

## Database

### MongoDB server
- Lift up the Mongodb server instance:

  Assuming you have a local instance of MongoDB in your machine, the first step is to serve it up. For Mac & Linux, you should execute the following command:: 

``` 
mongod --dbpath ~/data/db --logpath ~/data/log/mongodb/mongo.log --fork
````

### Data seeding

Once you have the instance running, follow these instructions to seed the database with the accounts with details generated automatically:
- Navigate to the folder called ```backend```
- Execute: 
  
```
npx ts-node seeder.ts
```

If everything's ok, you will see the message "Data seeded succesfully!".  

## Backend

Inside the backend folder (surely you are still there):

- Install the package dependencies of the project with:

```
npm install (or npm i)
```

- Lift up the backend application with:

```
npm start
```

You can view all available npm commands by running ```npm run```.

Once you have lifted it up, you can navigate vía browser to:

```
http://localhost:3000
````

Although you can navigate it with the browser, it will be used exclusively by the frontend.

To shut down the backend, you can click CTRL+C in the CLI. 

# Frontend

Inside the frontend folder:

- Install the package dependencies of the project with:

```
npm install (or npm i)
```

- Lift up the frontend application with:

```
npm start
```

You can view all available npm commands by running ```npm run```

Once you have lifted it up, you can navigate vía browser to:

```
http://localhost:4200
````

Now, you're inside the application! The first section you should see is the account page. You can navigate to any accont details by clicking in the eye button (and also in everyplace of each row). Once inside the detail page, you can go back by clicking the back button in the header or the browser back button.

You also can navigate directly to an account detail or refreshing the detail page whenever you want. 

## Testing

You can run the unit tests for ```backend``` or ```frontend``` by running inside their folders:

npm run test

For the backend, the test results will be displayed in the CLI. 
For the frontend, you will see the results both in the CLI and in the URL you will see next to the results a local Karma website to see it interactively. 

## Documentation

Due to time constraints and the eagerness to submit this project for evaluation, I've documented about 50% of the code in JSDoc notation. My intention was to install the ```compodoc``` npm package to have a beautifull website with the interactive documentation, as well as to install a swagger with the endpoints of the API. 

Thank you for taking the time to review this project and for considering my application. 

All the best! 
Pablo.