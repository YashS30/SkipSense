import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function AnalyticsFilters({ onFilterChange }) {
  return (
    <Card className="glass-effect border-white/10">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-300" />
            <span className="text-white font-medium">Filters:</span>
          </div>
          <Select onValueChange={(value) => onFilterChange(prev => ({ ...prev, genre: value }))}>
            <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="rock">Rock</SelectItem>
              <SelectItem value="hip-hop">Hip-Hop</SelectItem>
              <SelectItem value="electronic">Electronic</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => onFilterChange(prev => ({ ...prev, device: value }))}>
            <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="All Devices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Devices</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="smart_speaker">Smart Speaker</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => onFilterChange(prev => ({ ...prev, timeOfDay: value }))}>
            <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="All Times of Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Times of Day</SelectItem>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
              <SelectItem value="night">Night</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}