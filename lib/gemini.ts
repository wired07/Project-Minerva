import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const getGeminiModel = () => {
  const genAI = getGeminiClient();
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

export async function generateText(prompt: string): Promise<GeminiResponse> {
  try {
    const geminiModel = getGeminiModel();
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      text,
      success: true
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function generateCurriculum(userData: {
  previousKnowledge: string;
  experience: string;
  class: string;
  testScores: string;
  grades: string;
  subjects: string[];
  learningGoals: string;
}): Promise<GeminiResponse> {
  const prompt = `
You are an AI Syllabus Agent. Create a personalized curriculum based on the following user data:

Previous Knowledge: ${userData.previousKnowledge}
Experience Level: ${userData.experience}
Class/Grade: ${userData.class}
Test Scores: ${userData.testScores}
Grades: ${userData.grades}
Subjects of Interest: ${userData.subjects.join(', ')}
Learning Goals: ${userData.learningGoals}

Please create a comprehensive, personalized curriculum that:
1. Takes into account their current knowledge level
2. Builds upon their existing skills
3. Addresses any knowledge gaps
4. Aligns with their learning goals
5. Is appropriate for their class level
6. Includes a logical progression of topics
7. Suggests assessment methods

Format the response as a structured curriculum with:
- Learning Objectives
- Topic Sequence (with estimated time for each)
- Prerequisites
- Assessment Strategy
- Recommended Resources

Make it engaging and personalized to their specific needs.
`;

  return generateText(prompt);
}

export async function teachTopic(topic: string, userLevel: string, context: string = ''): Promise<GeminiResponse> {
  const prompt = `
You are an AI Teacher Agent. Teach the following topic in an engaging, comprehensive way:

Topic: ${topic}
User Level: ${userLevel}
Context: ${context}

Please provide:
1. Clear explanation of the concept
2. Real-world examples and applications
3. Step-by-step breakdown if applicable
4. Visual descriptions for graphs, diagrams, or images that would help
5. Practice questions or exercises
6. Common misconceptions to avoid
7. Tips for better understanding

Make the explanation:
- Age-appropriate for the user level
- Engaging and interactive
- Clear and easy to understand
- Include practical examples
- Suggest visual aids where helpful

Format your response in a structured way that's easy to follow.
`;

  return generateText(prompt);
}
