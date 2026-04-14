import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Filter, Calendar, Leaf } from 'lucide-react';

export const Database = () => {
  const [groves, setGroves] = useState([]);
  const [filteredGroves, setFilteredGroves] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchGroves();
    fetchDistricts();
  }, []);

  useEffect(() => {
    filterGroves();
  }, [searchTerm, selectedDistrict, groves]);

  const fetchGroves = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/groves`, {
        withCredentials: true
      });
      setGroves(data);
      setFilteredGroves(data);
    } catch (err) {
      setError('Failed to load sacred groves');
      console.error('Error fetching groves:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/districts`, {
        withCredentials: true
      });
      setDistricts(['all', ...data]);
    } catch (err) {
      console.error('Error fetching districts:', err);
    }
  };

  const filterGroves = () => {
    let filtered = groves;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(grove =>
        grove.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grove.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by district
    if (selectedDistrict !== 'all') {
      filtered = filtered.filter(grove => grove.district === selectedDistrict);
    }

    setFilteredGroves(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sacred groves...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Sacred Groves Database</h1>
          <p className="text-lg text-gray-600">Browse our comprehensive database of 288 sacred groves across 10 districts in Maharashtra</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* District Filter */}
            <div className="relative md:w-64">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
              >
                {districts.map(district => (
                  <option key={district} value={district}>
                    {district === 'all' ? 'All Districts' : district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredGroves.length}</span> of {groves.length} sacred groves
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Groves Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredGroves.map((grove) => (
            <div key={grove._id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="md:flex">
                {/* Image */}
                {grove.image && (
                  <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                    <img
                      src={grove.image}
                      alt={grove.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className={`${grove.image ? 'md:w-2/3' : 'w-full'} p-6`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{grove.name}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    {grove.district}
                  </div>

                  <div className="space-y-2 mb-4">
                    {grove.coordinates && (
                      <div className="text-xs text-gray-500 font-mono">
                        Coordinates: {grove.coordinates.lat.toFixed(4)}, {grove.coordinates.lng.toFixed(4)}
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {grove.natural_history}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                      {grove.present_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expandable Details */}
              <details className="border-t border-gray-100">
                <summary className="px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors text-sm font-semibold text-emerald-700">
                  View Full Details
                </summary>
                <div className="px-6 py-4 bg-gray-50 space-y-3">
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
              </details>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredGroves.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Leaf className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sacred Groves Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
