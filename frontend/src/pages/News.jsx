import React from 'react';
import { ExternalLink, Calendar, Newspaper, TrendingUp } from 'lucide-react';
import { news } from '../mock';

export const News = () => {
  const latestNews = news[0];
  const otherNews = news.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Latest News</h1>
          <p className="text-lg text-gray-600">Stay updated with the latest developments in community conservation</p>
        </div>

        {/* Latest News - Featured */}
        <div className="mb-8 bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="md:flex">
            <div className="md:w-1/2 h-64 md:h-96">
              <img
                src={latestNews.image}
                alt={latestNews.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  BREAKING NEWS
                </span>
                <span className="text-sm text-gray-500">{latestNews.source}</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {latestNews.title}
              </h2>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar className="w-4 h-4" />
                {new Date(latestNews.date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {latestNews.summary}
              </p>
              
              <a
                href={latestNews.link}
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
              >
                Read Full Story
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Other News */}
        <div className="grid md:grid-cols-3 gap-6">
          {otherNews.map((item) => (
            <article key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                  <span className="text-gray-300">•</span>
                  <span>{item.source}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>

                <a
                  href={item.link}
                  className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:gap-3 transition-all"
                >
                  Read More
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Newspaper className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Never Miss an Update</h2>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Get the latest news, research, and success stories from the community conservation movement delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                Subscribe
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-4">Join 10,000+ conservationists worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );
};
