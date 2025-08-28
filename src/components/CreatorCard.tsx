import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Users, Repeat } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { creatorApi } from "../services/creatorApi";
import React from "react";
interface Creator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tagline: string;
  followers: number;
  platform: string;
}

interface CreatorCardProps {
  creator: Creator;
  onSwap?: (id: string) => void;
  showSwap?: boolean;
  maxCreators?: number;
}

export function CreatorCard({ creator, onSwap, showSwap = false }: CreatorCardProps) {
  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <Card className="p-6 bg-card border border-border hover:shadow-lg hover:border-primary/50 transition-all">
      <div className="flex items-start space-x-4">
        <ImageWithFallback
          src={creatorApi.getImageUrl(creator.avatar)}
          alt={creator.name}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-baron font-semibold text-card-foreground truncate">{creator.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{creator.role}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{creator.tagline}</p>
            </div>
            
            {showSwap && onSwap && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSwap(creator.id)}
                className="ml-2 flex-shrink-0 border-border bg-card text-card-foreground hover:bg-card/80"
              >
                <Repeat className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs border-primary/20">
                {creator.platform}
              </Badge>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{formatFollowerCount(creator.followers)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}