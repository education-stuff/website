import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import QuestionDisplay from "@/components/QuestionDisplay";
import { ChevronLeft, ChevronRight, Home, BookOpen, Clock } from 'lucide-react';

// Interface for RW question answer options
interface AnswerOption {
  id: string;
  content: string;
}

// Interface for a generic question from the API
interface Question {
  questionId: string;
  stem: string;
  answerOptions: AnswerOption[];
  difficulty?: string;
  skill_desc?: string;
  primary_class_cd_desc?: string;
  correct_answer?: string[];
  explanation?: string;
  type?: string; // Some API responses include a 'type' field
}

interface QuestionsResponse {
  total: number;
  page: number;
  limit: number;
  questions: Question[];
}

const PracticePage: React.FC = () => {
  const router = useRouter();
  const { type = "rw" } = router.query;
  const [activeTab, setActiveTab] = useState<string>(typeof type === 'string' ? type : 'rw');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, { id: string, isCorrect: boolean }>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const questionRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof type === 'string') {
      setActiveTab(type);
    }
  }, [type]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/questions/${activeTab}`);
        const data: QuestionsResponse = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
    resetTimer();
  }, [activeTab]);

  // Timer functionality
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const resetTimer = () => {
    setTimer(0);
    setTimerActive(true);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answerId: string, isCorrect: boolean) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: { id: answerId, isCorrect }
    }));
    setShowFeedback(true);
    setTimerActive(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowFeedback(false);
    router.push(`/practice?type=${value}`, undefined, { shallow: true });
    resetTimer();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowFeedback(false); // Reset feedback when changing questions
      setTimerActive(true);
      // Scroll to top of question
      if (questionRef.current) {
        questionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowFeedback(false); // Reset feedback when changing questions
      setTimerActive(true);
      // Scroll to top of question
      if (questionRef.current) {
        questionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const getCorrectAnswerIds = (question: Question): string[] => {
    if (!question.correct_answer) return [];
    
    // For letter-based correct answers (like ["B"]), map to the corresponding answerOption id
    if (question.correct_answer.every(ans => ans.length === 1 && /[A-Z]/.test(ans))) {
      return question.answerOptions
        .filter((_, index) => {
          const letter = String.fromCharCode(65 + index); // A, B, C, D...
          return question.correct_answer?.includes(letter);
        })
        .map(option => option.id);
    }
    
    // Otherwise, return the correct_answer array as is
    return question.correct_answer;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = questions.length > 0 
    ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) 
    : 0;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.values(selectedAnswers).filter(a => a.isCorrect).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <Head>
        <title>{`SAT Practice - ${activeTab === "rw" ? "Reading & Writing" : "Math"}`}</title>
      </Head>
      
      <header className="bg-slate-800 sticky top-0 z-10 border-b border-slate-700">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-md">
              <BookOpen size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">SAT Practice</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-700 py-1 px-3 rounded-full text-sm flex items-center gap-2">
              <Clock size={14} /> 
              <span>{formatTime(timer)}</span>
            </div>
            <Button 
              onClick={() => router.push('/')}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-6 pb-12">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1 text-white">
              {activeTab === "rw" ? "Reading & Writing" : "Math"} Questions
            </h2>
            <div className="text-slate-400 text-sm flex items-center gap-4">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              {answeredCount > 0 && (
                <span>
                  Score: <span className="text-indigo-400 font-medium">{correctCount}</span>/{answeredCount}
                </span>
              )}
            </div>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full sm:w-[280px] grid-cols-2 bg-slate-800 p-1 rounded-md">
              <TabsTrigger 
                value="rw" 
                className="rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Reading & Writing
              </TabsTrigger>
              <TabsTrigger 
                value="math" 
                className="rounded-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Math
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mb-4">
          <Progress value={progressPercentage} className="h-2 bg-slate-800" indicatorClassName="bg-indigo-600" />
        </div>
        
        {loading ? (
          <div className="flex flex-col justify-center items-center h-60 bg-slate-800 rounded-lg border border-slate-700">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mb-4"></div>
            <div className="text-slate-400">Loading questions...</div>
          </div>
        ) : !currentQuestion ? (
          <div className="flex justify-center items-center h-60 bg-slate-800 rounded-lg border border-slate-700">
            <div className="text-slate-400 text-center p-6">
              <div className="mb-2 text-lg">No questions available</div>
              <p>Please check your connection to localhost:8000</p>
            </div>
          </div>
        ) : (
          <div ref={questionRef} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <QuestionDisplay 
              question={{
                id: currentQuestion.questionId,
                content: currentQuestion.stem,
                options: currentQuestion.answerOptions.map(option => ({
                  id: option.id,
                  text: option.content
                })),
                type: activeTab === "math" ? "Math" : "Reading & Writing",
                correct_answer: getCorrectAnswerIds(currentQuestion),
                explanation: currentQuestion.explanation || 
                  `This question tests your understanding of ${currentQuestion.skill_desc || "the material"}.`
              }} 
              onAnswer={handleAnswerSelect}
              showFeedback={showFeedback}
              resetFeedback={() => setShowFeedback(false)}
            />
            
            <div className="flex justify-between p-4 bg-slate-800 border-t border-slate-700">
              <Button 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                variant="secondary"
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center gap-1"
              >
                <ChevronLeft size={18} />
                Previous
              </Button>
              
              <div className="flex gap-2">
                {currentQuestionIndex < questions.length - 1 && (
                  <Button 
                    onClick={handleNextQuestion}
                    className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1"
                  >
                    Next Question
                    <ChevronRight size={18} />
                  </Button>
                )}
                {currentQuestionIndex === questions.length - 1 && (
                  <Button 
                    onClick={() => router.push('/')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Finish
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PracticePage; 