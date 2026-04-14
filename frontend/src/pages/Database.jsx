import React, { useState } from 'react';
import { Search, MapPin, Filter, Calendar, Users } from 'lucide-react';
import { communityConservedAreas } from '../mock';

export const Database = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  // Get unique countries for filter
  const countries = ['all', ...new Set(communityConservedAreas.map(cca => cca.location.split(', ').pop()))];

  // Filter CCAs based on search and country
  const filteredCCAs = communityConservedAreas.filter(cca => {
    const matchesSearch = cca.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cca.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cca.community.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || cca.location.includes(selectedCountry);
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">CCA Database</h1>
          <p className="text-lg text-gray-600">Browse our comprehensive database of Community Conserved Areas worldwide</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, location, or community..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Country Filter */}
            <div className="relative md:w-64">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
              >
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country === 'all' ? 'All Countries' : country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredCCAs.length}</span> of {communityConservedAreas.length} CCAs
          </div>
        </div>

        {/* CCA Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCCAs.map((cca) => (
            <div key={cca.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                  <img
                    src={cca.image}
                    alt={cca.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-semibold text-emerald-700">
                    {cca.area}
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{cca.name}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    {cca.location}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500">Established:</span>
                        <span className="text-gray-900 ml-1 font-medium">{cca.established}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500">Community:</span>
                        <span className="text-gray-900 ml-1 font-medium">{cca.community}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {cca.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                      {cca.conservation_status}
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
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Biodiversity</div>
                    <p className="text-sm text-gray-900 leading-relaxed">{cca.biodiversity}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Threats</div>
                    <p className="text-sm text-gray-900">{cca.threats}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Coordinates</div>
                    <p className="text-sm text-gray-900 font-mono">
                      {cca.coordinates.lat.toFixed(4)}, {cca.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCCAs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No CCAs Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};
