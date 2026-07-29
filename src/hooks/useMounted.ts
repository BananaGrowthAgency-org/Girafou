"use client";

import { useEffect, useState } from "react";

// Passe à `true` une fois monté côté client. Sert de garde d'hydratation : au
// SSR on rend l'état initial, puis on active les animations après le montage.
// Le setState au montage est volontaire (drapeau unique, pas de cascade réelle).
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  return mounted;
}
