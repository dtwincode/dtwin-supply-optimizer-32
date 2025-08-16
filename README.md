# dtwin-supply-optimizer-32

This is a modern demand-driven supply chain optimization platform built with React/TypeScript and Supabase. It implements analytics and planning functions based on the Demand-Driven MRP (DDMRP) methodology and extends towards Demand-Driven Operating Model (DDOM) and Demand-Driven Sales & Operations Planning (DDS&OP).

## Features

- **DDMRP Analytics:** Buffer profiles, dynamic adjustments, net flow positions, and alerts for demand-driven replenishment
- **DDOM Scheduling:** Capacity scheduling and execution functions aligned with demand and resource constraints  
- **DDS&OP Planning:** Master settings management, variance analysis, and scenario simulation
- **Modern React UI:** Built with React 19, TypeScript, Tailwind CSS, and shadcn/ui components
- **Supabase Backend:** Real-time database, authentication, and serverless functions
- **Multilingual Support:** English and Arabic with RTL layout support
- **Real-time Updates:** Live data synchronization and notifications

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **UI Components:** shadcn/ui, Radix UI, Lucide React
- **Backend:** Supabase (Database, Auth, Real-time subscriptions)
- **Charts:** Recharts, Nivo
- **Forms:** React Hook Form, Zod validation
- **Routing:** React Router DOM

## Installation

### Prerequisites

- Node.js 18+ 
- A Supabase project (for data persistence and authentication)

### Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd dtwin-supply-optimizer-32
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.example`:

   ```
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` by default.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Language, etc.)
├── hooks/              # Custom React hooks
├── integrations/       # Supabase client and types
├── lib/                # Utility functions
├── pages/              # Page components
├── translations/       # Internationalization files
└── routes.tsx          # Application routing
```

## Key Features

### Dashboard
- Real-time metrics and KPIs
- Financial and sustainability tracking
- Module overview cards

### Inventory Management
- DDMRP buffer calculations
- Stock level monitoring
- Automated replenishment alerts

### Demand Forecasting
- AI-powered demand predictions
- Seasonality analysis
- Forecast accuracy tracking

### Supply Planning
- Supplier performance monitoring
- Purchase order management
- Lead time optimization

### Logistics
- Real-time shipment tracking
- Route optimization
- Carrier performance analytics

## Contributing

1. Fork the repository and create a new branch for your feature
2. Make your changes following the existing code style
3. Test your changes thoroughly
4. Create a pull request with a clear description

## License

This project is private and proprietary.