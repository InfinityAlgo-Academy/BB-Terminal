import { useEffect, useRef, useState } from "react";
import { fmtPrice, fmtPct } from "@/lib/format";
import { cn } from "@/lib/cn";
import { rt, type RealtimePrice } from "@/lib/realtime";

const COINS = [
  { sym: "BTC-USD", name: "Bitcoin" },
  { sym: "ETH-USD", name: "Ethereum" },
  { sym: "SOL-USD", name: "Solana" },
  { sym: "BNB-USD", name: "BNB" },
  { sym: "XRP-USD", name: "XRP" },
  { sym: "ADA-USD", name: "Cardano" },
  { sym: "DOGE-USD", name: "Dogecoin" },
  { sym: "AVAX-USD", name: "Avalanche" },
  { sym: "LINK-USD", name: "Chainlink" },
  { sym: "LTC-USD", name: "Litecoin" },
  { sym: "MATIC-USD", name: "Polygon" },
  { sym: "DOT-USD", name: "Polkadot" },
];

export function CRYPTO() {
  const [rtPrices, setRtPrices] = useState<Record<string, RealtimePrice>>({});
  const priceHist = useRef<Record<string, number[]>>({});

  useEffect(() => {
    rt.connect();
    const unsubs: (() => void)[] = [];
    for (const c of COINS) {
      const unsub = rt.subscribe(c.sym, (data) => {
        setRtPrices(prev => ({ ...prev, [c.sym]: data }));
        if (data.lp != null) {
          if (!priceHist.current[c.sym]) priceHist.current[c.sym] = [];
          const h = priceHist.current[c.sym];
          if (h[h.length - 1] !== data.lp) {
            h.push(data.lp);
            if (h.length > 60) h.shift();
          }
        }
      });
      unsubs.push(unsub);
    }
    return () => unsubs.forEach(fn => fn());
  }, []);

  return (
    <div className="p-3 text-[12px]">
      <div className="text-term-amber text-[10px] tracking-[0.25em] font-bold border-b border-term-border pb-1 mb-2">TOP CRYPTOCURRENCIES</div>
      <table className="w-full grid-data">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th className="text-right">Price</th>
            <th className="text-right">24h Δ</th>
            <th className="text-right">24h %</th>
            <th className="text-right">Volume</th>
            <th className="text-right">RT Trend</th>
          </tr>
        </thead>
        <tbody>
          {COINS.map((c) => {
            const rtItem = rtPrices[c.sym];
            const price = rtItem?.lp;
            const chgPct = rtItem?.chp;
            const chg = rtItem?.ch;
            const dir = chgPct == null ? "flat" : chgPct >= 0 ? "up" : "down";
            const vals = priceHist.current[c.sym] ?? [];
            const min = Math.min(...vals), max = Math.max(...vals);
            const spark = vals.length > 1 ? vals.map((v, idx) => {
              const x = (idx / (vals.length - 1)) * 100;
              const y = 24 - ((v - min) / (max - min || 1)) * 20;
              return `${x},${y}`;
            }).join(" ") : "";
            return (
              <tr key={c.sym}>
                <td className="num text-term-amber font-semibold">{c.sym.replace("-USD", "")}</td>
                <td className="text-term-heading">{c.name}</td>
                <td className="num text-right">{fmtPrice(price, price != null && price < 1 ? 4 : 2)}</td>
                <td className={cn("num text-right", dir === "up" && "up", dir === "down" && "down")}>
                  {chg == null ? "—" : (chg >= 0 ? "+" : "") + fmtPrice(chg, chg && Math.abs(chg) < 1 ? 4 : 2)}
                </td>
                <td className={cn("num text-right", dir === "up" && "up", dir === "down" && "down")}>{fmtPct(chgPct)}</td>
                <td className="num text-right text-term-muted">{rtItem?.volume != null ? abbreviate(rtItem.volume) : "—"}</td>
                <td className="text-right">
                  {spark && (
                    <svg viewBox="0 0 100 24" className="w-24 h-6 inline-block">
                      <polyline fill="none" stroke={dir === "up" ? "#22ee22" : dir === "down" ? "#ff3b3b" : "#ff8c00"} strokeWidth="1.2" points={spark} />
                    </svg>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="sub-header mt-3">REAL-TIME VIA TRADINGVIEW</div>
    </div>
  );
}

function abbreviate(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toFixed(0);
}
