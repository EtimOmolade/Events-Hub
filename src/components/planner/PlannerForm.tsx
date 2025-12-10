import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, DollarSign, Palette, Heart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlannerFormData } from '@/hooks/usePlanner';
import { eventTypeCategories, eventThemes, colorPalettes, venueTypes } from '@/data/eventBuilder';

interface PlannerFormProps {
  formData: PlannerFormData;
  onUpdateField: <K extends keyof PlannerFormData>(field: K, value: PlannerFormData[K]) => void;
}

export function PlannerForm({ formData, onUpdateField }: PlannerFormProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold">Event Details</h3>
        <p className="text-xs text-muted-foreground">Fill in manually or let AI help</p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Plan Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-gold" />
            Plan Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onUpdateField('name', e.target.value)}
            placeholder="My Dream Wedding"
          />
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm">
            <Heart className="w-4 h-4 text-gold" />
            Event Type
          </Label>
          <Select
            value={formData.eventType || ''}
            onValueChange={(value) => onUpdateField('eventType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypeCategories.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  <span className="flex items-center gap-2">
                    <span>{type.icon}</span>
                    <span>{type.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm">
            <Palette className="w-4 h-4 text-gold" />
            Theme
          </Label>
          <Select
            value={formData.theme || ''}
            onValueChange={(value) => onUpdateField('theme', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {eventThemes.map((theme) => (
                <SelectItem key={theme.id} value={theme.id}>
                  <span className="flex items-center gap-2">
                    <span>{theme.icon}</span>
                    <span>{theme.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Palette */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm">
            <Palette className="w-4 h-4 text-gold" />
            Color Palette
          </Label>
          <Select
            value={formData.colors || ''}
            onValueChange={(value) => onUpdateField('colors', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select colors" />
            </SelectTrigger>
            <SelectContent>
              {colorPalettes.map((palette) => (
                <SelectItem key={palette.id} value={palette.id}>
                  <span className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {palette.colors.slice(0, 3).map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span>{palette.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Guest Count */}
        <div className="space-y-2">
          <Label htmlFor="guestCount" className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gold" />
            Guest Count
          </Label>
          <Input
            id="guestCount"
            type="number"
            value={formData.guestCount || ''}
            onChange={(e) => onUpdateField('guestCount', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="150"
            min={1}
          />
        </div>

        {/* Venue */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gold" />
            Venue Type
          </Label>
          <Select
            value={formData.venue || ''}
            onValueChange={(value) => onUpdateField('venue', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select venue type" />
            </SelectTrigger>
            <SelectContent>
              {venueTypes.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>
                  <span className="flex items-center gap-2">
                    <span>{venue.icon}</span>
                    <span>{venue.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Event Date */}
        <div className="space-y-2">
          <Label htmlFor="eventDate" className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gold" />
            Event Date
          </Label>
          <Input
            id="eventDate"
            type="date"
            value={formData.eventDate || ''}
            onChange={(e) => onUpdateField('eventDate', e.target.value || null)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <Label htmlFor="budget" className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-gold" />
            Budget (₦)
          </Label>
          <Input
            id="budget"
            type="number"
            value={formData.budget || ''}
            onChange={(e) => onUpdateField('budget', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="500000"
            min={0}
            step={10000}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-gold" />
            Additional Notes
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => onUpdateField('notes', e.target.value)}
            placeholder="Any special requirements or preferences..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
