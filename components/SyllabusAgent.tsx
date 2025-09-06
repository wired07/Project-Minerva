'use client';

import { useState } from 'react';
import { BookOpen, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SyllabusAgentProps {
  onCurriculumGenerated: (curriculum: string) => void;
}

export default function SyllabusAgent({ onCurriculumGenerated }: SyllabusAgentProps) {
  const [formData, setFormData] = useState({
    previousKnowledge: '',
    experience: '',
    class: '',
    testScores: '',
    grades: '',
    subjects: '',
    learningGoals: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [curriculum, setCurriculum] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setCurriculum('');

    try {
      const response = await fetch('/api/syllabus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate curriculum');
      }

      setCurriculum(data.curriculum);
      onCurriculumGenerated(data.curriculum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">AI Syllabus Agent</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Tell me about yourself and your learning goals, and I'll create a personalized curriculum just for you!
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Previous Knowledge *
            </label>
            <textarea
              name="previousKnowledge"
              value={formData.previousKnowledge}
              onChange={handleInputChange}
              className="input-field h-20 resize-none"
              placeholder="Describe what you already know about the subject..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level *
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select your level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class/Grade *
            </label>
            <input
              type="text"
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., Grade 10, College Freshman"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Scores (Optional)
            </label>
            <input
              type="text"
              name="testScores"
              value={formData.testScores}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., SAT: 1200, Math: 85%"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recent Grades (Optional)
            </label>
            <input
              type="text"
              name="grades"
              value={formData.grades}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., A in Math, B+ in Science"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subjects of Interest *
            </label>
            <input
              type="text"
              name="subjects"
              value={formData.subjects}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., Mathematics, Physics, Chemistry"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Goals *
          </label>
          <textarea
            name="learningGoals"
            value={formData.learningGoals}
            onChange={handleInputChange}
            className="input-field h-24 resize-none"
            placeholder="What do you want to achieve? What are your learning objectives?"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Curriculum...
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4" />
              Generate My Curriculum
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {curriculum && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 font-medium">Your Personalized Curriculum</span>
          </div>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {curriculum}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
