import * as React from "react";
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = "",
  children,
  style,
  ...props
}) => (
  <button
    style={{background:'#2563eb', color:'#fff', padding:'.5rem 1rem', borderRadius:'10px', border:0, cursor:'pointer', ...style}}
    className={className}
    {...props}
  >
    {children}
  </button>
);
