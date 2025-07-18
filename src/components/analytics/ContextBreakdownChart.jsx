import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { AppWindow } from 'lucide-react';

export default function ContextBreakdownChart({ skipEvents }) {
    const data = React.useMemo(() => {
        const contextCounts = {};
        skipEvents.filter(e => e.was_skipped).forEach(event => {
            const context = event.listening_context || 'unknown';
            contextCounts[context] = (contextCounts[context] || 0) + 1;
        });
        return Object.entries(contextCounts).map(([name, value]) => ({ name, value }));
    }, [skipEvents]);

    const COLORS = ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f97316', '#eab308'];

    return (
        <Card className="glass-effect border-white/10 h-full">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <AppWindow className="w-5 h-5" />
                    Skips by Listening Context
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend wrapperStyle={{ color: '#fff' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}