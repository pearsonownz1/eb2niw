"use client";

import { useState } from "react";

export function BuyButton() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="mt-6">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md bg-navy px-5 py-3 text-sm font-semibold text-paper"
        onClick={() => setClicked(true)}
        aria-describedby="buy-note"
      >
        Buy the guide — $99
      </button>
      <p
        id="buy-note"
        role={clicked ? "status" : undefined}
        className="mt-3 max-w-xl text-sm leading-relaxed text-muted"
      >
        {clicked
          ? "Checkout is not connected yet. No payment was started."
          : "Placeholder button. Checkout is not connected, and no payment will be taken."}
      </p>
    </div>
  );
}
