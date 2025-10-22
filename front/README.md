# Brain Tumor Classification with XAI - Frontend

A modern React frontend for AI-powered brain tumor classification with explainable AI features.

## Features

- **Clean White Design**: Modern, professional interface with excellent text visibility
- **Horizontal Layout**: Optimized for better space utilization and shorter pages
- **12 Tumor Types**: Comprehensive classification system
- **Interactive Navigation**: Breadcrumbs and smooth transitions
- **Tumor Information Pages**: Detailed information for each tumor type
- **XAI Integration**: Grad-CAM, SHAP, and LIME explanations
- **Responsive Design**: Works on all device sizes

## Design System

### Colors
- **Primary**: Blue tones (#3b82f6)
- **Secondary**: Dark grays (#374151)
- **Accent**: Light grays (#6b7280)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

### Typography
- **Headings**: `text-primary-dark` (#1e40af)
- **Body Text**: `text-secondary-dark` (#374151)
- **Muted Text**: `text-muted-dark` (#6b7280)

### Components
- **Cards**: Clean white cards with subtle shadows
- **Buttons**: Primary blue with hover effects
- **Forms**: Clean input fields with focus states

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation header
│   ├── ImageUpload.jsx     # File upload component
│   ├── ResultDisplay.jsx   # Analysis results
│   ├── TumorInfo.jsx       # Tumor types overview
│   ├── TumorDetail.jsx     # Individual tumor pages
│   ├── XAIMethodSelector.jsx # XAI method selection
│   ├── Breadcrumbs.jsx     # Navigation breadcrumbs
│   ├── TumorImage.jsx      # Tumor sample images
│   └── ...
├── store/
│   └── useAppStore.js      # Zustand state management
├── api/
│   └── api.js              # API communication
└── App.jsx                 # Main application
```

## Key Improvements

1. **Text Visibility**: All text now uses custom dark colors for excellent readability
2. **Horizontal Layout**: Components arranged horizontally to reduce page length
3. **English Language**: All text converted to English
4. **White Background**: Clean, professional appearance
5. **Tumor Images**: Support for sample images from dataset
6. **Navigation**: Breadcrumbs and smooth page transitions
7. **Responsive**: Optimized for all screen sizes

## Usage

1. **Home Page**: Overview and file upload
2. **Tumor Types**: Browse all 12 tumor types with images
3. **Tumor Detail**: Detailed information for each type
4. **Analysis**: Upload and analyze MRI scans
5. **Results**: View classification results with XAI explanations

## Development

```bash
npm install
npm run dev
```

## Deployment

The frontend is optimized for deployment on Vercel with the backend on Railway/Render.
