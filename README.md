# Finance Dashboard

A configurable dashboard application built with Next.js that enables users to create, arrange, and persist data visualization widgets from any JSON-based REST API. The system dynamically analyzes API responses and generates appropriate widget configurations without requiring hardcoded data schemas.

## Overview

This dashboard provides a flexible framework for consuming and visualizing data from arbitrary REST APIs. It automatically inspects API response structures, identifies data patterns, and presents configuration options for creating widgets. The application supports multiple visualization types and maintains state persistence through browser storage.

## Technology Stack

- **Framework:** Next.js (App Router)
- **UI Library:** React
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Drag and Drop:** dnd-kit
- **Data Visualization:** Recharts

## Key Capabilities

The application connects to REST APIs returning JSON responses, performs structural analysis of the data, and generates appropriate widget configurations. Users can create customized visualizations, arrange them through drag-and-drop interactions, configure automatic refresh intervals, and persist their dashboard configurations locally.

The system operates entirely client-side with no backend database requirements. All API integrations are handled through a server-side proxy layer that manages authentication and CORS concerns.

## Widget Types

### Card Widget

Displays scalar values extracted from API responses. Supports multiple field selection with automatic formatting for numeric and percentage values. Suitable for key metrics and summary statistics.

### Table Widget

Renders array-based data in tabular format. Features user-selectable columns and built-in pagination displaying ten rows per page. Appropriate for structured datasets and record listings.

### Chart Widget

Visualizes time-series data using line charts. Supports both object-based time series with date keys and array-based time series with auto-detected date fields. Allows selection of numeric fields for the Y-axis.

## API Integration

All API requests are routed through a server-side proxy to ensure security. API credentials are never exposed to the browser environment. The system supports configurable authentication mechanisms including custom header names and Bearer or ApiKey prefixes. CORS policies are handled transparently through the proxy layer.

## Data Validation System

The application includes a comprehensive validation layer that traverses complete JSON response structures and classifies data into three categories: scalars for card widgets, arrays for table widgets, and time series for chart widgets. The validation system generates dot-notation paths dynamically for configuration purposes. This logic is centralized in the `validateApi` function and serves as the foundation for all widget creation.

## Dashboard Management

Users can perform standard CRUD operations on widgets and reorder them through drag-and-drop interactions. The layout responds to different screen sizes on desktop devices. Dashboard state persists across sessions using localStorage. Widgets refresh automatically at user-defined intervals. Complete dashboard configurations can be exported to JSON files and imported for portability.

## Theme Support

The application supports light and dark color schemes managed through Redux state. The implementation ensures proper hydration behavior in Next.js server-side rendering contexts.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── widgets/      # Widget implementations
│   ├── modals/       # Dialog components
│   └── layout/       # Layout components
├── lib/              # Core utilities
│   ├── api/          # API client and validation
│   ├── store/        # Redux store configuration
│   └── hooks/        # Custom React hooks
└── redux/            # Redux slices
```

## Getting Started

### Prerequisites

Node.js version 18 or higher is required.

### Installation

Install project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Access the application at `http://localhost:3000`

## Scope and Limitations

The current implementation focuses on core dashboard functionality. The following features are explicitly excluded from the project scope:

- Multiple dashboard management or multi-user support
- User authentication and authorization systems
- Collaborative editing or sharing mechanisms
- Push notifications or alerting systems
- Data export to CSV or PDF formats
- Widget duplication functionality
- Backend persistence layers
- Real-time data synchronization via WebSockets

## Extension Guidelines

To implement additional widget types, follow these steps:

1. Create the widget component in the `components/widgets` directory
2. Register the new widget type in the `WidgetRenderer` component
3. Add the widget to the type selector interface
4. Define data consumption patterns for the validated API structure

## License

This project is licensed under the MIT License.

## Author

**Dev Bhardwaj**

GitHub: [github.com/devbhardwaj012](https://github.com/devbhardwaj012)
