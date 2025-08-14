
import React, { useState, useCallback } from 'react';
import { MasterRecord } from './types';
import { cleanDataWithGemini } from './services/geminiService';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { Loader } from './components/Loader';
import { DownloadIcon, RefreshCwIcon, AlertTriangleIcon, CheckCircle2Icon } from './components/Icons';

export default function App() {
  const [rawData, setRawData] = useState<any[] | null>(null);
  const [cleanedData, setCleanedData] = useState<MasterRecord[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('');
  const [processingMessage, setProcessingMessage] = useState<string>('');

  const handleFileProcessed = useCallback(async (data: any[], file: File) => {
    setError(null);
    setCleanedData(null);
    setRawData(data);
    setOriginalFileName(file.name);
    setIsLoading(true);
    setProcessingMessage('AI is analyzing your data structure...');

    try {
      const cleaned = await cleanDataWithGemini(data, (msg) => setProcessingMessage(msg));
      setCleanedData(cleaned);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to clean data. ${errorMessage}. Please check your file or try again.`);
    } finally {
      setIsLoading(false);
      setProcessingMessage('');
    }
  }, []);

  const handleDownload = () => {
    if (!cleanedData || cleanedData.length === 0) return;

    const headers: (keyof MasterRecord)[] = [
      'customer_id',
      'sesso',
      'età',
      'data_iscrizione',
      'tipo_abbonamento',
      'prezzo_abbonamento',
      'ultima_presenza',
      'media_presenze_sett',
      'giorni_da_ultima_presenza',
      'churn'
    ];

    const escapeCsvValue = (value: any): string => {
        const str = String(value === null || value === undefined ? '' : value);
        if (str.includes(',')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const csvContent = [
      headers.join(','),
      ...cleanedData.map(row => 
        headers.map(header => escapeCsvValue(row[header])).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    const baseName = originalFileName.substring(0, originalFileName.lastIndexOf('.')) || 'dataset';
    link.setAttribute("download", `cleaned_${baseName}.csv`);
    
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleReset = () => {
    setRawData(null);
    setCleanedData(null);
    setIsLoading(false);
    setError(null);
    setOriginalFileName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">AI Data Cleaner</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Upload a messy dataset, and our AI will instantly clean and standardize it for you.
          </p>
        </header>

        <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 md:p-8 ring-1 ring-slate-200 dark:ring-slate-700">
          {!rawData && !isLoading && (
            <FileUpload onFileProcessed={handleFileProcessed} />
          )}

          {isLoading && (
            <Loader message={processingMessage} />
          )}

          {error && (
            <div className="text-center">
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                    <div className="flex items-center justify-center">
                        <AlertTriangleIcon className="h-6 w-6 mr-3"/>
                        <span className="block sm:inline font-semibold">{error}</span>
                    </div>
                </div>
                <button
                    onClick={handleReset}
                    className="mt-6 inline-flex items-center px-6 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <RefreshCwIcon className="h-5 w-5 mr-2"/>
                    Try Again
                </button>
            </div>
          )}

          {cleanedData && !isLoading && !error && (
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center text-green-600 dark:text-green-400 mb-4 sm:mb-0">
                        <CheckCircle2Icon className="h-7 w-7 mr-3"/>
                        <h2 className="text-xl font-semibold">Data Cleaned Successfully!</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleReset}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-slate-800 focus:ring-indigo-500"
                        >
                            <RefreshCwIcon className="h-4 w-4 mr-2" />
                            New File
                        </button>
                        <button
                            onClick={handleDownload}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-slate-800 focus:ring-indigo-500"
                        >
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Download CSV
                        </button>
                    </div>
                </div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Cleaned Data Preview</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Showing the first 10 rows of your transformed dataset.</p>
                <DataTable data={cleanedData.slice(0, 10)} />
            </div>
          )}
        </div>
        <footer className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
            Powered by Google Gemini.
        </footer>
      </main>
    </div>
  );
}
