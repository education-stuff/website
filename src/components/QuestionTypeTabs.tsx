import React from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface QuestionTypeTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const QuestionTypeTabs: React.FC<QuestionTypeTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full grid grid-cols-2 mb-6 mx-auto" style={{maxWidth: '400px'}}>
        <TabsTrigger value="rw" className="flex items-center justify-center gap-2 p-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <span>Reading & Writing</span>
        </TabsTrigger>
        <TabsTrigger value="math" className="flex items-center justify-center gap-2 p-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
            <line x1="8" y1="8" x2="16" y2="16"></line>
            <line x1="16" y1="8" x2="8" y2="16"></line>
          </svg>
          <span>Math</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default QuestionTypeTabs; 