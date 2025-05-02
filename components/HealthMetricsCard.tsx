"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Legend,
  LabelList,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format } from "date-fns"

const chartData = [
  { metric: "readiness", label: "Readiness", score: 0.65, fill: "var(--chart-1)" },
  { metric: "strain", label: "Strain", score: 0.5, fill: "var(--chart-2)" },
  { metric: "sleep", label: "Sleep", score: 0.74, fill: "var(--chart-3)" },
  { metric: "hrv", label: "Heart Rate Variability", score: 0.6, fill: "var(--chart-4)" },
]
const chartConfig = {
  score: {
    label: "Score",
  },
  readiness: {
    label: "Readiness",
    color: "hsl(var(--chart-1))",
  },
  strain: {
    label: "Strain",
    color: "hsl(var(--chart-2))",
  },
  sleep: {
    label: "Sleep",
    color: "hsl(var(--chart-3))",
  },
  hrv: {
    label: "Heart Rate Variability",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function HealthMetrics() {
  return (
    <Card className="flex flex-col h-[calc(40vh)] overflow-hidden">
      <CardHeader className="items-center pb-0">
        <CardTitle>Health Metrics</CardTitle>
        <CardDescription>{format(new Date(), "MMM do")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
      <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            innerRadius={30}
            outerRadius={110}
            // barSize={10}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="metric" />}
            />
            <RadialBar dataKey="score" background cornerRadius={10}>
              <LabelList
                dataKey="label"
                position="insideStart"
                fill="#fff"
                fontSize={12}
                fontWeight={600}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}