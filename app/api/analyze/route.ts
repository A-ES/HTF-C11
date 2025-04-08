import { NextResponse } from "next/server"

// Analyze project data based on actual input
async function analyzeProjectData(data: any) {
  // Validate input data
  if (!data || Object.keys(data).length === 0) {
    throw new Error("No data provided for analysis")
  }

  // Extract key data from the input
  const materials = data.materials || []
  const labor = data.labor || []
  const equipment = data.equipment || []
  const schedule = data.schedule || []
  const risks = data.risks || []
  const sustainability = data.sustainability || {}
  const budget = data.budget || 0
  const projectType = data.projectType || "Commercial"
  const startDate = data.startDate ? new Date(data.startDate) : new Date()
  const endDate = data.endDate ? new Date(data.endDate) : new Date(startDate.getTime() + 180 * 24 * 60 * 60 * 1000)

  // Calculate material metrics
  const materialMetrics = calculateMaterialMetrics(materials)

  // Calculate labor metrics
  const laborMetrics = calculateLaborMetrics(labor)

  // Calculate equipment metrics
  const equipmentMetrics = calculateEquipmentMetrics(equipment)

  // Calculate schedule metrics
  const scheduleMetrics = calculateScheduleMetrics(schedule, startDate, endDate)

  // Calculate risk metrics
  const riskMetrics = calculateRiskMetrics(risks, materials, labor, equipment, schedule)

  // Calculate environmental metrics
  const environmentalMetrics = calculateEnvironmentalMetrics(materials, equipment, sustainability)

  // Calculate budget metrics
  const budgetMetrics = {
    totalBudget: budget,
    totalMaterialCost: materialMetrics.totalCost,
    totalLaborCost: laborMetrics.totalCost,
    totalEquipmentCost: equipmentMetrics.totalCost,
    totalCost: materialMetrics.totalCost + laborMetrics.totalCost + equipmentMetrics.totalCost,
    budgetVariance: budget - (materialMetrics.totalCost + laborMetrics.totalCost + equipmentMetrics.totalCost),
    budgetUtilization:
      ((materialMetrics.totalCost + laborMetrics.totalCost + equipmentMetrics.totalCost) / budget) * 100,
  }

  // Generate optimization recommendations
  const recommendations = generateRecommendations(
    materials,
    labor,
    equipment,
    schedule,
    risks,
    sustainability,
    materialMetrics,
    laborMetrics,
    equipmentMetrics,
    environmentalMetrics,
    budgetMetrics,
    scheduleMetrics,
    riskMetrics,
  )

  return {
    projectMetrics: {
      totalBudget: budget,
      totalMaterialCost: materialMetrics.totalCost,
      totalLaborCost: laborMetrics.totalCost,
      totalEquipmentCost: equipmentMetrics.totalCost,
      projectDuration: scheduleMetrics.duration,
      completionPercentage: scheduleMetrics.completionPercentage,
      riskLevel: riskMetrics.overallRiskLevel,
      projectType: projectType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    resourceOptimization: {
      labor: {
        currentAllocation: labor,
        distribution: laborMetrics.distribution,
        utilization: laborMetrics.utilization,
        bottlenecks: laborMetrics.bottlenecks,
        recommendations: recommendations.labor,
      },
      materials: {
        currentAllocation: materials,
        distribution: materialMetrics.distribution,
        inventory: materialMetrics.inventory,
        bottlenecks: materialMetrics.bottlenecks,
        recommendations: recommendations.materials,
      },
      equipment: {
        currentAllocation: equipment,
        utilization: equipmentMetrics.utilization,
        efficiency: equipmentMetrics.efficiency,
        bottlenecks: equipmentMetrics.bottlenecks,
        recommendations: recommendations.equipment,
      },
    },
    riskAssessment: riskMetrics.risks,
    environmentalImpact: {
      currentFootprint: environmentalMetrics.footprint,
      materialImpact: environmentalMetrics.materialImpact,
      equipmentImpact: environmentalMetrics.equipmentImpact,
      recommendations: recommendations.environmental,
    },
    scheduleOptimization: {
      currentCompletion: scheduleMetrics.endDate,
      optimizedCompletion: scheduleMetrics.optimizedEndDate,
      timelineReduction: scheduleMetrics.potentialReduction,
      criticalPath: scheduleMetrics.criticalPath,
      criticalPathChanges: recommendations.schedule,
    },
    budgetAnalysis: {
      currentSpend: budgetMetrics.totalCost,
      forecast: budgetMetrics.totalCost * 1.05, // Simple forecast with 5% contingency
      variance: budgetMetrics.budgetVariance,
      utilizationRate: budgetMetrics.budgetUtilization,
      recommendations: recommendations.budget,
    },
    projectData: data, // Include the original project data
  }
}

// Calculate material metrics
function calculateMaterialMetrics(materials: any[]) {
  if (!materials || materials.length === 0) {
    return {
      totalCost: 0,
      distribution: [],
      inventory: [],
      bottlenecks: [],
    }
  }

  // Calculate total cost
  const totalCost = materials.reduce((sum, item) => {
    return sum + (item.quantity || 0) * (item.unitCost || 0)
  }, 0)

  // Calculate distribution by category
  const categories: Record<string, number> = {}
  materials.forEach((item) => {
    const category = item.category || "Uncategorized"
    const cost = (item.quantity || 0) * (item.unitCost || 0)
    categories[category] = (categories[category] || 0) + cost
  })

  const distribution = Object.entries(categories).map(([name, value]) => ({
    name,
    value: Math.round((value / totalCost) * 100),
  }))

  // Calculate inventory status
  const inventory = materials.map((item) => {
    const allocated = Math.floor((item.quantity || 0) * (Math.random() * 0.3 + 0.5)) // Simulate allocation
    const remaining = (item.quantity || 0) - allocated
    const status =
      remaining < (item.quantity || 0) * 0.2 ? "Low" : remaining > (item.quantity || 0) * 0.5 ? "Excess" : "Sufficient"

    return {
      id: item.id,
      name: item.name,
      quantity: item.quantity || 0,
      allocated,
      remaining,
      status,
      nextDelivery: getRandomFutureDate(),
    }
  })

  // Identify potential bottlenecks
  const bottlenecks = materials
    .filter((item) => {
      // Identify materials with high cost impact or low availability
      const cost = (item.quantity || 0) * (item.unitCost || 0)
      const costImpact = cost / totalCost
      return costImpact > 0.15 || (item.quantity || 0) < 10
    })
    .map((item) => ({
      id: item.id,
      name: item.name,
      reason: (item.quantity || 0) < 10 ? "Low Quantity" : "High Cost Impact",
      impact: "Medium",
      mitigation:
        (item.quantity || 0) < 10
          ? "Increase order quantity and establish safety stock"
          : "Explore alternative suppliers and bulk purchasing options",
    }))
    .slice(0, 3) // Limit to top 3 bottlenecks

  return {
    totalCost,
    distribution,
    inventory,
    bottlenecks,
  }
}

// Calculate labor metrics
function calculateLaborMetrics(labor: any[]) {
  if (!labor || labor.length === 0) {
    return {
      totalCost: 0,
      distribution: [],
      utilization: [],
      bottlenecks: [],
    }
  }

  // Calculate total cost (monthly)
  const totalCost = labor.reduce((sum, item) => {
    return sum + (item.count || 0) * (item.hourlyRate || 0) * (item.hoursPerWeek || 40) * 4
  }, 0)

  // Calculate distribution by role
  const roles: Record<string, number> = {}
  labor.forEach((item) => {
    const role = item.role || "Uncategorized"
    roles[role] = (roles[role] || 0) + (item.count || 0)
  })

  const totalWorkers = labor.reduce((sum, item) => sum + (item.count || 0), 0)
  const distribution = Object.entries(roles).map(([name, value]) => ({
    name,
    value: Math.round((value / totalWorkers) * 100),
  }))

  // Calculate utilization
  const utilization = labor.map((item) => {
    const assigned = item.count || 0
    const available = Math.max(0, Math.floor(assigned * (Math.random() * 0.2 + 0.05)))
    const utilizationRate = Math.min(100, Math.floor(((assigned - available) / assigned) * 100))

    return {
      id: item.id,
      name: item.role || `Role ${item.id}`,
      assigned,
      available,
      utilization: `${utilizationRate}%`,
      skillLevel: getSkillLevelFromRate(item.hourlyRate),
      nextAvailable: available > 0 ? "Immediate" : getRandomFutureDate(),
    }
  })

  // Identify potential bottlenecks
  const bottlenecks = labor
    .filter((item) => {
      // Identify roles with high hourly rates or full utilization
      return (item.hourlyRate || 0) > 40 || (item.count || 0) < 3
    })
    .map((item) => ({
      id: item.id,
      name: item.role || `Role ${item.id}`,
      reason: (item.count || 0) < 3 ? "Limited Resources" : "High Cost Specialty",
      impact: "High",
      mitigation:
        (item.count || 0) < 3
          ? "Recruit additional workers or cross-train existing staff"
          : "Optimize scheduling to maximize utilization of high-cost resources",
    }))
    .slice(0, 3) // Limit to top 3 bottlenecks

  return {
    totalCost,
    distribution,
    utilization,
    bottlenecks,
  }
}

// Calculate equipment metrics
function calculateEquipmentMetrics(equipment: any[]) {
  if (!equipment || equipment.length === 0) {
    return {
      totalCost: 0,
      utilization: [],
      efficiency: [],
      bottlenecks: [],
    }
  }

  // Calculate total cost (monthly)
  const totalCost = equipment.reduce((sum, item) => {
    return sum + (item.quantity || 0) * (item.dailyRate || 0) * 22 // 22 working days per month
  }, 0)

  // Calculate utilization
  const utilization = equipment.map((item) => {
    const quantity = item.quantity || 1
    const utilizationRate = Math.random() * 30 + 60 // 60-90% utilization
    const inUse = Math.floor((quantity * utilizationRate) / 100)
    const available = quantity - inUse

    return {
      id: item.id,
      name: item.name || `Equipment ${item.id}`,
      value: Math.round(utilizationRate),
      quantity,
      inUse,
      available,
      condition: getRandomCondition(),
      nextService: getRandomFutureDate(),
    }
  })

  // Calculate efficiency (cost per hour of operation)
  const efficiency = equipment.map((item) => {
    const hourlyRate = (item.dailyRate || 0) / 8 // Assuming 8-hour workday
    const fuelCost = (item.fuelConsumption || 0) * 4 // Assuming $4 per unit of fuel
    const totalHourlyCost = hourlyRate + fuelCost

    return {
      id: item.id,
      name: item.name || `Equipment ${item.id}`,
      hourlyCost: totalHourlyCost,
      fuelCost,
      maintenanceCost: hourlyRate * 0.1, // Maintenance cost as 10% of hourly rate
    }
  })

  // Identify potential bottlenecks
  const bottlenecks = equipment
    .filter((item) => {
      // Identify equipment with high daily rates or limited quantity
      return (item.dailyRate || 0) > 500 || (item.quantity || 0) === 1
    })
    .map((item) => ({
      id: item.id,
      name: item.name || `Equipment ${item.id}`,
      reason: (item.quantity || 0) === 1 ? "Single Point of Failure" : "High Cost Equipment",
      impact: "Medium",
      mitigation:
        (item.quantity || 0) === 1
          ? "Arrange backup equipment or rental options"
          : "Optimize scheduling to maximize utilization and consider equipment sharing",
    }))
    .slice(0, 3) // Limit to top 3 bottlenecks

  // Calculate distribution by type
  const typeDistribution = equipment.reduce((acc: Record<string, number>, item) => {
    // Categorize equipment by name keywords
    let type = "Other Equipment"

    const name = (item.name || "").toLowerCase()
    if (name.includes("excavator") || name.includes("bulldozer") || name.includes("crane")) {
      type = "Heavy Machinery"
    } else if (name.includes("tool")) {
      type = "Power Tools"
    } else if (name.includes("generator") || name.includes("compressor")) {
      type = "Generators"
    } else if (name.includes("truck") || name.includes("vehicle")) {
      type = "Vehicles"
    } else if (name.includes("scaffold")) {
      type = "Scaffolding"
    }

    acc[type] = (acc[type] || 0) + (item.quantity || 1)
    return acc
  }, {})

  const distribution = Object.entries(typeDistribution).map(([name, value]) => ({
    name,
    value,
  }))

  return {
    totalCost,
    utilization,
    efficiency,
    bottlenecks,
    distribution,
  }
}

// Calculate schedule metrics
function calculateScheduleMetrics(schedule: any[], startDate: Date, endDate: Date) {
  if (!schedule || schedule.length === 0) {
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
    return {
      duration,
      completionPercentage: 0,
      endDate: endDate.toISOString(),
      optimizedEndDate: new Date(endDate.getTime() - duration * 0.05 * 24 * 60 * 60 * 1000).toISOString(),
      potentialReduction: `${Math.ceil(duration * 0.05)} days`,
      criticalPath: [],
    }
  }

  // Calculate project duration
  const phaseDurations = schedule.map((phase) => {
    const phaseStart = new Date(phase.startDate)
    const phaseEnd = new Date(phase.endDate)
    return {
      id: phase.id,
      phase: phase.phase,
      duration: Math.ceil((phaseEnd.getTime() - phaseStart.getTime()) / (24 * 60 * 60 * 1000)),
      dependencies: phase.dependencies || [],
    }
  })

  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))

  // Calculate completion percentage
  const now = new Date()
  let completedDuration = 0
  let totalDuration = 0

  schedule.forEach((phase) => {
    const phaseStart = new Date(phase.startDate)
    const phaseEnd = new Date(phase.endDate)
    const phaseDuration = (phaseEnd.getTime() - phaseStart.getTime()) / (24 * 60 * 60 * 1000)

    totalDuration += phaseDuration

    if (now > phaseEnd) {
      // Phase is complete
      completedDuration += phaseDuration
    } else if (now > phaseStart) {
      // Phase is in progress
      const elapsedDuration = (now.getTime() - phaseStart.getTime()) / (24 * 60 * 60 * 1000)
      completedDuration += Math.min(elapsedDuration, phaseDuration)
    }
  })

  const completionPercentage = totalDuration > 0 ? Math.round((completedDuration / totalDuration) * 100) : 0

  // Identify critical path (simplified approach)
  const criticalPath = identifyCriticalPath(schedule)

  // Calculate potential time reduction
  const potentialReduction = Math.ceil(duration * 0.05) // Assume 5% reduction potential
  const optimizedEndDate = new Date(endDate.getTime() - potentialReduction * 24 * 60 * 60 * 1000)

  return {
    duration,
    completionPercentage,
    endDate: endDate.toISOString(),
    optimizedEndDate: optimizedEndDate.toISOString(),
    potentialReduction: `${potentialReduction} days`,
    criticalPath,
  }
}

// Calculate risk metrics
function calculateRiskMetrics(risks: any[], materials: any[], labor: any[], equipment: any[], schedule: any[]) {
  // If no risks provided, generate some based on other data
  if (!risks || risks.length === 0) {
    risks = generateRisksFromData(materials, labor, equipment, schedule)
  }

  // Calculate overall risk level
  const riskScores = risks.map((risk) => {
    const probability = risk.probability || 0.3
    const impactValue = risk.impact === "High" ? 3 : risk.impact === "Medium" ? 2 : 1
    return probability * impactValue
  })

  const averageRiskScore =
    riskScores.length > 0 ? riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length : 0.5

  let overallRiskLevel = "Low"
  if (averageRiskScore > 1.2) {
    overallRiskLevel = "High"
  } else if (averageRiskScore > 0.7) {
    overallRiskLevel = "Medium"
  }

  // Enhance risk data with severity and mitigation strategies
  const enhancedRisks = risks.map((risk, index) => {
    const probability = risk.probability || 0.3
    const impactValue = risk.impact === "High" ? 3 : risk.impact === "Medium" ? 2 : 1
    const riskScore = probability * impactValue

    let severity = "Medium"
    if (riskScore > 1.5) {
      severity = "Critical"
    } else if (riskScore > 0.8) {
      severity = "High"
    } else if (riskScore < 0.4) {
      severity = "Low"
    }

    return {
      id: risk.id || index + 1,
      title: risk.category || `Risk ${index + 1}`,
      description: risk.description || "No description provided",
      probability: probability,
      impact: risk.impact || "Medium",
      severity: severity,
      mitigationStrategy: generateMitigationStrategy(risk.category || "General"),
    }
  })

  return {
    risks: enhancedRisks,
    overallRiskLevel,
    averageRiskScore,
  }
}

// Calculate environmental metrics
function calculateEnvironmentalMetrics(materials: any[], equipment: any[], sustainability: any) {
  // Calculate carbon footprint from materials
  const materialCarbonFactors: Record<string, number> = {
    Concrete: 0.1, // tons CO2e per cubic yard
    Steel: 1.8, // tons CO2e per ton
    Lumber: 0.03, // tons CO2e per board foot
    Glass: 0.85, // tons CO2e per ton
    Brick: 0.25, // tons CO2e per ton
    Asphalt: 0.03, // tons CO2e per ton
    default: 0.05, // default factor
  }

  const materialImpact = materials.map((material) => {
    const name = material.name || ""
    let factor = materialCarbonFactors.default

    // Find the appropriate carbon factor based on material name
    Object.entries(materialCarbonFactors).forEach(([key, value]) => {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        factor = value
      }
    })

    const carbonFootprint = (material.quantity || 0) * factor
    return {
      id: material.id,
      name: material.name,
      quantity: material.quantity || 0,
      carbonFootprint: Math.round(carbonFootprint * 100) / 100,
      unit: material.unit || "units",
    }
  })

  const totalMaterialCarbon = materialImpact.reduce((sum, item) => sum + item.carbonFootprint, 0)

  // Calculate carbon footprint from equipment
  const equipmentImpact = equipment.map((item) => {
    const fuelConsumption = item.fuelConsumption || 0
    const quantity = item.quantity || 1
    const hoursPerDay = 8
    const daysPerMonth = 22

    // Estimate carbon emissions based on fuel consumption
    // Assuming diesel fuel at 2.68 kg CO2e per liter
    const carbonFootprint = (fuelConsumption * quantity * hoursPerDay * daysPerMonth * 2.68) / 1000

    return {
      id: item.id,
      name: item.name,
      quantity: quantity,
      fuelConsumption: fuelConsumption,
      carbonFootprint: Math.round(carbonFootprint * 100) / 100,
    }
  })

  const totalEquipmentCarbon = equipmentImpact.reduce((sum, item) => sum + item.carbonFootprint, 0)

  // Calculate total carbon footprint
  const totalCarbonFootprint = Math.round(totalMaterialCarbon + totalEquipmentCarbon)

  // Calculate water usage (simplified estimate)
  const waterUsage = Math.round(
    materials.reduce((sum, item) => {
      const name = (item.name || "").toLowerCase()
      let waterFactor = 0.5 // default water factor

      if (name.includes("concrete")) {
        waterFactor = 3.0
      } else if (name.includes("brick") || name.includes("mortar")) {
        waterFactor = 1.5
      }

      return sum + (item.quantity || 0) * waterFactor * 1000
    }, 0),
  )

  // Calculate waste recycling percentage
  const wasteRecyclingTarget = sustainability?.wasteRecyclingTarget || 75
  const currentWasteRecycling = Math.max(
    50,
    Math.min(wasteRecyclingTarget - 10, Math.floor(Math.random() * 20) + wasteRecyclingTarget - 15),
  )

  // Calculate renewable energy percentage
  const renewableEnergyTarget = sustainability?.renewableEnergyTarget || 40
  const currentRenewableEnergy = Math.max(
    20,
    Math.min(renewableEnergyTarget - 5, Math.floor(Math.random() * 15) + renewableEnergyTarget - 10),
  )

  return {
    footprint: {
      carbon: totalCarbonFootprint,
      water: waterUsage,
      waste: currentWasteRecycling,
      renewable: currentRenewableEnergy,
    },
    materialImpact,
    equipmentImpact,
    targets: {
      carbon: sustainability?.targetCarbonFootprint || totalCarbonFootprint * 0.8,
      water: waterUsage * 0.85,
      waste: wasteRecyclingTarget,
      renewable: renewableEnergyTarget,
    },
  }
}

// Generate recommendations based on analysis
function generateRecommendations(
  materials: any[],
  labor: any[],
  equipment: any[],
  schedule: any[],
  risks: any[],
  sustainability: any,
  materialMetrics: any,
  laborMetrics: any,
  equipmentMetrics: any,
  environmentalMetrics: any,
  budgetMetrics: any,
  scheduleMetrics: any,
  riskMetrics: any,
) {
  const recommendations = {
    labor: [] as any[],
    materials: [] as any[],
    equipment: [] as any[],
    risks: [] as any[],
    environmental: [] as any[],
    schedule: [] as any[],
    budget: [] as any[],
  }

  // Generate labor recommendations
  if (labor.length > 0) {
    // Find the most expensive labor category
    const mostExpensiveLabor = [...labor].sort(
      (a, b) => (b.hourlyRate || 0) * (b.count || 0) - (a.hourlyRate || 0) * (a.count || 0),
    )[0]

    if (mostExpensiveLabor) {
      recommendations.labor.push({
        id: 1,
        title: `Optimize ${mostExpensiveLabor.role} Allocation`,
        description: `Redistribute ${mostExpensiveLabor.role} resources more efficiently across project phases.`,
        impact: "High",
        savingsEstimate: `$${Math.round((mostExpensiveLabor.hourlyRate || 30) * (mostExpensiveLabor.count || 5) * 40 * 0.15).toLocaleString()}`,
        carbonReduction: "1.2 tons CO₂e",
      })
    }

    // Add a general labor recommendation
    recommendations.labor.push({
      id: 2,
      title: "Implement Skill Cross-Training",
      description: "Cross-train workers to perform multiple roles, reducing idle time and increasing flexibility.",
      impact: "Medium",
      savingsEstimate: `$${Math.round(laborMetrics.totalCost * 0.08).toLocaleString()}`,
      carbonReduction: "0.8 tons CO₂e",
    })

    // Add recommendation based on bottlenecks
    if (laborMetrics.bottlenecks && laborMetrics.bottlenecks.length > 0) {
      const bottleneck = laborMetrics.bottlenecks[0]
      recommendations.labor.push({
        id: 3,
        title: `Address ${bottleneck.name} Bottleneck`,
        description: bottleneck.mitigation,
        impact: bottleneck.impact,
        savingsEstimate: `$${Math.round(laborMetrics.totalCost * 0.05).toLocaleString()}`,
        carbonReduction: "0.5 tons CO₂e",
      })
    }
  }

  // Generate material recommendations
  if (materials.length > 0) {
    // Find materials that could be optimized
    const concreteItems = materials.filter((m) => (m.name || "").toLowerCase().includes("concrete"))
    const steelItems = materials.filter((m) => (m.name || "").toLowerCase().includes("steel"))

    if (concreteItems.length > 0) {
      recommendations.materials.push({
        id: 1,
        title: "Optimize Concrete Mix Design",
        description: "Use optimized concrete mix with supplementary cementitious materials to reduce cement content.",
        impact: "High",
        savingsEstimate: `$${Math.round(concreteItems.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitCost || 100), 0) * 0.12).toLocaleString()}`,
        carbonReduction: `${Math.round(concreteItems.reduce((sum, item) => sum + (item.quantity || 0) * 0.5, 0))} tons CO₂e`,
      })
    }

    if (steelItems.length > 0) {
      recommendations.materials.push({
        id: 2,
        title: "Consolidate Steel Orders",
        description: "Consolidate steel orders to reduce delivery costs and negotiate volume discounts.",
        impact: "Medium",
        savingsEstimate: `$${Math.round(steelItems.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitCost || 1000), 0) * 0.08).toLocaleString()}`,
        carbonReduction: "2.4 tons CO₂e",
      })
    }

    // Add a general material recommendation
    if (recommendations.materials.length < 2) {
      recommendations.materials.push({
        id: recommendations.materials.length + 1,
        title: "Implement Just-in-Time Delivery",
        description:
          "Schedule material deliveries to arrive just before they're needed to reduce storage costs and waste.",
        impact: "Medium",
        savingsEstimate: `$${Math.round(materialMetrics.totalCost * 0.05).toLocaleString()}`,
        carbonReduction: "1.5 tons CO₂e",
      })
    }

    // Add recommendation based on bottlenecks
    if (materialMetrics.bottlenecks && materialMetrics.bottlenecks.length > 0) {
      const bottleneck = materialMetrics.bottlenecks[0]
      recommendations.materials.push({
        id: recommendations.materials.length + 1,
        title: `Address ${bottleneck.name} Supply Risk`,
        description: bottleneck.mitigation,
        impact: bottleneck.impact,
        savingsEstimate: `$${Math.round(materialMetrics.totalCost * 0.04).toLocaleString()}`,
        carbonReduction: "0.9 tons CO₂e",
      })
    }
  }

  // Generate equipment recommendations
  if (equipment.length > 0) {
    // Find the most expensive equipment
    const mostExpensiveEquipment = [...equipment].sort(
      (a, b) => (b.dailyRate || 0) * (b.quantity || 0) - (a.dailyRate || 0) * (a.quantity || 0),
    )[0]

    if (mostExpensiveEquipment) {
      recommendations.equipment.push({
        id: 1,
        title: `Optimize ${mostExpensiveEquipment.name} Usage`,
        description: `Improve scheduling of ${mostExpensiveEquipment.name} to reduce idle time and maximize utilization.`,
        impact: "High",
        savingsEstimate: `$${Math.round((mostExpensiveEquipment.dailyRate || 500) * (mostExpensiveEquipment.quantity || 1) * 30 * 0.2).toLocaleString()}`,
        carbonReduction: `${Math.round((mostExpensiveEquipment.fuelConsumption || 10) * 0.6)} tons CO₂e`,
      })
    }

    // Add equipment sharing recommendation
    recommendations.equipment.push({
      id: 2,
      title: "Implement Equipment Sharing",
      description: "Share equipment between project phases or with nearby construction sites to reduce rental costs.",
      impact: "Medium",
      savingsEstimate: `$${Math.round(equipmentMetrics.totalCost * 0.15).toLocaleString()}`,
      carbonReduction: "3.2 tons CO₂e",
    })

    // Add recommendation based on bottlenecks
    if (equipmentMetrics.bottlenecks && equipmentMetrics.bottlenecks.length > 0) {
      const bottleneck = equipmentMetrics.bottlenecks[0]
      recommendations.equipment.push({
        id: 3,
        title: `Address ${bottleneck.name} Bottleneck`,
        description: bottleneck.mitigation,
        impact: bottleneck.impact,
        savingsEstimate: `$${Math.round(equipmentMetrics.totalCost * 0.07).toLocaleString()}`,
        carbonReduction: "1.8 tons CO₂e",
      })
    }
  }

  // Generate risk recommendations
  if (riskMetrics.risks.length > 0) {
    riskMetrics.risks.forEach((risk: any, index: number) => {
      if (index < 3) {
        // Limit to 3 risk recommendations
        recommendations.risks.push({
          id: index + 1,
          title: risk.title,
          description: risk.description,
          severity: risk.severity,
          mitigationStrategy: risk.mitigationStrategy,
        })
      }
    })
  }

  // Generate environmental recommendations
  recommendations.environmental.push({
    id: 1,
    title: "Reduce Equipment Idle Time",
    description: "Implement strict equipment shutdown procedures during breaks and non-working hours.",
    impact: "Medium",
    carbonReduction: `${Math.round(environmentalMetrics.footprint.carbon * 0.08)} tons CO₂e`,
  })

  if (materials.length > 0) {
    recommendations.environmental.push({
      id: 2,
      title: "Increase Recycled Material Usage",
      description: "Substitute virgin materials with recycled alternatives where specifications allow.",
      impact: "High",
      carbonReduction: `${Math.round(environmentalMetrics.footprint.carbon * 0.12)} tons CO₂e`,
    })
  }

  recommendations.environmental.push({
    id: 3,
    title: "Optimize Delivery Logistics",
    description: "Consolidate deliveries and optimize routes to reduce transportation emissions.",
    impact: "Medium",
    carbonReduction: `${Math.round(environmentalMetrics.footprint.carbon * 0.05)} tons CO₂e`,
  })

  // Generate schedule recommendations
  if (schedule.length > 0) {
    // Find the longest phases
    const sortedPhases = [...schedule].sort((a, b) => {
      const aDuration = getDurationInDays(a.startDate, a.endDate)
      const bDuration = getDurationInDays(b.startDate, b.endDate)
      return bDuration - aDuration
    })

    if (sortedPhases.length > 0 && sortedPhases[0]) {
      const longestPhase = sortedPhases[0]
      const phaseDuration = getDurationInDays(longestPhase.startDate, longestPhase.endDate)

      recommendations.schedule.push({
        id: 1,
        task: longestPhase.phase || "Construction Phase",
        originalDuration: `${phaseDuration} days`,
        optimizedDuration: `${Math.round(phaseDuration * 0.9)} days`,
        strategy: "Implement parallel work streams and increase resource allocation during critical periods.",
      })
    }

    if (sortedPhases.length > 1 && sortedPhases[1]) {
      const secondPhase = sortedPhases[1]
      const phaseDuration = getDurationInDays(secondPhase.startDate, secondPhase.endDate)

      recommendations.schedule.push({
        id: 2,
        task: secondPhase.phase || "Construction Phase",
        originalDuration: `${phaseDuration} days`,
        optimizedDuration: `${Math.round(phaseDuration * 0.92)} days`,
        strategy: "Optimize workflow sequencing and reduce wait times between activities.",
      })
    }
  }

  // Generate budget recommendations
  recommendations.budget.push({
    id: 1,
    title: "Optimize Material Procurement",
    description: "Implement bulk purchasing and early procurement strategies for key materials.",
    impact: "High",
    savingsEstimate: `$${Math.round(materialMetrics.totalCost * 0.08).toLocaleString()}`,
  })

  recommendations.budget.push({
    id: 2,
    title: "Optimize Labor Scheduling",
    description: "Implement just-in-time labor scheduling to reduce idle time and overtime costs.",
    impact: "Medium",
    savingsEstimate: `$${Math.round(laborMetrics.totalCost * 0.06).toLocaleString()}`,
  })

  recommendations.budget.push({
    id: 3,
    title: "Equipment Rental Optimization",
    description: "Negotiate better rental terms and implement equipment sharing between project phases.",
    impact: "Medium",
    savingsEstimate: `$${Math.round(equipmentMetrics.totalCost * 0.1).toLocaleString()}`,
  })

  return recommendations
}

// Helper functions
function getRandomFutureDate() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const now = new Date()
  const futureDate = new Date(now.setDate(now.getDate() + Math.floor(Math.random() * 60)))
  return `${months[futureDate.getMonth()]} ${futureDate.getDate()}, ${futureDate.getFullYear()}`
}

function getSkillLevelFromRate(hourlyRate?: number) {
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

function getDurationInDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 30

  const start = new Date(startDate)
  const end = new Date(endDate)

  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 30
}

function identifyCriticalPath(schedule: any[]) {
  if (!schedule || schedule.length === 0) return []

  // Simple approach: find phases with dependencies and longest durations
  const phases = schedule.map((phase) => ({
    id: phase.id,
    phase: phase.phase,
    startDate: new Date(phase.startDate),
    endDate: new Date(phase.endDate),
    duration: getDurationInDays(phase.startDate, phase.endDate),
    dependencies: phase.dependencies || [],
  }))

  // Sort by duration (descending)
  phases.sort((a, b) => b.duration - a.duration)

  // Take top 3 phases with dependencies as critical path
  const criticalPath = phases
    .filter((phase) => phase.dependencies.length > 0)
    .slice(0, 3)
    .map((phase) => ({
      id: phase.id,
      phase: phase.phase,
      duration: phase.duration,
      impact: "High",
    }))

  // If not enough phases with dependencies, add longest phases
  if (criticalPath.length < 3) {
    phases
      .filter((phase) => !criticalPath.some((cp) => cp.id === phase.id))
      .slice(0, 3 - criticalPath.length)
      .forEach((phase) => {
        criticalPath.push({
          id: phase.id,
          phase: phase.phase,
          duration: phase.duration,
          impact: "Medium",
        })
      })
  }

  return criticalPath
}

function generateRisksFromData(materials: any[], labor: any[], equipment: any[], schedule: any[]) {
  const risks = []

  // Generate weather risk
  risks.push({
    category: "Weather",
    probability: 0.3,
    impact: "Medium",
    description: "Potential seasonal weather disruptions affecting outdoor work.",
  })

  // Generate material-related risk if applicable
  if (materials.length > 0) {
    const highCostMaterials = materials.filter(
      (m) => (m.unitCost || 0) > 1000 || (m.quantity || 0) * (m.unitCost || 0) > 50000,
    )

    if (highCostMaterials.length > 0) {
      risks.push({
        category: "Supply Chain",
        probability: 0.4,
        impact: "High",
        description: `Potential delivery delays for ${highCostMaterials[0].name || "critical materials"}.`,
      })
    } else {
      risks.push({
        category: "Supply Chain",
        probability: 0.25,
        impact: "Medium",
        description: "Possible material price volatility affecting budget.",
      })
    }
  }

  // Generate labor-related risk if applicable
  if (labor.length > 0) {
    const specializedLabor = labor.filter((l) => (l.hourlyRate || 0) > 45)

    if (specializedLabor.length > 0) {
      risks.push({
        category: "Labor",
        probability: 0.35,
        impact: "High",
        description: `Potential shortage of ${specializedLabor[0].role || "specialized workers"} in the region.`,
      })
    } else {
      risks.push({
        category: "Labor",
        probability: 0.2,
        impact: "Medium",
        description: "Possible labor productivity variations affecting schedule.",
      })
    }
  }

  // Generate equipment-related risk if applicable
  if (equipment.length > 0) {
    const criticalEquipment = equipment.filter((e) => (e.quantity || 0) === 1 && (e.dailyRate || 0) > 500)

    if (criticalEquipment.length > 0) {
      risks.push({
        category: "Equipment",
        probability: 0.3,
        impact: "Medium",
        description: `Potential downtime of critical ${criticalEquipment[0].name || "equipment"} affecting schedule.`,
      })
    }
  }

  // Generate schedule-related risk if applicable
  if (schedule.length > 0) {
    risks.push({
      category: "Schedule",
      probability: 0.25,
      impact: "Medium",
      description: "Potential delays in regulatory approvals affecting project timeline.",
    })
  }

  // Generate financial risk
  risks.push({
    category: "Financial",
    probability: 0.2,
    impact: "High",
    description: "Potential cost overruns due to unforeseen site conditions.",
  })

  return risks
}

function generateMitigationStrategy(riskCategory: string) {
  const strategies: Record<string, string> = {
    Weather: "Develop a weather contingency plan with flexible scheduling and temporary weather protection measures.",
    "Supply Chain": "Identify alternative suppliers and maintain a buffer stock of critical materials.",
    Labor: "Develop relationships with multiple labor providers and implement cross-training programs.",
    Financial: "Establish contingency funds and regular financial reviews to address potential cost overruns.",
    Safety: "Enhance safety training programs and implement rigorous inspection protocols.",
    Quality: "Implement comprehensive quality control processes with regular inspections and testing.",
    Regulatory: "Engage with regulatory authorities early and maintain regular communication throughout the project.",
    Equipment: "Arrange backup equipment options and implement preventive maintenance program.",
    Schedule: "Build buffer time into critical path activities and prepare acceleration plans for key milestones.",
  }

  return (
    strategies[riskCategory] ||
    "Develop a comprehensive risk management plan with regular monitoring and response protocols."
  )
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate input data
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ success: false, error: "No data provided for analysis" }, { status: 400 })
    }

    // Analyze the uploaded data
    const analysisResults = await analyzeProjectData(data)

    return NextResponse.json({
      success: true,
      data: analysisResults,
    })
  } catch (error: any) {
    console.error("Error analyzing project data:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to analyze project data" },
      { status: 500 },
    )
  }
}

