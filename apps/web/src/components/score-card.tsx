import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@itcamp-allcamp/ui/components/card";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@itcamp-allcamp/ui/components/chart";
import { Separator } from "@itcamp-allcamp/ui/components/separator";
import { type Score, type CategoryScore } from "../hooks/use-score";

const chartConfig = {
  score: {
    label: "Score",
  },
  re: {
    label: "RE",
    color: "oklch(63.7% 0.237 25.331)",
  },
  drop: {
    label: "DROP",
    color: "oklch(60.6% 0.25 292.717)",
  },
  pro: {
    label: "PRO",
    color: "oklch(62.3% 0.214 259.815)",
  },
  tire: {
    label: "TIRE",
    color: "oklch(72.3% 0.219 149.579)",
  },
} satisfies ChartConfig;

export const CATEGORIES: { key: keyof Score; label: string; colorClass: string }[] = [
  { key: "re", label: "RE", colorClass: "bg-re" },
  { key: "drop", label: "DROP", colorClass: "bg-drop" },
  { key: "pro", label: "PRO", colorClass: "bg-pro" },
  { key: "tire", label: "TIRE", colorClass: "bg-tire" },
];

export function ScoreCard({
  categoryKey,
  label,
  scoreData,
  totalScore,
  ownValue,
  otherValue,
}: {
  categoryKey: keyof Score;
  label: string;
  scoreData: CategoryScore;
  totalScore: number;
  ownValue: number;
  otherValue: number;
}) {
  const totalCount = scoreData.re + scoreData.drop + scoreData.pro + scoreData.tire;

  const chartData = useMemo(() => {
    if (totalCount === 0) {
      return [{ category: "empty", score: 1, fill: "var(--muted)" }];
    }
    return [
      { category: "re", score: scoreData.re, fill: "var(--color-re)" },
      { category: "drop", score: scoreData.drop, fill: "var(--color-drop)" },
      { category: "pro", score: scoreData.pro, fill: "var(--color-pro)" },
      { category: "tire", score: scoreData.tire, fill: "var(--color-tire)" },
    ];
  }, [scoreData, totalCount]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="justify-center pb-0">
        <CardTitle className="font-bold text-4xl flex items-center gap-2">
          <div className={`size-8 rounded-full bg-${categoryKey}`} />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="score"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className={`${totalScore < 0 ? "fill-red-500" : totalScore > 0 ? "fill-green-500" : "fill-white"} text-3xl font-bold`}
                        >
                          {totalScore.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="w-full flex flex-col gap-2 mt-4">
          {CATEGORIES.map((cat, idx) => {
            const rawScore = scoreData[cat.key];
            const multiplier = cat.key === categoryKey ? ownValue : otherValue;
            const calculated = rawScore * multiplier;

            return (
              <React.Fragment key={cat.key}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 uppercase">
                    <div className={`size-4 ${cat.colorClass} rounded-full`} />
                    {cat.label}
                  </div>
                  <div className="text-muted-foreground">
                    {rawScore} x {multiplier} ={" "}
                    <span
                      className={
                        calculated < 0
                          ? "text-red-500"
                          : calculated > 0
                            ? "text-green-500"
                            : "text-white"
                      }
                    >
                      {calculated > 0 ? "+" : ""}
                      {calculated}
                    </span>
                  </div>
                </div>
                {idx < CATEGORIES.length - 1 && <Separator />}
              </React.Fragment>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
