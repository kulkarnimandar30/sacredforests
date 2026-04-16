import React from 'react';
import { Leaf, Target, Users, Heart, BookOpen, Shield } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl mb-6">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Devrai</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Participatory Sacred Grove Database
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Initiative</h2>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p className="leading-relaxed">
              <strong className="text-emerald-700">Devrai</strong> (देवराई) is a Marathi word meaning "sacred grove" — 
              patches of forest or natural vegetation in Maharashtra dedicated to local deities and protected by communities through 
              traditional beliefs and practices. These sacred groves represent a unique intersection of cultural heritage, 
              spiritual significance, and biodiversity conservation in Maharashtra.
            </p>

            <p className="leading-relaxed">
              Our initiative aims to create a comprehensive database of sacred groves across Maharashtra, particularly in the 
              Pune district, documenting their natural history, present status, threats, and cultural significance. By bringing 
              together researchers, conservationists, local communities, and policymakers, we strive to ensure the protection 
              and preservation of these invaluable ecosystems for future generations.
            </p>

            <p className="leading-relaxed">
              Sacred groves in Maharashtra serve as biodiversity hotspots, often harboring rare and endangered plant and animal 
              species. They also play crucial roles in watershed protection, climate regulation, and maintaining ecological balance 
              in the Western Ghats region. Beyond their environmental value, these groves are living repositories of indigenous 
              knowledge, traditional practices, and Maharashtrian cultural identity.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To document, preserve, and promote sacred groves by creating an accessible database that empowers 
              communities, supports research, and informs conservation policies. We aim to bridge traditional 
              ecological knowledge with modern conservation science.
            </p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl p-8">
            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              A future where every sacred grove is recognized, protected, and celebrated as a vital component of 
              our natural and cultural heritage. We envision thriving ecosystems managed through collaborative 
              efforts between communities, scientists, and policymakers.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What We Offer</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Comprehensive Database</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                District-wise documentation of sacred groves with detailed information on natural history, 
                biodiversity, and cultural significance.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Threat Reporting</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Community-driven platform for reporting threats to sacred groves, enabling timely 
                intervention and conservation action.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Community Engagement</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Resources, research articles, and educational materials to support conservation 
                efforts and raise awareness.
              </p>
            </div>
          </div>
        </div>

        {/* How to Contribute */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">How You Can Help</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Report Threats</h3>
              <p className="text-emerald-50 leading-relaxed">
                If you observe any threats to sacred groves in your area, use our threat reporting 
                system to alert conservationists and authorities.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Share Knowledge</h3>
              <p className="text-emerald-50 leading-relaxed">
                Contribute to our database by sharing information about sacred groves, traditional 
                practices, and conservation success stories.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Spread Awareness</h3>
              <p className="text-emerald-50 leading-relaxed">
                Help us raise awareness about the importance of sacred groves by sharing our 
                resources and articles with your networks.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Support Research</h3>
              <p className="text-emerald-50 leading-relaxed">
                Researchers and students can access our database for academic studies and contribute 
                their findings back to the community.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            For more information or to get involved, please contact us at{' '}
            <a href="mailto:info@devrai.org" className="text-emerald-600 font-semibold hover:text-emerald-700">
              info@devrai.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
