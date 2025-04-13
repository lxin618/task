import React, { useState } from "react";

interface FileInputProps {
    onFileSelect: (file: File) => void;
}

export const FileInputComponent: React.FC<FileInputProps> = ({ onFileSelect }) => {

    const [error, setError] = useState(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        // uploading 1 file for example
        const file = event.target.files?.[0];
    
        if (!file) return;
    
        // Validate file size and type
        if (file.size > 2 * 1024 * 1024) {
          setError("File size should not exceed 2MB");
          return;
        }
        
        // file type validation
        if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
          setError("Only PDF or image files are allowed.");
          return;
        }
    
        setError(null);
        onFileSelect(file);
    };

    return (
        <div>
            <input
                data-testid="file-input"
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
            />
            {error && <div data-testid="file-error">{error}</div>}
        </div>
    );
};