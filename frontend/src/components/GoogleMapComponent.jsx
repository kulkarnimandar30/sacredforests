import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Map Content Component (must be child of Map to use useMap hook)
const MapContent = ({ groves, selectedGrove, onMarkerClick, onInfoWindowClose }) => {
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    if (!map || !selectedGrove) return;

    // Center map on selected grove
    map.panTo({
      lat: selectedGrove.coordinates.lat,
      lng: selectedGrove.coordinates.lng
    });
    map.setZoom(15);
  }, [map, selectedGrove]);

  // Cluster markers by proximity (simple clustering)
  const getClusteredMarkers = () => {
    if (!groves.length) return [];
    
    // For performance, show all markers without complex clustering
    // Google Maps handles render optimization internally
    return groves.filter(grove => grove.coordinates);
  };

  const clusteredMarkers = getClusteredMarkers();

  return (
    <>
      {clusteredMarkers.map((grove) => (
        <AdvancedMarker
          key={grove._id}
          position={{
            lat: grove.coordinates.lat,
            lng: grove.coordinates.lng
          }}
          onClick={() => onMarkerClick(grove)}
          title={grove.name}
        >
          <div
            className={`relative transition-transform hover:scale-110 cursor-pointer ${
              selectedGrove?._id === grove._id ? 'scale-125 z-50' : 'z-10'
            }`}
          >
            {/* Pulse animation for selected marker */}
            {selectedGrove?._id === grove._id && (
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
            )}
            
            {/* Custom Marker */}
            <div
              className={`relative flex items-center justify-center rounded-full shadow-lg ${
                selectedGrove?._id === grove._id
                  ? 'w-10 h-10 bg-emerald-600'
                  : 'w-8 h-8 bg-emerald-500'
              }`}
            >
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>
        </AdvancedMarker>
      ))}

      {/* Info Window */}
      {selectedGrove && (
        <InfoWindow
          position={{
            lat: selectedGrove.coordinates.lat,
            lng: selectedGrove.coordinates.lng
          }}
          onCloseClick={onInfoWindowClose}
          headerDisabled={true}
        >
          <div className="p-2 max-w-xs">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900 pr-2">
                {selectedGrove.name}
              </h3>
              <button
                onClick={onInfoWindowClose}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{selectedGrove.district} District</span>
            </div>

            {selectedGrove.natural_history && (
              <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                {selectedGrove.natural_history}
              </p>
            )}

            <div className="text-xs text-gray-500 mb-3">
              <span className="font-semibold">Status:</span> {selectedGrove.present_status}
            </div>

            <button
              onClick={() => {
                navigate(`/database?highlight=${selectedGrove._id}`);
              }}
              className="w-full px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              View Full Details
            </button>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

// Main Google Maps Component
export const GoogleMapComponent = ({ groves, selectedGrove, onMarkerClick, districts, selectedDistrict, onDistrictChange }) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  // Calculate center based on selected district or all groves
  const getMapCenter = () => {
    const relevantGroves = selectedDistrict && selectedDistrict !== 'all'
      ? groves.filter(g => g.district === selectedDistrict && g.coordinates)
      : groves.filter(g => g.coordinates);

    if (relevantGroves.length === 0) {
      // Default to Maharashtra center
      return { lat: 18.5204, lng: 73.8567 }; // Pune
    }

    // Calculate average center
    const avgLat = relevantGroves.reduce((sum, g) => sum + g.coordinates.lat, 0) / relevantGroves.length;
    const avgLng = relevantGroves.reduce((sum, g) => sum + g.coordinates.lng, 0) / relevantGroves.length;

    return { lat: avgLat, lng: avgLng };
  };

  const getMapZoom = () => {
    if (selectedDistrict && selectedDistrict !== 'all') {
      return 11; // District level zoom
    }
    return 8; // State level zoom
  };

  const handleMarkerClick = useCallback((grove) => {
    onMarkerClick(grove);
    setInfoWindowOpen(true);
  }, [onMarkerClick]);

  const handleInfoWindowClose = useCallback(() => {
    setInfoWindowOpen(false);
    onMarkerClick(null);
  }, [onMarkerClick]);

  // Filter groves by selected district
  const filteredGroves = selectedDistrict && selectedDistrict !== 'all'
    ? groves.filter(g => g.district === selectedDistrict)
    : groves;

  if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY") {
    return (
      <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-6">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Google Maps Not Configured
          </h3>
          <p className="text-sm text-gray-600 max-w-md">
            Please add your Google Maps API key to the environment variables.
            <br />
            Set REACT_APP_GOOGLE_MAPS_API_KEY in your .env file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* District Filter Dropdown */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Filter by District
        </label>
        <select
          value={selectedDistrict || 'all'}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
        >
          <option value="all">All Districts ({groves.length} groves)</option>
          {districts.map(district => {
            const count = groves.filter(g => g.district === district).length;
            return (
              <option key={district} value={district}>
                {district} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {/* Map Stats Badge */}
      <div className="absolute top-4 right-4 z-10 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-sm font-semibold">
          {filteredGroves.length} Sacred Groves
        </div>
        <div className="text-xs opacity-90">
          {selectedDistrict && selectedDistrict !== 'all' ? selectedDistrict : 'Maharashtra'}
        </div>
      </div>

      {/* Google Maps */}
      <APIProvider apiKey={apiKey}>
        <Map
          style={{ width: "100%", height: "600px", borderRadius: "1rem" }}
          defaultCenter={getMapCenter()}
          defaultZoom={getMapZoom()}
          center={getMapCenter()}
          zoom={getMapZoom()}
          mapId="sacred-groves-map" // Required for AdvancedMarker
          gestureHandling="greedy"
          disableDefaultUI={false}
          zoomControl={true}
          mapTypeControl={true}
          streetViewControl={false}
          fullscreenControl={true}
          mapTypeId="terrain" // Terrain view by default
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          }}
        >
          <MapContent
            groves={filteredGroves}
            selectedGrove={selectedGrove}
            onMarkerClick={handleMarkerClick}
            onInfoWindowClose={handleInfoWindowClose}
          />
        </Map>
      </APIProvider>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-gray-900">Map Legend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Sacred Grove</span>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Click markers for details
        </div>
      </div>
    </div>
  );
};
