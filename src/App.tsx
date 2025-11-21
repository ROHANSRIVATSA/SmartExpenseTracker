import { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { ProcessingScreen } from './components/ProcessingScreen';
import { ExpenseListScreen } from './components/ExpenseListScreen';
import { InsightsScreen } from './components/InsightsScreen';
import { WeeklySummaryScreen } from './components/WeeklySummaryScreen';
import { PrivacyControlsScreen } from './components/PrivacyControlsScreen';
import { SpendingOverviewScreen } from './components/SpendingOverviewScreen';
import type { Expense, WeekData } from './types';
import React from 'react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'processing' | 'expenses' | 'insights' | 'weeklySummary' | 'privacy' | 'overview'>('home');
  const [previousScreen, setPreviousScreen] = useState<'home' | 'processing' | 'expenses' | 'insights' | 'weeklySummary' | 'privacy' | 'overview'>('home');
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      amount: 7.80,
      category: 'Coffee',
      description: 'Cappuccino and Croissant',
      date: new Date(),
    }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mock historical week data
  const [previousWeeks] = useState<WeekData[]>([
    {
      weekNumber: 1,
      weekLabel: 'Week 1',
      total: 87.50,
      topCategory: 'Food',
      expenses: []
    },
    {
      weekNumber: 2,
      weekLabel: 'Week 2',
      total: 92.30,
      topCategory: 'Coffee',
      expenses: []
    },
    {
      weekNumber: 3,
      weekLabel: 'Week 3',
      total: 76.80,
      topCategory: 'Transport',
      expenses: []
    }
  ]);

  const handleScanReceipt = () => {
    setPreviousScreen('home');
    setCurrentScreen('processing');
  };

  const handleSkipToExpenses = (extractedItems?: Array<{ name: string; amount: number; category: string }>) => {
    if (extractedItems && extractedItems.length > 0) {
      const newExpenses = extractedItems.map((item) => ({
        id: Date.now().toString() + Math.random(),
        amount: item.amount,
        category: item.category,
        description: item.name,
        date: new Date(),
      }));
      setExpenses([...expenses, ...newExpenses]);
    }
    setCurrentScreen('expenses');
  };

  const handleViewInsights = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
    setPreviousScreen(currentScreen);
    setCurrentScreen('insights');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleBackFromInsights = () => {
    setSelectedCategory(null);
    setCurrentScreen(previousScreen);
  };

  const handleAddExpense = (amount: number, category: string, description: string) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount,
      category,
      description,
      date: new Date(),
    };
    setExpenses([...expenses, newExpense]);
  };

  // POLISH FEATURE 1: Delete expense
  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(updatedExpenses);
  };

  // POLISH FEATURE 3: Clear all expenses
  const handleClearAllExpenses = () => {
    setExpenses([]);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setPreviousScreen(currentScreen);
    setCurrentScreen('insights');
  };

  const handleViewWeeklySummary = () => {
    setCurrentScreen('weeklySummary');
  };

  const handleViewPrivacy = () => {
    setCurrentScreen('privacy');
  };

  const handleViewOverview = () => {
    setCurrentScreen('overview');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* iPhone Frame */}
      <div className="relative w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-800">
        {/* Screen Content */}
        <div className="w-full h-full overflow-y-auto bg-white">
          {currentScreen === 'home' && (
            <HomeScreen 
              onScanReceipt={handleScanReceipt} 
              expenses={expenses}
              onCategoryClick={handleCategoryClick}
              onViewWeeklySummary={handleViewWeeklySummary}
              onViewPrivacy={handleViewPrivacy}
              onViewOverview={handleViewOverview}
              onAddExpense={handleAddExpense}
            />
          )}
          {currentScreen === 'processing' && (
            <ProcessingScreen onSkip={handleSkipToExpenses} />
          )}
          {currentScreen === 'expenses' && (
            <ExpenseListScreen 
              expenses={expenses}
              onViewInsights={handleViewInsights} 
              onBackToHome={handleBackToHome}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}
          {currentScreen === 'insights' && (
            <InsightsScreen 
              onBack={handleBackFromInsights}
              expenses={expenses}
              selectedCategory={selectedCategory}
              onDeleteExpense={handleDeleteExpense}
            />
          )}
          {currentScreen === 'weeklySummary' && (
            <WeeklySummaryScreen
              onBack={handleBackToHome}
              onViewDetailedBreakdown={() => setCurrentScreen('expenses')}
              expenses={expenses}
            />
          )}
          {currentScreen === 'privacy' && (
            <PrivacyControlsScreen
              onBack={handleBackToHome}
              onClearAllExpenses={handleClearAllExpenses}
            />
          )}
          {currentScreen === 'overview' && (
            <SpendingOverviewScreen
              onBack={handleBackToHome}
              currentWeekExpenses={expenses}
              previousWeeks={previousWeeks}
            />
          )}
        </div>

        {/* Home Indicator (iPhone) */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full" />
      </div>
    </div>
  );
}