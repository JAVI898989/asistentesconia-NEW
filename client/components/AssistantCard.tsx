import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Clock, CheckCircle } from 'lucide-react';
import { useAssistantAvatar } from '@/hooks/useAssistantAvatar';

interface Assistant {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "basic" | "intermediate" | "advanced" | "expert";
  image: string;
  features: string[];
  isPublic?: boolean;
  isPro?: boolean;
}

interface AssistantCardProps {
  assistant: Assistant;
  currentCycle: 'monthly' | 'annual';
  founderPrice: number;
  normalPrice: number;
  billingCycle: Record<string, string>;
  setBillingCycle: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  categories: Array<{ id: string; name: string; icon: any }>;
  formatCurrency: (amount: number) => string;
  handleSubscribe?: (assistantId: string, cycle: string) => void;
}

export default function AssistantCard({
  assistant,
  currentCycle,
  founderPrice,
  normalPrice,
  billingCycle,
  setBillingCycle,
  categories,
  formatCurrency,
  handleSubscribe
}: AssistantCardProps) {
  // Use real-time avatar with fallback to static image
  const { thumbUrl, avatar, loading } = useAssistantAvatar(assistant.id);

  // Use avatar thumbnail if available, otherwise fallback to static
  const displayImageUrl = thumbUrl || assistant.image;

  return (
    <Card className="bg-card border-border overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={displayImageUrl}
          alt={assistant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback to placeholder on error
            console.warn(`Image load error for ${assistant.id}, falling back to placeholder`);
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-orange-500 text-white font-medium">
            <Crown className="w-3 h-3 mr-1" />
            Fundador
          </Badge>
        </div>

        {/* Avatar Indicator (only show if different from static) */}
        {avatar && thumbUrl && thumbUrl !== assistant.image && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-500 text-white font-medium text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              v{avatar.version}
            </Badge>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {categories.find((c) => c.id === assistant.category)?.name || "General"}
          </Badge>
        </div>
        <CardTitle className="text-lg">
          {assistant.name}
        </CardTitle>
        <CardDescription className="text-sm">
          {assistant.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Billing Toggle */}
        {!assistant.isPublic && !assistant.isPro && (
          <div className="flex items-center justify-center">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={currentCycle === "monthly" ? "default" : "ghost"}
                size="sm"
                className="text-xs"
                onClick={() =>
                  setBillingCycle((prev) => ({
                    ...prev,
                    [assistant.id]: "monthly",
                  }))
                }
              >
                Mensual
              </Button>
              <Button
                variant={currentCycle === "annual" ? "default" : "ghost"}
                size="sm"
                className="text-xs"
                onClick={() =>
                  setBillingCycle((prev) => ({
                    ...prev,
                    [assistant.id]: "annual",
                  }))
                }
              >
                Anual
              </Button>
            </div>
          </div>
        )}

        {/* Pricing */}
        {!assistant.isPublic && !assistant.isPro && (
          <div className="text-center space-y-2">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-500">
                {formatCurrency(founderPrice)}
              </div>
              <div className="text-xs text-orange-600">🚀 Precio Fundador</div>
              <div className="text-lg text-muted-foreground line-through">
                {formatCurrency(normalPrice)}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentCycle === "annual" && (
                  <div className="text-green-600">
                    ✨ Ahorras {formatCurrency(
                      founderPrice * (currentCycle === "annual" ? 12 : 1) - founderPrice
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link to={`/asistente/${assistant.id}`} className="block">
          <Button className="w-full" variant={assistant.isPublic ? "outline" : "default"}>
            {assistant.isPublic ? "Acceso Gratuito" : "Ver Detalles"}
          </Button>
        </Link>

        {/* Features */}
        {assistant.features && assistant.features.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <div className="flex flex-wrap gap-1">
              {assistant.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {assistant.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{assistant.features.length - 3} más
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
