"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

const BreadcrumbsContext = createContext<{
  breadcrumbs: {
    label: string;
    href?: string;
  }[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<{
    label: string;
    href?: string;
  }[]>>;
} | undefined>(undefined);

export const BreadcrumbsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<{
    label: string;
    href?: string;
  }[]>([]);

  return (
    <BreadcrumbsContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbsProvider');
  }
  return context;
}; 