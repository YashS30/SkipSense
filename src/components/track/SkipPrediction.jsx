import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function SkipPrediction({ prediction, trackTitle, artist }) {
  const { probability, confidence, risk_factors } = prediction;
  
  const getRiskLevel = () => {
    if (probability > 0.7) return { level: "HIGH", color: "red", icon: XCircle };
    if (probability > 0.4) return { level: "MEDIUM", color: "yellow", icon: AlertTriangle };
    return { level: "LOW", color: "green", icon: CheckCircle };
  };

  const risk = getRiskLevel();

  return (
    <Card className="glass-effect border-white/10 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5" />
          Skip Prediction Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-1">"{trackTitle}"</h3>
              <p className="text-purple-300">by {artist}</p>
            </div>
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="relative w-32 h-32 mx-auto mb-4"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse opacity-20"></div>
              <div className="absolute inset-2 rounded-full bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-bold text-${risk.color}-400`}>
                    {(probability * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-400">Skip Risk</div>
                </div>
              </div>
            </motion.div>

            <Badge 
              className={`mb-4 text-lg px-4 py-2 bg-${risk.color}-500/20 text-${risk.color}-400 border-${risk.color}-500/30`}
            >
              <risk.icon className="w-4 h-4 mr-2" />
              {risk.level} RISK
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                {(confidence * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-400">Confidence</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                {risk_factors.length}
              </div>
              <div className="text-sm text-gray-400">Risk Factors</div>
            </div>
          </div>

          {risk_factors.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-3">Identified Risk Factors:</h4>
              <div className="space-y-2">
                {risk_factors.map((factor, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                  >
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300 text-sm">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}