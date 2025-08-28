import * as React from "react";
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", style, ...props }) => (
  <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'16px', ...style}} className={className} {...props} />
);
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", style, ...props }) => (
  <div style={{padding:'1rem', borderBottom:'1px solid #e5e7eb', ...style}} className={className} {...props} />
);
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", style, ...props }) => (
  <div style={{padding:'1rem', ...style}} className={className} {...props} />
);
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = "", style, ...props }) => (
  <h2 style={{fontSize:'1.25rem', fontWeight:800, ...style}} className={className} {...props} />
);
