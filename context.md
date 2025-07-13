# Project Context

## Overview
This document provides essential context and information about the Invoice Fetcher project to help developers, contributors, and stakeholders understand the codebase, architecture, and development workflow.

## Project Description
**Project Name:** Invoice Fetcher  
**Version:** 1.0.0  
**Type:** Desktop Web Application  
**Primary Language:** TypeScript/JavaScript  

A personal invoice management application that automatically downloads invoice documents as PDF files from various web pages and stores them in a local database. The application provides a maintainable list of target pages, shows already stored invoices, and allows bulk download of invoices for specific months as ZIP files for accounting purposes.

## Architecture

### Frontend
- **Framework:** Angular 19 with TypeScript
- **UI Library:** Angular Material
- **State Management:** NgRx
- **Build Tool:** Angular CLI
- **Testing:** Jasmine + Karma

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js with TypeScript
- **Database:** SQLite (local storage)
- **ORM:** TypeORM
- **Web Automation:** Puppeteer
- **File Processing:** PDF manipulation libraries

### Infrastructure
- **Deployment:** Electron (desktop application)
- **File Storage:** Local file system

## Directory Structure
```
├── src/
│   ├── app/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── invoice-list/
│   │   │   ├── progress-bar/
│   │   │   └── target-page-card/
│   │   ├── pages/          # Page-level components
│   │   │   ├── dashboard/
│   │   │   └── invoice-manager/
│   │   ├── services/       # API service functions
│   │   │   ├── invoice.service.ts
│   │   │   ├── scraper.service.ts
│   │   │   └── file.service.ts
│   │   ├── store/          # NgRx store configuration
│   │   │   ├── invoice/
│   │   │   └── target-page/
│   │   ├── models/         # TypeScript interfaces/models
│   │   │   ├── invoice.model.ts
│   │   │   └── target-page.model.ts
│   │   └── shared/         # Shared modules and utilities
│   ├── assets/             # Static assets
│   └── environments/       # Environment configurations
├── backend/
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   │   ├── invoice.controller.ts
│   │   │   └── scraper.controller.ts
│   │   ├── services/       # Business logic services
│   │   │   ├── invoice.service.ts
│   │   │   ├── scraper.service.ts
│   │   │   └── file.service.ts
│   │   ├── entities/       # Database entities
│   │   │   ├── invoice.entity.ts
│   │   │   └── target-page.entity.ts
│   │   ├── scrapers/       # Page-specific scrapers
│   │   │   ├── base.scraper.ts
│   │   │   └── klarmobil.scraper.ts
│   │   ├── config/         # Configuration
│   │   │   └── database.config.ts
│   │   └── utils/          # Utility functions
│   │       ├── pdf.utils.ts
│   │       └── zip.utils.ts
│   └── database/           # Database files and migrations
├── electron/               # Electron main process
├── tests/                  # Test files
├── docs/                   # Documentation
└── scripts/                # Build and deployment scripts
```

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- Angular CLI 17+
- Chrome/Chromium (for Puppeteer)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd invoice-fetcher

# Install Angular CLI globally
npm install -g @angular/cli

# Install dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Set up environment variables
cp src/environments/environment.example.ts src/environments/environment.ts
# Edit environment.ts with your configuration

# Initialize database
npm run db:init

# Start backend server
npm run backend:dev

# Start frontend development server
npm run frontend:dev

# For Electron development
npm run electron:dev
```

### Environment Variables

**Frontend Configuration:**
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  downloadPath: './downloads',
  maxConcurrentDownloads: 3,
  // Add other configuration variables
};
```

**Backend Configuration:**
```typescript
// backend/src/config/app.config.ts
export const config = {
  port: 3000,
  database: {
    type: 'sqlite',
    database: './data/invoices.db',
    synchronize: true,
    logging: false
  },
  puppeteer: {
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    timeout: 30000
  },
  downloads: {
    path: './downloads',
    tempPath: './temp'
  }
};
```

## Development Workflow

### Code Standards
- **Linting:** ESLint with Prettier
- **Type Checking:** TypeScript strict mode
- **Commit Messages:** Conventional Commits format
- **Branch Naming:** `feature/`, `bugfix/`, `hotfix/` prefixes

### Testing Strategy
- Unit tests for services and scrapers
- Integration tests for API endpoints
- Component tests for Angular components
- E2E tests for critical user flows

### Code Review Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Run full test suite locally
4. Create pull request with description
5. Address review feedback
6. Merge after approval and CI passes

## API Documentation

### Invoice Management Endpoints
- `GET /api/invoices` - List all invoices with pagination
- `GET /api/invoices/:targetPageId` - Get invoices for specific target page
- `POST /api/invoices/download` - Download invoices for date range as ZIP
- `DELETE /api/invoices/:id` - Delete specific invoice

### Target Page Management
- `GET /api/target-pages` - List all configured target pages
- `POST /api/target-pages` - Add new target page configuration
- `PUT /api/target-pages/:id` - Update target page configuration
- `DELETE /api/target-pages/:id` - Remove target page

### Scraping Operations
- `POST /api/scraper/authenticate/:targetPageId` - Start authentication process
- `POST /api/scraper/fetch/:targetPageId` - Fetch new invoices
- `GET /api/scraper/status/:sessionId` - Get scraping progress status

## Database Schema

### Target Pages Table
```sql
CREATE TABLE target_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  scraper_type VARCHAR(100) NOT NULL,
  config TEXT, -- JSON configuration for scraper
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Invoices Table
```sql
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  target_page_id INTEGER REFERENCES target_pages(id),
  filename VARCHAR(255) NOT NULL,
  invoice_name VARCHAR(255) NOT NULL,
  invoice_date DATE NOT NULL,
  download_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  checksum VARCHAR(64),
  status VARCHAR(50) DEFAULT 'downloaded',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Angular Specific Configuration

### Angular Material Setup
```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatProgressBarModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    // Add other Material modules as needed
  ],
  // ... rest of module configuration
})
export class AppModule { }
```

### NgRx Store Structure
```typescript
// store/app.state.ts
export interface AppState {
  invoices: InvoicesState;
  targetPages: TargetPagesState;
  scraping: ScrapingState;
  ui: UiState;
}

// store/invoices/invoices.state.ts
export interface InvoicesState {
  invoices: Invoice[];
  selectedInvoices: string[];
  isLoading: boolean;
  error: string | null;
}

// store/scraping/scraping.state.ts
export interface ScrapingState {
  activeSessions: ScrapingSession[];
  progress: { [sessionId: string]: ScrapingProgress };
  isAuthenticated: { [targetPageId: string]: boolean };
}
```

## Scraper Implementation

### Base Scraper Interface
```typescript
// backend/src/scrapers/base.scraper.ts
export abstract class BaseScraper {
  protected page: Page;
  protected targetPage: TargetPage;

  abstract authenticate(): Promise<boolean>;
  abstract fetchInvoices(): Promise<InvoiceData[]>;
  abstract downloadInvoice(invoiceData: InvoiceData): Promise<string>;
  
  protected async waitForNavigation(): Promise<void> {
    // Common navigation waiting logic
  }
  
  protected async takeScreenshot(name: string): Promise<void> {
    // Debug screenshot functionality
  }
}
```

### Klarmobil Scraper Example
```typescript
// backend/src/scrapers/klarmobil.scraper.ts
export class KlarmobilScraper extends BaseScraper {
  async authenticate(): Promise<boolean> {
    await this.page.goto('https://www.klarmobil.de/online-service');
    // Wait for manual authentication
    await this.page.waitForSelector('.authenticated-indicator', { timeout: 300000 });
    return true;
  }

  async fetchInvoices(): Promise<InvoiceData[]> {
    await this.page.goto('https://www.klarmobil.de/online-service/meine-rechnungen');
    // Scrape invoice list
    const invoices = await this.page.evaluate(() => {
      // Extract invoice data from page
    });
    return invoices;
  }

  async downloadInvoice(invoiceData: InvoiceData): Promise<string> {
    // Download PDF and return file path
  }
}
```

## Deployment

### Development Build
```bash
# Build frontend
ng build --configuration development

# Build backend
cd backend
npm run build

# Start application
npm run start
```

### Production Build
```bash
# Build frontend for production
ng build --configuration production

# Build backend
cd backend
npm run build

# Build Electron app
npm run electron:build

# Package for distribution
npm run electron:package
```

### Electron Packaging
```bash
# Build for current platform
npm run electron:package

# Build for all platforms
npm run electron:package:all

# Build installer
npm run electron:installer
```

## Troubleshooting

### Common Issues

**Puppeteer Issues**
- Ensure Chrome/Chromium is installed
- Check if running in headless mode works
- Verify timeout settings for slow pages

**Database Issues**
- Check SQLite file permissions
- Verify database path exists
- Run database migrations if needed

**File Download Issues**
- Check download directory permissions
- Verify disk space availability
- Ensure PDF files are not corrupted

**Authentication Issues**
- Clear browser cache/cookies
- Check if target site has changed authentication flow
- Verify manual authentication is completed

## Target Page Configuration

### Adding New Target Pages
1. Create new scraper class extending `BaseScraper`
2. Implement authentication and fetching logic
3. Add scraper to factory pattern
4. Configure target page in database
5. Test authentication and invoice fetching

### Klarmobil Configuration Example
```json
{
  "name": "Klarmobil",
  "url": "https://www.klarmobil.de/online-service",
  "scraper_type": "klarmobil",
  "config": {
    "login_url": "https://www.klarmobil.de/online-service",
    "invoices_url": "https://www.klarmobil.de/online-service/meine-rechnungen",
    "selectors": {
      "invoice_list": ".invoice-item",
      "download_link": ".download-pdf",
      "invoice_date": ".invoice-date",
      "invoice_name": ".invoice-title"
    }
  }
}
```

## Contributing

### Adding New Scrapers
1. Create scraper class in `backend/src/scrapers/`
2. Implement required abstract methods
3. Add unit tests for scraper logic
4. Update scraper factory
5. Document authentication process

### Reporting Issues
1. Check existing issues first
2. Provide target page details
3. Include error logs and screenshots
4. Describe expected vs actual behavior

## Resources

### Documentation
- [Scraper Development Guide](./docs/scrapers.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)

### External Links
- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io)
- [Puppeteer Documentation](https://pptr.dev)
- [TypeORM Documentation](https://typeorm.io)
- [Electron Documentation](https://electronjs.org/docs)
- [SQLite Documentation](https://sqlite.org/docs.html)

## Contact

**Project Maintainer:** [Your Name](mailto:your.email@example.com)  
**Repository:** [GitHub Link](https://github.com/username/invoice-fetcher)

---

*Last Updated: 2024-01-15*  
*Document Version: 1.0*