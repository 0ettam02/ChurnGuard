
import React from 'react';
import { RefreshCwIcon } from './Icons';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
        <RefreshCwIcon className="h-10 w-10 text-indigo-500 animate-spin"/>
        <p className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">Processing Data</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message || 'Please wait a moment...'}</p>
    </div>
  );
};
