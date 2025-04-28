import type { NextApiRequest, NextApiResponse } from 'next';

interface AnswerOption {
  id: string;
  content: string;
  isCorrect?: boolean;
  correct?: boolean;
}

interface Question {
  questionId: string;
  stem: string;
  answerOptions: AnswerOption[];
  correct_answer?: string[];
  difficulty?: string;
  skill_desc?: string;
  primary_class_cd_desc?: string;
  explanation?: string;
  type?: string;
}

interface QuestionsResponse {
  total: number;
  page: number;
  limit: number;
  questions: Question[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type } = req.query;
  
  if (!type || Array.isArray(type) || (type !== 'rw' && type !== 'math')) {
    return res.status(400).json({ error: 'Invalid question type. Must be "rw" or "math".' });
  }

  try {
    // Forward the request to the external API
    const response = await fetch(`http://localhost:8000/questions/${type}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching questions: ${response.statusText}`);
    }
    
    const data = await response.json() as QuestionsResponse;

    // Process the data as needed
    if (data.questions && Array.isArray(data.questions)) {
      // The API is already providing the data in the format we need,
      // so we don't need to transform it further.
      // We'll let the client handle the letter-based correct answers.
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch questions from external API',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 