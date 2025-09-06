'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, BookOpen, GraduationCap, Sparkles, Plus, MessageSquare, Settings, Menu, X } from 'lucide-react';
import SyllabusAgent from '@/components/SyllabusAgent';
import TeacherAgent from '@/components/TeacherAgent';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'teacher'>('syllabus');
  const [curriculum, setCurriculum] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, title: 'New Conversation', type: 'syllabus', timestamp: new Date() },
    { id: 2, title: 'Mathematics Curriculum', type: 'teacher', timestamp: new Date() },
  ]);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCurriculumGenerated = (newCurriculum: string) => {
    setCurriculum(newCurriculum);
    setActiveTab('teacher');
  };

  const startNewConversation = () => {
    const newConversation = {
      id: conversations.length + 1,
      title: 'New Conversation',
      type: 'syllabus' as const,
      timestamp: new Date()
    };
    setConversations([newConversation, ...conversations]);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: sidebarOpen ? (isMobile ? '100%' : '280px') : '0px',
          x: isMobile && !sidebarOpen ? '-100%' : '0%'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden ${
          isMobile ? 'fixed inset-0 z-50' : 'relative'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Minerva</h1>
              </div>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={startNewConversation}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Chat</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setActiveTab(conversation.type as 'syllabus' | 'teacher')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    activeTab === conversation.type
                      ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {conversation.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {conversation.type === 'syllabus' ? 'Syllabus Agent' : 'Teacher Agent'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
              <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Settings</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                {sidebarOpen ? <X className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
              </button>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {activeTab === 'syllabus' ? 'AI Syllabus Agent' : 'AI Teacher Agent'}
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Gemini AI</span>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Welcome Message */}
          {!curriculum && activeTab === 'syllabus' && (
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center w-full max-w-2xl"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                  Welcome to Minerva
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed px-4">
                  I'm your AI Syllabus Agent. I'll help you create a personalized learning curriculum 
                  based on your knowledge, goals, and preferences. Let's get started!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto px-4">
                  <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm sm:text-base">Personalized Curriculum</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Custom learning paths tailored to you</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm sm:text-base">Expert Teaching</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Comprehensive explanations and examples</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Teacher Agent Welcome */}
          {activeTab === 'teacher' && (
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center w-full max-w-2xl"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                  Ready to Learn?
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed px-4">
                  I'm your AI Teacher Agent. I'll provide comprehensive explanations, examples, 
                  and practice exercises for any topic you want to master.
                </p>
                {curriculum && (
                  <div className="p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 mb-4 sm:mb-6 mx-4">
                    <p className="text-orange-800 dark:text-orange-200 font-medium text-sm sm:text-base">
                      📚 I see you have a curriculum ready! I can help you learn any topic from it.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Agent Components */}
          <div className="flex-1 overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 lg:p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                {activeTab === 'syllabus' ? (
                  <SyllabusAgent onCurriculumGenerated={handleCurriculumGenerated} />
                ) : (
                  <TeacherAgent curriculum={curriculum} />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
