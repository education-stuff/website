'use client';

import React, { useEffect, useState } from 'react';
import { fetchQuestions, Question, QuestionsResponse } from '@/services/questionService';
import QuestionDisplay from '@/components/QuestionDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function QuestionsPage() {
  const [readingQuestions, setReadingQuestions] = useState<Question[]>([]);
  const [mathQuestions, setMathQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<{ reading: boolean; math: boolean }>({
    reading: true,
    math: true,
  });
  const [currentIndex, setCurrentIndex] = useState<{ reading: number; math: number }>({
    reading: 0,
    math: 0,
  });
  const [activeTab, setActiveTab] = useState<string>('reading');

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Fetch reading questions
        setLoading(prev => ({ ...prev, reading: true }));
        const readingResponse = await fetchQuestions('rw');
        setReadingQuestions(readingResponse.questions || []);
        setLoading(prev => ({ ...prev, reading: false }));

        // Fetch math questions
        setLoading(prev => ({ ...prev, math: true }));
        const mathResponse = await fetchQuestions('math');
        setMathQuestions(mathResponse.questions || []);
        setLoading(prev => ({ ...prev, math: false }));
      } catch (error) {
        console.error('Error loading questions:', error);
        setLoading({ reading: false, math: false });
      }
    };

    loadQuestions();
  }, []);

  const handleAnswer = (questionId: string, answerId: string) => {
    console.log(`Question: ${questionId}, Answer: ${answerId}`);
    // Here you would typically send the answer to your API
    // and then move to the next question
    
    if (activeTab === 'reading' && currentIndex.reading < readingQuestions.length - 1) {
      setCurrentIndex(prev => ({ ...prev, reading: prev.reading + 1 }));
    } else if (activeTab === 'math' && currentIndex.math < mathQuestions.length - 1) {
      setCurrentIndex(prev => ({ ...prev, math: prev.math + 1 }));
    }
  };

  const currentReadingQuestion = readingQuestions[currentIndex.reading];
  const currentMathQuestion = mathQuestions[currentIndex.math];

  const renderLoading = () => (
    <div className="w-full max-w-4xl mx-auto">
      <Skeleton className="h-12 w-3/4 mb-4" />
      <Skeleton className="h-6 w-1/2 mb-8" />
      <Skeleton className="h-24 w-full mb-6" />
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Practice Questions</h1>
      
      <Tabs defaultValue="reading" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="reading">Reading & Writing</TabsTrigger>
          <TabsTrigger value="math">Math</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reading">
          {loading.reading ? (
            renderLoading()
          ) : readingQuestions.length > 0 ? (
            <>
              <div className="mb-4 text-center">
                Question {currentIndex.reading + 1} of {readingQuestions.length}
              </div>
              <QuestionDisplay 
                question={currentReadingQuestion} 
                onAnswer={handleAnswer}
              />
            </>
          ) : (
            <div className="text-center py-8">No reading questions available</div>
          )}
        </TabsContent>
        
        <TabsContent value="math">
          {loading.math ? (
            renderLoading()
          ) : mathQuestions.length > 0 ? (
            <>
              <div className="mb-4 text-center">
                Question {currentIndex.math + 1} of {mathQuestions.length}
              </div>
              <QuestionDisplay 
                question={currentMathQuestion} 
                onAnswer={handleAnswer}
              />
            </>
          ) : (
            <div className="text-center py-8">No math questions available</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 