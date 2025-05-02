"use client";

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";

const chartData = [
  { day: "4/15", calories: 137 },
  { day: "4/16", calories: 155 },
  { day: "4/17", calories: 170 },
  { day: "4/18", calories: 50 },
  { day: "4/19", calories: 45 },
  { day: "4/20", calories: 150 },
  { day: "4/21", calories: 212 },
  { day: "4/22", calories: 189 },
  { day: "4/23", calories: 191 },
  { day: "4/24", calories: 149 },
  { day: "4/25", calories: 169 },
  { day: "4/26", calories: 201 },
  { day: "4/27", calories: 220 },
  { day: "4/28", calories: 187 },
  { day: "4/29", calories: 191 },
  { day: "4/30", calories: 250 },
  { day: "5/1", calories: 225 },
  { day: "5/2", calories: 237 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "(var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function CaloriesBurned() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calories Burned</CardTitle>
        <CardDescription>April - {format(new Date(), "MMMM yyyy")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="calories"
              type="natural"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{
                fill: "var(--chart-1)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 23.1% this week <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
