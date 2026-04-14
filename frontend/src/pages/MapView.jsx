import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, ZoomIn, Layers, Info, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MapView = () => {
  const [groves, setGroves] = useState([]);
  const [selectedGrove, setSelectedGrove] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchGroves();
  }, []);

  const fetchGroves = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/groves`, {
        withCredentials: true
      });
      setGroves(data);
    } catch (error) {
      console.error('Error fetching groves:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map visualization optimized for Pune district
  const getMarkerPosition = (lat, lng) => {
    // Pune district bounds approximately:
    // Latitude: 18.0° to 19.5°
    // Longitude: 73.0° to 74.5°
    const MIN_LAT = 18.0;
    const MAX_LAT = 19.5;
    const MIN_LNG = 73.0;
    const MAX_LNG = 74.5;
    
    // Convert to percentage within Pune bounds with some padding
    const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 80 + 10; // 10% padding on each side
    const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 80 + 10; // Invert Y axis, add padding
    
    return { 
      left: `${Math.max(5, Math.min(95, x))}%`, 
      top: `${Math.max(5, Math.min(95, y))}%` 
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Interactive Sacred Groves Map</h1>
          <p className="text-lg text-gray-600">Explore sacred groves across Pune District, Maharashtra</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* Map Controls */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">Pune District Map - Maharashtra</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Map Area */}
              {loading ? (
                <div className="h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-100 via-green-50 to-emerald-100">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              ) : (
                <div className="relative bg-gradient-to-br from-blue-100 via-green-50 to-emerald-100 h-[600px] overflow-hidden">
                  {/* Pune district map representation */}
                  <div className="absolute inset-0 opacity-10">
                    <svg viewBox="0 0 1000 600" className="w-full h-full">
                      {/* Simplified topographic lines for Pune district */}
                      <path d="M 100 150 Q 300 120 500 150 T 900 150" stroke="#059669" strokeWidth="3" fill="none" />
                      <path d="M 100 250 Q 300 220 500 250 T 900 250" stroke="#059669" strokeWidth="3" fill="none" />
                      <path d="M 100 350 Q 300 320 500 350 T 900 350" stroke="#059669" strokeWidth="3" fill="none" />
                      <path d="M 100 450 Q 300 420 500 450 T 900 450" stroke="#059669" strokeWidth="3" fill="none" />
                      {/* Western Ghats representation */}
                      <path d="M 200 100 L 250 200 L 200 300 L 250 400 L 200 500" stroke="#10b981" strokeWidth="4" fill="none" strokeDasharray="10,5" />
                    </svg>
                  </div>

                  {/* Grove Markers - All 70 locations */}
                  {groves.map((grove, index) => {
                    if (!grove.coordinates) return null;
                    const position = getMarkerPosition(grove.coordinates.lat, grove.coordinates.lng);
                    const isSelected = selectedGrove?._id === grove._id;
                    
                    return (
                      <button
                        key={grove._id}
                        onClick={() => setSelectedGrove(grove)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                        style={position}
                        title={grove.name}
                      >
                        <div className={`relative ${isSelected ? 'z-20' : 'z-10'}`}>
                          {/* Pulse animation for selected marker */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                          )}
                          
                          {/* Marker */}
                          <div className={`relative rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'w-10 h-10 bg-emerald-600 shadow-xl scale-125'
                              : 'w-6 h-6 bg-emerald-500 group-hover:bg-emerald-600 group-hover:scale-110 shadow-md'
                          }`}>
                            <MapPin className={`${isSelected ? 'w-6 h-6' : 'w-4 h-4'} text-white`} />
                          </div>

                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                              {grove.name}
                            </div>
                            <div className="w-2 h-2 bg-gray-900 transform rotate-45 mx-auto -mt-1"></div>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-900">Map Legend</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Sacred Grove ({groves.length} total)</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Click markers to view details
                    </div>
                  </div>

                  {/* District Label */}
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg z-10">
                    <div className="text-sm font-semibold">Pune District</div>
                    <div className="text-xs opacity-90">Maharashtra, India</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedGrove ? 'Grove Details' : 'Select a Location'}
              </h3>

              {selectedGrove ? (
                <div className="space-y-4">
                  {selectedGrove.image && (
                    <img
                      src={selectedGrove.image}
                      alt={selectedGrove.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{selectedGrove.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      {selectedGrove.district}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Coordinates</div>
                      <div className="text-sm text-gray-900 font-mono">
                        {selectedGrove.coordinates.lat.toFixed(4)}, {selectedGrove.coordinates.lng.toFixed(4)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Natural History</div>
                      <div className="text-sm text-gray-900 leading-relaxed line-clamp-4">{selectedGrove.natural_history}</div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Present Status</div>
                      <div className="text-sm text-gray-900">{selectedGrove.present_status}</div>
                    </div>

                    {selectedGrove.threats && (
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Threats</div>
                        <div className="text-sm text-red-700">{selectedGrove.threats}</div>
                      </div>
                    )}
                  </div>

                  {/* Report Threat Button */}
                  <button
                    onClick={() => navigate(`/report-threat?grove=${selectedGrove._id}&name=${encodeURIComponent(selectedGrove.name)}`)}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    Report Threat to this Grove
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Click on any marker on the map to view detailed information about that sacred grove.</p>
                  <p className="text-sm text-gray-400 mt-2">You can also report threats directly from the grove details.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">{groves.length}</div>
            <div className="text-sm text-gray-600">Sacred Groves in Pune</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-teal-600">{new Set(groves.map(g => g.district)).size}</div>
            <div className="text-sm text-gray-600">Districts</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">Maharashtra</div>
            <div className="text-sm text-gray-600">State</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">100%</div>
            <div className="text-sm text-gray-600">Community-Protected</div>
          </div>
        </div>

        {/* Map Legend & Instructions */}
        <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-emerald-900 mb-2">Report Threats Directly from Map</h3>
              <p className="text-emerald-800 text-sm leading-relaxed">
                Click on any grove marker to view its details. If you notice any threats like construction, logging, or waste dumping, 
                use the "Report Threat" button to notify authorities and conservation teams immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
