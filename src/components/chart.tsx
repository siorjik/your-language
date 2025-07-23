'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import useDisplayData from '@/hooks/useDisplayData'

type ObjType = { [k: string]: number | string | ObjType }

export default function Chart({ data, config }: { data: ObjType[]; config: ChartConfig }) {
  const { isMobile } = useDisplayData()

  return (
    <ChartContainer config={config} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <YAxis width={20} allowDecimals={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: string) => String(value).slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend
          className={`${isMobile ? 'h-12 pt-5 flex-wrap gap-2' : ''}`}
          content={<ChartLegendContent payload={{}} verticalAlign="top" />}
        />
        {Object.keys(config).map((key, idx) => {
          return <Bar key={idx} dataKey={key} fill={`var(--color-${key})`} radius={3} maxBarSize={100} />
        })}
      </BarChart>
    </ChartContainer>
  )
}
