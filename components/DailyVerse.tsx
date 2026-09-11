import { getDailyVerse } from "@/lib/verses";

export default function DailyVerse() {
  const verset = getDailyVerse();

  return (
    <div className="flex-1 px-4 text-center">
      <p
        className="text-lg font-light italic"
        style={{
          color: "#f5e6a3",
          textShadow: "0 0 8px rgba(245, 230, 163, 0.7), 0 0 18px rgba(245, 230, 163, 0.35)",
        }}
      >
        « {verset.texte} »
      </p>
      <p
        className="mt-1 text-sm font-light not-italic opacity-70"
        style={{ color: "#f5e6a3" }}
      >
        — {verset.reference}
      </p>
    </div>
  );
}