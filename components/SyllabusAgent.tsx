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
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">AI Syllabus Agent</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create your personalized learning curriculum</p>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Tell me about yourself and your learning goals, and I'll create a personalized curriculum just for you!
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        {curriculum && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300 font-medium">Your Personalized Curriculum</span>
            </div>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {curriculum}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
