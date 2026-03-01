## Running 4Life — Running Companion SPA
Project Description & Purpose

Running 4Life is a React single-page application designed for recreational runners who want a simple way to track workouts and visualize running routes. The application allows users to log runs and view an interactive route using Mapbox mapping services. The goal of the project is to centralize workout tracking and route visualization into one accessible dashboard instead of relying on multiple separate tools.

## Features
* Log running workouts (date, distance, duration, notes)
* Interactive route visualization using Mapbox
* View individual run details
* Dynamic navigation using React Router
* Global state management using React Context
* Mobile-first responsive layout
* Unit testing with Vitest and React Testing Library

## Available Routes
Route	Description

* /	Home page displaying application overview and summary
* /runs	Displays list of saved runs
* /runs/new	Form to create a new run and view route map
* /runs/:id	Displays detailed information for a specific run
* 404 page for invalid routes

## Technologies Used
* React (Vite)
* React Router
* React Context API
* Mapbox GL JS
* Mapbox Directions API
* Vitest
* React Testing Library
* CSS (mobile-first responsive design)
* Vercel (deployment)


## Setup & Installation
Clone the repository

* git clone <your-repo-url>
* cd running-4life

Install dependencies
* npm install

Create environment variable file:
* Create .env.local in the project root: VITE_MAPBOX_TOKEN=your_mapbox_token_here

Run development server
* npm run dev

Running Tests
* npm test

## API Documentation & Dependencies
Mapbox GL JS
Used to render the interactive map inside the application.

Mapbox Directions API
The Directions API retrieves a route between selected coordinates and returns:
route geometry (coordinates)
distance
estimated duration

The response is parsed and displayed as a route line on the map.
Documentation: https://docs.mapbox.com/api/navigation/directions/

### Deployment
The application is deployed using Vercel.
Live URL:
https://running-4life-qp8va61e6-evrots-projects.vercel.app

Deployment Instructions:

Push project to GitHub
Import repository into Vercel

Add environment variable:
VITE_MAPBOX_TOKEN=your_mapbox_token_here
Redeploy the project

## Screenshots

Home Page
![alt text](src/screenshots/home.png)

Runs Page
![alt text](src/screenshots/runs.png)

New Run Page
![alt text](src/screenshots/runs_new.png)

## Known Issues
* Runs are stored only in client memory and are not persisted after page refresh
* Route selection currently uses predefined coordinates rather than user-selected map clicks

## Future Enhancements (Final Submission Plan)

* Persistent database storage (Node.js backend + database)
* User authentication and accounts
* Map click-to-select start and end points
* Advanced run analytics and progress charts
* Pace and weekly mileage statistics