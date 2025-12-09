import { AIRecommendation } from '@/store/useStore';
import {
  eventTypeCategories,
  eventThemes,
  colorPalettes,
  guestSizeRanges,
  venueTypes,
  budgetRanges,
} from '@/data/eventBuilder';

// Parse AI response text to extract event planning details
export function parseAIRecommendations(text: string): AIRecommendation {
  const recommendation: AIRecommendation = {};
  const lowerText = text.toLowerCase();

  // Match event type
  for (const eventType of eventTypeCategories) {
    if (lowerText.includes(eventType.name.toLowerCase()) || lowerText.includes(eventType.id)) {
      recommendation.eventType = eventType.id;
      break;
    }
  }

  // Match theme
  for (const theme of eventThemes) {
    if (lowerText.includes(theme.name.toLowerCase()) || lowerText.includes(theme.id.replace('-', ' '))) {
      recommendation.theme = theme.id;
      break;
    }
  }

  // Match color palette
  for (const palette of colorPalettes) {
    if (lowerText.includes(palette.name.toLowerCase()) || lowerText.includes(palette.id.replace('-', ' '))) {
      recommendation.colorPalette = palette.id;
      break;
    }
  }

  // Match guest count from numbers mentioned
  const guestMatches = lowerText.match(/(\d+)\s*(guests?|people|attendees)/i);
  if (guestMatches) {
    const guestCount = parseInt(guestMatches[1], 10);
    for (const range of guestSizeRanges) {
      if (guestCount >= range.min && guestCount <= range.max) {
        recommendation.guestSize = range.id;
        break;
      }
    }
  }

  // Match venue type
  for (const venue of venueTypes) {
    const venueKeywords = venue.name.toLowerCase().split(/[\s\/]+/);
    if (venueKeywords.some(kw => kw.length > 3 && lowerText.includes(kw))) {
      recommendation.venueType = venue.id;
      break;
    }
  }

  // Match budget from Naira amounts
  const budgetMatches = lowerText.match(/[₦n]?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(k|m|million|thousand)?/gi);
  if (budgetMatches) {
    for (const match of budgetMatches) {
      const cleanMatch = match.replace(/[₦n\s,]/gi, '').toLowerCase();
      let amount = parseFloat(cleanMatch);
      
      if (cleanMatch.includes('m') || cleanMatch.includes('million')) {
        amount = amount * 1000000;
      } else if (cleanMatch.includes('k') || cleanMatch.includes('thousand')) {
        amount = amount * 1000;
      } else if (amount < 1000) {
        // Likely in millions if small number mentioned with budget context
        amount = amount * 1000000;
      }

      for (const range of budgetRanges) {
        if (amount >= range.min && amount <= range.max) {
          recommendation.budget = range.id;
          break;
        }
      }
      if (recommendation.budget) break;
    }
  }

  // Also check for budget tier keywords
  if (!recommendation.budget) {
    if (lowerText.includes('luxury') || lowerText.includes('high-end') || lowerText.includes('premium')) {
      recommendation.budget = 'luxury';
    } else if (lowerText.includes('moderate') || lowerText.includes('mid-range')) {
      recommendation.budget = 'moderate';
    } else if (lowerText.includes('budget') || lowerText.includes('affordable')) {
      recommendation.budget = 'budget';
    }
  }

  return recommendation;
}

// Check if recommendation has enough data to auto-fill
export function hasValidRecommendation(rec: AIRecommendation | null): boolean {
  if (!rec) return false;
  return !!(rec.eventType || rec.theme || rec.guestSize || rec.budget);
}
