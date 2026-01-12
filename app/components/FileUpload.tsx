'use client';

interface FileUploadProps {
  label: string;
  accept: string;
  onChange: (file: File | null) => void;
  helpText?: string;
  required?: boolean;
}

export default function FileUpload({
  label,
  accept,
  onChange,
  helpText,
  required = false,
}: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="block w-full text-sm text-zinc-900 dark:text-zinc-100
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-zinc-100 file:text-zinc-900
          dark:file:bg-zinc-800 dark:file:text-zinc-100
          hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700
          border border-zinc-300 dark:border-zinc-700 rounded-md
          cursor-pointer"
      />
      {helpText && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400">{helpText}</p>
      )}
    </div>
  );
}
