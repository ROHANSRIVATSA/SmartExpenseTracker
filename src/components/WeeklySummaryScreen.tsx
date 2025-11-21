import { ChevronLeft, MessageCircle, Calendar, ShoppingBag, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { Expense } from '../types';
import { getCoachResponse } from '../utils/coachResponses';
import React from 'react';

interface WeeklySummaryScreenProps {
  onBack: () => void;
  onViewDetailedBreakdown: () => void;
  expenses: Expense[];
  weekNumber?: number;
}

export function WeeklySummaryScreen({ 
  onBack, 
  onViewDetailedBreakdown, 
  expenses,
  weekNumber = 1 
}: WeeklySummaryScreenProps) {
  // Calculate totals
  const weekTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const purchaseCount = expenses.length;
  const averagePerPurchase = purchaseCount > 0 ? weekTotal / purchaseCount : 0;

  // Get top category
  const categoryTotals: { [key: string]: number } = {};
  expenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const categoriesUsed = Object.keys(categoryTotals).length;

  // FIX: Get AI coach message based on spending patterns
  const coachMessage = getCoachResponse(expenses);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <span className="text-gray-900">Weekly Reflection</span>
        <div className="w-6" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto space-y-6">
        {/* Large Spending Total */}
        <div className="text-center space-y-2">
          <p className="text-gray-500">This Week's Spending</p>
          <p className="text-teal-600" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            ${weekTotal.toFixed(2)}
          </p>
          {topCategory && (
            <p className="text-gray-600">
              Top category: <span className="text-gray-900">{topCategory[0]}</span>
            </p>
          )}
        </div>

        {/* AI Coach Message Card - FIX: Properly integrated */}
        <Card className={`p-6 bg-gradient-to-br ${coachMessage.color} border-2 border-purple-100`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-gray-900" style={{ lineHeight: '1.6' }}>
                {coachMessage.text}
              </p>
            </div>
          </div>
        </Card>

        {/* Reflection Prompt */}
        <Card className="p-6 bg-gray-50">
          <h3 className="text-gray-900 mb-3">Reflection Prompt</h3>
          <p className="text-gray-600 mb-4" style={{ lineHeight: '1.6' }}>
            Take a moment to reflect: What surprised you about your spending this week? 
            Are there any patterns you'd like to change?
          </p>
          <div className="h-24 bg-white border-2 border-gray-200 rounded-lg p-3">
            <p className="text-gray-400 italic">Your thoughts here...</p>
          </div>
        </Card>

        {/* Week at a Glance */}
        <Card className="p-6 bg-white border-2 border-gray-200">
          <h3 className="text-gray-900 mb-4">Your Week at a Glance</h3>
          <div className="space-y-4">
            {/* Number of purchases */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-teal-600" strokeWidth={2} />
                </div>
                <span className="text-gray-700">Purchases</span>
              </div>
              <span className="text-gray-900 font-semibold">{purchaseCount}</span>
            </div>

            {/* Average per purchase */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" strokeWidth={2} />
                </div>
                <span className="text-gray-700">Average per purchase</span>
              </div>
              <span className="text-gray-900 font-semibold">${averagePerPurchase.toFixed(2)}</span>
            </div>

            {/* Categories used */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" strokeWidth={2} />
                </div>
                <span className="text-gray-700">Categories used</span>
              </div>
              <span className="text-gray-900 font-semibold">{categoriesUsed}</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-8">
          <Button 
            onClick={onViewDetailedBreakdown}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            View Detailed Breakdown
          </Button>
          <Button 
            onClick={onBack}
            variant="outline"
            className="w-full"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}