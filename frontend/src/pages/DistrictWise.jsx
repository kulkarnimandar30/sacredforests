import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, ChevronRight, Leaf } from 'lucide-react';

export const DistrictWise = () => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [groves, setGroves] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/districts`, {
        withCredentials: true
      });
      setDistricts(data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictClick = async (district) => {
    setSelectedDistrict(district);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/groves/by-district/${district}`);
      setGroves(data);
    } catch (error) {
      console.error('Error fetching groves:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">District-wise Sacred Groves</h1>
          <p className="text-lg text-gray-600">Explore sacred groves organized by district</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Districts List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select District</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {districts.map((district) => (
                    <button
                      key={district}
                      onClick={() => handleDistrictClick(district)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                        selectedDistrict === district
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span>{district}</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Groves List */}
          <div className="lg:col-span-2">
            {!selectedDistrict ? (
              <div className="text-center py-20">
                <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a District</h3>
                <p className="text-gray-600">Choose a district from the list to view its sacred groves</p>
              </div>
            ) : groves.length === 0 ? (
              <div className="text-center py-20">
                <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Groves Found</h3>
                <p className="text-gray-600">No sacred groves recorded in {selectedDistrict} district</p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedDistrict} District
                  <span className="text-sm font-normal text-gray-600 ml-3">
                    ({groves.length} {groves.length === 1 ? 'grove' : 'groves'})
                  </span>
                </h2>

                <div className="grid gap-6">
                  {groves.map((grove) => (
                    <div key={grove._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{grove.name}</h3>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          {grove.district}
                          {grove.coordinates && (
                            <span className="ml-2 text-xs text-gray-500 font-mono">
                              ({grove.coordinates.lat.toFixed(4)}, {grove.coordinates.lng.toFixed(4)})
                            </span>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Natural History</div>
                            <p className="text-sm text-gray-900 leading-relaxed">{grove.natural_history}</p>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Present Status</div>
                            <p className="text-sm text-gray-900">{grove.present_status}</p>
                          </div>

                          {grove.threats && (
                            <div>
                              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Threats</div>
                              <p className="text-sm text-red-700">{grove.threats}</p>
                            </div>
                          )}

                          {grove.references && (
                            <div>
                              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">References</div>
                              <p className="text-sm text-gray-700 italic">{grove.references}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
