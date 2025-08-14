
import React, { useState, useCallback } from 'react';
import { UploadCloudIcon } from './Icons';

interface FileUploadProps {
  onFileProcessed: (data: any[], file: File) => void;
}

declare var XLSX: any;

export const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    if (!file) {
      setError('No file selected.');
      return;
    }

    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      setError('Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates:true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        onFileProcessed(json, file);
      } catch (err) {
        console.error(err);
        setError('There was an error parsing the file. Please ensure it is a valid Excel/CSV file.');
      }
    };
    reader.onerror = () => {
        setError('Failed to read the file.');
    };
    reader.readAsBinaryString(file);
  }, [onFileProcessed]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="text-center">
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative block w-full border-2 ${
          isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-600 border-dashed'
        } rounded-lg p-12 text-center hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
      >
        <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400" />
        <span className="mt-2 block text-sm font-medium text-slate-800 dark:text-slate-200">
          Drag and drop your Excel file here
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">or</span>
        <label
          htmlFor="file-upload"
          className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
        >
          <span> browse to upload</span>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept=".xlsx, .xls, .csv" />
        </label>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">.xlsx, .xls, or .csv</p>
      </div>
       {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};
