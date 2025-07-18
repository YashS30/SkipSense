
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AudioWaveform, Volume2, Zap, Music, Mic } from "lucide-react";

export default function AudioFeatures({ features }) {
  const getFeatureColor = (value) => {
    if (value > 0.7) return "bg-green-500";
    if (value > 0.4) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getFeatureIcon = (feature) => {
    switch (feature) {
      case 'energy': return <Zap className="w-4 h-4" />;
      case 'danceability': return <Music className="w-4 h-4" />;
      case 'valence': return <Volume2 className="w-4 h-4" />;
      case 'speechiness': return <Mic className="w-4 h-4" />;
      default: return <AudioWaveform className="w-4 h-4" />;
    }
  };

  const featureLabels = {
    energy: "Energy",
    danceability: "Danceability",
    valence: "Valence (Positivity)",
    tempo: "Tempo",
    acousticness: "Acousticness",
    instrumentalness: "Instrumentalness",
    liveness: "Liveness",
    speechiness: "Speechiness",
    loudness: "Loudness"
  };

  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <AudioWaveform className="w-5 h-5" />
          Audio Features Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(features).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getFeatureIcon(key)}
                  <span className="text-white font-medium">{featureLabels[key]}</span>
                </div>
                <Badge variant="outline" className="text-purple-300 border-purple-300/30">
                  {key === 'tempo' ? `${Math.round(value)} BPM` : 
                   key === 'loudness' ? `${value.toFixed(1)} dB` : 
                   `${(value * 100).toFixed(1)}%`}
                </Badge>
              </div>
              <Progress 
                value={key === 'tempo' ? (value / 200) * 100 : 
                       key === 'loudness' ? ((value + 60) / 60) * 100 : 
                       value * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
