import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Globe, TrendingUp, ArrowRight, Leaf, Shield, Heart } from 'lucide-react';

export const Home = () => {

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
              <span className="text-sm font-medium text-gray-700">Participatory Sacred Grove Conservation Initiative</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Sacred Grove
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Database
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Explore Devrai - a comprehensive database of 288 sacred groves across 10 districts in Maharashtra. Documenting natural history, biodiversity, and cultural significance of these ancient ecosystems protected by local communities.
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
                <Leaf className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">288</div>
              <div className="text-sm text-gray-600">Sacred Groves</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-2xl mb-4">
                <MapPin className="w-8 h-8 text-teal-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">10</div>
              <div className="text-sm text-gray-600">Districts</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">Maharashtra</div>
              <div className="text-sm text-gray-600">State</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
              <div className="text-sm text-gray-600">Community Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* What are Sacred Groves Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What are Sacred Groves?
            </h2>
            <p className="text-lg text-gray-600">
              Sacred Groves are patches of forest or natural vegetation dedicated to local deities and protected by communities through traditional beliefs, cultural practices where indigenous knowledge systems are rooted in forest conservation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cultural Heritage</h3>
              <p className="text-gray-600 leading-relaxed">
                Protected by indigenous and local communities through customary laws and traditional practices passed down through generations, representing living repositories of cultural identity.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Biodiversity Hotspots</h3>
              <p className="text-gray-600 leading-relaxed">
                Serve as refuges for rare and endangered species, harboring rich biodiversity including medicinal plants, native trees, and unique ecosystems critical for conservation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Spiritual Significance</h3>
              <p className="text-gray-600 leading-relaxed">
                Sacred sites associated with deities, ancestral worship, and spiritual practices that create a deep connection between communities and nature, ensuring long-term protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sacred Groves */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Explore Sacred Groves</h2>
              <p className="text-lg text-gray-600">Discover documented sacred groves across Maharashtra</p>
            </div>
            <Link
              to="/database"
              className="hidden md:inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="text-center py-12">
            <Leaf className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Login to Explore</h3>
            <p className="text-gray-600 mb-6">
              Access our comprehensive database of sacred groves by logging in
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Login to Continue
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Support Sacred Grove Conservation
          </h2>
          <p className="text-xl text-emerald-50 mb-8 leading-relaxed">
            Join the movement to document, preserve, and protect sacred groves across Maharashtra. Help us build a comprehensive database for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Learn More
            </Link>
            <Link
              to="/report-threat"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 text-white border-2 border-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors"
            >
              Report Threats
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
