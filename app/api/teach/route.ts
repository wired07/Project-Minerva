import { NextRequest, NextResponse } from 'next/server';
import { teachTopic } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { topic, userLevel, context } = body;
    
    if (!topic || !userLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: topic and userLevel' },
        { status: 400 }
      );
    }
    
    const result = await teachTopic(topic, userLevel, context || '');
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate teaching content' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      content: result.text,
      success: true
    });
    
  } catch (error) {
    console.error('Teach API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
