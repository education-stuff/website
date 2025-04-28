import * as React from "react";

declare module "*.tsx" {
  const content: React.ComponentType<any>;
  export default content;
}

declare module "@/components/ui/radio-group" {
  import * as React from "react";
  
  export interface RadioGroupProps {
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
  }
  
  export const RadioGroup: React.FC<RadioGroupProps>;
  export const RadioGroupItem: React.FC<{
    value: string;
    id?: string;
    className?: string;
  }>;
}

declare module "@/components/ui/label" {
  import * as React from "react";
  
  export interface LabelProps {
    htmlFor?: string;
    className?: string;
    children?: React.ReactNode;
  }
  
  export const Label: React.FC<LabelProps>;
}

declare module "@/components/ui/input" {
  import * as React from "react";
  
  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
  
  export const Input: React.FC<InputProps>;
} 