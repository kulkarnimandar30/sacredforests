import React from 'react';
import { Download, BookOpen, Microscope, FileText, Map, DollarSign, Scale, CloudRain, Users } from 'lucide-react';
import { resources } from '../mock';

const iconMap = {
  BookOpen,
  Microscope,
  FileText,
  Map,
  DollarSign,
  Scale,
  CloudRain,
  Users
};

export const Resources = () => {
  // Group resources by type
  const resourceTypes = [...new Set(resources.map(r => r.type))];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Educational Resources</h1>
          <p className="text-lg text-gray-600">Tools, guides, and materials to support community conservation efforts</p>
        </div>

        {/* Resource Types Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {resourceTypes.map((type, index) => {
            const count = resources.filter(r => r.type === type).length;
            const colors = ['emerald', 'teal', 'green', 'cyan'];
            const color = colors[index % colors.length];
            
            return (
              <div key={type} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className={`text-2xl font-bold text-${color}-600`}>{count}</div>
                <div className="text-sm text-gray-600">{type}</div>
              </div>
            );
          })}
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((resource) => {
            const IconComponent = iconMap[resource.icon] || FileText;
            
            return (
              <div key={resource.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all group border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {resource.title}
                      </h3>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full whitespace-nowrap ml-2">
                        {resource.type}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {resource.description}
                    </p>

                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all">
                      <Download className="w-4 h-4" />
                      Download Resource
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Resources Section */}
        <div className="mt-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need More Resources?</h2>
            <p className="text-emerald-50 mb-6 text-lg leading-relaxed">
              We're continuously developing new tools and materials. Subscribe to our newsletter to get notified when new resources become available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-emerald-700 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resource Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Educational Materials</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Comprehensive guides, toolkits, and training materials for community conservation practitioners.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Scale className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Legal & Policy</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Legal frameworks, policy templates, and advocacy tools for protecting community rights.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Microscope className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Research & Monitoring</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Scientific methods and protocols for biodiversity assessment and ecological monitoring.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
