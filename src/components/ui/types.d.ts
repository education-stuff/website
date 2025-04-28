declare module '@/components/ui/radio-group' {
  import * as React from "react";
  
  export interface RadioGroupProps extends React.ComponentPropsWithoutRef<"div"> {
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
  }
  
  export interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<"button"> {
    value: string;
    id?: string;
    className?: string;
  }
  
  export const RadioGroup: React.ForwardRefExoticComponent<RadioGroupProps & React.RefAttributes<HTMLDivElement>>;
  export const RadioGroupItem: React.ForwardRefExoticComponent<RadioGroupItemProps & React.RefAttributes<HTMLButtonElement>>;
}

declare module '@/components/ui/label' {
  import * as React from "react";
  
  export interface LabelProps extends React.ComponentPropsWithoutRef<"label"> {
    className?: string;
  }
  
  export const Label: React.ForwardRefExoticComponent<LabelProps & React.RefAttributes<HTMLLabelElement>>;
}

declare module '@/components/ui/input' {
  import * as React from "react";
  
  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
  }
  
  export const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
} 