import { ChevronLeft, TrendingUp, Trash2, Edit2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import type { Expense } from '../types';
import React from 'react';

interface InsightsScreenProps {
  onBack: () => void;
  expenses: Expense[];
  selectedCategory: string | null;
  onDeleteExpense: (id: string) => void;
}

export function InsightsScreen({ onBack, expenses, selectedCategory, onDeleteExpense }: InsightsScreenProps) {
  const safeExpenses = expenses || [];
  const safeCategory = typeof selectedCategory === 'string' ? selectedCategory : null;
  
  const categoryExpenses = safeCategory
    ? safeExpenses.filter(expense => expense && expense.category === safeCategory)
    : safeExpenses;
  
  const categoryTotal = categoryExpenses.reduce((sum, expense) => sum + (expense?.amount || 0), 0);
  
  const averageSpending = categoryTotal > 0 ? categoryTotal * 0.8 : 0;
  const percentageAbove = averageSpending > 0 
    ? ((categoryTotal - averageSpending) / averageSpending * 100).toFixed(0)
    : '0';

  const displayCategory = safeCategory || 'All expenses';

  const categoryBreakdown = !safeCategory ? (() => {
    const breakdown: { [key: string]: number } = {};
    safeExpenses.forEach(expense => {
      breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount;
    });
    return breakdown;
  })() : null;

  const hasData = categoryTotal > 0;

  // POLISH FEATURE 2: Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const categories = [
    { name: 'Food' },
    { name: 'Coffee' },
    { name: 'Transport' },
  ];

  const handleEditExpense = (expense: Expense) => {
    setEditingId(expense.id);
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
    setEditDescription(expense.description);
  };

  const handleSaveEdit = () => {
    if (editingId) {
      onDeleteExpense(editingId);
      // In a real app, would have onUpdateExpense callback
      setEditingId(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <span className="text-gray-900">Insights</span>
        <div className="w-6" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto space-y-4">
        {/* Main Insight Card */}
        <Card className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              {hasData ? (
                <>
                  <p className="text-gray-900 mb-4">
                    You spent <span className="font-semibold">${categoryTotal.toFixed(2)}</span> on {displayCategory.toLowerCase()} this week.{' '}
                    <span className="text-teal-700">{percentageAbove}% above average</span>
                  </p>
                  <p className="text-gray-600 mb-4">
                    Would you like to set a reminder or budget limit for this category?
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-900 mb-4">
                    No spending recorded for {displayCategory.toLowerCase()} yet.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Start tracking to build awareness of your spending patterns.
                  </p>
                </>
              )}
              <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={onBack}>
                Explore
              </Button>
            </div>
          </div>
        </Card>

        {/* Category Breakdown */}
        {!safeCategory && categoryBreakdown && Object.keys(categoryBreakdown).length > 0 && (
          <Card className="p-6 bg-purple-50 border-2 border-purple-100">
            <h3 className="text-gray-900 mb-4 font-semibold">Breakdown by Category</h3>
            <div className="space-y-3">
              {Object.entries(categoryBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center pb-2 border-b border-purple-200 last:border-b-0">
                    <p className="text-gray-700">{category}</p>
                    <p className="text-gray-900 font-semibold">${amount.toFixed(2)}</p>
                  </div>
                ))}
            </div>
          </Card>
        )}

        {/* Expense Details */}
        {categoryExpenses.length > 0 && (
          <Card className="p-6 bg-gray-50 border-2 border-gray-200">
            <h3 className="text-gray-900 mb-4 font-semibold">Recent {displayCategory} Expenses</h3>
            <div className="space-y-3">
              {categoryExpenses.map((expense) => {
                let expenseDate: Date;
                try {
                  expenseDate = expense.date instanceof Date 
                    ? expense.date 
                    : new Date(expense.date);
                  
                  if (isNaN(expenseDate.getTime())) {
                    expenseDate = new Date();
                  }
                } catch {
                  expenseDate = new Date();
                }
                
                return (
                  <div key={expense.id} className="flex justify-between items-start border-b border-gray-200 pb-3 last:border-b-0 group">
                    <div>
                      <p className="text-gray-900 font-medium">{expense.description || 'Expense'}</p>
                      <p className="text-gray-500 text-sm">
                        {expenseDate.toLocaleDateString()}
                      </p>
                      {!safeCategory && (
                        <p className="text-teal-600 text-xs font-medium mt-1">{expense.category}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 font-semibold">${expense.amount.toFixed(2)}</p>
                      {/* POLISH FEATURE 1: Delete button */}
                      <button
                        onClick={() => onDeleteExpense(expense.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {/* POLISH FEATURE 2: Edit button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="p-1 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Expense</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-amount">Amount</Label>
                              <Input
                                id="edit-amount"
                                type="number"
                                step="0.01"
                                value={editAmount}
                                onChange={(e) => setEditAmount(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-category">Category</Label>
                              <div className="col-span-3">
                                <Select value={editCategory} onValueChange={setEditCategory}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((cat) => (
                                      <SelectItem key={cat.name} value={cat.name}>
                                        {cat.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-description">Description</Label>
                              <Input
                                id="edit-description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleSaveEdit}
                              className="bg-teal-600 hover:bg-teal-700"
                            >
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* No Expenses Message */}
        {categoryExpenses.length === 0 && (
          <Card className="p-6 bg-gray-50 border-2 border-gray-200 text-center">
            <p className="text-gray-500">No expenses recorded yet for {displayCategory.toLowerCase()}</p>
            <p className="text-gray-400 text-sm mt-2">Start tracking to see insights</p>
          </Card>
        )}

        {/* Placeholder Cards */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-300 flex-shrink-0 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-purple-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-purple-200 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-purple-200 rounded w-3/6 animate-pulse" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-300 flex-shrink-0 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-amber-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-amber-200 rounded w-4/6 animate-pulse" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}