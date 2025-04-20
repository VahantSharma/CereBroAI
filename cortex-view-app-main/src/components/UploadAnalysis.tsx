import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/auth";
import { cn } from "@/lib/utils";
import axios from "axios";
import { AlertCircle, CheckCircle2, FileImage, Upload, X } from "lucide-react";
import { useState } from "react";

// Define the Analysis type
interface Analysis {
  id: string;
  result: string;
  confidence: number;
  status: "success" | "error" | "processing";
  imagePath: string;
  createdAt: string;
}

const UploadAnalysis = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<{
    result: string;
    confidence: number;
    status: "success" | "error" | "processing" | null;
  } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setAnalysis(null);
  };

  const analyzeImage = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setAnalysis(null);

    // Create form data
    const formData = new FormData();
    formData.append("image", file);

    try {
      // Track upload progress
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          // Simulate progress up to 90% while waiting for server response
          return prevProgress >= 90 ? 90 : prevProgress + 5;
        });
      }, 100);

      // Send file to backend
      const response = await api.post("/analysis/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            // Calculate real upload progress percentage
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(Math.min(percentCompleted, 90)); // Cap at 90% until processing is done
          }
        },
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Get analysis result from response
      const analysisData = response.data.data.analysis as Analysis;

      setAnalysis({
        result: analysisData.result,
        confidence: analysisData.confidence,
        status: analysisData.status,
      });

      toast({
        title: "Analysis complete",
        description: `Detected: ${analysisData.result} (${analysisData.confidence}% confidence)`,
      });
    } catch (error) {
      console.error("Error analyzing image:", error);

      let errorMessage = "An error occurred during analysis. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }

      setAnalysis({
        result: "Analysis Failed",
        confidence: 0,
        status: "error",
      });

      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-colors",
          dragActive
            ? "border-cerebro-accent bg-cerebro-accent/10"
            : "border-white/20 hover:border-white/40",
          preview ? "border-white/40" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!preview ? (
          <div className="flex flex-col items-center justify-center text-center">
            <FileImage className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Drag & drop MRI scan</h3>
            <p className="text-sm text-gray-400 mb-4 max-w-md">
              Upload a brain MRI scan image for analysis. Supported formats:
              JPEG, PNG, DICOM.
            </p>
            <Button asChild variant="secondary">
              <label className="cursor-pointer">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  onChange={handleChange}
                  accept="image/*"
                />
              </label>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md">
              <img
                src={preview}
                alt="Uploaded MRI scan"
                className="w-full h-auto rounded-lg"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-3 -right-3 rounded-full"
                onClick={clearFile}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                {file?.name} ({Math.round(file?.size / 1024)} KB)
              </p>
            </div>
          </div>
        )}
      </div>

      {preview && (
        <div className="space-y-6">
          <Button
            onClick={analyzeImage}
            className="w-full bg-cerebro-accent hover:bg-cerebro-accent/90"
            disabled={uploading}
          >
            {uploading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Analyze Image
              </span>
            )}
          </Button>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-gray-400">
                Analyzing MRI scan... {progress}%
              </p>
            </div>
          )}

          {analysis && (
            <div
              className={cn(
                "p-4 rounded-lg",
                analysis.status === "success"
                  ? "bg-green-500/10"
                  : "bg-red-500/10"
              )}
            >
              <div className="flex items-center">
                {analysis.status === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                )}
                <div>
                  <h4 className="font-medium">Analysis Results</h4>
                  <p className="text-gray-300">
                    Detected:{" "}
                    <span className="font-medium text-white">
                      {analysis.result}
                    </span>
                    <span className="text-gray-400">
                      {" "}
                      ({analysis.confidence}% confidence)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadAnalysis;
