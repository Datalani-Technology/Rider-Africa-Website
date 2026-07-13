"use client";
import { useRef } from "react";
import { Upload, ImagePlus, CheckCircle2, X } from "lucide-react";

type Props = {
  label: string;
  required?: boolean;
  optional?: boolean;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  isPhotoSelector?: boolean;
  files: File[];
  onFiles: (files: File[]) => void;
  uploading?: boolean;
  theme?: "dark" | "light";
};

export default function FileUploadField({
  label,
  required,
  optional,
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = false,
  maxFiles,
  isPhotoSelector = false,
  files,
  onFiles,
  uploading,
  theme = "light",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (maxFiles) {
      onFiles(selected.slice(0, maxFiles));
    } else {
      onFiles(selected);
    }
    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  function removeFile(idx: number) {
    onFiles(files.filter((_, i) => i !== idx));
  }

  const isDark = theme === "dark";
  const labelCls = isDark ? "text-gray-300 text-sm font-semibold" : "text-gray-700 text-sm font-semibold";
  const metaCls = isDark ? "text-gray-500 text-xs" : "text-gray-400 text-xs";

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={labelCls}>{label}</span>
        {required && <span className="text-red-400 text-xs font-bold">Required</span>}
        {optional && <span className={metaCls}>(optional)</span>}
        {maxFiles && <span className={metaCls}>max {maxFiles} files</span>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple || (maxFiles !== undefined && maxFiles > 1)}
        className="hidden"
        onChange={handleChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`w-full flex items-center justify-center gap-3 font-bold py-3.5 px-5 rounded-xl transition-all disabled:opacity-60 ${
          isPhotoSelector
            ? "bg-[#0073FF] hover:bg-[#0055CC] text-white"
            : "bg-[#F97316] hover:bg-[#EA6900] text-white"
        }`}
      >
        {isPhotoSelector
          ? <ImagePlus className="w-5 h-5" strokeWidth={2} />
          : <Upload className="w-5 h-5" strokeWidth={2} />}
        <span>
          {uploading
            ? "Uploading…"
            : isPhotoSelector
              ? maxFiles ? `Select up to ${maxFiles} photos` : "Select photos"
              : files.length > 0 ? "Replace file" : "Upload File"}
        </span>
        {files.length > 0 && !uploading && (
          <CheckCircle2 className="w-4 h-4 text-green-300" strokeWidth={2.5} />
        )}
      </button>

      {/* Selected file pills */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {files.map((f, i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                isDark
                  ? "bg-white/10 text-gray-300 border border-white/10"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" strokeWidth={2.5} />
              <span className="max-w-[160px] truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-gray-400 hover:text-red-400 transition-colors shrink-0"
              >
                <X className="w-3 h-3" strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
