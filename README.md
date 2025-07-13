# Invoice Fetcher Frontend

A modern Angular 19 application for managing invoice downloads from various web pages with dummy data for demonstration purposes.

## Features

- **Dashboard Overview**: View all target pages and their downloaded invoices
- **Target Page Management**: Display configured target pages (Klarmobil, Telekom, Vodafone)
- **Invoice List**: Show downloaded invoices with details like filename, date, and size
- **Progress Tracking**: Real-time progress bars during invoice fetching process
- **Bulk Operations**: Select and download multiple invoices as ZIP files
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Framework**: Angular 19 with TypeScript
- **UI Library**: Angular Material
- **State Management**: NgRx (structure prepared)
- **Styling**: SCSS with Material Design theme
- **Build Tool**: Angular CLI

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Angular CLI 19+

### Installation

1. Navigate to the frontend directory:
```bash
cd invoice-fetcher-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── invoice-list/    # Invoice list component
│   │   ├── progress-bar/    # Progress tracking component
│   │   └── target-page-card/# Target page card component
│   ├── pages/              # Page-level components
│   │   └── dashboard/      # Main dashboard page
│   ├── services/           # Data services with dummy data
│   │   ├── invoice.service.ts
│   │   ├── target-page.service.ts
│   │   └── scraper.service.ts
│   ├── store/              # NgRx store structure (prepared)
│   │   ├── invoices/
│   │   ├── target-pages/
│   │   └── scraping/
│   ├── models/             # TypeScript interfaces
│   │   ├── invoice.model.ts
│   │   └── target-page.model.ts
│   └── shared/             # Shared utilities
├── assets/                 # Static assets
└── environments/           # Environment configurations
```

## Dummy Data

The application includes realistic dummy data for demonstration:

### Target Pages
- **Klarmobil**: Mobile provider with 3 sample invoices
- **Deutsche Telekom**: Telecom provider with 2 sample invoices  
- **Vodafone**: Mobile provider (inactive)

### Sample Invoices
- Monthly invoices from January to March 2024
- Realistic file sizes and names
- Different statuses (downloaded, pending, error)

## Components

### Dashboard Component
- Main application view
- Statistics overview
- Target page management
- Real-time updates

### Target Page Card Component
- Individual target page display
- Invoice list integration
- Download progress tracking
- Action buttons

### Invoice List Component
- Tabular invoice display
- Selection capabilities
- Individual invoice actions
- Bulk operations

### Progress Bar Component
- Real-time download progress
- Step-by-step status updates
- Success/failure indicators

## Services

### Invoice Service
- CRUD operations for invoices
- Filtering by target page
- ZIP download simulation
- Dummy data management

### Target Page Service
- Target page configuration
- Active/inactive status
- CRUD operations

### Scraper Service
- Authentication simulation
- Progress tracking
- Session management
- Download orchestration

## Styling

- Material Design theme (Indigo/Pink)
- Responsive grid layouts
- Custom SCSS variables
- Mobile-first approach

## Development

### Available Scripts

- `ng serve` - Start development server
- `ng build` - Build for production
- `ng test` - Run unit tests
- `ng lint` - Run linting
- `ng e2e` - Run end-to-end tests

### Code Standards

- TypeScript strict mode
- Angular style guide compliance
- Material Design principles
- Responsive design patterns

## Future Enhancements

When connecting to a real backend:

1. Replace dummy services with HTTP clients
2. Implement NgRx store for state management
3. Add authentication and authorization
4. Integrate with real scraping backend
5. Add file upload/download capabilities
6. Implement real-time WebSocket updates

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow Angular style guide
2. Use TypeScript strict mode
3. Write unit tests for new features
4. Follow Material Design principles
5. Ensure responsive design

## License

This project is part of the Invoice Fetcher application suite.