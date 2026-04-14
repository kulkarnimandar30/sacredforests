import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Globe, TrendingUp, ArrowRight, Leaf, Shield, Heart } from 'lucide-react';
import { stats, communityConservedAreas } from '../mock';

export const Home = () => {
  const featuredCCAs = communityConservedAreas.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 opacity-70"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">Community-Led Conservation</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Protecting Nature Through
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Community Action
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover and support Community Conserved Areas (CCAs) worldwide—territories and ecosystems voluntarily conserved by indigenous peoples and local communities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/map"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                <MapPin className="w-5 h-5" />
                Explore Map
              </Link>
              <Link
                to="/database"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
              >
                Browse Database
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
                <Globe className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalCCAs}</div>
              <div className="text-sm text-gray-600">CCAs Worldwide</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-2xl mb-4">
                <MapPin className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.areasProtected}</div>
              <div className="text-sm text-gray-600">Area Protected</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.communitiesInvolved}</div>
              <div className="text-sm text-gray-600">People Involved</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.countriesRepresented}</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* What are CCAs Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What are Community Conserved Areas?
            </h2>
            <p className="text-lg text-gray-600">
              CCAs are natural and modified ecosystems, including significant biodiversity, ecological services, and cultural values, voluntarily conserved by indigenous peoples and local communities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Governed</h3>
              <p className="text-gray-600 leading-relaxed">
                Managed by local communities and indigenous peoples using traditional knowledge and customary practices passed down through generations.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Biodiversity Protection</h3>
              <p className="text-gray-600 leading-relaxed">
                Safeguarding critical ecosystems, endangered species, and genetic diversity while maintaining ecological balance and natural processes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cultural Heritage</h3>
              <p className="text-gray-600 leading-relaxed">
                Preserving sacred sites, traditional practices, and indigenous knowledge systems that are intrinsically linked to these landscapes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured CCAs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Featured CCAs</h2>
              <p className="text-lg text-gray-600">Explore remarkable examples of community-led conservation</p>
            </div>
            <Link
              to="/database"
              className="hidden md:inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCCAs.map((cca) => (
              <div key={cca.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cca.image}
                    alt={cca.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-emerald-700">
                    {cca.area}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    {cca.location}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {cca.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {cca.description}
                  </p>
                  <Link
                    to={`/database`}
                    className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:gap-3 transition-all"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/database"
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
            >
              View All CCAs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Support Community Conservation
          </h2>
          <p className="text-xl text-emerald-50 mb-8 leading-relaxed">
            Join the global movement to recognize, support, and strengthen community-led conservation initiatives worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/resources"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Get Resources
            </Link>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 text-white border-2 border-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors"
            >
              Get Involved
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
