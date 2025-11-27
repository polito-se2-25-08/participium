# participium
A web application for citizen participation in the management of urban environments for the Municipality of Turin

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

### 5. Notes

- The frontend container uses `VITE_API_BASE_URL` (set in `docker-compose.yml` and `frontend/.env`) to reach the backend.
- If you change ports in `docker-compose.yml`, update corresponding URLs in `.env` files.
- For local development without Docker, you can still run `npm install` and `npm run dev` in `backend` and `frontend` separately.
