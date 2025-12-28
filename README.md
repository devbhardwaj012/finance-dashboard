Finance Dashboard
A configurable dashboard built with Next.js that allows users to create, arrange, and persist data widgets from any JSON-based REST API.

The project focuses on data-driven widget configuration, clean architecture, and correctness. It is not limited to finance APIs and works with any structured JSON response.

Tech Stack
Framework: Next.js (App Router)

UI Library: React

State Management: Redux Toolkit

Styling: Tailwind CSS

Drag & Drop: dnd-kit

Charts: Recharts

What This Project Does
Connects to any REST API that returns JSON.

Analyzes the API response structure dynamically.

Allows users to create widgets based on detected data.

Supports drag, resize, auto-refresh, theming, and persistence.

Stores dashboard state locally in the browser.

Note: There is no backend database and no hardcoded finance logic.

Core Features
Widget Types
The dashboard currently supports three widget types:

Card Widget

Displays scalar values (numbers or strings).

Multiple fields can be selected.

Automatic formatting for numbers and percentages.

Table Widget

Displays array-based data.

User-selectable columns.

Built-in pagination (10 rows per page).

Chart Widget

Displays time-series data using a line chart.

Supports object-based time series (date keys) and array-based time series (auto-detected date field).

Numeric Y-axis selection.

API Handling & Security
All API requests go through a server-side proxy.

API keys are never exposed to the browser.

Supports configurable authentication (Custom header names, Bearer/ApiKey prefixes).

Handles CORS safely via the proxy.

Smart API Validation
The project includes a robust API validation layer that:

Traverses the full JSON response.

Classifies data into Scalars (Cards), Arrays (Tables), and Time series (Charts).

Generates dot-paths dynamically for configuration.

This logic lives in validateApi and serves as the foundation of the dashboard.

Dashboard Behavior
Operations: Widgets can be added, edited, deleted, and reordered via drag-and-drop.

Layout: Responsive resizing on desktop screens.

Persistence: Dashboard state is persisted in localStorage.

Sync: Widgets auto-refresh at configurable intervals.

Portability: Import and export dashboard configuration as JSON.

Theme Support
Light and dark mode supported.

Theme managed using Redux.

Hydration-safe implementation for Next.js.

Project Structure (Simplified)
Plaintext

src/
├── app/
├── components/
│   ├── widgets/
│   ├── modals/
│   └── layout/
├── lib/
│   ├── api/
│   ├── store/
│   └── hooks/
└── redux/
Getting Started
Prerequisites
Node.js 18+

Installation
Install dependencies:

Bash

npm install
Run the development server:

Bash

npm run dev
Open in your browser: http://localhost:3000

Limitations (What This Project Does NOT Do)
To maintain clarity, the following features are not implemented:

Multiple dashboards or User accounts/auth.

Collaboration, sharing, or notifications.

CSV/PDF export or Widget duplication.

Backend persistence or Real-time sockets.

Extending the Project
To add a new widget type:

Create a widget component.

Register it in WidgetRenderer.

Add it to the widget type selector.

Define how it consumes validated API data.

License
MIT License

Author
Dev Bhardwaj GitHub: https://github.com/devbhardwaj012