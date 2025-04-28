import React, { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle } from '@/components/icons';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface Question {
  id: string;
  content: string;
  options?: Answer[];
  type?: string;
  title?: string;
  correct_answer?: string[];
  explanation?: string;
}

interface QuestionDisplayProps {
  question: Question;
  onAnswer?: (questionId: string, answerId: string, isCorrect: boolean) => void;
  showFeedback?: boolean;
  resetFeedback?: () => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  question, 
  onAnswer,
  showFeedback: externalShowFeedback = false,
  resetFeedback
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [internalShowFeedback, setInternalShowFeedback] = useState(false);
  const [inputAnswer, setInputAnswer] = useState("");
  
  // Use either external or internal feedback state
  const showFeedback = externalShowFeedback || internalShowFeedback;
  
  // Reset selected answer when the question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setInputAnswer("");
    setInternalShowFeedback(false);
  }, [question.id]);

  const isCorrectAnswer = (id: string) => {
    if (question.correct_answer) {
      return question.correct_answer.includes(id);
    }
    // If we don't have correct_answer data, fall back to the isCorrect property on the option
    const option = question.options?.find(opt => opt.id === id);
    return option?.isCorrect || false;
  };

  const handleSelectAnswer = (id: string) => {
    if (showFeedback) return; // Prevent changing answers after feedback is shown
    
    setSelectedAnswer(id);
    setInternalShowFeedback(true);
    
    if (onAnswer) {
      onAnswer(question.id, id, isCorrectAnswer(id));
    }
  };

  const handleSubmitInputAnswer = () => {
    if (!inputAnswer.trim() || showFeedback) return;
    
    const submittedValue = inputAnswer.trim(); // Use the trimmed value
    setSelectedAnswer(submittedValue); // Set selectedAnswer with the input value
    setInternalShowFeedback(true);

    const isCorrect = question.correct_answer ? 
      question.correct_answer.some(ans => ans.toLowerCase() === submittedValue.toLowerCase()) : 
      false;
    
    if (onAnswer) {
      // Pass the trimmed input value as the answerId
      onAnswer(question.id, submittedValue, isCorrect); 
    }
  };

  // Determine if content contains a graph (likely has SVG or img tags)
  const hasGraph = question.content?.includes('<svg') || 
                  question.content?.includes('<img') || 
                  (question.type === 'math' && (question.content?.includes('graph') || 
                                               question.content?.includes('coordinate')));
  
  // Function to safely render HTML content, including SVG
  const renderHTML = (htmlContent: string) => {
    // For math content, add graph wrapper
    if (question.type?.toLowerCase() === 'math' && hasGraph) {
      // Use a combination of split and join instead of regex with 's' flag
      let processedContent = htmlContent;
      const svgRegex = /<svg[^>]*>[\s\S]*?<\/svg>/g;
      const imgRegex = /<img[^>]*>/g;
      
      processedContent = processedContent.replace(svgRegex, match => {
        return '<div class="graph">' + match + '</div>';
      });
      
      processedContent = processedContent.replace(imgRegex, match => {
        return '<div class="graph">' + match + '</div>';
      });
      
      return { __html: processedContent };
    }
    return { __html: htmlContent };
  };

  const renderQuestionContent = () => {
    return (
      <div className="p-6 border-b border-border">
        <div 
          dangerouslySetInnerHTML={renderHTML(question.content)} 
          className={cn(
            "prose prose-slate dark:prose-invert max-w-none prose-lg",
            hasGraph && "math-content"
          )}
        />
      </div>
    );
  };

  const renderFeedback = () => {
    // Allow feedback if showFeedback is true and either selectedAnswer (MCQ) 
    // or inputAnswer (input) is present.
    if (!showFeedback || (!selectedAnswer && !inputAnswer)) return null; 

    // Determine correctness based on selectedAnswer (MCQ) or inputAnswer (input)
    const answerToCheck = question.options && question.options.length > 0 ? selectedAnswer : inputAnswer;
    if (!answerToCheck) return null; // Should not happen if the above check passes, but good for safety

    const isCorrect = question.correct_answer ? 
      question.correct_answer.some(ans => ans.toLowerCase() === answerToCheck.toLowerCase()) : 
      false;
    
    return (
      <div className={cn(
        "feedback-card",
        isCorrect ? "feedback-correct" : "feedback-incorrect"
      )}>
        <div className="flex items-center gap-3 mb-4">
          {isCorrect ? (
            <>
              <CheckCircle2 size={24} className="text-success" />
              <p className="font-medium text-lg text-success">Correct Answer!</p>
            </>
          ) : (
            <>
              <XCircle size={24} className="text-error" />
              <p className="font-medium text-lg text-error">Incorrect Answer</p>
            </>
          )}
        </div>
        
        {question.explanation && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-muted-foreground" />
              <h4 className="font-medium">Explanation</h4>
            </div>
            <div 
              dangerouslySetInnerHTML={renderHTML(question.explanation)} 
              className="text-muted-foreground prose prose-slate dark:prose-invert" 
            />
          </div>
        )}
        
        {!isCorrect && question.correct_answer && question.options && (
          <div className="mt-5 pt-5 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-success" />
              <p className="font-medium">Correct Answer:</p>
            </div>
            <div className="space-y-3">
              {question.options
                .filter(option => question.correct_answer?.includes(option.id))
                .map(option => (
                  <div key={option.id} className="p-4 rounded-xl border border-success/20 bg-success/5 shadow-sm">
                    <div 
                      dangerouslySetInnerHTML={renderHTML(option.text)} 
                      className="prose prose-slate dark:prose-invert" 
                    />
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOptions = () => {
    if (!question.options || question.options.length === 0) {
      return (
        <div className="mt-6 px-6 pb-6">
          <label className="block text-sm font-medium mb-2">
            Your Answer
          </label>
          <Input 
            type="text" 
            className={cn(
              "math-input",
              question.type?.toLowerCase() === "math" && "math-input"
            )}
            placeholder={question.type?.toLowerCase() === "math" ? "Enter your numerical answer" : "Enter your answer here"}
            value={inputAnswer}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputAnswer(e.target.value)}
            disabled={showFeedback}
          />
          {!showFeedback && (
            <Button 
              className="mt-4 w-full py-6 text-lg font-medium" 
              onClick={handleSubmitInputAnswer}
            >
              Submit Answer
            </Button>
          )}
        </div>
      );
    }

    return (
      <RadioGroup
        className="p-6 space-y-4"
        value={selectedAnswer || ""}
        onValueChange={handleSelectAnswer}
        disabled={showFeedback}
      >
        {question.options.map((option: Answer, index) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrect = isCorrectAnswer(option.id);
          
          // Create option labels (A, B, C, D...)
          const optionLabel = String.fromCharCode(65 + index);
          
          return (
            <Label 
              key={option.id}
              htmlFor={option.id}
              className={cn(
                "relative flex items-start p-5 rounded-xl border transition-all cursor-pointer block w-full",
                showFeedback ? (
                  isSelected && isCorrect ? "border-success/30 bg-success/5" :
                  isSelected && !isCorrect ? "border-error/30 bg-error/5" : 
                  !isSelected && isCorrect ? "border-success/20 bg-success/5" :
                  "border-border bg-card"
                ) : (
                  isSelected ? "border-primary bg-primary/5" : 
                  "border-border bg-card hover:border-primary/30"
                )
              )}
            >
              <div className="flex w-full">
                <div className="flex items-center h-5 mr-4">
                  <RadioGroupItem 
                    value={option.id} 
                    id={option.id}
                  />
                </div>
                <div className="flex flex-1">
                  <div className={cn(
                    "option-badge",
                    showFeedback ? (
                      isCorrect ? "option-badge-correct" : 
                      isSelected ? "option-badge-incorrect" : 
                      ""
                    ) : (
                      isSelected ? "option-badge-selected" : 
                      ""
                    )
                  )}>
                    {optionLabel}
                  </div>
                  <div className="ml-3 flex-1">
                    <div
                      dangerouslySetInnerHTML={renderHTML(option.text)}
                    />
                  </div>
                </div>
              </div>
            </Label>
          );
        })}
      </RadioGroup>
    );
  };

  return (
    <div className="result-screen">
      {renderQuestionContent()}
      {renderOptions()}
      {renderFeedback()}
    </div>
  );
};

export default QuestionDisplay; 