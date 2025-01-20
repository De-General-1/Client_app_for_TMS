# Task Management System - Frontend

This repository contains the frontend of the Task Management System built using React, TypeScript, and styled with Tailwind CSS. The frontend interacts with the backend API services hosted on AWS using API Gateway and Lambda functions, allowing Admins and Team Members to manage tasks, view notifications, and update task statuses.

The application is deployed and hosted using AWS Amplify.

## Features

### Admin Dashboard

- **Create and Assign Tasks**: Admins can create tasks and assign them to team members, with a deadline.
- **Edit and Delete Tasks**: Admins can update or remove tasks as needed.
- **View All Tasks**: Admins can view all tasks in the system, regardless of assignment.
- **Send Notifications**: Admins receive email notifications when tasks are completed.

### Team Member Dashboard

- **View Assigned Tasks**: Team members can see all tasks assigned to them.
- **Update Task Status**: Team members can mark tasks as completed once they finish them.
- **Receive Reminders**: Team members receive task reminders one day before the task's deadline.

## Frontend Structure

### Technologies Used:

- **React**: For building the user interface.
- **TypeScript**: For type safety and improved development experience.
- **Tailwind CSS**: For responsive and utility-first styling.
- **AWS Amplify**: For hosting and connecting with AWS backend services (Cognito, API Gateway, etc.).
- **Axios**: For making API requests to the backend services.

### Key Components

- **Authentication**: Handled by AWS Cognito. Users can sign up, log in, and log out, with roles for Admin and Team Members.
- **Task Management**: Admins can create, update, and delete tasks, while team members can view and update their assigned tasks.
- **Notifications**: Email notifications are sent to Admins when a task is completed, and reminders are sent to team members a day before a task's deadline.

## API Integration

The frontend makes use of the following API endpoints provided by the backend:

- **POST /tasks**: Create a new task (Admin only).
- **GET /tasks**: Get all tasks assigned to a user or view all tasks (Admin).
- **GET /tasks/{taskId}**: Get details of a specific task.
- **PATCH /tasks/{taskId}**: Update task status (Team Member marks task as completed).
- **POST /users**: Create a new user (Admin only).

These endpoints are hosted using AWS API Gateway and connected to Lambda functions that interact with DynamoDB and other services.

## Setup & Installation

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. (Version 14.x or higher recommended)
- **Yarn or npm**: A package manager to install dependencies.
- **AWS Amplify CLI**: If you plan to deploy or make changes to the Amplify hosting configuration.

To get started with the project locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/De-General-1/Client_app_for_TMS.git
cd task-management-frontend
```

### 2. Install dependencies

```bash
npm install
# or if you prefer Yarn
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project and add the following environment variables. These are necessary for connecting to the backend and configuring the frontend.

### 4. Start the development server

Run the following command to start the local development server:

```bash
npm start
# or
yarn start
```

This will open the app in your default browser, usually at `http://localhost:3000`.

### 5. Sign up or log in

Once the app is loaded in the browser:

- Admins can sign up and log in through the Cognito authentication flow.
- Team members can also sign up and log in to view their assigned tasks.

### 6. Deploying to AWS Amplify

The app is set up to be deployed using AWS Amplify. To deploy the app to AWS Amplify, follow these steps:

1. Install the AWS Amplify CLI if you haven't already:

   ```bash
   npm install -g @aws-amplify/cli
   ```

2. Configure Amplify for the project:

   ```bash
   amplify init
   ```

3. Push changes to the cloud:

   ```bash
   amplify push
   ```

4. Publish the app:
   ```bash
   amplify publish
   ```

After deploying, Amplify will provide a URL for the live app.

## Tailwind CSS Setup

This project uses Tailwind CSS for styling. If you need to make changes to the styling, you can modify the Tailwind configuration as follows:

### 1. Configuration

The configuration file for Tailwind is located at `tailwind.config.js`. You can adjust the theme, colors, or extend Tailwind's default configurations if needed.

### 2. Customizing the Styles

You can find the main CSS file at `src/index.css`. Tailwind’s utility classes are applied throughout the components for styling.

### 3. Building for Production

For building the app for production, you can run:

```bash
npm run build

```
