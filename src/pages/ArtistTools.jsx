import React, { useState, useEffect } from "react";
import { Track } from "@/api/entities";
import { motion } from "framer-motion";
import { Mic, Music } from "lucide-react";
import ArtistSelector from "../components/artist/ArtistSelector";
import ArtistDashboard from "../components/artist/ArtistDashboard";

export default function ArtistTools() {
  const [allTracks, setAllTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const tracks = await Track.list();
      setAllTracks(tracks);
      
      const uniqueArtists = [...new Set(tracks.map(t => t.artist))];
      setArtists(uniqueArtists);
      
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleSelectArtist = (artist) => {
    setSelectedArtist(artist);
  };
  
  const reset = () => {
    setSelectedArtist(null);
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
          <h1 className="text-4xl font-bold text-white mb-2">Artist Tools</h1>
          <p className="text-purple-300 text-lg">
            Insights and benchmarks for your music.
          </p>
        </motion.div>

        {!selectedArtist ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ArtistSelector 
              artists={artists} 
              onSelect={handleSelectArtist} 
              isLoading={isLoading} 
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ArtistDashboard
              artistName={selectedArtist}
              artistTracks={allTracks.filter(t => t.artist === selectedArtist)}
              allTracks={allTracks}
              onReset={reset}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}