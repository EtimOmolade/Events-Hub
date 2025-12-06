import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { eventThemes, colorPalettes } from '@/data/eventBuilder';

interface StepThemeProps {
  selectedTheme: string | null;
  selectedPalette: string | null;
  onSelectTheme: (id: string) => void;
  onSelectPalette: (id: string) => void;
}

export function StepTheme({ 
  selectedTheme, 
  selectedPalette, 
  onSelectTheme, 
  onSelectPalette 
}: StepThemeProps) {
  return (
    <div className="space-y-10">
      {/* Theme Selection */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
            Choose your style
          </h2>
          <p className="text-muted-foreground">
            Select a theme that matches your vision
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {eventThemes.map((theme, index) => (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onSelectTheme(theme.id)}
              className={cn(
                "p-5 rounded-xl border-2 text-left transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1",
                selectedTheme === theme.id
                  ? "border-gold bg-gold/10 shadow-gold"
                  : "border-border bg-card hover:border-gold/50"
              )}
            >
              <span className="text-3xl block mb-2">{theme.icon}</span>
              <h3 className="font-semibold text-sm mb-1">{theme.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {theme.description}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Color Palette Selection */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-display text-xl font-semibold mb-2">
            Pick your colors
          </h3>
          <p className="text-muted-foreground text-sm">
            Select a color palette for your event
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {colorPalettes.map((palette, index) => (
            <motion.button
              key={palette.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.03 }}
              onClick={() => onSelectPalette(palette.id)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1",
                selectedPalette === palette.id
                  ? "border-gold bg-gold/10 shadow-gold"
                  : "border-border bg-card hover:border-gold/50"
              )}
            >
              <div className="flex gap-1 mb-3 justify-center">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border border-border/30"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="font-medium text-sm">{palette.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
