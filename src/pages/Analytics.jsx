import React, { useState, useEffect } from "react";
import { Track, SkipEvent } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart3, Filter } from "lucide-react";

import AnalyticsFilters from "../components/analytics/AnalyticsFilters";
import GenreSkipRateChart from "../components/analytics/GenreSkipRateChart";
import FeatureCorrelationChart from "../components/analytics/FeatureCorrelationChart";
import ContextBreakdownChart from "../components/analytics/ContextBreakdownChart";
import SkipTimeDistributionChart from "../components/analytics/SkipTimeDistributionChart";

export default function Analytics() {
  const [tracks, setTracks] = useState([]);
  const [skipEvents, setSkipEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: 'all',
    device: 'all',
    timeOfDay: 'all'
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [tracksData, skipEventsData] = await Promise.all([
        Track.list(),
        SkipEvent.list()
      ]);
      setTracks(tracksData);
      setSkipEvents(skipEventsData);
      setIsLoading(false);
    };
    loadData();
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" } }
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
          <h1 className="text-4xl font-bold text-white mb-2">Deeper Analytics</h1>
          <p className="text-purple-300 text-lg">
            Explore detailed skip patterns and correlations.
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <AnalyticsFilters onFilterChange={setFilters} />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
        >
          <motion.div variants={itemVariants}>
            <GenreSkipRateChart tracks={tracks} skipEvents={skipEvents} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ContextBreakdownChart skipEvents={skipEvents} />
          </motion.div>
          <motion.div variants={itemVariants}>
             <FeatureCorrelationChart tracks={tracks} featureX="energy" featureY="valence" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SkipTimeDistributionChart skipEvents={skipEvents} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}