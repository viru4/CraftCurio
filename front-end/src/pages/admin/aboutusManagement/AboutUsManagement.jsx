import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { 
  Save, RefreshCw, Eye, EyeOff, AlertCircle, CheckCircle, 
  ChevronDown, ChevronUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminSidebar from '../components/AdminSidebar';
import HeroEditor from './components/HeroEditor';
import StoryEditor from './components/StoryEditor';
import MissionEditor from './components/MissionEditor';
import TeamEditor from './components/TeamEditor';
import TimelineEditor from './components/TimelineEditor';
import UniqueEditor from './components/UniqueEditor';
import ImpactEditor from './components/ImpactEditor';
import TestimonialsEditor from './components/TestimonialsEditor';
import GalleryEditor from './components/GalleryEditor';
import ContactEditor from './components/ContactEditor';

/**
 * About Us Management Component
 * Admin dashboard for managing all About Us page content
 * Features section-based editing with expand/collapse functionality
 */
const AboutUsManagement = () => {
  const [aboutUsData, setAboutUsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    hero: true,
    story: false,
    mission: false,
    team: false,
    timeline: false,
    unique: false,
    impact: false,
    testimonials: false,
    gallery: false,
    contact: false
  });

  // Fetch About Us data on component mount
  useEffect(() => {
    fetchAboutUsData();
  }, []);

  /**
   * Fetch About Us data from backend
   */
  const fetchAboutUsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/api/about-us`);
      
      if (response.data.success) {
        setAboutUsData(response.data.data);
      }
    } catch (err) {
      setError('Failed to load About Us data: ' + err.message);
      console.error('Error fetching About Us data:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update specific section
   */
  const updateSection = async (section, data) => {
    try {
      setSaving(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_BASE_URL}/api/about-us/${section}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
        setSuccess(`${sectionName} section updated successfully!`);
        
        // Show browser alert
        alert(`✓ ${sectionName} section saved successfully!`);
        
        // Update local state
        setAboutUsData(prev => ({
          ...prev,
          [section]: response.data.data
        }));
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(`Failed to update ${section}: ${errorMsg}`);
      console.error(`Error updating ${section}:`, err.response?.data || err);
      
      // Show browser alert for error
      alert(`❌ Failed to save ${section} section: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Save all changes
   */
  const saveAllChanges = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/api/about-us`,
        aboutUsData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess('All changes saved successfully!');
        
        // Show browser alert
        alert('✓ All changes saved successfully!');
        
        setAboutUsData(response.data.data);
        
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Failed to save changes: ' + (err.response?.data?.message || err.message));
      console.error('Error saving changes:', err);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Toggle publish status
   */
  const togglePublishStatus = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(
        `${API_BASE_URL}/api/about-us/publish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        const status = response.data.data.isPublished ? 'published' : 'unpublished';
        
        setAboutUsData(prev => ({
          ...prev,
          isPublished: response.data.data.isPublished
        }));
        
        setSuccess(`Page ${status} successfully!`);
        
        // Show browser alert
        alert(`✓ About Us page ${status} successfully!`);
        
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Failed to toggle publish status: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Toggle section expansion
   */
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-stone-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-lg text-stone-600">Loading About Us data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!aboutUsData) {
    return (
      <div className="flex min-h-screen bg-stone-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-lg text-red-600">Failed to load data</p>
            <Button onClick={fetchAboutUsData} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-stone-800 mb-2">
                About Us Page Management
              </h1>
              <p className="text-stone-600">
                Manage all content for the About Us page
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={togglePublishStatus}
                variant={aboutUsData.isPublished ? "outline" : "default"}
                disabled={saving}
                className="flex items-center gap-2"
              >
                {aboutUsData.isPublished ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Published
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Unpublished
                  </>
                )}
              </Button>

              <Button
                onClick={fetchAboutUsData}
                variant="outline"
                disabled={loading || saving}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Button
                onClick={saveAllChanges}
                disabled={saving}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save All Changes'}
              </Button>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800">{success}</p>
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {/* Hero Section */}
          <SectionCard
            title="Hero Section"
            description="Welcome headline, tagline, and hero image"
            expanded={expandedSections.hero}
            onToggle={() => toggleSection('hero')}
          >
            <HeroEditor
              data={aboutUsData.hero}
              onChange={(data) => setAboutUsData(prev => ({ ...prev, hero: data }))}
              onSave={(data) => updateSection('hero', data)}
              saving={saving}
            />
          </SectionCard>

          {/* Story Section */}
          <SectionCard
            title="Story Section"
            description="Company origin, journey, and inspiration"
            expanded={expandedSections.story}
            onToggle={() => toggleSection('story')}
          >
            <StoryEditor
              data={aboutUsData.story}
              onChange={(data) => setAboutUsData(prev => ({ ...prev, story: data }))}
              onSave={(data) => updateSection('story', data)}
              saving={saving}
            />
          </SectionCard>

          {/* Mission Section */}
          <SectionCard
            title="Mission & Values"
            description="Mission statement, vision, and core values"
            expanded={expandedSections.mission}
            onToggle={() => toggleSection('mission')}
          >
            <MissionEditor
              data={aboutUsData.mission}
              onChange={(data) => setAboutUsData(prev => ({ ...prev, mission: data }))}
              onSave={(data) => updateSection('mission', data)}
              saving={saving}
            />
          </SectionCard>

          {/* Team Section */}
          <SectionCard
            title="Team Members"
            description="Team profiles with photos and bios"
            expanded={expandedSections.team}
            onToggle={() => toggleSection('team')}
          >
            <TeamEditor
              data={aboutUsData.team}
              onChange={(data) => setAboutUsData(prev => ({ ...prev, team: data }))}
              onSave={(data) => updateSection('team', data)}
              saving={saving}
            />
          </SectionCard>

          {/* Timeline Section */}
          <SectionCard
            title="Timeline & Milestones"
            description="Company milestones and achievements"
            expanded={expandedSections.timeline}
            onToggle={() => toggleSection('timeline')}
          >
            <TimelineEditor
              data={aboutUsData.timeline}
              onChange={(data) => setAboutUsData(prev => ({ ...prev, timeline: data }))}
              onSave={(data) => updateSection('timeline', data)}
              saving={saving}
            />
          </SectionCard>

          {/* Unique Section */}
          <SectionCard
            title="Unique Selling Points"
            description="What makes CraftCurio different"
            expanded={expandedSections.unique}
            onToggle={() => toggleSection('unique')}
          >
            <UniqueEditor
              data={aboutUsData.unique}
              onChange={(data) => setAboutUsData(prev => ({ ...prev, unique: data }))}
              onSave={(data) => updateSection('unique', data)}
              saving={saving}
            />
          </SectionCard>

          {/* Impact Section */}
          <SectionCard
            title="Community Impact"
            description="Statistics, initiatives, and impact stories"
            expanded={expandedSections.impact}
            onToggle={() => toggleSection('impact')}
          >
            <ImpactEditor
              data={aboutUsData.impact}
              onChange={(data) => setAboutUsData(prev => ({ ...prev, impact: data }))}
              onSave={(data) => updateSection('impact', data)}
              saving={saving}
            />
          </SectionCard>

          {/* Testimonials Section */}
          <SectionCard
            title="Testimonials"
            description="Customer and artisan testimonials"
            expanded={expandedSections.testimonials}
            onToggle={() => toggleSection('testimonials')}
          >
            <TestimonialsEditor
              data={aboutUsData.testimonials}
              onChange={(data) => setAboutUsData(prev => ({ ...prev, testimonials: data }))}
              onSave={(data) => updateSection('testimonials', data)}
              saving={saving}
            />
          </SectionCard>

          {/* Gallery Section */}
          <SectionCard
            title="Gallery"
            description="Image gallery with categories"
            expanded={expandedSections.gallery}
            onToggle={() => toggleSection('gallery')}
          >
            <GalleryEditor
              data={aboutUsData.gallery}
              onChange={(data) => setAboutUsData(prev => ({ ...prev, gallery: data }))}
              onSave={(data) => updateSection('gallery', data)}
              saving={saving}
            />
          </SectionCard>

          {/* Contact Section */}
          <SectionCard
            title="Contact & Social Links"
            description="Contact information and social media links"
            expanded={expandedSections.contact}
            onToggle={() => toggleSection('contact')}
          >
            <ContactEditor
              data={aboutUsData.contact}
              onChange={(data) => setAboutUsData(prev => ({ ...prev, contact: data }))}
              onSave={(data) => updateSection('contact', data)}
              saving={saving}
            />
          </SectionCard>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Reusable Section Card Component
 * Provides expand/collapse functionality for each section
 */
const SectionCard = ({ title, description, expanded, onToggle, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
      >
        <div className="text-left">
          <h2 className="text-xl font-bold text-stone-800">{title}</h2>
          <p className="text-sm text-stone-600 mt-1">{description}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-6 h-6 text-stone-600" />
        ) : (
          <ChevronDown className="w-6 h-6 text-stone-600" />
        )}
      </button>
      
      {expanded && (
        <div className="px-6 py-6 border-t border-stone-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default AboutUsManagement;
