import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  value,
  onValueChange,
  children,
  className = "",
}) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("tabs", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TabsList: React.FC<TabsListProps> = ({ children, className = "", style }) => {
  return <div className={cn("tabs-list", className)} style={style}>{children}</div>;
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className = "",
}) => {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isActive = value === selectedValue;

  return (
    <button
      className={cn(
        "tabs-trigger", 
        isActive && "active",
        isActive && "[data-state=active]",
        className
      )}
      onClick={() => onValueChange(value)}
      type="button"
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className = "",
}) => {
  const { value: selectedValue } = useTabsContext();
  const isSelected = value === selectedValue;

  if (!isSelected) return null;

  return <div className={cn("tabs-content", className)}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent }; 