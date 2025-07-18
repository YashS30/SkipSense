import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function RecentAnalysis({ tracks, isLoading }) {
  const getRiskColor = (probability) => {
    if (probability > 0.7) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (probability > 0.4) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-green-500/20 text-green-400 border-green-500/30";
  };

  const getRiskIcon = (probability) => {
    if (probability > 0.7) return <TrendingDown className="w-3 h-3" />;
    if (probability > 0.4) return <AlertTriangle className="w-3 h-3" />;
    return <TrendingUp className="w-3 h-3" />;
  };

  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Music className="w-5 h-5" />
          Recent Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))
          ) : tracks.length > 0 ? (
            tracks.slice(0, 5).map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium truncate">{track.title}</div>
                  <div className="text-gray-400 text-sm truncate">{track.artist}</div>
                </div>
                <Badge className={getRiskColor(track.skip_prediction?.probability || 0.3)}>
                  {getRiskIcon(track.skip_prediction?.probability || 0.3)}
                  {((track.skip_prediction?.probability || 0.3) * 100).toFixed(0)}%
                </Badge>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <Music className="w-12 h-12 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">No tracks analyzed yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}