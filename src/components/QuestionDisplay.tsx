import React, { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
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
    
    setInternalShowFeedback(true);
    // For input answers, we'd need a different method to check correctness
    // This is a placeholder assuming we'd compare with question.correct_answer
    const isCorrect = question.correct_answer ? 
      question.correct_answer.some(ans => ans.toLowerCase() === inputAnswer.toLowerCase()) : 
      false;
    
    if (onAnswer) {
      onAnswer(question.id, inputAnswer, isCorrect);
    }
  };

  // Determine if content contains a graph (likely has SVG or img tags)
  const hasGraph = question.content?.includes('<svg') || 
                  question.content?.includes('<img') || 
                  (question.type === 'math' && (question.content?.includes('graph') || 
                                               question.content?.includes('coordinate')));
  
  // Function to safely render HTML content, including SVG
  const renderHTML = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  const renderQuestionContent = () => {
    return (
      <div className="p-6 border-b border-slate-800/50">
        <div 
          dangerouslySetInnerHTML={renderHTML(question.content)} 
          className={cn(
            "prose prose-invert max-w-none prose-lg prose-headings:text-slate-100 prose-p:text-slate-300 prose-strong:text-white",
            hasGraph && "math-content"
          )}
        />
      </div>
    );
  };

  const renderFeedback = () => {
    if (!showFeedback || !selectedAnswer) return null;

    const isCorrect = isCorrectAnswer(selectedAnswer);
    
    return (
      <div className={cn(
        "mt-6 p-6 rounded-lg border",
        isCorrect ? "border-emerald-600 bg-emerald-950/20" : "border-rose-600 bg-rose-950/20"
      )}>
        <div className="flex items-center gap-3 mb-4">
          {isCorrect ? (
            <>
              <CheckCircle2 size={24} className="text-emerald-500" />
              <p className="font-medium text-lg text-emerald-500">Correct Answer!</p>
            </>
          ) : (
            <>
              <XCircle size={24} className="text-rose-500" />
              <p className="font-medium text-lg text-rose-500">Incorrect Answer</p>
            </>
          )}
        </div>
        
        {question.explanation && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-slate-400" />
              <h4 className="font-medium text-slate-200">Explanation</h4>
            </div>
            <div 
              dangerouslySetInnerHTML={renderHTML(question.explanation)} 
              className="text-slate-400 prose prose-invert prose-p:text-slate-400 prose-headings:text-slate-300" 
            />
          </div>
        )}
        
        {!isCorrect && question.correct_answer && question.options && (
          <div className="mt-5 pt-5 border-t border-slate-800/50">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <p className="font-medium text-slate-200">Correct Answer:</p>
            </div>
            {question.options
              .filter(option => question.correct_answer?.includes(option.id))
              .map(option => (
                <div key={option.id} className="p-4 rounded-lg border border-emerald-600/50 bg-emerald-950/10">
                  <div 
                    dangerouslySetInnerHTML={renderHTML(option.text)} 
                    className="text-emerald-400 prose prose-invert" 
                  />
                </div>
              ))
            }
          </div>
        )}
      </div>
    );
  };

  const renderOptions = () => {
    if (!question.options || question.options.length === 0) {
      return (
        <div className="mt-6 px-6">
          <Input 
            type="text" 
            className="w-full bg-slate-800 border-slate-700 text-slate-100"
            placeholder="Enter your answer here"
            value={inputAnswer}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputAnswer(e.target.value)}
            disabled={showFeedback}
          />
          {!showFeedback && (
            <Button 
              className="mt-4 w-full py-6 text-lg font-medium bg-indigo-600 hover:bg-indigo-700" 
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
                "relative flex items-start p-5 rounded-lg border transition-all cursor-pointer block w-full",
                showFeedback ? (
                  isSelected && isCorrect ? "border-emerald-500 bg-emerald-950/20" :
                  isSelected && !isCorrect ? "border-rose-500 bg-rose-950/20" : 
                  !isSelected && isCorrect ? "border-emerald-500/50 bg-emerald-950/10" :
                  "border-slate-700 bg-slate-800/50"
                ) : (
                  isSelected ? "border-indigo-500 bg-indigo-950/20" : 
                  "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
                )
              )}
            >
              <div className="flex w-full">
                <div className="flex items-center h-5 mr-4">
                  <RadioGroupItem 
                    value={option.id} 
                    id={option.id} 
                    className="border-slate-600"
                  />
                </div>
                <div className="flex flex-1">
                  <div className={cn(
                    "flex-shrink-0 font-semibold mr-3 mt-0.5 w-6 h-6 flex items-center justify-center rounded-full text-sm",
                    showFeedback ? (
                      isCorrect ? "bg-emerald-900/50 text-emerald-400" : 
                      isSelected ? "bg-rose-900/50 text-rose-400" : 
                      "bg-slate-800 text-slate-400"
                    ) : (
                      isSelected ? "bg-indigo-900/50 text-indigo-400" : "bg-slate-800 text-slate-400"
                    )
                  )}>
                    {optionLabel}
                  </div>
                  <div className="font-medium text-slate-100 flex-grow w-full">
                    <div 
                      dangerouslySetInnerHTML={renderHTML(option.text)} 
                      className={cn(
                        "answer-text prose prose-invert max-w-none prose-p:text-slate-300",
                        hasGraph && "math-content"
                      )}
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
    <div className="w-full">
      <style jsx global>{`
        .math-content svg, 
        .math-content img, 
        .math-content .graph,
        .math-content .coordinate {
          background-color: white;
          padding: 12px;
          border-radius: 8px;
          margin: 12px 0;
          display: block;
        }
        
        .math-content svg * {
          color: black;
          stroke: currentColor;
        }
        
        /* Fix for making labels fully clickable */
        .radio-group label {
          position: relative;
          z-index: 1;
        }
        
        .radio-item {
          position: relative;
        }
        
        .radio-item input[type="radio"] {
          position: absolute;
          opacity: 0;
          width: 1px;
          height: 1px;
        }
        
        /* Add the radio button style */
        .radio-item::before {
          content: "";
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          border: 2px solid #64748b;
          margin-right: 0.5rem;
        }
        
        /* Style for checked radio button */
        .radio-item input[type="radio"]:checked + label::before {
          border-color: var(--color-primary);
          background-color: var(--color-primary);
        }
      `}</style>
      {renderQuestionContent()}
      {renderOptions()}
      {showFeedback && (
        <div className="px-6 pb-6">
          {renderFeedback()}
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay; 