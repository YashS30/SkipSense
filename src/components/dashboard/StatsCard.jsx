import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, trend, color }) {
  const isPositiveTrend = trend && (trend.includes('+') || trend.includes('improvement'));
  
  return (
    <Card className="glass-effect border-white/10 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-purple-300 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white mb-2">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                {isPositiveTrend ? (
                  <TrendingUp className="w-3 h-3 text-green-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className={isPositiveTrend ? 'text-green-400' : 'text-red-400'}>
                  {trend}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${color} bg-opacity-20`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}