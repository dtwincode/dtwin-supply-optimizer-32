
import { useState } from "react";
import { type MarketEvent } from '@/types/weatherAndEvents';

export const useMarketEvents = () => {
  const [marketEvents, setMarketEvents] = useState<MarketEvent[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<MarketEvent>>({});

  return {
    marketEvents,
    setMarketEvents,
    newEvent,
    setNewEvent
  };
};
