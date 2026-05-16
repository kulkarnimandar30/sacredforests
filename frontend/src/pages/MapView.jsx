import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, AlertTriangle, Layers, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleMapComponent } from '../components/GoogleMapComponent';

export const MapView = () => {
  const [groves, setGroves] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedGrove, setSelectedGrove] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [grovesRes, districtsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/groves`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/districts`, { withCredentials: true })
      ]);
      
      setGroves(grovesRes.data);
      setDistricts(districtsRes.data.sort());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (grove) => {
    setSelectedGrove(grove);
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setSelectedGrove(null); // Clear selection when changing district
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map and grove data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Interactive Sacred Groves Map</h1>
          </div>
          <p className="text-lg text-gray-600">
            Explore {groves.length} sacred groves across {districts.length} districts in Maharashtra using Google Maps
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <GoogleMapComponent
              groves={groves}
              selectedGrove={selectedGrove}
              onMarkerClick={handleMarkerClick}
              districts={districts}
              selectedDistrict={selectedDistrict}
              onDistrictChange={handleDistrictChange}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24 max-h-[600px] overflow-y-auto">
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
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      {selectedGrove.district} District
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-emerald-700 uppercase mb-1">GPS Coordinates</div>
                      <div className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
                        {selectedGrove.coordinates.lat.toFixed(6)}, {selectedGrove.coordinates.lng.toFixed(6)}
                      </div>
                    </div>

                    {selectedGrove.location && (
                      <div>
                        <div className="text-xs font-semibold text-emerald-700 uppercase mb-1">Location (DMS)</div>
                        <div className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
                          {selectedGrove.location}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-xs font-semibold text-emerald-700 uppercase mb-1">Natural History</div>
                      <div className="text-sm text-gray-900 leading-relaxed">
                        {selectedGrove.natural_history}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-blue-700 uppercase mb-1">Present Status</div>
                      <div className="text-sm text-gray-900">{selectedGrove.present_status}</div>
                    </div>

                    {selectedGrove.threats && (
                      <div>
                        <div className="text-xs font-semibold text-red-700 uppercase mb-1">Threats</div>
                        <div className="text-sm text-red-700 whitespace-pre-line">{selectedGrove.threats}</div>
                      </div>
                    )}

                    {selectedGrove.references && (
                      <div>
                        <div className="text-xs font-semibold text-gray-700 uppercase mb-1">References</div>
                        <div className="text-sm text-gray-700 italic whitespace-pre-line">{selectedGrove.references}</div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate(`/database?highlight=${selectedGrove._id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      <Info className="w-5 h-5" />
                      View Full Database Entry
                    </button>

                    <button
                      onClick={() => navigate(`/report-threat?grove=${selectedGrove._id}&name=${encodeURIComponent(selectedGrove.name)}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      <AlertTriangle className="w-5 h-5" />
                      Report Threat
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    Click on any marker on the map to view detailed information about that sacred grove.
                  </p>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-left">
                    <h4 className="text-sm font-semibold text-emerald-900 mb-2">Map Features:</h4>
                    <ul className="text-xs text-emerald-800 space-y-1">
                      <li>• Filter by district using dropdown</li>
                      <li>• Zoom and pan to explore</li>
                      <li>• Click markers for details</li>
                      <li>• Terrain view shows geography</li>
                      <li>• Fullscreen mode available</li>
                    </ul>
                  </div>
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
            <div className="text-2xl font-bold text-teal-600">{districts.length}</div>
            <div className="text-sm text-gray-600">Districts</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {groves.filter(g => g.coordinates).length}
            </div>
            <div className="text-sm text-gray-600">GPS Mapped</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">100%</div>
            <div className="text-sm text-gray-600">Community-Protected</div>
          </div>
        </div>

        {/* Information Banner */}
        <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-emerald-900 mb-2">
                Powered by Google Maps
              </h3>
              <p className="text-emerald-800 text-sm leading-relaxed">
                This interactive map uses Google Maps to display accurate locations of sacred groves across Maharashtra. 
                Click on any marker to view details, or use the district filter to focus on specific regions. 
                All {groves.length} sacred groves are mapped using actual GPS coordinates from field surveys covering 
                Bhandara, Chandrapur, Jalgaon, Kolaba, Kolhapur, Pune, Ratnagiri, Satara, Thana, and Yeotmal districts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
