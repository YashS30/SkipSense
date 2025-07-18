import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Music } from 'lucide-react';

export default function GenreSkipRateChart({ tracks, skipEvents }) {
    const data = React.useMemo(() => {
        const genreData = {};
        tracks.forEach(track => {
            if (!genreData[track.genre]) {
                genreData[track.genre] = { total: 0, skips: 0 };
            }
        });

        skipEvents.forEach(event => {
            const track = tracks.find(t => t.id === event.track_id);
            if (track && genreData[track.genre]) {
                genreData[track.genre].total++;
                if (event.was_skipped) {
                    genreData[track.genre].skips++;
                }
            }
        });

        return Object.entries(genreData)
            .map(([genre, { total, skips }]) => ({
                genre,
                skipRate: total > 0 ? (skips / total) * 100 : 0,
            }))
            .filter(d => d.skipRate > 0)
            .sort((a, b) => b.skipRate - a.skipRate);
    }, [tracks, skipEvents]);

    return (
        <Card className="glass-effect border-white/10 h-full">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Skip Rate by Genre
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="genre" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" unit="%" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                                    borderColor: '#4b5563',
                                    color: '#e5e7eb',
                                }}
                            />
                            <Bar dataKey="skipRate" fill="url(#colorUv)" radius={[4, 4, 0, 0]}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.8}/>
                                    </linearGradient>
                                </defs>
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}