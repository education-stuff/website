import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchQuestions, Question } from "@/services/questionService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const QuestionTypePage: React.FC = () => {
  const router = useRouter();
  const { type } = router.query;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const formattedType = typeof type === "string"
    ? type.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    : "";

  useEffect(() => {
    if (type) {
      const loadQuestions = async () => {
        setLoading(true);
        try {
          const fetchedQuestions = await fetchQuestions(type as string);
          setQuestions(fetchedQuestions);
        } catch (error) {
          console.error(`Error loading ${type} questions:`, error);
        } finally {
          setLoading(false);
        }
      };

      loadQuestions();
    }
  }, [type]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrevQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const isCorrect = showFeedback && selectedAnswer === currentQuestion?.answer;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button 
          className="mb-6 flex items-center gap-2"
          onClick={() => router.push("/practice")}
        >
          <ArrowLeft size={16} />
          Back to Practice
        </Button>
        <Card>
          <CardContent className="p-6">
            <p>No questions available for this category. Please try another category.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button 
        className="mb-6 flex items-center gap-2"
        onClick={() => router.push("/practice")}
      >
        <ArrowLeft size={16} />
        Back to Practice
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{formattedType} Question</CardTitle>
            <div className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          <CardDescription>{currentQuestion.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentQuestion.passage && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <p className="whitespace-pre-wrap">{currentQuestion.passage}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium mb-2">{currentQuestion.title}</h3>
            {currentQuestion.choices && (
              <div className="space-y-2">
                {currentQuestion.choices.map((choice, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-md cursor-pointer ${
                      selectedAnswer === choice
                        ? showFeedback
                          ? selectedAnswer === currentQuestion.answer
                            ? "bg-green-100 border-green-500"
                            : "bg-red-100 border-red-500"
                          : "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleAnswerSelect(choice)}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                      <span>{choice}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showFeedback && (
            <div className={`p-4 mb-6 rounded-md ${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
              <p className="font-medium">
                {isCorrect ? "Correct!" : "Incorrect!"} 
                {!isCorrect && currentQuestion.answer && (
                  <span> The correct answer is: {currentQuestion.answer}</span>
                )}
              </p>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Previous
            </Button>
            
            {!showFeedback ? (
              <Button onClick={handleSubmit} disabled={!selectedAnswer}>
                Submit
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next Question
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionTypePage; 