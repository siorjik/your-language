'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'

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
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px]">
        <ChartContainer config={config} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <YAxis width={30} allowDecimals={false} />
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
              {Object.keys(config).map((key, idx) => (
                <Bar key={idx} dataKey={key} fill={`var(--color-${key})`} radius={3} maxBarSize={100} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
