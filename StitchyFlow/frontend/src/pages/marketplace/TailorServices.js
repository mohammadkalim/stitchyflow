import React, { useState, useEffect } from 'react';
import PageTemplate from '../../components/PageTemplate';

/**
 * Tailor Services Page
 * Displays all tailor services live from database
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */

function TailorServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services from database
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/v1/tailor-services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
      } else {
        setError('Failed to fetch services');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/tailor-services/meta/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(['All', ...data.data]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const popularServices = services.filter(service => service.is_popular);
  const regularServices = services.filter(service => !service.is_popular);

  const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {service.image_url && (
        <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <img 
            src={service.image_url} 
            alt={service.service_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="text-6xl">🧵</div>
              `;
            }}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">{service.service_name}</h3>
          {service.is_popular && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
              ⭐ Popular
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.service_description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
            {service.category}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            service.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
            service.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            service.difficulty_level === 'advanced' ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {service.difficulty_level}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-green-600">Rs. {service.base_price}</span>
            {service.price_range_min && service.price_range_max && (
              <span className="text-gray-500 text-sm ml-2">
                (Rs. {service.price_range_min} - Rs. {service.price_range_max})
              </span>
            )}
          </div>
        </div>

        {service.estimated_duration_hours && (
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <span className="mr-2">⏱️</span>
            <span>~{service.estimated_duration_hours} hours</span>
          </div>
        )}

        {service.tags && Array.isArray(service.tags) && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {service.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
          Book Service
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tailor Services</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Explore our comprehensive range of professional tailoring services, from custom garments to expert alterations
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Services Display */}
        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl font-bold text-blue-600">{services.length}</div>
                <div className="text-gray-600">Total Services</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl font-bold text-green-600">{popularServices.length}</div>
                <div className="text-gray-600">Popular Services</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl font-bold text-purple-600">{categories.length - 1}</div>
                <div className="text-gray-600">Categories</div>
              </div>
            </div>

            {/* Popular Services Section */}
            {popularServices.length > 0 && selectedCategory === 'All' && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-2">⭐</span> Popular Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularServices.map(service => (
                    <ServiceCard key={service.service_id} service={service} />
                  ))}
                </div>
              </div>
            )}

            {/* All Services Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {selectedCategory === 'All' ? 'All Services' : selectedCategory}
              </h2>
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map(service => (
                    <ServiceCard key={service.service_id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-600">No services found in this category</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer Note */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            All services are displayed in real-time from our database. Prices may vary based on fabric choice and complexity.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TailorServices;
