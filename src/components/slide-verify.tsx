"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

const HANDLE = 56;

export function SlideVerify({
  verified,
  onVerified,
}: {
  verified: boolean;
  onVerified: (value: boolean) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [prevVerified, setPrevVerified] = useState(verified);
  const draggingRef = useRef(false);

  const maxOffset = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    return track.clientWidth - HANDLE;
  }, []);

  if (prevVerified !== verified) {
    setPrevVerified(verified);
    if (!verified) setOffset(0);
  }

  useEffect(() => {
    function move(clientX: number) {
      if (!draggingRef.current || verified) return;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const next = Math.min(Math.max(clientX - rect.left - HANDLE / 2, 0), maxOffset());
      setOffset(next);
    }
    function end() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      if (offset >= maxOffset() - 4) {
        setOffset(maxOffset());
        onVerified(true);
      } else {
        setOffset(0);
      }
    }
    function onMouseMove(e: MouseEvent) {
      move(e.clientX);
    }
    function onTouchMove(e: TouchEvent) {
      move(e.touches[0].clientX);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("touchend", end);
    };
  }, [offset, maxOffset, onVerified, verified]);

  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <div className="mb-3 flex items-start gap-3">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
          <ShieldCheck className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-foreground">
            VERIFIKASI KEAMANAN
          </p>
          <p className="text-sm text-muted-foreground">
            {verified ? "Verifikasi berhasil" : "Geser ke kanan untuk lanjut"}
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        className={`relative h-14 select-none overflow-hidden rounded-lg border text-center transition-colors ${
          verified
            ? "border-primary/40 bg-primary/10"
            : "border-border bg-card"
        }`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-lg bg-primary/15"
          style={{ width: offset + HANDLE }}
          aria-hidden
        />
        <span className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          {verified ? "Terverifikasi" : "Geser \u2192"}
        </span>
        <button
          type="button"
          role="slider"
          aria-label="Geser untuk verifikasi"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={verified ? 100 : 0}
          disabled={verified}
          onMouseDown={() => (draggingRef.current = true)}
          onTouchStart={() => (draggingRef.current = true)}
          className="absolute inset-y-1 left-1 flex w-14 cursor-grab items-center justify-center rounded-md bg-gradient-to-b from-primary to-primary-strong text-primary-foreground shadow-md active:cursor-grabbing disabled:cursor-default"
          style={{ transform: `translateX(${offset}px)` }}
        >
          {verified ? <Check className="size-5" aria-hidden /> : <ArrowRight className="size-5" aria-hidden />}
        </button>
      </div>
    </div>
  );
}
