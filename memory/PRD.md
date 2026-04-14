# Product Requirements Document (PRD)
# Community Conserved Areas (CCA) Information Website

**Date Created**: December 2024
**Last Updated**: December 2024

---

## Original Problem Statement

Build an environmental information website focused on a Database of Community Conserved Areas with:
- Interactive maps showing environmental data
- Informational sections with articles/content
- Educational resources & tips
- News/blog section
- Target audience: General public, students & educators, researchers & professionals, environmental activists
- Static content (no real-time API integrations initially)

---

## User Personas

1. **General Public / Awareness Seekers**
   - Goal: Learn about community conservation efforts
   - Needs: Accessible information, inspiring stories, ways to get involved

2. **Students & Educators**
   - Goal: Research and educational materials on CCAs
   - Needs: Comprehensive database, downloadable resources, verified information

3. **Researchers & Professionals**
   - Goal: Access detailed data on CCAs worldwide
   - Needs: Searchable database, geographic data, biodiversity information, case studies

4. **Environmental Activists**
   - Goal: Support and promote community conservation
   - Needs: Latest news, success stories, advocacy resources, network connections

---

## Core Features

### Phase 1: Frontend (COMPLETED - Dec 2024)

#### 1. Homepage
- Hero section with compelling CTA
- Global statistics showcase
- "What are CCAs" educational section
- Featured CCAs gallery
- Support/Get Involved CTA

#### 2. Interactive Map
- Visual world map with CCA locations
- Clickable markers for each CCA
- Sidebar with detailed information on selection
- Legend and map controls
- Quick stats display

#### 3. CCA Database
- Comprehensive listing of 8+ CCAs
- Search functionality (by name, location, community)
- Country filter
- Expandable detail sections
- Information includes:
  - Name, location, coordinates
  - Area size, establishment date
  - Managing community
  - Biodiversity highlights
  - Threats and conservation status

#### 4. Articles Section
- 6+ expert articles
- Category filtering (Conservation, Sustainability, Indigenous Knowledge, Research, Climate, Policy)
- Featured article spotlight
- Article metadata (author, date, read time)
- Article previews with images

#### 5. Resources Section
- 8+ downloadable educational materials
- Resource type organization (Guides, Manuals, Templates, Case Studies, Directories)
- Resource categories:
  - Educational materials
  - Legal & Policy tools
  - Research & Monitoring methods
- Newsletter subscription

#### 6. News Section
- Latest conservation news
- Featured breaking news
- News source attribution
- Newsletter subscription CTA

#### 7. Header & Footer
- Responsive navigation
- Logo and branding
- Mobile menu
- Footer with links, social media, newsletter signup
- Contact information

---

## Technical Architecture

### Frontend Stack
- React 19.0.0
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Shadcn UI components

### Current Implementation (Phase 1)
- All data served from `/app/frontend/src/mock.js`
- Static content, no backend integration yet
- Fully functional frontend with mock data

### Mock Data Structure
```javascript
- communityConservedAreas: Array of 8 CCAs with full details
- articles: Array of 6 articles
- news: Array of 4 news items
- resources: Array of 8 educational resources
- stats: Global statistics object
```

---

## What's Been Implemented (Phase 1)

✅ Complete frontend with 6 pages
✅ Responsive design for all screen sizes
✅ Nature-inspired color scheme (emerald, teal, green)
✅ Interactive components (search, filters, expandable sections)
✅ Professional layout suitable for all target audiences
✅ Mock data for all features
✅ Smooth animations and transitions
✅ SEO-friendly routing

---

## Prioritized Backlog

### P0 Features (Next Phase - Backend Development)

1. **Database Models**
   - CCA model (name, location, coordinates, area, community, biodiversity, threats, status, images)
   - Article model (title, author, date, category, excerpt, content, image, readTime)
   - News model (title, date, source, summary, link, image)
   - Resource model (title, type, description, downloadLink, icon)

2. **API Endpoints**
   ```
   GET  /api/ccas - Get all CCAs with search and filter
   GET  /api/ccas/:id - Get single CCA details
   GET  /api/articles - Get all articles with category filter
   GET  /api/articles/:id - Get single article
   GET  /api/news - Get all news items
   GET  /api/resources - Get all resources
   POST /api/newsletter - Subscribe to newsletter
   ```

3. **Backend Integration**
   - Remove mock.js
   - Connect frontend to backend APIs
   - Implement error handling
   - Add loading states

### P1 Features (Future Enhancements)

1. **User Accounts**
   - User registration and login
   - Bookmark favorite CCAs
   - Subscribe to specific areas for updates
   - User dashboard

2. **Admin Panel**
   - Add/edit/delete CCAs
   - Publish articles and news
   - Upload resources
   - Manage newsletter subscribers

3. **Enhanced Map**
   - Real map integration (Mapbox/Leaflet)
   - Clustering for dense areas
   - Filter by conservation status, size, etc.
   - Export functionality

4. **Search Enhancements**
   - Full-text search
   - Advanced filters (biodiversity type, threats, community type)
   - Sort options (size, date, alphabetical)

### P2 Features (Nice to Have)

1. **Community Features**
   - Comment system on articles
   - Share CCAs on social media
   - Success story submissions
   - Community forum

2. **Data Visualization**
   - Charts and graphs of conservation data
   - Interactive biodiversity explorer
   - Timeline of CCA establishment
   - Impact metrics dashboard

3. **Multilingual Support**
   - Translation system
   - Content in multiple languages
   - RTL support

4. **Mobile App**
   - React Native mobile application
   - Offline access to CCA database
   - GPS-based nearby CCAs

---

## API Contracts (for Backend Phase)

### GET /api/ccas
**Query Params**: 
- `search` (string, optional)
- `country` (string, optional)
- `limit` (number, default: 50)
- `offset` (number, default: 0)

**Response**:
```json
{
  "ccas": [
    {
      "id": "string",
      "name": "string",
      "location": "string",
      "coordinates": { "lat": number, "lng": number },
      "area": "string",
      "established": "string",
      "biodiversity": "string",
      "community": "string",
      "description": "string",
      "image": "string",
      "threats": "string",
      "conservation_status": "string"
    }
  ],
  "total": number
}
```

### POST /api/newsletter
**Request Body**:
```json
{
  "email": "string"
}
```

**Response**:
```json
{
  "message": "Successfully subscribed",
  "email": "string"
}
```

---

## Design Guidelines

- **Colors**: Emerald (#059669), Teal (#0d9488), Green (#10b981) for primary actions
- **Typography**: Clean sans-serif, good readability
- **Icons**: Lucide React library (no emoji)
- **Spacing**: Generous whitespace, comfortable reading experience
- **Imagery**: Nature photography, community-focused images
- **Interactions**: Smooth hover states, subtle animations
- **Accessibility**: Proper contrast ratios, semantic HTML

---

## Next Tasks

1. Review and approve frontend implementation
2. Begin backend development with MongoDB models
3. Create API endpoints for CCAs, articles, news, resources
4. Integrate frontend with backend
5. Test full-stack functionality
6. Deploy to production

---

## Mocked Data

All data in `/app/frontend/src/mock.js` represents the structure that will be replaced with real database content. Mock data includes:
- 8 Community Conserved Areas from 8 different countries
- 6 articles across various conservation topics
- 4 news items
- 8 educational resources
- Global statistics

---

## Success Metrics (Future)

- Number of CCAs in database
- User engagement (page views, time on site)
- Newsletter subscriptions
- Resource downloads
- Search queries and popular CCAs
- Geographic distribution of visitors

---
