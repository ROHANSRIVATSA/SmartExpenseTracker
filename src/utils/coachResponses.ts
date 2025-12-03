import type { Expense } from '../types';

export interface CoachMessage {
  text: string;
  tone: 'supportive' | 'curious' | 'encouraging' | 'reflective';
  color: string;
}

interface CategorySpending {
  [category: string]: number;
}

/**
 * Generates AI coach messages based on spending patterns
 * Designed to be encouraging and supportive, never shaming or judgmental
 */
export function getCoachResponse(expenses: Expense[], previousWeekTotal?: number): CoachMessage {
  const weekTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const purchaseCount = expenses.length;
  
  console.log('Coach Debug:', { weekTotal, purchaseCount, expenseCount: expenses.length });
  
  // Calculate category spending
  const categorySpending: CategorySpending = {};
  expenses.forEach(expense => {
    categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
  });
  
  // Find highest spending category
  let highestCategory = '';
  let highestAmount = 0;
  Object.entries(categorySpending).forEach(([category, amount]) => {
    if (amount > highestAmount) {
      highestAmount = amount;
      highestCategory = category;
    }
  });
  
  // No spending yet
  if (weekTotal === 0 || purchaseCount === 0) {
    return {
      text: "No expenses yet this week. Start tracking to build awareness!",
      tone: 'encouraging',
      color: 'from-teal-50 to-blue-50'
    };
  }
  
  // First purchase
  if (purchaseCount === 1) {
    return {
      text: "Great start! Each receipt you track builds awareness.",
      tone: 'encouraging',
      color: 'from-teal-50 to-blue-50'
    };
  }
  
  // Check for category spike FIRST (if one category is >50% of total)
  if (highestAmount > weekTotal * 0.5 && highestCategory) {
    return {
      text: `I notice ${highestCategory} was higher this week. What changed?`,
      tone: 'curious',
      color: 'from-purple-50 to-pink-50'
    };
  }
  
  // High spending (>$100)
  if (weekTotal >= 100) {
    return {
      text: "You've had a busy week. What stands out to you about your spending?",
      tone: 'reflective',
      color: 'from-purple-50 to-pink-50'
    };
  }
  
  // Moderate spending ($50-$100)
  if (weekTotal >= 50 && weekTotal < 100) {
    return {
      text: "I notice you're exploring a bit this week. That's okay! Awareness is the first step.",
      tone: 'curious',
      color: 'from-purple-50 to-pink-50'
    };
  }
  
  // Low spending (<$50) - balanced
  if (weekTotal < 50) {
    return {
      text: "Your spending was balanced this week. That takes intentionality.",
      tone: 'supportive',
      color: 'from-purple-50 to-pink-50'
    };
  }
  
  // Default supportive message (shouldn't reach here)
  return {
    text: "You're building awareness this week. Keep tracking—patterns will emerge.",
    tone: 'supportive',
    color: 'from-purple-50 to-pink-50'
  };
}

/**
 * Generates trend comparison messages
 * Compares current week to previous week
 */
export function getTrendMessage(currentWeek: number, previousWeek: number): string {
  const difference = currentWeek - previousWeek;
  const percentChange = previousWeek > 0 
    ? Math.abs((difference / previousWeek) * 100).toFixed(0)
    : '0';
  
  if (difference === 0) {
    return "Your spending remained consistent with last week.";
  } else if (difference > 0) {
    return `↑ ${percentChange}% from last week`;
  } else {
    return `↓ ${percentChange}% from last week`;
  }
}

/**
 * Generates progress messages based on weeks tracked
 * Encourages long-term habit building
 */
export function getProgressMessage(weeksTracked: number): string {
  if (weeksTracked === 0) {
    return "Start your first week of tracking to build awareness.";
  } else if (weeksTracked === 1) {
    return "You've started tracking! One week of awareness is powerful.";
  } else if (weeksTracked === 2) {
    return "Two weeks of tracking—patterns are starting to emerge.";
  } else if (weeksTracked === 3) {
    return "Three weeks in! You're building real awareness.";
  } else if (weeksTracked >= 4) {
    return `You've maintained consistent awareness over ${weeksTracked} weeks. That's real progress.`;
  }
  
  return "Keep tracking to build awareness.";
}