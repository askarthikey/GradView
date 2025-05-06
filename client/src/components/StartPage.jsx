import React from "react";
import hero from "../assets/image.jpg";
import vnrlogo from '../assets/vnrlogo.jpg'
import {useUser } from "@clerk/clerk-react";
import {useNavigate} from 'react-router-dom'

const StartPage = () => {
  const { isSignedIn } = useUser();
  const navigate=useNavigate()
  if(isSignedIn) navigate('/home')
  return (
    <div className="text-gray-900 bg-gray-50">
      {/* Hero Section (Full Screen) */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 py-16 md:py-0 gap-10">
        {/* Left Content */}
        <div className="w-full md:w-1/2 space-y-6">
          <span className="inline-block px-4 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-2">Student Success Platform</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
            Connect, Track, and Succeed
          </h1>
          <p className="text-lg text-gray-600 max-w-xl">
            Empowering students and alumni with comprehensive data management and insightful analysis. Strengthen connections, track achievements, and visualize progress with GradView — gateway to smarter academic and professional growth.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-md hover:shadow-lg transition">
              Join GradView
            </button>
            <button className="px-6 py-3 text-lg font-semibold rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 transition">
              Watch Demo
            </button>
          </div>
          
          {/* Trust Badges */}
          <div className="pt-8 mt-8 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-6">Trusted by leading institutions</p>
            <div className="flex flex-wrap items-center gap-8">
              <div className="h-14 bg-white shadow-sm rounded-lg px-6 py-2 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
                <img src={vnrlogo} className="h-10 w-auto object-contain" alt="VNR Institution" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Image with Float Effect */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-[70vh] relative">
          <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-r from-red-200 to-yellow-200 rounded-xl transform rotate-2"></div>
          <img
            src={hero}
            alt="GradView Dashboard"
            className="w-full h-full object-cover rounded-xl shadow-lg relative z-10"
          />
          
          {/* Floating Stats */}
          <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg z-20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-bold">10,000+ Students Connected</span>
            </div>
          </div>
          
          {/* Additional Floating Stat */}
          <div className="absolute top-6 -right-5 bg-white p-4 rounded-lg shadow-lg z-20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="font-bold">500+ Alumni Networks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Data Tracking Section */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm font-semibold mb-2">Comprehensive Tracking</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-4">
              Track Your Academic Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              GradView is a comprehensive web application for storing statistics and data of students, fostering connections between alumni and current students, and providing powerful visualization tools for better analysis.
            </p>
          </div>
          
          {/* Data Tracking Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {[
              { name: "Publications", icon: "📑", color: "from-red-100 to-red-200", desc: "Track research papers and academic publications" },
              { name: "Projects", icon: "💻", color: "from-orange-100 to-orange-200", desc: "Document all academic and personal projects" },
              { name: "Coding Profiles", icon: "⚡", color: "from-yellow-100 to-yellow-200", desc: "Connect and showcase your programming skills" },
              { name: "Achievements", icon: "🏆", color: "from-amber-100 to-amber-200", desc: "Record awards, certifications and recognitions" }
            ].map((item, index) => (
              <div
                key={index}
                className={`p-6 bg-gradient-to-br ${item.color} rounded-xl shadow-md text-center hover:shadow-lg transition-all cursor-pointer group`}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">{item.name}</h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
                <button className="mt-4 px-4 py-2 text-sm bg-white rounded-lg text-red-600 font-medium shadow hover:shadow-md">
                  Learn More
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-16 p-8 bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-3">Data-Driven Insights</h3>
                <p className="text-gray-600">
                  GradView provides powerful graphical representations for better analysis of student performance, career trajectories, and institutional growth. Make informed decisions with our comprehensive analytics tools.
                </p>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
                  📊
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-2">Powerful Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-4">
              Features That Set GradView Apart
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the tools and resources designed to enhance your academic journey and professional connections
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            <div className="flex-1 bg-gradient-to-r from-red-500 to-yellow-500 p-8 md:p-10 rounded-xl text-white flex flex-col justify-center">
              <span className="text-5xl mb-4">🔍</span>
              <h3 className="text-2xl font-bold mb-3">Alumni Network</h3>
              <p className="text-yellow-100">
                Connect with graduates from your institution who are now industry leaders. Access mentorship, job opportunities, and valuable insights from those who've walked your path.
              </p>
              <button className="mt-6 self-start px-6 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition">
                Explore Network
              </button>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-red-500">
                <div className="flex items-start">
                  <div className="p-3 bg-red-100 rounded-lg mr-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">Visualization Tools</h3>
                    <p className="text-gray-600 mt-2">
                      Interactive dashboards and graphical representations help you analyze data patterns, track progress, and identify growth opportunities at a glance.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-orange-500">
                <div className="flex items-start">
                  <div className="p-3 bg-orange-100 rounded-lg mr-4">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">Profile Integration</h3>
                    <p className="text-gray-600 mt-2">
                      Seamlessly connect your coding profiles, research publications, and professional accounts for a comprehensive digital presence.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-yellow-500">
                <div className="flex items-start">
                  <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">Achievement Showcase</h3>
                    <p className="text-gray-600 mt-2">
                    Highlight and celebrate student accomplishments, including projects, publications, patents, and coding achievements. Inspire others by showcasing success stories and fostering a culture of excellence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-2">Impact</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-4">
              GradView by the Numbers
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "10,000+", label: "Students", icon: "👨‍🎓" },
              { value: "500+", label: "Institutions", icon: "🏛️" },
              { value: "25,000+", label: "Projects Tracked", icon: "📊" },
              { value: "8,500+", label: "Alumni Connections", icon: "🤝" }
            ].map((stat, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-xl shadow-sm text-center hover:shadow-md transition">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-yellow-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Academic Journey?</h2>
          <p className="text-yellow-100 mb-10 text-lg max-w-2xl mx-auto">
            Join thousands of students and alumni who are connecting, tracking, and visualizing their path to success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-red-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition">
              Get Started Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StartPage;