import * as React from "react";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", style, ...props }, ref) => (
    <input
      ref={ref}
      style={{border:'1px solid #e5e7eb', borderRadius:'8px', padding:'.6rem .75rem', width:'100%', ...style}}
      className={className}
      {...props}
    />
  )
);
Input.displayName = "Input";
