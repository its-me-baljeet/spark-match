"use client";

import { Slider } from "../ui/slider";
import { GradientButton } from "../sliders/gradient-button";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Card } from "../cards/card";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface FiltersPanelProps {
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  distanceKm: number;
  onlyOnline: boolean;
  setDistanceKm: (v: number) => void;
  setOnlyOnline: (v: boolean) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  fetchUsers: (
    forceRefetch?: boolean,
    overrides?: { distanceKm?: number; onlyOnline?: boolean }
  ) => Promise<void>;
}

export default function FiltersPanel({
  showFilters,
  setShowFilters,
  distanceKm,
  onlyOnline,
  setDistanceKm,
  setOnlyOnline,
  resetFilters,
  applyFilters,
  fetchUsers,
}: FiltersPanelProps) {
  return (
    <div className="w-full max-w-[420px] pt-3 z-50 relative">
      <div className="flex gap-3 items-center px-2 border-b border-border pb-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full 
            backdrop-blur-xl border transition-all duration-300 active:scale-95
            ${
              showFilters
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card/80 text-foreground border-border/80 hover:bg-card"
            }
          `}
        >
          <span className="font-medium text-sm">
            Distance ({distanceKm}km)
          </span>
          <ChevronDown className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            const newValue = !onlyOnline;
            setOnlyOnline(newValue);
            fetchUsers(true, { onlyOnline: newValue });
          }}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full 
            backdrop-blur-xl border transition-all duration-300 active:scale-95
            ${
              onlyOnline
                ? "bg-green-500/10 border-green-500 text-green-500"
                : "bg-card/80 text-foreground border-border/80 hover:bg-card"
            }
          `}
        >
          <div
            className={`
              w-2 h-2 rounded-full transition-all duration-300 
              ${onlyOnline ? "bg-green-500" : "bg-muted-foreground/50"}
            `}
          />
          <span className="font-medium text-sm">Online</span>
        </button>
      </div>

      {/* Floating Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full mt-2"
          >
            <Card className="p-5 shadow-2xl border-border/50 bg-card/90 backdrop-blur-xl rounded-2xl">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-lg">Range</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-6">
                <span className="text-sm font-medium text-muted-foreground">
                  {distanceKm} km
                </span>

                <Slider
                  min={1}
                  max={200}
                  step={1}
                  value={[distanceKm]}
                  onValueChange={(val) => setDistanceKm(val[0])}
                  className="py-2"
                />
              </div>

              <div className="flex gap-3 mt-8">
                <GradientButton
                  variant="secondary"
                  className="flex-1"
                  onClick={resetFilters}
                >
                  Reset
                </GradientButton>

                <GradientButton className="flex-1" onClick={applyFilters}>
                  Apply
                </GradientButton>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
