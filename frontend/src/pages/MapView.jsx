import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, ZoomIn, Layers, Info } from 'lucide-react';

export const MapView = () => {
  const [groves, setGroves] = useState([]);
  const [selectedGrove, setSelectedGrove] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Simple map visualization using positioned markers
  const getMarkerPosition = (lat, lng) => {
    // Convert lat/lng to percentage positions for simple visualization
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Interactive Sacred Groves Map</h1>
          <p className="text-lg text-gray-600">Explore sacred groves across India</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* Map Controls */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">India Map View</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Map Area */}
              {loading ? (
                <div className="h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-100 via-green-50 to-emerald-100">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              ) : (
                <div className="relative bg-gradient-to-br from-blue-100 via-green-50 to-emerald-100 h-[500px] overflow-hidden">
                  {/* Simplified map background */}
                  <div className="absolute inset-0 opacity-20">
                    <svg viewBox="0 0 1000 500" className="w-full h-full">
                      <path d="M 100 100 Q 200 80 300 100 T 500 100 T 700 100 T 900 100" stroke="#059669" strokeWidth="2" fill="none" />
                      <path d="M 150 200 Q 250 180 350 200 T 550 200 T 750 200" stroke="#059669" strokeWidth="2" fill="none" />
                      <path d="M 100 300 Q 300 280 500 300 T 900 300" stroke="#059669" strokeWidth="2" fill="none" />
                    </svg>
                  </div>

                  {/* Grove Markers */}
                  {groves.map((grove) => {
                    const position = getMarkerPosition(grove.coordinates.lat, grove.coordinates.lng);
                    return (
                      <button
                        key={grove._id}
                        onClick={() => setSelectedGrove(grove)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                        style={position}
                      >
                        <div className={`relative ${selectedGrove?._id === grove._id ? 'z-10' : 'z-0'}`}>
                          {/* Pulse animation */}
                          <div className={`absolute inset-0 bg-emerald-500 rounded-full animate-ping ${selectedGrove?._id === grove._id ? 'opacity-75' : 'opacity-0'}`}></div>
                          
                          {/* Marker */}
                          <div className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            selectedGrove?._id === grove._id
                              ? 'bg-emerald-600 scale-150 shadow-lg'
                              : 'bg-emerald-500 group-hover:bg-emerald-600 group-hover:scale-125 shadow-md'
                          }`}>
                            <MapPin className="w-4 h-4 text-white" />
                          </div>

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                              {grove.name}
                            </div>
                            <div className="w-2 h-2 bg-gray-900 transform rotate-45 mx-auto -mt-1"></div>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-900">Legend</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Sacred Grove</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Click markers to view details
                    </div>
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
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Click on any marker on the map to view detailed information about that sacred grove.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">{groves.length}</div>
            <div className="text-sm text-gray-600">Sacred Groves</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-teal-600">{new Set(groves.map(g => g.district)).size}</div>
            <div className="text-sm text-gray-600">Districts</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">5+</div>
            <div className="text-sm text-gray-600">States</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">100%</div>
            <div className="text-sm text-gray-600">Community-Protected</div>
          </div>
        </div>
      </div>
    </div>
  );
};
