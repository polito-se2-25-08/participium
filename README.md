# Participium

A web application for citizen participation in the management of urban environments for the Municipality of Turin.

## Table of Contents

- [System Description](#system-description)
- [How to start the application](#how-to-run-with-docker)

# System Description

Participium is a web application designed to facilitate citizen participation in the management of urban environments for the Municipality of Turin. It allows citizens to report issues, tracks the resolution process, and involves various municipal roles in the workflow.

## Features

### 1. User Management & Authentication

- **Registration & Login:** Citizens can register and log in to the system.
- **Role Management:** Administrators can assign specific roles (Officer, Technician) to users.
- **Profile Management:** Users can view and manage their profiles.

### 2. Reporting System

- **Create Reports:** Citizens can report issues with details such as:
  - Title and Description
  - Category (Technical Office)
  - Location (Latitude/Longitude)
  - Photos
  - Anonymous reporting option
- **Map Integration:** Reports are geolocated and can be visualized on a map.

### 3. Workflow Management

- **Approval Process:** Municipality Officers review incoming reports to ensure validity before they are passed to technical offices.
- **Resolution Process:** Technicians pick up approved reports relevant to their expertise and update their status as they work on them.

---

## Roles

The system defines four distinct user roles, each with specific permissions:

1.  **CITIZEN**

    - The default role for new users.
    - Can create new reports.
    - Can view the status of their own reports.

2.  **ADMIN**

    - Responsible for system administration.
    - Can assign roles (Officer, Technician) to other users.

3.  **OFFICER**

    - Acts as a moderator/dispatcher.
    - Reviews pending reports.
    - Can **Approve** a report (forwarding it to the relevant Technical Office).
    - Can **Reject** a report (providing a motivation).

4.  **TECHNICIAN**
    - Assigned to a specific **Technical Office**.
    - Can view reports assigned to their category.
    - Manages the resolution of reports (updating status to in progress, suspended, resolved).

---

## Technical Offices

Reports are classified into specific categories, based on the description and the context specified by the citizen.
Each Technical Office is responsible for the maintenance of one specific category. Technicians of a given Technical Office are responsible of only the reports of that Technical Office category.
The different Technical Offices are :

- **Water Supply**
- **Architectural Barriers**
- **Sewer System**
- **Public Lighting**
- **Waste**
- **Road Signs & Traffic Lights**
- **Roads & Urban Furnishings**
- **Public Green Areas & Playgrounds**
- **Other**

---

## Report Status Lifecycle

A report progresses through the following statuses:

1.  **PENDING_APPROVAL**: The initial state when a Citizen submits a report.
2.  **REJECTED**: The report was reviewed by an Officer and deemed invalid or duplicate.
3.  **ASSIGNED**: The report was approved by an Officer and is now visible to Technicians of the relevant category.
4.  **IN_PROGRESS**: A Technician has started working on the issue.
5.  **SUSPENDED**: Work on the issue has been temporarily paused.
6.  **RESOLVED**: The issue has been fixed and the report is closed.

## How to run with Docker

The project can be run either by building images locally with `docker-compose.yml` or by using pre-built images published on Docker Hub under https://hub.docker.com/repositories/lorisc2345.

---

## Option A – Use pre-built images from Docker Hub

This is usually the fastest way to run the system.

### 1. Create environment files

Create the backend environment file `backend/.env` (adjust values as needed):

```bash
cp backend/.env.example backend/.env  # if available
# otherwise create backend/.env manually and set required vars
```

At minimum you will need the variables required by the backend (e.g. DB connection, JWT secret, Supabase keys). Refer to `backend` documentation or `.env.example` if present.

Create the frontend environment file `frontend/.env` (optional if defaults are fine):

```bash
echo "VITE_API_ENDOPOINT=http://localhost:3000/api/v1" > frontend/.env
```

### 2. Pull and start containers

You can start the containers with:

```bash
docker pull lorisc2345/participium-backend
docker pull lorisc2345/participium-frontend

docker run -d -p 3000:3000 --name participium-backend \
  --env-file ./backend/.env \
  lorisc2345/participium-backend

docker run -d -p 5173:4173 --name participium-frontend \
  --env-file ./frontend/.env \
  lorisc2345/participium-frontend
```

You can also create your own `docker-compose.yml` that points services to these images instead of building locally.

---

## Option B – Build images locally with docker-compose

### 1. Create environment files

Same as in Option A.

### 2. Build and start the stack

From the project root (where `docker-compose.yml` is located) run:

```bash
docker compose up --build
```

This will:

- build and start the backend on port `3000`
- build and start the frontend on port `5173` (served internally on `4173`)

Run in detached mode with:

```bash
docker compose up -d --build
```

### 3. Access the application

- Frontend (web app): http://localhost:5173
- Backend API: http://localhost:3000

### 4. Stop and clean up

To stop the containers (from the project root):

```bash
docker compose down
```

To remove containers and rebuild from scratch next time, also clear images and volumes as needed (be careful, this deletes persisted data):

```bash
docker compose down --volumes --rmi local

```

### 5. Example user credentials

#### Admin
Username: Haland <br>
Password: Secret123!

#### Officer
Username: Loris <br>
Password: Secret123!

#### Technician
Username: Clara <br>
Password: Secret123!

Username: Lara <br>
Password: Ow9#D9o0OvD.

Username: Alberto <br>
Password: hAQ1>gAlPK_}

#### Citizen
Username: Alice <br>
Password: Secret123!



### 6. Notes

- The frontend container uses `VITE_API_BASE_URL` (set in `docker-compose.yml` and `frontend/.env`) to reach the backend.
- If you change ports in `docker-compose.yml`, update corresponding URLs in `.env` files.
- For local development without Docker, you can still run `npm install` and `npm run dev` in `backend` and `frontend` separately.
