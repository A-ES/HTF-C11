"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Sample data for different resource types (fallback if no data is provided)
const resourceData = {
  materials: [
    {
      id: 1,
      name: "Concrete (cubic yards)",
      quantity: 450,
      allocated: 320,
      remaining: 130,
      status: "Sufficient",
      nextDelivery: "May 25, 2024",
    },
    {
      id: 2,
      name: "Steel Beams (tons)",
      quantity: 85,
      allocated: 65,
      remaining: 20,
      status: "Low",
      nextDelivery: "May 18, 2024",
    },
    {
      id: 3,
      name: "Lumber (board feet)",
      quantity: 12000,
      allocated: 8500,
      remaining: 3500,
      status: "Sufficient",
      nextDelivery: "Jun 2, 2024",
    },
    {
      id: 4,
      name: "Electrical Wiring (feet)",
      quantity: 25000,
      allocated: 15000,
      remaining: 10000,
      status: "Sufficient",
      nextDelivery: "Jun 10, 2024",
    },
    {
      id: 5,
      name: "Plumbing Pipes (feet)",
      quantity: 8000,
      allocated: 5500,
      remaining: 2500,
      status: "Sufficient",
      nextDelivery: "Jun 5, 2024",
    },
    {
      id: 6,
      name: "Insulation (sq. feet)",
      quantity: 18000,
      allocated: 7000,
      remaining: 11000,
      status: "Excess",
      nextDelivery: "Jul 15, 2024",
    },
    {
      id: 7,
      name: "Drywall Sheets",
      quantity: 850,
      allocated: 400,
      remaining: 450,
      status: "Excess",
      nextDelivery: "Jul 20, 2024",
    },
    {
      id: 8,
      name: "Roofing Materials (sq. feet)",
      quantity: 9500,
      allocated: 0,
      remaining: 9500,
      status: "Not Started",
      nextDelivery: "Jul 1, 2024",
    },
  ],
  labor: [
    {
      id: 1,
      name: "General Laborers",
      assigned: 25,
      available: 5,
      utilization: "83%",
      skillLevel: "Entry",
      nextAvailable: "Immediate",
    },
    {
      id: 2,
      name: "Carpenters",
      assigned: 12,
      available: 0,
      utilization: "100%",
      skillLevel: "Skilled",
      nextAvailable: "May 22, 2024",
    },
    {
      id: 3,
      name: "Electricians",
      assigned: 8,
      available: 2,
      utilization: "80%",
      skillLevel: "Skilled",
      nextAvailable: "Immediate",
    },
    {
      id: 4,
      name: "Plumbers",
      assigned: 6,
      available: 1,
      utilization: "86%",
      skillLevel: "Skilled",
      nextAvailable: "Immediate",
    },
    {
      id: 5,
      name: "HVAC Technicians",
      assigned: 4,
      available: 0,
      utilization: "100%",
      skillLevel: "Specialized",
      nextAvailable: "May 30, 2024",
    },
    {
      id: 6,
      name: "Project Managers",
      assigned: 2,
      available: 0,
      utilization: "100%",
      skillLevel: "Management",
      nextAvailable: "Jun 15, 2024",
    },
    {
      id: 7,
      name: "Civil Engineers",
      assigned: 3,
      available: 1,
      utilization: "75%",
      skillLevel: "Specialized",
      nextAvailable: "Immediate",
    },
    {
      id: 8,
      name: "Safety Inspectors",
      assigned: 2,
      available: 1,
      utilization: "67%",
      skillLevel: "Specialized",
      nextAvailable: "Immediate",
    },
  ],
  equipment: [
    { id: 1, name: "Excavator", quantity: 3, inUse: 3, available: 0, condition: "Good", nextService: "Jun 5, 2024" },
    { id: 2, name: "Crane", quantity: 2, inUse: 1, available: 1, nextService: "Jun 5, 2024" },
    { id: 2, name: "Crane", quantity: 2, inUse: 1, available: 1, condition: "Excellent", nextService: "Jul 10, 2024" },
    { id: 3, name: "Bulldozer", quantity: 2, inUse: 2, available: 0, condition: "Fair", nextService: "May 25, 2024" },
    {
      id: 4,
      name: "Concrete Mixer",
      quantity: 4,
      inUse: 3,
      available: 1,
      condition: "Good",
      nextService: "Jun 15, 2024",
    },
    { id: 5, name: "Generator", quantity: 6, inUse: 4, available: 2, condition: "Good", nextService: "Jun 20, 2024" },
    {
      id: 6,
      name: "Forklift",
      quantity: 3,
      inUse: 2,
      available: 1,
      condition: "Excellent",
      nextService: "Jul 5, 2024",
    },
    {
      id: 7,
      name: "Scaffolding (sets)",
      quantity: 15,
      inUse: 12,
      available: 3,
      condition: "Good",
      nextService: "Ongoing",
    },
    {
      id: 8,
      name: "Power Tools (sets)",
      quantity: 25,
      inUse: 20,
      available: 5,
      condition: "Various",
      nextService: "Ongoing",
    },
  ],
}

interface ResourceTableProps {
  resourceType: "materials" | "labor" | "equipment"
  data?: any[]
}

export function ResourceTable({ resourceType, data }: ResourceTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Use provided data or fallback to sample data
  const tableData = data || resourceData[resourceType] || []

  // Transform data if needed based on resource type
  const processedData = processResourceData(tableData, resourceType)

  const filteredData = processedData.filter((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))

  // Determine columns based on resource type
  const renderTableHeader = () => {
    if (resourceType === "materials") {
      return (
        <TableRow>
          <TableHead>Material</TableHead>
          <TableHead className="text-right">Total Quantity</TableHead>
          <TableHead className="text-right">Allocated</TableHead>
          <TableHead className="text-right">Remaining</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Next Delivery</TableHead>
        </TableRow>
      )
    }

    if (resourceType === "labor") {
      return (
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Assigned</TableHead>
          <TableHead className="text-right">Available</TableHead>
          <TableHead>Utilization</TableHead>
          <TableHead>Skill Level</TableHead>
          <TableHead>Next Available</TableHead>
        </TableRow>
      )
    }

    if (resourceType === "equipment") {
      return (
        <TableRow>
          <TableHead>Equipment</TableHead>
          <TableHead className="text-right">Total Units</TableHead>
          <TableHead className="text-right">In Use</TableHead>
          <TableHead className="text-right">Available</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>Next Service</TableHead>
        </TableRow>
      )
    }

    // Default header if resourceType doesn't match
    return (
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Details</TableHead>
      </TableRow>
    )
  }

  const renderTableRow = (item: any) => {
    if (!item) return null

    if (resourceType === "materials") {
      return (
        <TableRow key={item.id}>
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell className="text-right">{item.quantity}</TableCell>
          <TableCell className="text-right">{item.allocated}</TableCell>
          <TableCell className="text-right">{item.remaining}</TableCell>
          <TableCell>
            <Badge
              className={
                item.status === "Low"
                  ? "bg-amber-500"
                  : item.status === "Sufficient"
                    ? "bg-green-500"
                    : item.status === "Excess"
                      ? "bg-blue-500"
                      : "bg-gray-500"
              }
            >
              {item.status}
            </Badge>
          </TableCell>
          <TableCell>{item.nextDelivery}</TableCell>
        </TableRow>
      )
    }

    if (resourceType === "labor") {
      return (
        <TableRow key={item.id}>
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell className="text-right">{item.assigned}</TableCell>
          <TableCell className="text-right">{item.available}</TableCell>
          <TableCell>{item.utilization}</TableCell>
          <TableCell>
            <Badge
              className={
                item.skillLevel === "Entry"
                  ? "bg-gray-500"
                  : item.skillLevel === "Skilled"
                    ? "bg-green-500"
                    : item.skillLevel === "Specialized"
                      ? "bg-blue-500"
                      : "bg-purple-500"
              }
            >
              {item.skillLevel}
            </Badge>
          </TableCell>
          <TableCell>{item.nextAvailable}</TableCell>
        </TableRow>
      )
    }

    if (resourceType === "equipment") {
      return (
        <TableRow key={item.id}>
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell className="text-right">{item.quantity}</TableCell>
          <TableCell className="text-right">{item.inUse}</TableCell>
          <TableCell className="text-right">{item.available}</TableCell>
          <TableCell>
            <Badge
              className={
                item.condition === "Excellent"
                  ? "bg-green-500"
                  : item.condition === "Good"
                    ? "bg-blue-500"
                    : item.condition === "Fair"
                      ? "bg-amber-500"
                      : "bg-gray-500"
              }
            >
              {item.condition}
            </Badge>
          </TableCell>
          <TableCell>{item.nextService}</TableCell>
        </TableRow>
      )
    }

    // Default row if resourceType doesn't match
    return (
      <TableRow key={item.id || "default"}>
        <TableCell>{item.name || "Unknown"}</TableCell>
        <TableCell>No details available</TableCell>
      </TableRow>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search ${resourceType}...`}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>{renderTableHeader()}</TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => renderTableRow(item))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// Helper function to process and transform data based on resource type
function processResourceData(data: any[], resourceType: string) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return []
  }

  if (resourceType === "materials") {
    return data.map((item) => {
      // Transform material data from API format to table format
      const allocated = Math.floor(item.quantity * 0.7)
      const remaining = item.quantity - allocated
      const status = remaining < item.quantity * 0.2 ? "Low" : remaining > item.quantity * 0.5 ? "Excess" : "Sufficient"

      return {
        id: item.id,
        name: item.name || `Material ${item.id}`,
        quantity: item.quantity || 0,
        allocated: allocated,
        remaining: remaining,
        status: status,
        nextDelivery: getRandomFutureDate(),
      }
    })
  }

  if (resourceType === "labor") {
    return data.map((item) => {
      // Transform labor data from API format to table format
      const assigned = item.count || 0
      const available = Math.max(0, Math.floor(assigned * 0.2))
      const utilization = `${Math.min(100, Math.floor(((assigned - available) / assigned) * 100))}%`

      return {
        id: item.id,
        name: item.role || `Role ${item.id}`,
        assigned: assigned,
        available: available,
        utilization: utilization,
        skillLevel: getSkillLevel(item.hourlyRate),
        nextAvailable: available > 0 ? "Immediate" : getRandomFutureDate(),
      }
    })
  }

  if (resourceType === "equipment") {
    return data.map((item) => {
      // Transform equipment data from API format to table format
      const quantity = item.quantity || 1
      const inUse = Math.floor(quantity * 0.8)
      const available = quantity - inUse

      return {
        id: item.id,
        name: item.name || `Equipment ${item.id}`,
        quantity: quantity,
        inUse: inUse,
        available: available,
        condition: getRandomCondition(),
        nextService: getRandomFutureDate(),
      }
    })
  }

  return data
}

// Helper functions for generating random data
function getRandomFutureDate() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const now = new Date()
  const futureDate = new Date(now.setDate(now.getDate() + Math.floor(Math.random() * 60)))
  return `${months[futureDate.getMonth()]} ${futureDate.getDate()}, ${futureDate.getFullYear()}`
}

function getSkillLevel(hourlyRate?: number) {
  if (!hourlyRate) return "Entry"
  if (hourlyRate < 30) return "Entry"
  if (hourlyRate < 45) return "Skilled"
  if (hourlyRate < 60) return "Specialized"
  return "Management"
}

function getRandomCondition() {
  const conditions = ["Excellent", "Good", "Fair", "Poor"]
  const weights = [0.3, 0.5, 0.15, 0.05]
  const random = Math.random()
  let sum = 0

  for (let i = 0; i < conditions.length; i++) {
    sum += weights[i]
    if (random <= sum) return conditions[i]
  }

  return "Good"
}

