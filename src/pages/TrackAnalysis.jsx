
import React, { useState } from "react";
import { Track } from "@/api/entities";
import { InvokeLLM, UploadFile } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  Music, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  AudioWaveform // Changed from Waveform to AudioWaveform as per outline
} from "lucide-react";
import { motion } from "framer-motion";

import FileUpload from "../components/track/FileUpload";
import AudioFeatures from "../components/track/AudioFeatures";
import SkipPrediction from "../components/track/SkipPrediction";
import Recommendations from "../components/track/Recommendations";

export default function TrackAnalysis() {
  const [trackData, setTrackData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    release_year: new Date().getFullYear()
  });
  const [audioFile, setAudioFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!trackData.title || !trackData.artist) {
      setError("Please provide track title and artist");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate audio analysis with AI
      const audioFeatures = await InvokeLLM({
        prompt: `Analyze the musical characteristics of "${trackData.title}" by ${trackData.artist} (${trackData.genre} genre, ${trackData.release_year}). 
        
        Generate realistic audio features and predict skip likelihood based on:
        - Genre patterns and typical skip rates
        - Artist popularity and familiarity
        - Audio characteristics that typically lead to skips
        - Time period and cultural context
        
        Consider factors like:
        - Intro length and engagement
        - Vocal prominence and clarity
        - Instrumentation complexity
        - Tempo and energy patterns
        - Genre-specific expectations`,
        response_json_schema: {
          type: "object",
          properties: {
            audio_features: {
              type: "object",
              properties: {
                energy: { type: "number", minimum: 0, maximum: 1 },
                danceability: { type: "number", minimum: 0, maximum: 1 },
                valence: { type: "number", minimum: 0, maximum: 1 },
                tempo: { type: "number", minimum: 60, maximum: 200 },
                acousticness: { type: "number", minimum: 0, maximum: 1 },
                instrumentalness: { type: "number", minimum: 0, maximum: 1 },
                liveness: { type: "number", minimum: 0, maximum: 1 },
                speechiness: { type: "number", minimum: 0, maximum: 1 },
                loudness: { type: "number", minimum: -20, maximum: 0 }
              }
            },
            skip_prediction: {
              type: "object",
              properties: {
                probability: { type: "number", minimum: 0, maximum: 1 },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                risk_factors: { type: "array", items: { type: "string" } }
              }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      // Save track to database
      const savedTrack = await Track.create({
        ...trackData,
        audio_features: audioFeatures.audio_features,
        skip_prediction: audioFeatures.skip_prediction,
        popularity: Math.floor(Math.random() * 100)
      });

      setAnalysis({
        ...audioFeatures,
        trackId: savedTrack.id
      });

    } catch (err) {
      setError("Failed to analyze track. Please try again.");
      console.error(err);
    }

    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setTrackData({
      title: "",
      artist: "",
      album: "",
      genre: "",
      release_year: new Date().getFullYear()
    });
    setAudioFile(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Track Analysis</h1>
          <p className="text-purple-300 text-lg">
            Analyze skip probability and get optimization insights
          </p>
        </motion.div>

        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/20">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {!analysis ? (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Track Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-purple-300">Track Title</Label>
                      <Input
                        value={trackData.title}
                        onChange={(e) => setTrackData({...trackData, title: e.target.value})}
                        placeholder="Enter track title..."
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300">Artist</Label>
                      <Input
                        value={trackData.artist}
                        onChange={(e) => setTrackData({...trackData, artist: e.target.value})}
                        placeholder="Enter artist name..."
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300">Album</Label>
                      <Input
                        value={trackData.album}
                        onChange={(e) => setTrackData({...trackData, album: e.target.value})}
                        placeholder="Enter album name..."
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-300">Genre</Label>
                      <Select value={trackData.genre} onValueChange={(value) => setTrackData({...trackData, genre: value})}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pop">Pop</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                          <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                          <SelectItem value="electronic">Electronic</SelectItem>
                          <SelectItem value="indie">Indie</SelectItem>
                          <SelectItem value="classical">Classical</SelectItem>
                          <SelectItem value="jazz">Jazz</SelectItem>
                          <SelectItem value="country">Country</SelectItem>
                          <SelectItem value="r&b">R&B</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-purple-300">Release Year</Label>
                      <Input
                        type="number"
                        value={trackData.release_year}
                        onChange={(e) => setTrackData({...trackData, release_year: parseInt(e.target.value)})}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FileUpload onFileSelect={setAudioFile} selectedFile={audioFile} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !trackData.title || !trackData.artist}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Track...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Analyze Skip Probability
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <SkipPrediction 
                prediction={analysis.skip_prediction}
                trackTitle={trackData.title}
                artist={trackData.artist}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <AudioFeatures features={analysis.audio_features} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Recommendations recommendations={analysis.recommendations} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                onClick={resetAnalysis}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/5"
              >
                Analyze Another Track
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
