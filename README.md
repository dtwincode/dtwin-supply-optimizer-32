# dtwin-supply-optimizer-32

This project is a demand-driven supply chain optimization platform built with a FastAPI backend and a React/TypeScript frontend. It implements analytics and planning functions based on the Demand-Driven MRP (DDMRP) methodology and extends towards Demand-Driven Operating Model (DDOM) and Demand-Driven Sales & Operations Planning (DDS&OP).

## Features

- **DDMRP Analytics:** Calculates decoupled lead times, buffer profiles, dynamic buffer adjustments, net flow positions, and generates alerts to support demand-driven replenishment【978784539584437†L126-L166】.
- **DDOM Scheduling:** Provides capacity scheduling and execution functions to align supply orders with actual demand and resource constraints【851657482394210†L88-L143】.
- **DDS&OP Planning:** Offers master settings management, variance analysis, and scenario simulation to assess DDOM performance and support integrated planning【94646912161783†L120-L137】.
- **API Services:** All analytics are exposed via RESTful FastAPI endpoints with Pydantic models.
- **React Frontend:** Modern React/Vite UI with pages for DDMRP, DDOM, and DDS&OP dashboards, connecting to the backend services.
- **CI Pipeline:** GitHub Actions workflow runs linters, type checks, unit tests, and builds the frontend.

## Installation

### Prerequisites

- Python 3.11+
- Node.js 18+ and pnpm (used for frontend)
- A Supabase project (for data persistence)

### Backend Setup

1. Clone the repository and navigate to the backend:

   ```bash
   git clone <repository-url>
   cd dtwin-supply-optimizer-32/backend
   ```

2. Create a Python virtual environment and install dependencies:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory based on `.env.example`:

   ```
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. Run the FastAPI server:

   ```bash
   uvicorn app_server:app --reload
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies using pnpm:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

The frontend will be available at `http://localhost:5173` by default.

## API Endpoints

A full OpenAPI spec is available at `/docs` when the backend server is running. Key endpoints include:

- `POST /ddmrp/decoupled-lead-time` – Calculate decoupled lead time for an item.
- `POST /ddmrp/buffer-profiles` – Compute DDMRP buffer zones (red, yellow, green).
- `POST /ddmrp/buffer-adjustments` – Apply dynamic buffer adjustments.
- `POST /ddmrp/net-flow` – Determine net flow position and color status.
- `POST /ddmrp/alerts` – Generate alerts based on net flow.
- `POST /ddom/schedule` – Schedule orders based on capacity.
- `POST /ddom/execute` – Execute orders and update statuses.
- `POST /ddom/variance` – Analyze buffer variance.
- `POST /ddsop/master-settings` – Upsert master settings for DDOM.
- `POST /ddsop/variance` – Perform variance analysis for DDOM.
- `POST /ddsop/simulation` – Simulate DDOM scenarios.

## Contributing

1. Fork the repository and create a new branch for your feature.
2. Install pre-commit hooks:

   ```bash
   pre-commit install
   ```

3. Run the test suite before committing:

   ```bash
   pytest
   ```

4. Push your branch and create a pull request.

## References

- Demand Driven Institute software compliance criteria【978784539584437†L126-L166】.
- Demand Driven Operating Model concepts【851657482394210†L88-L143】.
- DDS&OP software requirements【94646912161783†L120-L137】.
