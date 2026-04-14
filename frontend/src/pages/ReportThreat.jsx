import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';

export const ReportThreat = () => {
  const [groves, setGroves] = useState([]);
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    grove_id: '',
    grove_name: '',
    district: '',
    threat_type: '',
    description: '',
    severity: 'Medium',
    contact_email: '',
    contact_phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchGroves();
  }, []);

  const fetchGroves = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/groves`, {
        withCredentials: true
      });
      setGroves(data);
    } catch (error) {
      console.error('Error fetching groves:', error);
    }
  };

  const handleGroveSelect = (e) => {
    const groveId = e.target.value;
    const selectedGrove = groves.find(g => g._id === groveId);
    if (selectedGrove) {
      setFormData({
        ...formData,
        grove_id: groveId,
        grove_name: selectedGrove.name,
        district: selectedGrove.district
      });
    } else {
      setFormData({
        ...formData,
        grove_id: '',
        grove_name: '',
        district: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await axios.post(
        `${BACKEND_URL}/api/threats/report`,
        formData,
        { withCredentials: true }
      );
      setSuccess(true);
      setFormData({
        grove_id: '',
        grove_name: '',
        district: '',
        threat_type: '',
        description: '',
        severity: 'Medium',
        contact_email: '',
        contact_phone: ''
      });
    } catch (err) {
      setError('Failed to submit threat report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Report Threats</h1>
              <p className="text-gray-600">Help us protect sacred groves by reporting threats</p>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-700">
              <p className="font-semibold mb-1">Thank you for your report!</p>
              <p>Your threat report has been submitted successfully. Our team will review it and take appropriate action.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grove Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Sacred Grove *
              </label>
              <select
                value={formData.grove_id}
                onChange={handleGroveSelect}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Choose a grove...</option>
                {groves.map((grove) => (
                  <option key={grove._id} value={grove._id}>
                    {grove.name} ({grove.district})
                  </option>
                ))}
              </select>
            </div>

            {formData.district && (
              <div className="p-4 bg-emerald-50 rounded-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-emerald-900">
                  <strong>{formData.grove_name}</strong> - {formData.district} District
                </span>
              </div>
            )}

            {/* Threat Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type of Threat *
              </label>
              <select
                value={formData.threat_type}
                onChange={(e) => setFormData({ ...formData, threat_type: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select threat type...</option>
                <option value="Deforestation">Deforestation</option>
                <option value="Encroachment">Encroachment</option>
                <option value="Pollution">Pollution</option>
                <option value="Mining">Mining Activities</option>
                <option value="Agriculture">Agricultural Expansion</option>
                <option value="Construction">Construction/Development</option>
                <option value="Poaching">Poaching/Illegal Harvesting</option>
                <option value="Fire">Fire Hazard</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Severity Level *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, severity: level })}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      formData.severity === level
                        ? level === 'Critical'
                          ? 'bg-red-600 text-white'
                          : level === 'High'
                          ? 'bg-orange-600 text-white'
                          : level === 'Medium'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="6"
                placeholder="Please provide detailed information about the threat, including location specifics, timeline, and any observed impacts..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+91 XXXXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting Report...' : 'Submit Threat Report'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> All reports are reviewed by our team. For emergencies requiring immediate attention, 
              please also contact local forest authorities or conservation organizations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
