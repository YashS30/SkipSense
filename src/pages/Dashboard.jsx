import React, { useState, useEffect } from "react";
import { Track, SkipEvent } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Music, 
  Zap, 
  Users, 
  Clock,
  Play,
  SkipForward,
  Target,
  Brain
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { motion } from "framer-motion";

import StatsCard from "../components/dashboard/StatsCard";
import ModelPerformance from "../components/dashboard/ModelPerformance";
import RecentAnalysis from "../components/dashboard/RecentAnalysis";
import SkipTrends from "../components/dashboard/SkipTrends";

export default function Dashboard() {
  const [tracks, setTracks] = useState([]);
  const [skipEvents, setSkipEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [tracksData, skipEventsData] = await Promise.all([
      Track.list("-created_date", 20),
      SkipEvent.list("-created_date", 100)
    ]);
    setTracks(tracksData);
    setSkipEvents(skipEventsData);
    setIsLoading(false);
  };

  const calculateStats = () => {
    const totalTracks = tracks.length;
    const totalSkipEvents = skipEvents.length;
    const skippedTracks = skipEvents.filter(event => event.was_skipped).length;
    const skipRate = totalSkipEvents > 0 ? (skippedTracks / totalSkipEvents) * 100 : 0;
    const avgSkipTime = skipEvents.length > 0 
      ? skipEvents.reduce((sum, event) => sum + (event.skip_time_ms || 0), 0) / skipEvents.length / 1000
      : 0;

    return {
      totalTracks,
      totalSkipEvents,
      skipRate,
      avgSkipTime,
      modelAccuracy: 94.2,
      predictionsToday: 347
    };
  };

  const stats = calculateStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Music Intelligence Dashboard
              </h1>
              <p className="text-purple-300 text-lg">
                Real-time skip prediction and analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                Model Active
              </Badge>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <Brain className="w-4 h-4 mr-2" />
                Analyze New Track
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Total Tracks"
              value={stats.totalTracks}
              icon={Music}
              trend="+12% this week"
              color="from-blue-500 to-cyan-500"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Skip Rate"
              value={`${stats.skipRate.toFixed(1)}%`}
              icon={SkipForward}
              trend="-2.3% from last week"
              color="from-red-500 to-pink-500"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Model Accuracy"
              value={`${stats.modelAccuracy}%`}
              icon={Target}
              trend="+0.8% improvement"
              color="from-green-500 to-emerald-500"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Predictions Today"
              value={stats.predictionsToday}
              icon={Zap}
              trend="+24% from yesterday"
              color="from-purple-500 to-violet-500"
            />
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ModelPerformance />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <SkipTrends skipEvents={skipEvents} />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <RecentAnalysis tracks={tracks} isLoading={isLoading} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}