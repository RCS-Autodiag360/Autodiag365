import * as React from "react";
export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className = "", style, ...props }) => (
  <label style={{display:'block', fontSize:'.9rem', fontWeight:600, marginBottom:'.25rem', ...style}} className={className} {...props} />
);
