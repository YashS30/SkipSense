import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Mic, Music, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function ArtistDashboard({ artistName, artistTracks, allTracks, onReset }) {
  const getGenreStats = (genre) => {
    const genreTracks = allTracks.filter(t => t.genre === genre);
    if(genreTracks.length === 0) return null;
    const avgFeatures = {
        energy: 0, danceability: 0, valence: 0, acousticness: 0, liveness: 0
    };
    genreTracks.forEach(t => {
        avgFeatures.energy += t.audio_features.energy;
        avgFeatures.danceability += t.audio_features.danceability;
        avgFeatures.valence += t.audio_features.valence;
        avgFeatures.acousticness += t.audio_features.acousticness;
        avgFeatures.liveness += t.audio_features.liveness;
    });
    Object.keys(avgFeatures).forEach(key => {
        avgFeatures[key] /= genreTracks.length;
    });
    return avgFeatures;
  };
  
  const selectedTrack = artistTracks[0];
  const genreAverage = getGenreStats(selectedTrack?.genre);

  const radarData = genreAverage ? Object.keys(genreAverage).map(key => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      artist: selectedTrack.audio_features[key] * 100,
      average: genreAverage[key] * 100,
      fullMark: 100,
  })) : [];
  
  const getRiskColor = (probability) => {
    if (probability > 0.7) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (probability > 0.4) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-green-500/20 text-green-400 border-green-500/30";
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Mic className="w-8 h-8 text-purple-400" />
          {artistName}'s Dashboard
        </h2>
        <Button onClick={onReset} variant="ghost" className="text-white hover:bg-white/10">
          <X className="w-4 h-4 mr-2" />
          Change Artist
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card className="glass-effect border-white/10 h-full">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">Track Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {artistTracks.map(track => (
                        <div key={track.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                            <Music className="w-5 h-5 text-purple-300"/>
                            <div className="flex-1">
                                <p className="text-white font-medium">{track.title}</p>
                                <p className="text-gray-400 text-sm">{track.album}</p>
                            </div>
                            <Badge className={getRiskColor(track.skip_prediction?.probability)}>
                                {((track.skip_prediction?.probability || 0) * 100).toFixed(0)}% Skip Risk
                            </Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
        <div>
            <Card className="glass-effect border-white/10 h-full">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        "{selectedTrack?.title}" vs. {selectedTrack?.genre} Average
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#4b5563" />
                                <PolarAngleAxis dataKey="subject" stroke="#d1d5db" />
                                <Radar name={artistName} dataKey="artist" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                                <Radar name="Genre Average" dataKey="average" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}