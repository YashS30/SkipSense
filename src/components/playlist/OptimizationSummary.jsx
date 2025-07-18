import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ArrowRight } from "lucide-react";

export default function OptimizationSummary({ originalPlaylist, optimizedPlaylist }) {
  const calculateAvgRisk = (playlist) => {
    if (!playlist || playlist.length === 0) return 0;
    const totalRisk = playlist.reduce((sum, track) => sum + (track.skip_prediction?.probability || 0.5), 0);
    return (totalRisk / playlist.length) * 100;
  };

  const originalRisk = calculateAvgRisk(originalPlaylist);
  const optimizedRisk = calculateAvgRisk(optimizedPlaylist);
  const improvement = originalRisk - optimizedRisk;

  return (
    <Card className="glass-effect border-white/10">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-around gap-6">
          <div className="text-center">
            <p className="text-purple-300 text-sm">Original Avg. Skip Risk</p>
            <p className="text-3xl font-bold text-white mt-1">{originalRisk.toFixed(1)}%</p>
          </div>
          <ArrowRight className="w-8 h-8 text-purple-400 hidden md:block" />
          <div className="text-center">
            <p className="text-purple-300 text-sm">Optimized Avg. Skip Risk</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{optimizedRisk.toFixed(1)}%</p>
          </div>
          <div className="text-center md:border-l border-white/10 md:pl-8">
            <p className="text-purple-300 text-sm">Improvement</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <TrendingUp className="w-7 h-7 text-green-400" />
              <p className="text-3xl font-bold text-green-400">{improvement.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}