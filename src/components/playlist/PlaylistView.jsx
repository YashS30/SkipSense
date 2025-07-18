import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function PlaylistView({ title, tracks, icon: Icon }) {
  const getRiskColor = (probability) => {
    if (probability > 0.7) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (probability > 0.4) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-green-500/20 text-green-400 border-green-500/30";
  };
  
  const getRiskIcon = (probability) => {
    if (probability > 0.7) return <TrendingDown className="w-3 h-3 mr-1" />;
    if (probability > 0.4) return <AlertTriangle className="w-3 h-3 mr-1" />;
    return <TrendingUp className="w-3 h-3 mr-1" />;
  };

  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tracks.map((track, index) => (
            <motion.div
              key={track.id + title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
            >
              <div className="text-purple-300 font-bold w-6 text-center">{index + 1}</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-white font-medium truncate">{track.title}</p>
                <p className="text-gray-400 text-sm truncate">{track.artist}</p>
              </div>
              <Badge className={getRiskColor(track.skip_prediction?.probability || 0.5)}>
                {getRiskIcon(track.skip_prediction?.probability || 0.5)}
                {((track.skip_prediction?.probability || 0.5) * 100).toFixed(0)}%
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}