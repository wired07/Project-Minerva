'use client';

import { useState } from 'react';
import { GraduationCap, Loader2, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TeacherAgentProps {
  curriculum?: string;
}

export default function TeacherAgent({ curriculum }: TeacherAgentProps) {
  const [topic, setTopic] = useState('');
  const [userLevel, setUserLevel] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setContent('');

    try {
      const response = await fetch('/api/teach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          userLevel,
          context
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate teaching content');
      }

      setContent(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const extractTopicsFromCurriculum = () => {
    if (!curriculum) return [];
    
    // Simple extraction of topics from curriculum text
    const lines = curriculum.split('\n');
    const topics = lines
      .filter(line => line.includes('•') || line.includes('-') || line.includes('1.') || line.includes('2.'))
      .map(line => line.replace(/^[•\-\d\.\s]+/, '').trim())
      .filter(topic => topic.length > 0 && topic.length < 100)
      .slice(0, 10); // Limit to first 10 topics
    
    return topics;
  };

  const suggestedTopics = extractTopicsFromCurriculum();

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <GraduationCap className="w-8 h-8 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">AI Teacher Agent</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Ask me to teach you any topic! I'll provide comprehensive explanations with examples, visuals, and practice exercises.
      </p>

      {curriculum && suggestedTopics.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Suggested Topics from Your Curriculum
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestedTopics.map((suggestedTopic, index) => (
              <button
                key={index}
                onClick={() => setTopic(suggestedTopic)}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm rounded-full transition-colors duration-200"
              >
                {suggestedTopic}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic to Learn *
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input-field"
            placeholder="e.g., Quadratic Equations, Photosynthesis, World War II"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Level *
          </label>
          <select
            value={userLevel}
            onChange={(e) => setUserLevel(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select your level</option>
            <option value="Elementary (Grades K-5)">Elementary (Grades K-5)</option>
            <option value="Middle School (Grades 6-8)">Middle School (Grades 6-8)</option>
            <option value="High School (Grades 9-12)">High School (Grades 9-12)</option>
            <option value="College/University">College/University</option>
            <option value="Adult Learner">Adult Learner</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="input-field h-20 resize-none"
            placeholder="Any specific aspects you want to focus on or questions you have..."
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
              Teaching...
            </>
          ) : (
            <>
              <GraduationCap className="w-4 h-4" />
              Start Learning
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

      {content && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 font-medium">Learning Content</span>
          </div>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
