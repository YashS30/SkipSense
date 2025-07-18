import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mic, User } from "lucide-react";

export default function ArtistSelector({ artists, onSelect, isLoading }) {
  return (
    <Card className="glass-effect border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Select an Artist to Analyze
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
          ) : (
            artists.map(artist => (
              <Button 
                key={artist}
                variant="outline"
                className="justify-start gap-2 border-white/20 text-white hover:bg-white/10"
                onClick={() => onSelect(artist)}
              >
                <User className="w-4 h-4 text-purple-300" />
                <span>{artist}</span>
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}