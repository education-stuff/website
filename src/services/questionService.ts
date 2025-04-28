import axios from "axios";

export interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  options?: Answer[];
  type: 'rw' | 'math';
}

export interface QuestionStats {
  type: string;
  total: number;
  completed: number;
}

export interface QuestionOption {
  id: string;
  content: string;
}

export interface QuestionsResponse {
  questions: Question[];
  total: number;
}

export async function fetchQuestions(type: 'rw' | 'math'): Promise<QuestionsResponse> {
  // In a real app, this would make an API call to fetch questions
  // For now, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      if (type === 'rw') {
        resolve({
          questions: [
            {
              id: 'rw1',
              type: 'rw',
              title: 'Reading Passage',
              content: `<p>The following is an excerpt from a speech given by President John F. Kennedy at Rice University in 1962.</p>
              <blockquote>
                <p>We choose to go to the moon. We choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win, and the others, too.</p>
              </blockquote>
              <p>What is the main purpose of this speech?</p>`,
              options: [
                { id: 'a', text: 'To explain the scientific benefits of space exploration' },
                { id: 'b', text: 'To inspire Americans to support the ambitious goal of reaching the moon', isCorrect: true },
                { id: 'c', text: 'To criticize those who think space exploration is too difficult' },
                { id: 'd', text: 'To announce a timeline for NASA\'s upcoming mission' }
              ]
            },
            {
              id: 'rw2',
              type: 'rw',
              title: 'Grammar Question',
              content: '<p>Choose the sentence that is grammatically correct.</p>',
              options: [
                { id: 'a', text: 'The committee have decided to postpone the meeting.' },
                { id: 'b', text: 'Neither of the students have completed their assignments.' },
                { id: 'c', text: 'The committee has decided to postpone the meeting.', isCorrect: true },
                { id: 'd', text: 'Each of the players are responsible for their own equipment.' }
              ]
            }
          ],
          total: 2
        });
      } else {
        resolve({
          questions: [
            {
              id: 'math1',
              type: 'math',
              title: 'Algebra',
              content: '<p>If <span>5x + 3 = 18</span>, what is the value of x?</p>',
              options: [
                { id: 'a', text: '2' },
                { id: 'b', text: '3', isCorrect: true },
                { id: 'c', text: '4' },
                { id: 'd', text: '5' }
              ]
            },
            {
              id: 'math2',
              type: 'math',
              title: 'Geometry',
              content: '<p>The diagram shows a circle with radius <span>r = 5</span> units. What is the area of the circle?</p><svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" fill="none" /><line x1="50" y1="50" x2="90" y2="50" stroke="black" stroke-width="1" /><text x="65" y="45">r = 5</text></svg>',
              options: [
                { id: 'a', text: '25π square units', isCorrect: true },
                { id: 'b', text: '10π square units' },
                { id: 'c', text: '50π square units' },
                { id: 'd', text: '100π square units' }
              ]
            }
          ],
          total: 2
        });
      }
    }, 1500); // Simulate network delay
  });
}

export const mockQuestionStats: QuestionStats[] = [
  { type: 'reading', total: 10, completed: 3 },
  { type: 'vocabulary', total: 8, completed: 2 },
  { type: 'insert-text', total: 5, completed: 1 },
  { type: 'sentence-simplification', total: 6, completed: 0 },
  { type: 'factual-info', total: 7, completed: 4 },
  { type: 'rhetorical-purpose', total: 5, completed: 2 },
  { type: 'reference', total: 4, completed: 1 },
  { type: 'inference', total: 6, completed: 3 },
  { type: 'math', total: 9, completed: 5 }
];

export async function fetchQuestionStats(): Promise<QuestionStats[]> {
  // In a real app, this would make an API call to fetch question stats
  // For now, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockQuestionStats);
    }, 800); // Simulate network delay
  });
} 