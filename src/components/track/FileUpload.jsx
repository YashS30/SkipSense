import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Music, FileAudio } from "lucide-react";

export default function FileUpload({ onFileSelect, selectedFile }) {
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Audio File (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          {selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto flex items-center justify-center">
                <FileAudio className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-purple-300 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button
                variant="outline"
                onClick={() => onFileSelect(null)}
                className="border-white/20 text-white hover:bg-white/5"
              >
                Remove File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-lg mx-auto flex items-center justify-center">
                <Music className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium mb-2">Upload Audio File</p>
                <p className="text-purple-300 text-sm mb-4">
                  Upload an audio file for advanced spectral analysis
                </p>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="audio-upload"
                />
                <label htmlFor="audio-upload">
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/5"
                    asChild
                  >
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}