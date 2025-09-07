import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const getGeminiModel = () => {
  const genAI = getGeminiClient();
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
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
  const prompt = `Create a personalized curriculum for a ${userData.experience} level student in ${userData.class}.

**Student Profile:**
- Previous Knowledge: ${userData.previousKnowledge}
- Test Scores: ${userData.testScores}
- Recent Grades: ${userData.grades}
- Subjects: ${userData.subjects.join(', ')}
- Learning Goals: ${userData.learningGoals}

**Requirements:**
Format the curriculum with clear sections and numbered/bulleted topics for easy parsing:

## Learning Objectives
• Objective 1
• Objective 2

## Module 1: [Module Name]
### Topic 1.1: [Topic Name]
- Key concepts
- Estimated time: X hours

### Topic 1.2: [Topic Name]
- Key concepts
- Estimated time: X hours

## Module 2: [Module Name]
### Topic 2.1: [Topic Name]
- Key concepts
- Estimated time: X hours

## Assessment Strategy
• Assessment method 1
• Assessment method 2

## Recommended Resources
• Resource 1
• Resource 2

Make it concise, well-structured, and focused on their specific needs.`;

  return generateText(prompt);
}

export async function teachTopic(topic: string, userLevel: string, context: string = ''): Promise<GeminiResponse> {
  const prompt = `Teach "${topic}" to a ${userLevel} student. ${context ? `Additional context: ${context}` : ''}

Format your response with clear sections and include code examples where relevant:

## What is [Topic]?
[Clear, concise definition with **highlighted** key terms]

## Key Concepts
• **Concept 1**: [Detailed explanation with examples]
• **Concept 2**: [Detailed explanation with examples]

## Real-World Examples
• Example 1: [Description with practical applications]
• Example 2: [Description with practical applications]

## Step-by-Step Process
1. **Step 1**: [Detailed description]
2. **Step 2**: [Detailed description]

## Code Examples
Include relevant code snippets in proper code blocks:

\`\`\`language
// Example code here
function example() {
  return "Hello World";
}
\`\`\`

## Practice Questions
1. **Question 1**: [Clear question with context]
2. **Question 2**: [Clear question with context]

## Common Mistakes to Avoid
• **Mistake 1**: [Explanation of why it's wrong and how to avoid it]
• **Mistake 2**: [Explanation of why it's wrong and how to avoid it]

## Tips for Success
• **Tip 1**: [Actionable advice]
• **Tip 2**: [Actionable advice]

Use **bold text** for emphasis, include code blocks for programming concepts, and keep explanations clear, engaging, and appropriate for the student's level.`;

  return generateText(prompt);
}
