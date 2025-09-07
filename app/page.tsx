'use client';

import React, { useState } from 'react';
import { Brain, BookOpen, GraduationCap, Github, Twitter, ExternalLink } from 'lucide-react';
import SyllabusAgent from '@/components/SyllabusAgent';
import TeacherAgent from '@/components/TeacherAgent';

export default function Home() {
  const [activeSection, setActiveSection] = useState<'about' | 'syllabus' | 'teacher'>('about');

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">hi, i am minerva!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            i am an intelligent tutoring system, powered by advanced AI.
            <br />
            mainly work in personalized learning, curriculum design and love teaching people.
          </p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center mb-12">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setActiveSection('about')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeSection === 'about'
                  ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              about
            </button>
            <button
              onClick={() => setActiveSection('syllabus')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeSection === 'syllabus'
                  ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              syllabus agent
            </button>
            <button
              onClick={() => setActiveSection('teacher')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeSection === 'teacher'
                  ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              teacher agent
            </button>
          </div>
        </nav>

        {/* Content Sections */}
        <main>
          {activeSection === 'about' && (
            <div className="space-y-12">
              {/* Features */}
              <section>
                <h2 className="section-title">Features</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card">
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className="w-5 h-5" />
                      <h3 className="font-semibold">Personalized curriculum</h3>
                    </div>
                    <p className="section-content">
                      Create custom learning paths tailored to your knowledge, goals, and preferences
                    </p>
                  </div>
                  <div className="card">
                    <div className="flex items-center gap-3 mb-3">
                      <GraduationCap className="w-5 h-5" />
                      <h3 className="font-semibold">Expert teaching</h3>
                    </div>
                    <p className="section-content">
                      Comprehensive explanations with examples, visuals, and practice exercises
                    </p>
                  </div>
                </div>
              </section>

              {/* How it works */}
              <section>
                <h2 className="section-title">How it works</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Tell me about yourself</h3>
                      <p className="section-content">
                        Share your previous knowledge, experience level, and learning goals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Get your curriculum</h3>
                      <p className="section-content">
                        Receive a personalized learning plan designed just for you
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Start learning</h3>
                      <p className="section-content">
                        Dive deep into any topic with expert guidance and explanations
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Links */}
              <section>
                <h2 className="section-title">Connect</h2>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/wired07/Project-Minerva"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </section>
            </div>
          )}

          {activeSection === 'syllabus' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="section-title">Syllabus agent</h2>
                <p className="section-content max-w-2xl mx-auto">
                  Create your personalized learning curriculum based on your knowledge, goals, and preferences
                </p>
              </div>
              <SyllabusAgent onCurriculumGenerated={() => {}} />
            </div>
          )}

          {activeSection === 'teacher' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="section-title">Teacher agent</h2>
                <p className="section-content max-w-2xl mx-auto">
                  Learn any topic with comprehensive explanations, examples, and practice exercises
                </p>
              </div>
              <TeacherAgent />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
        </footer>
      </div>
    </div>
  );
}