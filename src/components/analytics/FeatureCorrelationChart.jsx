import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { BarChart2 } from 'lucide-react';

export default function FeatureCorrelationChart({ tracks, featureX, featureY }) {
    const data = tracks.map(track => ({
        x: track.audio_features?.[featureX] || 0,
        y: track.audio_features?.[featureY] || 0,
        skipProb: track.skip_prediction?.probability || 0,
        name: track.title,
    }));

    return (
        <Card className="glass-effect border-white/10 h-full">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 capitalize">
                    <BarChart2 className="w-5 h-5" />
                    {featureX} vs. {featureY}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis type="number" dataKey="x" name={featureX} stroke="#9ca3af" />
                            <YAxis type="number" dataKey="y" name={featureY} stroke="#9ca3af" />
                            <Tooltip 
                              cursor={{ strokeDasharray: '3 3' }} 
                              contentStyle={{ 
                                backgroundColor: 'rgba(30, 41, 59, 0.8)', 
                                borderColor: '#4b5563',
                                color: '#e5e7eb'
                              }}
                            />
                            <Scatter name="Tracks" data={data} fill="#8884d8" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}