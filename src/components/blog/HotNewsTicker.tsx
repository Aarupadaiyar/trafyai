"use client";

interface TickerItem {
  slug: string;
  title: string;
}

export function HotNewsTicker({ items }: { items: TickerItem[] }) {
  // Duplicate the list so the CSS marquee loops seamlessly.
  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-border-dark bg-ink py-3">
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-10">
        {loop.map((item, i) => (
          <a key={`${item.slug}-${i}`} href={`/intelligence/news/${item.slug}`} className="flex items-center gap-2 whitespace-nowrap text-sm text-white/90 hover:text-lime">
            <span>🔥</span>
            {item.title}
          </a>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[marquee_38s_linear_infinite\\] { animation: none; }
        }
      `}</style>
    </div>
  );
}
