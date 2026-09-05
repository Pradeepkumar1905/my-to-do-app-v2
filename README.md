# My Todo App

A full-stack multi-user Todo application built with React, Azure Functions, Azure Cosmos DB, and Azure Static Web Apps.

Users can sign in with Google, manage their own tasks, and access their data securely through a server-side API.
👉 [My Todo App](https://polite-ground-0d4cd6b00.5.azurestaticapps.net)

## Features

- Google authentication
- User-specific Todo data
- Add Todo
- Edit Todo
- Mark Todo as completed
- Delete Todo
- Created date and time for each Todo
- Responsive user interface
- Serverless backend
- Cosmos DB persistence
- GitHub Actions CI/CD

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Azure Functions
- Node.js
- Azure Functions Node.js programming model v4

### Database
- Azure Cosmos DB for NoSQL
- Partition key: `/userId`

### Authentication
- Google OAuth
- Azure Static Web Apps authentication

### Hosting & Deployment
- Azure Static Web Apps
- Azure Functions
- GitHub
- GitHub Actions

## Architecture

# Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Google Login     │
                         └────────┬─────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │ Azure Static Web Apps    │
                    │                          │
                    │ React + Vite Frontend    │
                    └────────────┬─────────────┘
                                 │
                              /api
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │ Azure Functions          │
                    │ Node.js                  │
                    │                          │
                    │ Authentication           │
                    │ Authorization            │
                    │ Validation               │
                    │ Business Logic           │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │ Azure Cosmos DB          │
                    │                          │
                    │ Database: TodoApp        │
                    │ Container: Todos         │
                    │ Partition Key: /userId   │
                    └──────────────────────────┘
