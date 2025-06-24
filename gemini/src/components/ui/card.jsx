// src/components/ui/card.jsx
import React from "react";

export const Card = ({ children, ...props }) => (
  <div className="bg-white rounded-lg shadow-md p-4 w-xxl" {...props}>{children}</div>
);

export const CardHeader = ({ children }) => (
  <div className="mb-2 text-center">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-2xl font-semibold ">{children}</h3>
);

export const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-500">{children}</p>
);

export const CardContent = ({ children }) => (
  <div className="mt-2">{children}</div>
);