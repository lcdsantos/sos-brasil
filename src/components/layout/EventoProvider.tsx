"use client";

import { createContext, useCallback, useContext, useState } from "react";

import type { Tables } from "@/types/database";

type Evento = Tables<"eventos">;

type EventoContextValue = {
  eventoAtual: Evento | null;
  setEventoAtual: (evento: Evento | null) => void;
  limparEvento: () => void;
};

const EventoContext = createContext<EventoContextValue | null>(null);

const STORAGE_KEY = "sos_brasil_evento_id";

export function EventoProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from sessionStorage (lazy initializer) to avoid calling
  // setState inside an effect
  const [eventoAtual, setEventoAtualState] = useState<Evento | null>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setEventoAtual = useCallback((evento: Evento | null) => {
    setEventoAtualState(evento);
    if (evento) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(evento));
    else sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const limparEvento = useCallback(() => {
    setEventoAtualState(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <EventoContext.Provider
      value={{ eventoAtual, setEventoAtual, limparEvento }}
    >
      {children}
    </EventoContext.Provider>
  );
}

export function useEvento() {
  const ctx = useContext(EventoContext);
  if (!ctx) throw new Error("useEvento must be used inside <EventoProvider>");
  return ctx;
}
