import React, { useState, useEffect } from "react";
import { Track } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Zap, TrendingUp, TrendingDown, Shuffle, ListMusic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import TrackSelector from "../components/playlist/TrackSelector";
import PlaylistView from "../components/playlist/PlaylistView";
import OptimizationSummary from "../components/playlist/OptimizationSummary";

export default function PlaylistOptimizer() {
  const [allTracks, setAllTracks] = useState([]);
  const [selectedTrackIds, setSelectedTrackIds] = useState(new Set());
  const [originalPlaylist, setOriginalPlaylist] = useState([]);
  const [optimizedPlaylist, setOptimizedPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      setIsLoading(true);
      const tracks = await Track.list();
      setAllTracks(tracks);
      setIsLoading(false);
    };
    loadTracks();
  }, []);

  const handleTrackSelection = (trackId) => {
    setSelectedTrackIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const handleOptimize = () => {
    const selectedTracks = allTracks.filter(t => selectedTrackIds.has(t.id));
    setOriginalPlaylist(selectedTracks);
    
    const optimized = [...selectedTracks].sort((a, b) => {
      const probA = a.skip_prediction?.probability || 0.5;
      const probB = b.skip_prediction?.probability || 0.5;
      return probA - probB;
    });
    setOptimizedPlaylist(optimized);
  };
  
  const reset = () => {
    setSelectedTrackIds(new Set());
    setOriginalPlaylist([]);
    setOptimizedPlaylist(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Playlist Optimizer</h1>
          <p className="text-purple-300 text-lg">
            Re-order playlists to reduce skips and improve listener retention.
          </p>
        </motion.div>

        {!optimizedPlaylist ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TrackSelector 
              tracks={allTracks}
              selectedIds={selectedTrackIds}
              onSelect={handleTrackSelection}
              isLoading={isLoading}
            />
            {selectedTrackIds.size > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center"
              >
                <Button
                  onClick={handleOptimize}
                  disabled={selectedTrackIds.size < 2}
                  className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 px-10 text-lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Optimize Playlist
                </Button>
                {selectedTrackIds.size < 2 && (
                  <p className="text-sm text-purple-300 mt-2">Select at least 2 tracks to optimize.</p>
                )}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <OptimizationSummary 
              originalPlaylist={originalPlaylist} 
              optimizedPlaylist={optimizedPlaylist}
            />

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <PlaylistView title="Original Playlist" tracks={originalPlaylist} icon={Shuffle} />
              <PlaylistView title="Optimized Playlist" tracks={optimizedPlaylist} icon={TrendingUp} />
            </div>
            
            <div className="mt-8 text-center">
              <Button onClick={reset} variant="outline" className="border-white/20 text-white hover:bg-white/5">
                Optimize Another Playlist
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}