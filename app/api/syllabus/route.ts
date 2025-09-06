import { NextRequest, NextResponse } from 'next/server';
import { generateCurriculum } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { previousKnowledge, experience, class: userClass, testScores, grades, subjects, learningGoals } = body;
    
    if (!previousKnowledge || !experience || !userClass || !subjects || !learningGoals) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const userData = {
      previousKnowledge,
      experience,
      class: userClass,
      testScores: testScores || 'Not provided',
      grades: grades || 'Not provided',
      subjects: Array.isArray(subjects) ? subjects : [subjects],
      learningGoals
    };
    
    const result = await generateCurriculum(userData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate curriculum' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      curriculum: result.text,
      success: true
    });
    
  } catch (error) {
    console.error('Syllabus API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
