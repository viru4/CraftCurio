import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/utils/api';
import { Navbar, Footer } from '@/components/layout';
import {
  HeroSection,
  StorySection,
  MissionSection,
  TeamSection,
  TimelineSection,
  UniqueSection,
  ImpactSection,
  TestimonialsSection,
  GallerySection,
  CTASection
} from '@/components/aboutUs';
import { RefreshCw, AlertCircle } from 'lucide-react';

/**
 * About Us Page Component - Dynamic Version
 * Main page that combines all About Us sections
 * Fetches data from backend API and renders dynamically
 * Features smooth scrolling and responsive layout
 */
const AboutUs = () => {
  const [aboutUsData, setAboutUsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch About Us data from API
  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/about-us`);
        
        if (response.data.success) {
          setAboutUsData(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching About Us data:', err);
        setError('Failed to load About Us page. Using default content.');
        // Set default data if fetch fails
        setAboutUsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUsData();
  }, []);

  // Handle smooth scrolling for anchor links
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        e.preventDefault();
        const id = target.getAttribute('href').slice(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-16 md:pt-20 flex items-center justify-center">
          <div className="text-center p-8">
            <RefreshCw className="w-16 h-16 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-xl text-stone-600">Loading About Us page...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state - show default content
  if (error && !aboutUsData) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-8 text-center">
            <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-stone-800 mb-4">About Us</h1>
            <p className="text-lg text-stone-600 mb-6">{error}</p>
            <p className="text-stone-600">Showing default content. Please try refreshing the page.</p>
          </div>
          
          {/* Render default sections */}
          <HeroSection data={null} />
          <StorySection data={null} />
          <MissionSection data={null} />
          <TeamSection data={null} />
          <TimelineSection data={null} />
          <UniqueSection data={null} />
          <ImpactSection data={null} />
          <TestimonialsSection data={null} />
          <GallerySection data={null} />
          <CTASection data={null} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-20">
        {/* Hero Section - Welcome and introduction */}
        <HeroSection data={aboutUsData?.hero} />

        {/* Story Section - Company origin and journey */}
        <StorySection data={aboutUsData?.story} />

        {/* Mission Section - Goals, values, and vision */}
        <MissionSection data={aboutUsData?.mission} />

        {/* Team Section - Meet our team members */}
        <TeamSection data={aboutUsData?.team} />

        {/* Timeline Section - Milestones and achievements */}
        <TimelineSection data={aboutUsData?.timeline} />

        {/* Unique Section - What makes us different */}
        <UniqueSection data={aboutUsData?.unique} />

        {/* Impact Section - Community and social impact */}
        <ImpactSection data={aboutUsData?.impact} />

        {/* Testimonials Section - Customer reviews */}
        <TestimonialsSection data={aboutUsData?.testimonials} />

        {/* Gallery Section - Visual showcase */}
        <GallerySection data={aboutUsData?.gallery} />

        {/* CTA Section - Call to action and contact */}
        <CTASection data={aboutUsData?.contact} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
