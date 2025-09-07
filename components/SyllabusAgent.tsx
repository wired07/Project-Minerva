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
    <div className="card">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white dark:text-black" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">syllabus agent</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">create your personalized learning curriculum</p>
          </div>
        </div>
        
        <p className="section-content">
          tell me about yourself and your learning goals, and i'll create a personalized curriculum just for you!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              previous knowledge *
            </label>
            <textarea
              name="previousKnowledge"
              value={formData.previousKnowledge}
              onChange={handleInputChange}
              className="input-field h-20 resize-none"
              placeholder="describe what you already know about the subject..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              experience level *
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">select your level</option>
              <option value="Beginner">beginner</option>
              <option value="Intermediate">intermediate</option>
              <option value="Advanced">advanced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              class/grade *
            </label>
            <input
              type="text"
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., grade 10, college freshman"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              test scores (optional)
            </label>
            <input
              type="text"
              name="testScores"
              value={formData.testScores}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., sat: 1200, math: 85%"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              recent grades (optional)
            </label>
            <input
              type="text"
              name="grades"
              value={formData.grades}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., a in math, b+ in science"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              subjects of interest *
            </label>
            <input
              type="text"
              name="subjects"
              value={formData.subjects}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., mathematics, physics, chemistry"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            learning goals *
          </label>
          <textarea
            name="learningGoals"
            value={formData.learningGoals}
            onChange={handleInputChange}
            className="input-field h-24 resize-none"
            placeholder="what do you want to achieve? what are your learning objectives?"
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
              generating curriculum...
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4" />
              generate my curriculum
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
          <span className="text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      {curriculum && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">your personalized curriculum</span>
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
