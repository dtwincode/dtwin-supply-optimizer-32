
import React from 'react';
import { createRoot } from 'react-dom/client';

interface MarkerOptions {
  color?: string;
  icon?: string;
  tooltipContent?: React.ReactNode;
}

export const createMapMarker = ({ 
  color = 'blue', 
  icon = 'location', 
  tooltipContent 
}: MarkerOptions = {}): HTMLElement => {
  // Create marker element
  const markerElement = document.createElement('div');
  markerElement.className = 'custom-marker';
  markerElement.style.width = '30px';
  markerElement.style.height = '30px';
  markerElement.style.cursor = 'pointer';
  
  // Set marker appearance
  markerElement.innerHTML = `
    <div style="
      background-color: ${color};
      border-radius: 50%;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${getIconPath(icon)}
      </svg>
    </div>
  `;

  // Add tooltip if provided
  if (tooltipContent) {
    const tooltipContainer = document.createElement('div');
    tooltipContainer.className = 'marker-tooltip-container';
    tooltipContainer.style.display = 'none';
    tooltipContainer.style.position = 'absolute';
    tooltipContainer.style.bottom = '40px';
    tooltipContainer.style.left = '50%';
    tooltipContainer.style.transform = 'translateX(-50%)';
    tooltipContainer.style.backgroundColor = 'white';
    tooltipContainer.style.borderRadius = '4px';
    tooltipContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    tooltipContainer.style.zIndex = '10';
    tooltipContainer.style.minWidth = '120px';
    
    markerElement.appendChild(tooltipContainer);
    
    let root: any = null;
    
    // Render tooltip content using React
    const renderTooltip = () => {
      if (!root) {
        root = createRoot(tooltipContainer);
      }
      root.render(
        <div className="marker-tooltip">{tooltipContent}</div>
      );
    };
    
    // Show tooltip on hover
    markerElement.addEventListener('mouseenter', () => {
      tooltipContainer.style.display = 'block';
      renderTooltip();
    });
    
    markerElement.addEventListener('mouseleave', () => {
      tooltipContainer.style.display = 'none';
    });
  }

  return markerElement;
};

// Helper function to get SVG path for different icons
function getIconPath(icon: string): string {
  switch (icon) {
    case 'warehouse':
      return '<path d="M3 21V8l9-4 9 4v13"></path><path d="M13 13h4v8h-4z"></path><path d="M9 13h4v8H9z"></path>';
    case 'truck':
      return '<path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"></path><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"></path><circle cx="7" cy="18" r="2"></circle><path d="M15 18H9"></path><circle cx="17" cy="18" r="2"></circle>';
    case 'van':
      return '<path d="M10 17h4V5H3v12h3"></path><path d="M2 9h8"></path><path d="M13 5l4 4v8"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle>';
    case 'delivery':
      return '<path d="M5 12V7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v5"></path><path d="M3 21h18"></path><path d="M17 12v9"></path><path d="M7 12v9"></path><path d="M20 12H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Z"></path>';
    default: // location marker
      return '<path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path><path d="M12 22s7-4.2 7-10.5c0-4.2-3.1-7.6-7-7.6s-7 3.4-7 7.6C5 17.8 12 22 12 22Z"></path>';
  }
}
