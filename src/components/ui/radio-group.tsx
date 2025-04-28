"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
  name: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined);

function useRadioGroupContext() {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup");
  }
  return context;
}

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  className,
  value,
  onValueChange,
  name,
  disabled = false,
  children,
  ...props
}) => {
  const uniqueName = React.useMemo(() => name || `radio-group-${Math.random().toString(36).slice(2, 9)}`, [name]);
  
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, name: uniqueName }}>
      <div 
        className={cn("radio-group", className)} 
        role="radiogroup" 
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  id?: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, disabled, ...props }, ref) => {
    const { value: groupValue, onValueChange, name } = useRadioGroupContext();
    const itemId = id || `radio-${value}`;
    
    return (
      <input
        type="radio"
        ref={ref}
        id={itemId}
        name={name}
        value={value}
        checked={value === groupValue}
        onChange={() => onValueChange(value)}
        disabled={disabled}
        className={cn("radio-item-input", className)}
        {...props}
      />
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem } 