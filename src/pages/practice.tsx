import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import QuestionDisplay from "@/components/QuestionDisplay";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Home, BookOpen, Clock } from '@/components/icons';

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

  // Get the API base URL from environment variable, default to localhost if not set
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    if (typeof type === 'string') {
      setActiveTab(type);
    }
  }, [type]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setShowFeedback(false);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      resetTimer();
      try {
        const response = await fetch(`${API_BASE_URL}/questions/${activeTab}`);
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
  }, [activeTab, API_BASE_URL]);

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
    if (timerRef.current) clearInterval(timerRef.current);
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
    router.push(`/practice?type=${value}`, undefined, { shallow: true });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowFeedback(false);
      resetTimer();
      if (questionRef.current) {
        questionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowFeedback(false);
      resetTimer();
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Head>
        <title>{`SAT Practice - ${activeTab === "rw" ? "Reading & Writing" : "Math"}`}</title>
      </Head>
      
      <header className="sticky top-0 z-10 backdrop-blur-md bg-card/90 dark:bg-card/90 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">SAT Practice</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-muted text-muted-foreground py-1 px-3 rounded-md text-sm font-mono">
              {formatTime(timer)}
            </div>
            <Button 
              onClick={() => router.push('/')}
              variant="ghost"
              size="sm"
            >
             Home
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold mb-1">
              {activeTab === "rw" ? "Reading & Writing" : "Math"}
            </h2>
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              {answeredCount > 0 && (
                <span className="bg-primary/10 text-primary py-0.5 px-2 rounded-md font-medium">
                  Score: {correctCount}/{answeredCount}
                </span>
              )}
            </div>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full sm:w-auto"
          >
            <TabsList className="w-full sm:w-[240px] grid grid-cols-2 bg-muted text-muted-foreground">
              <TabsTrigger value="rw" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground">R & W</TabsTrigger>
              <TabsTrigger value="math" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground">Math</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mb-4">
          <Progress value={progressPercentage} className="h-1.5 rounded-full" />
        </div>
        
        {loading ? (
          <Card className="flex flex-col justify-center items-center h-80">
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
              <p className="text-muted-foreground font-medium">Loading questions...</p>
            </CardContent>
          </Card>
        ) : !currentQuestion ? (
           <Card className="flex flex-col justify-center items-center h-80">
            <CardContent className="text-center pt-6">
              <p className="text-lg font-semibold mb-2">No questions available</p>
              <p className="text-muted-foreground">Could not load questions for {activeTab}. Please check the backend connection.</p>
            </CardContent>
          </Card>
        ) : (
          <Card ref={questionRef} className="overflow-hidden shadow-sm">
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
            
            <CardFooter className="flex justify-between p-4 bg-muted/50 border-t border-border">
              <Button 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                variant="secondary"
                size="md"
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button 
                    onClick={handleNextQuestion}
                    variant="primary"
                    size="md"
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button 
                    onClick={() => router.push('/')}
                    variant="success"
                    size="md"
                  >
                    Finish Practice
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
};

export default PracticePage; 