'use client';

import { useState } from 'react';
import { BookOpen, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SyllabusAgentProps {
  onCurriculumGenerated: (curriculum: string, topics: string[]) => void;
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

  const extractTopicsFromCurriculum = (curriculumText: string): string[] => {
    const topics: string[] = [];
    const lines = curriculumText.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Look for numbered items, bullet points, or module headers
      if (trimmedLine.match(/^\d+\.\s+/) || // 1. Topic
          trimmedLine.match(/^[-•]\s+/) || // - Topic or • Topic
          trimmedLine.match(/^##\s+/) || // ## Module Title
          trimmedLine.match(/^###\s+/) || // ### Topic Title
          trimmedLine.match(/^Module\s+\d+/i) || // Module 1:
          trimmedLine.match(/^Chapter\s+\d+/i) || // Chapter 1:
          trimmedLine.match(/^Unit\s+\d+/i)) { // Unit 1:
        
        // Clean up the topic name
        let topic = trimmedLine
          .replace(/^\d+\.\s+/, '') // Remove numbering
          .replace(/^[-•]\s+/, '') // Remove bullet points
          .replace(/^#+\s+/, '') // Remove markdown headers
          .replace(/^(Module|Chapter|Unit)\s+\d+[:\-]\s*/i, '') // Remove module/chapter/unit prefixes
          .trim();
        
        // Only add if it's a meaningful topic (not too short or too long)
        if (topic.length > 3 && topic.length < 100 && !topic.match(/^\d+$/)) {
          topics.push(topic);
        }
      }
    }
    
    // Remove duplicates and limit to 15 topics
    return Array.from(new Set(topics)).slice(0, 15);
  };

  const formatCurriculumText = (text: string): string => {
    const lines = text.split('\n');
    const formattedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Add the current line
      formattedLines.push(line);
      
      // Check if this is a module header (## Module or similar)
      if (trimmedLine.match(/^##\s+Module/i) || 
          trimmedLine.match(/^##\s+Chapter/i) || 
          trimmedLine.match(/^##\s+Unit/i) ||
          trimmedLine.match(/^##\s+Part/i)) {
        // Add two empty lines after module headers
        formattedLines.push('', '');
      }
      // Check if this is a topic header (### Topic or similar)
      else if (trimmedLine.match(/^###\s+/) || 
               trimmedLine.match(/^\d+\.\s+/) ||
               trimmedLine.match(/^Topic\s+\d+/i)) {
        // Add one empty line after topic headers
        formattedLines.push('');
      }
    }
    
    return formattedLines.join('\n');
  };

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
      
      // Extract topics from curriculum
      const topics = extractTopicsFromCurriculum(data.curriculum);
      onCurriculumGenerated(data.curriculum, topics);
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
            <h2 className="text-lg font-semibold">Syllabus Agent</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create your personalized learning curriculum</p>
          </div>
        </div>
        
        <p className="section-content">
          Tell me about yourself and your learning goals, and I'll create a personalized curriculum just for you!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
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
            <label className="block text-sm font-medium mb-2">
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
            <label className="block text-sm font-medium mb-2">
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
            <label className="block text-sm font-medium mb-2">
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
            <label className="block text-sm font-medium mb-2">
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
            <label className="block text-sm font-medium mb-2">
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
          <label className="block text-sm font-medium mb-2">
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
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
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
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <div className="mt-6 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                      {children}
                    </h2>
                  </div>
                ),
                h3: ({ children }) => (
                  <div className="mt-4 mb-2">
                    <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {children}
                    </h3>
                  </div>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 my-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-1 my-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {children}
                  </li>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed my-2">
                    {children}
                  </p>
                )
              }}
            >
              {formatCurriculumText(curriculum)}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
