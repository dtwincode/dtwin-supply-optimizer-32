import { addDays, format, startOfWeek, endOfWeek, eachWeekOfInterval, differenceInDays } from 'date-fns';

export interface DayProjection {
  day: number;
  date: Date;
  dateString: string;
  demand: number;
  onHandStart: number;
  incomingSupply: number;
  onHandEnd: number;
  onOrder: number;
  qualifiedDemand: number;
  nfp: number;
  launchOrder: boolean;
  orderAmount: number;
  bufferStatus: 'RED' | 'YELLOW' | 'GREEN' | 'BLUE';
  isWeekend: boolean;
}

export interface WeekProjection {
  week: number;
  weekLabel: string;
  startDate: Date;
  endDate: Date;
  totalDemand: number;
  startInventory: number;
  incomingSupply: number;
  endInventory: number;
  avgNFP: number;
  launchOrder: boolean;
  orderAmount: number;
  bufferStatus: 'RED' | 'YELLOW' | 'GREEN' | 'BLUE';
  dailyProjections: DayProjection[];
}

export interface OpenPO {
  ordered_qty: number;
  expected_date: string;
}

export interface ProjectionInput {
  currentOnHand: number;
  currentOnOrder: number;
  qualifiedDemand: number;
  adu: number;
  dlt: number;
  tor: number;
  toy: number;
  tog: number;
  openPOs: OpenPO[];
  moq?: number;
  roundingMultiple?: number;
}

/**
 * Calculate buffer status based on NFP and buffer zones
 */
export function calculateBufferStatus(
  nfp: number,
  tor: number,
  toy: number,
  tog: number
): 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' {
  if (nfp < tor) return 'RED';
  if (nfp < toy) return 'YELLOW';
  if (nfp < tog) return 'GREEN';
  return 'BLUE';
}

/**
 * Calculate order quantity based on DDMRP principles
 */
export function calculateOrderQuantity(
  nfp: number,
  tog: number,
  moq: number = 0,
  roundingMultiple: number = 1
): number {
  const baseQty = Math.max(0, tog - nfp);
  let orderQty = Math.max(baseQty, moq);
  
  // Round to nearest multiple
  if (roundingMultiple > 1) {
    orderQty = Math.ceil(orderQty / roundingMultiple) * roundingMultiple;
  }
  
  return orderQty;
}

/**
 * Group open POs by expected delivery date
 */
function groupOpenPOsByDate(openPOs: OpenPO[]): Map<string, number> {
  const poMap = new Map<string, number>();
  
  openPOs.forEach(po => {
    const dateKey = format(new Date(po.expected_date), 'yyyy-MM-dd');
    const existing = poMap.get(dateKey) || 0;
    poMap.set(dateKey, existing + po.ordered_qty);
  });
  
  return poMap;
}

/**
 * Calculate daily projections for 14 days
 */
export function calculateDailyProjections(input: ProjectionInput): DayProjection[] {
  const projections: DayProjection[] = [];
  const today = new Date();
  const poMap = groupOpenPOsByDate(input.openPOs);
  
  let runningOnHand = input.currentOnHand;
  let runningOnOrder = input.currentOnOrder;
  
  for (let day = 0; day < 14; day++) {
    const projectionDate = addDays(today, day);
    const dateString = format(projectionDate, 'yyyy-MM-dd');
    const isWeekend = projectionDate.getDay() === 0 || projectionDate.getDay() === 6;
    
    // Check for incoming supply
    const incomingSupply = poMap.get(dateString) || 0;
    
    // Start of day on-hand
    const onHandStart = runningOnHand;
    
    // Add incoming supply
    runningOnHand += incomingSupply;
    runningOnOrder -= incomingSupply;
    
    // Subtract demand
    const demand = input.adu;
    runningOnHand -= demand;
    
    // End of day on-hand
    const onHandEnd = runningOnHand;
    
    // Calculate NFP
    const nfp = onHandEnd + Math.max(0, runningOnOrder) - input.qualifiedDemand;
    
    // Determine buffer status
    const bufferStatus = calculateBufferStatus(nfp, input.tor, input.toy, input.tog);
    
    // Launch order if NFP <= TOY
    const launchOrder = nfp <= input.toy;
    
    // Calculate order amount
    const orderAmount = launchOrder 
      ? calculateOrderQuantity(nfp, input.tog, input.moq, input.roundingMultiple)
      : 0;
    
    projections.push({
      day,
      date: projectionDate,
      dateString,
      demand,
      onHandStart,
      incomingSupply,
      onHandEnd,
      onOrder: Math.max(0, runningOnOrder),
      qualifiedDemand: input.qualifiedDemand,
      nfp,
      launchOrder,
      orderAmount,
      bufferStatus,
      isWeekend,
    });
    
    // Update running on-hand for next iteration
    runningOnHand = onHandEnd;
  }
  
  return projections;
}

/**
 * Calculate weekly aggregated projections for 4 weeks
 */
export function calculateWeeklyProjections(input: ProjectionInput): WeekProjection[] {
  const dailyProjections = calculateDailyProjections(input);
  const today = new Date();
  const fourWeeksOut = addDays(today, 28);
  
  // Generate week intervals
  const weeks = eachWeekOfInterval(
    { start: today, end: fourWeeksOut },
    { weekStartsOn: 0 } // Sunday
  ).slice(0, 4);
  
  const weeklyProjections: WeekProjection[] = weeks.map((weekStart, index) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
    const weekLabel = `Week ${index + 1}`;
    
    // Filter daily projections for this week
    const weekDays = dailyProjections.filter(day => {
      const daysDiff = differenceInDays(day.date, today);
      const weekStartDay = index * 7;
      const weekEndDay = weekStartDay + 6;
      return daysDiff >= weekStartDay && daysDiff <= weekEndDay;
    });
    
    // Aggregate metrics
    const totalDemand = weekDays.reduce((sum, day) => sum + day.demand, 0);
    const incomingSupply = weekDays.reduce((sum, day) => sum + day.incomingSupply, 0);
    const startInventory = weekDays[0]?.onHandStart || 0;
    const endInventory = weekDays[weekDays.length - 1]?.onHandEnd || 0;
    const avgNFP = weekDays.reduce((sum, day) => sum + day.nfp, 0) / (weekDays.length || 1);
    
    // Check if any day requires order launch
    const launchOrder = weekDays.some(day => day.launchOrder);
    const orderAmount = weekDays.reduce((sum, day) => sum + day.orderAmount, 0);
    
    // Determine overall buffer status for the week (worst status)
    const statusPriority = { RED: 4, YELLOW: 3, GREEN: 2, BLUE: 1 };
    const bufferStatus = weekDays.reduce((worst, day) => {
      return statusPriority[day.bufferStatus] > statusPriority[worst] 
        ? day.bufferStatus 
        : worst;
    }, 'BLUE' as 'RED' | 'YELLOW' | 'GREEN' | 'BLUE');
    
    return {
      week: index + 1,
      weekLabel,
      startDate: weekStart,
      endDate: weekEnd,
      totalDemand,
      startInventory,
      incomingSupply,
      endInventory,
      avgNFP,
      launchOrder,
      orderAmount,
      bufferStatus,
      dailyProjections: weekDays,
    };
  });
  
  return weeklyProjections;
}
