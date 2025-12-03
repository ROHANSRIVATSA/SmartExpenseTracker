import { useMemo } from 'react';
import type { Expense } from '../types';

interface CoachMessage {
  message: string;
  tone: 'supportive' | 'curious' | 'celebratory' | 'reflective';
  category?: string;
}

/**
 * React Hook for AI Coach Messages
 * Memoized for performance - only recalculates when expenses change
 */
export function useCoachMessage(expenses: Expense[]): CoachMessage {
  return useMemo(() => {
    const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const purchaseCount = expenses.length;
    
    // No spending yet
    if (expenses.length === 0) {
      return {
        message: "No expenses yet this week. Start tracking to build awareness!",
        tone: 'supportive',
      };
    }
    
    // First purchase
    if (expenses.length === 1) {
      return {
        message: "Great start! Each receipt you track builds awareness.",
        tone: 'celebratory',
      };
    }
    
    // Calculate category with most spending
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    
    // High spending (>$100)
    if (totalSpending > 100) {
      return {
        message: "You've had a busy week. What stands out to you about your spending?",
        tone: 'reflective',
      };
    }
    
    // Moderate spending ($50-100)
    if (totalSpending >= 50 && totalSpending <= 100) {
      return {
        message: "I notice you're exploring a bit this week. That's okay—awareness is the first step.",
        tone: 'supportive',
      };
    }
    
    // Low spending (<$50) - balanced
    if (totalSpending < 50) {
      return {
        message: "Your spending was balanced this week. That takes intentionality.",
        tone: 'supportive',
      };
    }
    
    // Check for category spike (if one category is >50% of total)
    if (topCategory && topCategory[1] > totalSpending * 0.5) {
      return {
        message: `I notice ${topCategory[0]} was higher this week. What changed?`,
        tone: 'curious',
        category: topCategory[0],
      };
    }
    
    // Default message
    return {
      message: "You're building awareness this week. Keep tracking—patterns will emerge.",
      tone: 'supportive',
    };
  }, [expenses]);
}