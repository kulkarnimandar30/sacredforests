import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Globe, Facebook, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg">Devrai</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Documenting and preserving sacred groves across districts. Empowering communities to protect their natural and cultural heritage.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-emerald-400 transition-colors">Interactive Map</Link>
              </li>
              <li>
                <Link to="/database" className="hover:text-emerald-400 transition-colors">Sacred Groves Database</Link>
              </li>
              <li>
                <Link to="/district-wise" className="hover:text-emerald-400 transition-colors">District-wise Groves</Link>
              </li>
              <li>
                <Link to="/report-threat" className="hover:text-emerald-400 transition-colors">Report Threats</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/articles" className="hover:text-emerald-400 transition-colors">Articles & Insights</Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-emerald-400 transition-colors">Educational Resources</Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-emerald-400 transition-colors">Latest News</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">About the Initiative</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500" />
                <a href="mailto:info@devrai.org" className="hover:text-emerald-400 transition-colors">
                  info@devrai.org
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  www.devrai.org
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h5 className="text-white text-sm font-semibold mb-2">Subscribe to Newsletter</h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Devrai - Sacred Groves Database. All rights reserved. Built with care for conservation.</p>
        </div>
      </div>
    </footer>
  );
};
