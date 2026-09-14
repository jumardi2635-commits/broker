import { Landmark, ScrollText } from "lucide-react";

const badges = [
  {
    name: "OJK",
    reg: "S-428/PM.21/2024",
    icon: Landmark,
  },
  {
    name: "Bappebti",
    reg: "001/BAPPEBTI/SI/12/2024",
    icon: ScrollText,
  },
];

export function RegulatorBadges() {
  return (
    <section aria-label="Terdaftar dan diawasi" className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-semibold tracking-[0.22em] text-muted-foreground">
          TERDAFTAR &amp; DIAWASI
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {badges.map(({ name, reg, icon: Icon }) => (
          <div
            key={name}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-4 text-center"
          >
            <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <p className="text-xs font-semibold text-foreground">{name}</p>
            <p className="text-[10px] tracking-wide text-muted-foreground">{reg}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
