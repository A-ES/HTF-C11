"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Color palettes for different resource types
const COLORS = {
  materials: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"],
  labor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA62B", "#98D8C8"],
  equipment: ["#845EC2", "#D65DB1", "#FF6F91", "#FF9671", "#FFC75F"],
}

interface ResourceChartProps {
  type: "pie" | "line" | "bar"
  resourceType: "materials" | "labor" | "equipment"
  data?: any[]
}

export function ResourceChart({ type, resourceType, data }: ResourceChartProps) {
  // Add a safety check to ensure data is an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="flex h-full w-full items-center justify-center text-muted-foreground">No data available</div>
  }

  if (type === "pie") {
    return (
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[resourceType][index % COLORS[resourceType].length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  if (type === "line") {
    return (
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={COLORS[resourceType][0]} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  if (type === "bar") {
    // Ensure the first data item exists before trying to get its keys
    const firstDataItem = data[0] || {}
    // Determine which keys to use based on the data structure
    const dataKeys = Object.keys(firstDataItem).filter((key) => key !== "name")

    return (
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            {dataKeys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={COLORS[resourceType][index % COLORS[resourceType].length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  return null
}

