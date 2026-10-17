"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { MotionConfig } from "motion/react";
import { CartDrawer } from "@/components/cart/cart-drawer";

interface CartDrawerState {
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartDrawerContext = createContext<CartDrawerState | null>(null);

export function useCartDrawer() {
  const value = useContext(CartDrawerContext);
  if (!value) throw new Error("useCartDrawer doit être utilisé dans <Providers>");
  return value;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(
    () => ({ open, openCart: () => setOpen(true), closeCart: () => setOpen(false) }),
    [open],
  );

  return (
    // Respecte le réglage « réduire les animations » du système.
    <MotionConfig reducedMotion="user">
      <CartDrawerContext value={value}>
        {children}
        <CartDrawer />
      </CartDrawerContext>
    </MotionConfig>
  );
}
