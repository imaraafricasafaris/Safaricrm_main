import React, { useState } from 'react';
import { Book, Search, Code, FileText } from 'lucide-react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const API_SPEC = {
  openapi: '3.0.0',
  info: {
    title: 'Safari CRM API',
    version: '1.0.0',
    description: `
# Safari CRM API Documentation

## Overview
The Safari CRM API provides programmatic access to manage leads, bookings, and other CRM functionalities.

## Data Structures

### Standard Response Format
All API responses follow this structure:
\`\`\`json
{
  "status": "success",
  "data": {
    "resource": {}, // The requested data
    "meta": {}     // Metadata like pagination
  },
  "message": "Optional message",
  "errors": []     // Array of error details
}
\`\`\`

### Error Format
Error responses include detailed information:
\`\`\`json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid format"
    }
  ]
}
\`\`\`

## Pagination
For list endpoints, use these query parameters:
- page: Page number (default: 1)
- per_page: Items per page (default: 20)
- sort: Sort field
- order: asc/desc

Example response with pagination:
\`\`\`json
{
  "data": [...],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total_count": 100
  }
}
\`\`\`

## Authentication
Use Bearer token authentication:
\`\`\`bash
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Rate Limiting
- Default: 1000 requests per minute
- Headers:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset
`
  },
  servers: [
    {
      url: 'https://api.safaricroms.com/v1',
      description: 'Production server'
    },
    {
      url: 'https://staging-api.safaricroms.com/v1',
      description: 'Staging server'
    }
  ],
  tags: [
    { name: 'Leads', description: 'Lead management endpoints' },
    { name: 'Clients', description: 'Client management endpoints' },
    { name: 'Bookings', description: 'Booking management endpoints' },
    { name: 'Staff', description: 'Staff management endpoints' },
    { name: 'Offices', description: 'Office management endpoints' }
  ],
  paths: {
    '/leads': {
      get: {
        summary: 'List all leads',
        description: 'Returns a paginated list of leads',
        tags: ['Leads'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'per_page',
            in: 'query',
            description: 'Items per page',
            schema: { type: 'integer', default: 20 }
          }
        ],
        responses: {
          '200': {
            description: 'List of leads',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', enum: ['success'] },
                    data: {
                      type: 'object',
                      properties: {
                        leads: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Lead' }
                        },
                        meta: { $ref: '#/components/schemas/PaginationMeta' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create a new lead',
        tags: ['Leads'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LeadInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Lead created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', enum: ['success'] },
                    data: {
                      type: 'object',
                      properties: {
                        lead: { $ref: '#/components/schemas/Lead' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Lead: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          status: {
            type: 'string',
            enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']
          },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      LeadInput: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          source: {
            type: 'string',
            enum: ['website', 'referral', 'social', 'email', 'other']
          }
        }
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          per_page: { type: 'integer' },
          total_count: { type: 'integer' }
        }
      }
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer'
      }
    }
  }
};

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Book className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            API Documentation
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[30px] focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <a
            href="/api-docs.json"
            download
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Download OpenAPI Spec
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Getting Started
            </h3>
          </div>
          <ul className="space-y-2">
            <li>
              <a href="#authentication" className="text-primary hover:text-primary/90">
                Authentication Guide
              </a>
            </li>
            <li>
              <a href="#errors" className="text-primary hover:text-primary/90">
                Error Handling
              </a>
            </li>
            <li>
              <a href="#pagination" className="text-primary hover:text-primary/90">
                Pagination
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              API Reference
            </h3>
          </div>
          <ul className="space-y-2">
            <li>
              <a href="#leads" className="text-primary hover:text-primary/90">
                Leads API
              </a>
            </li>
            <li>
              <a href="#clients" className="text-primary hover:text-primary/90">
                Clients API
              </a>
            </li>
            <li>
              <a href="#bookings" className="text-primary hover:text-primary/90">
                Bookings API
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Code Examples
            </h3>
          </div>
          <ul className="space-y-2">
            <li>
              <a href="#javascript" className="text-primary hover:text-primary/90">
                JavaScript/TypeScript
              </a>
            </li>
            <li>
              <a href="#python" className="text-primary hover:text-primary/90">
                Python
              </a>
            </li>
            <li>
              <a href="#php" className="text-primary hover:text-primary/90">
                PHP
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="swagger-wrapper dark:bg-gray-800 dark:text-white">
          <SwaggerUI spec={API_SPEC} />
        </div>
      </div>
    </div>
  );
}