import { createFileRoute } from "@tanstack/react-router";
import { useScore } from "../hooks/use-score";
import { ScoreCard, CATEGORIES } from "../components/score-card";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { score, getCalculatedTotal, ownValue, otherValue } = useScore();

  return (
    <div className="flex items-center flex-col justify-center min-h-dvh p-4 py-20">
      <div className="flex flex-col md:flex-row gap-8 items-center mb-8 bg-card p-6 rounded-xl border shadow-sm container w-full">
        <label className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Same Category Multiplier:</span>
          <input 
            type="number" 
            value={ownValue} 
            readOnly
            className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </label>
        <label className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Other Category Multiplier:</span>
          <input 
            type="number" 
            value={otherValue} 
            readOnly
            className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full mt-19 container">
        {CATEGORIES.map((cat) => (
          <ScoreCard
            key={String(cat.key)}
            categoryKey={cat.key}
            label={cat.label}
            scoreData={score[cat.key as keyof typeof score]}
            totalScore={getCalculatedTotal(cat.key as keyof typeof score)}
            ownValue={ownValue}
            otherValue={otherValue}
          />
        ))}
      </div>
    </div>
  );
}
