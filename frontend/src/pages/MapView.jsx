import React, { useState } from 'react';
import { MapPin, ZoomIn, Layers, Info } from 'lucide-react';
import { communityConservedAreas } from '../mock';

export const MapView = () => {
  const [selectedCCA, setSelectedCCA] = useState(null);
  const [filter, setFilter] = useState('all');

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
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Interactive CCA Map</h1>
          <p className="text-lg text-gray-600">Explore Community Conserved Areas around the world</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* Map Controls */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">World Map View</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Map Area */}
              <div className="relative bg-gradient-to-br from-blue-100 via-green-50 to-emerald-100 h-[500px] overflow-hidden">
                {/* Simplified world map background */}
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 1000 500" className="w-full h-full">
                    <path d="M 100 100 Q 200 80 300 100 T 500 100 T 700 100 T 900 100" stroke="#059669" strokeWidth="2" fill="none" />
                    <path d="M 150 200 Q 250 180 350 200 T 550 200 T 750 200" stroke="#059669" strokeWidth="2" fill="none" />
                    <path d="M 100 300 Q 300 280 500 300 T 900 300" stroke="#059669" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                {/* CCA Markers */}
                {communityConservedAreas.map((cca) => {
                  const position = getMarkerPosition(cca.coordinates.lat, cca.coordinates.lng);
                  return (
                    <button
                      key={cca.id}
                      onClick={() => setSelectedCCA(cca)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                      style={position}
                    >
                      <div className={`relative ${selectedCCA?.id === cca.id ? 'z-10' : 'z-0'}`}>
                        {/* Pulse animation */}
                        <div className={`absolute inset-0 bg-emerald-500 rounded-full animate-ping ${selectedCCA?.id === cca.id ? 'opacity-75' : 'opacity-0'}`}></div>
                        
                        {/* Marker */}
                        <div className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          selectedCCA?.id === cca.id
                            ? 'bg-emerald-600 scale-150 shadow-lg'
                            : 'bg-emerald-500 group-hover:bg-emerald-600 group-hover:scale-125 shadow-md'
                        }`}>
                          <MapPin className="w-4 h-4 text-white" />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                            {cca.name}
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
                    <span className="text-xs text-gray-600">Community Conserved Area</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Click markers to view details
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedCCA ? 'CCA Details' : 'Select a Location'}
              </h3>

              {selectedCCA ? (
                <div className="space-y-4">
                  <img
                    src={selectedCCA.image}
                    alt={selectedCCA.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{selectedCCA.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      {selectedCCA.location}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Area</div>
                      <div className="text-sm text-gray-900">{selectedCCA.area}</div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Established</div>
                      <div className="text-sm text-gray-900">{selectedCCA.established}</div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Community</div>
                      <div className="text-sm text-gray-900">{selectedCCA.community}</div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Biodiversity</div>
                      <div className="text-sm text-gray-900 leading-relaxed">{selectedCCA.biodiversity}</div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</div>
                      <div className="text-sm text-gray-900 leading-relaxed">{selectedCCA.description}</div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Conservation Status</div>
                      <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                        {selectedCCA.conservation_status}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Click on any marker on the map to view detailed information about that Community Conserved Area.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">{communityConservedAreas.length}</div>
            <div className="text-sm text-gray-600">CCAs on Map</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-teal-600">7</div>
            <div className="text-sm text-gray-600">Continents</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">Countries</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">100%</div>
            <div className="text-sm text-gray-600">Community-Led</div>
          </div>
        </div>
      </div>
    </div>
  );
};
