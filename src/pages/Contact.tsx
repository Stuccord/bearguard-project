import { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowLeft, ArrowRight, Clock, Shield } from 'lucide-react';
import AppointmentModal from '../components/AppointmentModal';

interface ContactProps {
  onNavigate: (page: string) => void;
}

export default function Contact({ onNavigate }: ContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full">
        <button
          onClick={() => onNavigate('landing')}
          className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Contact <span className="text-orange-600">BearGuard</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are here to help you get the compensation you deserve. Fill out the form below or reach out directly to our support team.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Contact Info Panel */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 md:w-2/5 text-white flex flex-col pt-12">
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            <div className="space-y-8 flex-1">
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-orange-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone / WhatsApp</h3>
                  <p className="text-gray-300 text-lg">050 282 9901</p>
                  <p className="text-sm text-gray-400 mt-1">Available 24/7</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-blue-400 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-gray-300 text-lg">bearguard25@gmail.com</p>
                  <p className="text-sm text-gray-400 mt-1">Quick response guaranteed</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Office Location</h3>
                  <p className="text-gray-300 text-lg">Ghana</p>
                  <p className="text-sm text-gray-400 mt-1">Nationwide Coverage</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-6 h-6 text-yellow-400 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Working Hours</h3>
                  <p className="text-gray-300">Monday - Friday: 8AM - 6PM</p>
                  <p className="text-gray-300">Saturday: 9AM - 2PM</p>
                  <p className="text-sm text-gray-400 mt-1">Emergency Support 24/7</p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-white/10 p-6 rounded-2xl border border-white/20">
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="w-6 h-6 text-orange-400" />
                <h4 className="font-bold text-lg">Free Consultation</h4>
              </div>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                Not sure if you have a valid claim? Speak directly with one of our experts at no cost.
              </p>
              <button 
                onClick={() => setAppointmentModalOpen(true)}
                className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-10 md:w-3/5 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {submitSuccess ? (
              <div className="bg-green-50 text-green-800 p-8 rounded-2xl border border-green-200 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">Message Sent!</h3>
                <p className="text-lg">Thank you for reaching out to BearGuard. One of our experts will contact you shortly.</p>
                <button 
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="first_name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="last_name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="e.g. 050 282 9901"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">How can we help you?</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    placeholder="Please describe your accident or claim issue briefly..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 font-bold text-white text-lg transition-all ${
                    isSubmitting 
                      ? 'bg-orange-400 cursor-not-allowed' 
                      : 'bg-orange-600 hover:bg-orange-700 active:scale-[0.98]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
      />
    </div>
  );
}
