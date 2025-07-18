import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Target, Brain } from "lucide-react";

const performanceData = [
  { day: 'Mon', accuracy: 91.2, precision: 89.4, recall: 92.1 },
  { day: 'Tue', accuracy: 92.8, precision: 90.2, recall: 93.5 },
  { day: 'Wed', accuracy: 93.1, precision: 91.8, recall: 92.9 },
  { day: 'Thu', accuracy: 94.2, precision: 92.4, recall: 94.1 },
  { day: 'Fri', accuracy: 93.8, precision: 92.1, recall: 93.6 },
  { day: 'Sat', accuracy: 94.5, precision: 93.2, recall: 94.8 },
  { day: 'Sun', accuracy: 94.2, precision: 92.8, recall: 94.4 },
];

export default function ModelPerformance() {
  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5" />
          Model Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="precisionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[85, 100]} />
              <Area
                type="monotone"
                dataKey="accuracy"
                stroke="#a855f7"
                fillOpacity={1}
                fill="url(#accuracyGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="precision"
                stroke="#ec4899"
                fillOpacity={1}
                fill="url(#precisionGradient)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="recall"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">94.2%</div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">92.8%</div>
            <div className="text-sm text-gray-400">Precision</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">94.4%</div>
            <div className="text-sm text-gray-400">Recall</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}