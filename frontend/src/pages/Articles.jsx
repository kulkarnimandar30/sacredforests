import React, { useState } from 'react';
import { Calendar, User, Clock, Tag, ArrowRight } from 'lucide-react';
import { articles } from '../mock';

export const Articles = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique categories
  const categories = ['all', ...new Set(articles.map(article => article.category))];

  // Filter articles by category
  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Articles & Insights</h1>
          <p className="text-lg text-gray-600">Expert perspectives on community conservation and environmental stewardship</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category === 'all' ? 'All Articles' : category}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        {filteredArticles.length > 0 && (
          <div className="mb-8 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="md:flex">
              <div className="md:w-1/2 h-64 md:h-auto">
                <img
                  src={filteredArticles[0].image}
                  alt={filteredArticles[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-4">
                  FEATURED
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {filteredArticles[0].title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {filteredArticles[0].excerpt}
                </p>
                <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {filteredArticles[0].author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(filteredArticles[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {filteredArticles[0].readTime}
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all">
                  Read Full Article
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.slice(1).map((article) => (
            <article key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                </div>

                <button className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:gap-3 transition-all">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Tag className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};
