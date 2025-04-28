"use client"

import * as React from "react"

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined);

function useRadioGroupContext() {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioGroup components must be used within a RadioGroup");
  }
  return context;
}

export interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className = "", value, onValueChange, name, children, disabled, ...props }, ref) => {
    // Generate a unique name if one is not provided
    const uniqueName = React.useMemo(() => name || `radio-group-${Math.random().toString(36).substr(2, 9)}`, [name]);
    
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange, name: uniqueName }}>
        <div ref={ref} className={`radio-group ${className}`} {...props}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps {
  value: string;
  id?: string;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className = "", value, id, children, disabled, ...props }, ref) => {
    const { value: groupValue, onValueChange, name } = useRadioGroupContext();
    const itemId = id || `radio-${value}`;
    
    return (
      <div className={`radio-item ${className}`}>
        <input 
          type="radio"
          id={itemId}
          ref={ref}
          name={name}
          value={value}
          checked={value === groupValue}
          onChange={() => onValueChange(value)}
          disabled={disabled}
          {...props}
        />
        {children && <label htmlFor={itemId}>{children}</label>}
      </div>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem } 