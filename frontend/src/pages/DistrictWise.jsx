import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Search, Trees, ChevronDown } from 'lucide-react';

export const DistrictWise = () => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [groves, setGroves] = useState([]);
  const [filteredGroves, setFilteredGroves] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== 'all') {
      fetchGrovesByDistrict(selectedDistrict);
    } else if (selectedDistrict === 'all') {
      fetchAllGroves();
    }
  }, [selectedDistrict]);

  useEffect(() => {
    // Filter groves based on search term
    if (searchTerm.trim() === '') {
      setFilteredGroves(groves);
    } else {
      const filtered = groves.filter(grove =>
        grove.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grove.natural_history?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grove.present_status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGroves(filtered);
    }
  }, [searchTerm, groves]);

  const fetchDistricts = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/districts`, {
        withCredentials: true
      });
      const sortedDistricts = data.sort();
      setDistricts(sortedDistricts);
      if (sortedDistricts.length > 0) {
        setSelectedDistrict(sortedDistricts[0]);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllGroves = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/groves`);
      setGroves(data);
      setFilteredGroves(data);
    } catch (error) {
      console.error('Error fetching groves:', error);
    }
  };

  const fetchGrovesByDistrict = async (district) => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/groves/by-district/${district}`);
      setGroves(data);
      setFilteredGroves(data);
    } catch (error) {
      console.error('Error fetching groves:', error);
    }
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setSearchTerm('');
    setDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">District Wise SGs</h1>
          <p className="text-lg text-gray-600">Participatory Sacred Grove Database - Maharashtra</p>
        </div>

        {/* District Statistics Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Trees className="w-5 h-5 text-emerald-600" />
            Sacred Groves Distribution Across Districts
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600">288</div>
              <div className="text-xs text-gray-600 mt-1">Total SGs</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">141</div>
              <div className="text-xs text-gray-600 mt-1">Pune</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">71</div>
              <div className="text-xs text-gray-600 mt-1">Kolhapur</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-indigo-600">21</div>
              <div className="text-xs text-gray-600 mt-1">Thana</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-teal-600">10</div>
              <div className="text-xs text-gray-600 mt-1">Districts</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-600 text-center">
            Other districts: Satara (16), Kolaba (14), Ratnagiri (11), Jalgaon (4), Chandrapur (4), Bhandara (3), Yeotmal (3)
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* District Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select District
              </label>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-emerald-500 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <span className="text-gray-900 font-medium">
                    {selectedDistrict || 'Choose a district...'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {districts.map((district) => (
                      <button
                        key={district}
                        onClick={() => handleDistrictChange(district)}
                        className={`w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors ${
                          selectedDistrict === district ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {district}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Sacred Groves
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, history, or status..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Results Count */}
          {selectedDistrict && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-emerald-700">{filteredGroves.length}</span> of{' '}
                <span className="font-semibold">{groves.length}</span> sacred groves
                {selectedDistrict !== 'all' && <> in <span className="font-semibold">{selectedDistrict}</span> district</>}
              </p>
            </div>
          )}
        </div>

        {/* Groves Display */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading districts...</p>
          </div>
        ) : !selectedDistrict ? (
          <div className="text-center py-20">
            <Trees className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a District</h3>
            <p className="text-gray-600">Choose a district from the dropdown to view its sacred groves</p>
          </div>
        ) : filteredGroves.length === 0 ? (
          <div className="text-center py-20">
            <Trees className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Groves Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'No sacred groves match your search criteria' : `No sacred groves recorded in ${selectedDistrict} district`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredGroves.map((grove, index) => (
              <div key={grove._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Trees className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{grove.name}</h3>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium">{grove.district} District</span>
                        {grove.coordinates && (
                          <span className="ml-2 text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                            {grove.coordinates.lat.toFixed(6)}, {grove.coordinates.lng.toFixed(6)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                        SG #{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  {grove.location && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">GPS Location</div>
                      <p className="text-sm text-gray-700 font-mono">{grove.location}</p>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-emerald-700 uppercase mb-2 flex items-center gap-1">
                        <div className="w-1 h-4 bg-emerald-600 rounded"></div>
                        Natural History
                      </div>
                      <p className="text-sm text-gray-900 leading-relaxed">{grove.natural_history}</p>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-blue-700 uppercase mb-2 flex items-center gap-1">
                        <div className="w-1 h-4 bg-blue-600 rounded"></div>
                        Present Status
                      </div>
                      <p className="text-sm text-gray-900">{grove.present_status}</p>
                    </div>

                    {grove.threats && (
                      <div>
                        <div className="text-xs font-semibold text-red-700 uppercase mb-2 flex items-center gap-1">
                          <div className="w-1 h-4 bg-red-600 rounded"></div>
                          Threats
                        </div>
                        <p className="text-sm text-red-700 whitespace-pre-line">{grove.threats}</p>
                      </div>
                    )}

                    {grove.references && (
                      <div>
                        <div className="text-xs font-semibold text-gray-700 uppercase mb-2 flex items-center gap-1">
                          <div className="w-1 h-4 bg-gray-600 rounded"></div>
                          References
                        </div>
                        <p className="text-sm text-gray-700 italic whitespace-pre-line">{grove.references}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
   </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
