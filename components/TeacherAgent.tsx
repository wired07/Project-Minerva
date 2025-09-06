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
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">AI Teacher Agent</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Learn any topic with expert guidance</p>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Ask me to teach you any topic! I'll provide comprehensive explanations with examples, visuals, and practice exercises.
        </p>
      </div>

      <div className="p-6">
        {curriculum && suggestedTopics.length > 0 && (
          <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
            <h3 className="text-lg font-medium text-orange-900 dark:text-orange-300 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Suggested Topics from Your Curriculum
            </h3>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map((suggestedTopic, index) => (
                <button
                  key={index}
                  onClick={() => setTopic(suggestedTopic)}
                  className="px-3 py-1 bg-orange-100 dark:bg-orange-800 hover:bg-orange-200 dark:hover:bg-orange-700 text-orange-800 dark:text-orange-200 text-sm rounded-full transition-colors duration-200"
                >
                  {suggestedTopic}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}

        {content && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300 font-medium">Learning Content</span>
            </div>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
