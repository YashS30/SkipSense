import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Clock } from 'lucide-react';

export default function SkipTimeDistributionChart({ skipEvents }) {
    const data = React.useMemo(() => {
        const timeBins = {
            '0-5s': 0, '5-10s': 0, '10-15s': 0, '15-20s': 0, '20-25s': 0, '25-30s': 0,
        };
        skipEvents.filter(e => e.was_skipped && e.skip_time_ms <= 30000).forEach(event => {
            const bin = Math.floor(event.skip_time_ms / 5000);
            const binName = `${bin * 5}-${(bin + 1) * 5}s`;
            if (timeBins.hasOwnProperty(binName)) {
                timeBins[binName]++;
            }
        });
        return Object.entries(timeBins).map(([time, count]) => ({ time, count }));
    }, [skipEvents]);

    return (
        <Card className="glass-effect border-white/10 h-full">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Early Skip Time Distribution
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: '#4b5563' }} />
                            <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#timeGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}