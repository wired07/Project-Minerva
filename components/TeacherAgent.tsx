'use client';

import { useState, useRef } from 'react';
import { GraduationCap, Loader2, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TeacherAgentProps {
  curriculum?: string;
  syllabusTopics?: string[];
}

export default function TeacherAgent({ curriculum, syllabusTopics = [] }: TeacherAgentProps) {
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

  const suggestedTopics = syllabusTopics;

  const formatTeacherContent = (text: string): string => {
    const lines = text.split('\n');
    const formattedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Add the current line
      formattedLines.push(line);
      
      // Check if this is a main section header (## What is, ## Key Concepts, etc.)
      if (trimmedLine.match(/^##\s+(What is|Key Concepts|Real-World Examples|Step-by-Step Process|Practice Questions|Common Mistakes|Tips for Success)/i)) {
        // Add two empty lines after main section headers
        formattedLines.push('', '');
      }
      // Check if this is a subsection header (### or numbered items)
      else if (trimmedLine.match(/^###\s+/) || 
               trimmedLine.match(/^\d+\.\s+/) ||
               trimmedLine.match(/^•\s+/) ||
               trimmedLine.match(/^-\s+/)) {
        // Add one empty line after subsection headers
        formattedLines.push('');
      }
    }
    
    return formattedLines.join('\n');
  };

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white dark:text-black" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Teacher Agent</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Learn any topic with expert guidance</p>
          </div>
        </div>
        
        <p className="section-content">
          Ask me to teach you any topic! I'll provide comprehensive explanations with examples, visuals, and practice exercises.
        </p>
      </div>

      {curriculum && suggestedTopics.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg backdrop-blur-sm">
          <h3 className="text-base font-medium mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Suggested Topics From Your Curriculum
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestedTopics.map((suggestedTopic, index) => (
              <button
                key={index}
                onClick={() => setTopic(suggestedTopic)}
                className="px-3 py-2 bg-white/70 dark:bg-gray-700/70 hover:bg-white/90 dark:hover:bg-gray-700/90 text-gray-800 dark:text-gray-200 text-sm rounded-lg transition-all duration-200 border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm shadow-sm hover:shadow-md"
              >
                {suggestedTopic}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
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
          <label className="block text-sm font-medium mb-2">
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
          <label className="block text-sm font-medium mb-2">
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
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
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
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => (
                  <div className="mt-8 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 border-b-2 border-blue-500 dark:border-blue-400 pb-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
                      {children}
                    </h2>
                  </div>
                ),
                h3: ({ children }) => (
                  <div className="mt-6 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md border-l-4 border-orange-500">
                      {children}
                    </h3>
                  </div>
                ),
                h4: ({ children }) => (
                  <div className="mt-4 mb-2">
                    <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded border-l-2 border-yellow-500">
                      {children}
                    </h4>
                  </div>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 my-4 ml-4">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 my-4 ml-4">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {children}
                  </li>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed my-3">
                    {children}
                  </p>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <div className="relative my-4">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(String(children));
                        }}
                        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200 z-10"
                      >
                        Copy
                      </button>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border">
                        <code className="text-sm font-mono">
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
                pre: ({ children }) => {
                  const preRef = useRef<HTMLPreElement>(null);
                  return (
                    <div className="relative my-4">
                      <button
                        onClick={() => {
                          if (preRef.current) {
                            navigator.clipboard.writeText(preRef.current.textContent || '');
                          }
                        }}
                        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200 z-10"
                      >
                        Copy
                      </button>
                      <pre ref={preRef} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border">
                        {children}
                      </pre>
                    </div>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900 dark:text-gray-100 bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-blue-600 dark:text-blue-400 font-medium">
                    {children}
                  </em>
                )
              }}
            >
              {formatTeacherContent(content)}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
