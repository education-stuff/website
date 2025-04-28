import React from "react";
import { Card, CardContent } from "./ui/card";
import { QuestionStats } from "@/services/questionService";
import { cn } from "@/lib/utils";

interface PracticeQuestionCardProps {
  questionStat: QuestionStats;
  onClick: () => void;
  locked?: boolean;
}

const PracticeQuestionCard: React.FC<PracticeQuestionCardProps> = ({
  questionStat,
  onClick,
  locked = false,
}) => {
  const formattedType = questionStat.type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const getDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      "reading": "Identify information that is incorrect or not mentioned in the passage. (0-2 questions per passage)",
      "vocabulary": "Identify the contextual meaning of a particular word or phrase given in the passage. (1-2 questions per passage)",
      "insert-text": "Identify the best place to insert a sentence in the passage. (1 question per passage)",
      "sentence-simplification": "Identify the sentence that best summarizes the essential information from the sentence given in the passage. (0-1 question per passage)",
      "factual-info": "Identify information that is explicitly stated in the passage. (2-5 questions per passage)",
      "rhetorical-purpose": "Identify the reason why the author presents a particular piece of information in the passage.",
      "reference": "Identify what a pronoun or other referencing word refers to in the passage.",
      "inference": "Identify information that is implied but not directly stated in the passage."
    };
    
    return descriptions[type] || "";
  };

  return (
    <Card 
      onClick={locked ? undefined : onClick} 
      className={cn(
        "border",
        locked ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
      )}
      style={{ position: "relative" }}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium mb-2">{formattedType}</h3>
            <p className="text-sm text-muted">
              {getDescription(questionStat.type)}
            </p>
          </div>
          <div className="badge badge-primary">
            {questionStat.completed}/{questionStat.total}
          </div>
        </div>
        
        {locked && (
          <div className="position-absolute inset-0 flex items-center justify-center bg-background backdrop-blur">
            <div className="bg-muted p-3 rounded-full">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PracticeQuestionCard; 