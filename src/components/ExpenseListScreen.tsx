import { Coffee, UtensilsCrossed, Car, Plus, ChevronLeft, Edit2, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import type { Expense } from '../types';
import React from 'react';

interface ExpenseListScreenProps {
  expenses: Expense[];
  onViewInsights: (category?: string) => void;
  onBackToHome: () => void;
  onAddExpense: (amount: number, category: string, description: string) => void;
  onDeleteExpense: (id: string) => void;
}

export function ExpenseListScreen({ 
  expenses, 
  onViewInsights, 
  onBackToHome, 
  onAddExpense,
  onDeleteExpense 
}: ExpenseListScreenProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Calculate totals by category
  const getCategoryTotal = (categoryName: string): number => {
    return expenses
      .filter(expense => expense.category === categoryName)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  // Calculate overall total
  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categories = [
    { name: 'Food', icon: UtensilsCrossed },
    { name: 'Coffee', icon: Coffee },
    { name: 'Transport', icon: Car },
  ];

  const handleAddExpense = () => {
    if (amount && category) {
      onAddExpense(parseFloat(amount), category, description);
      setOpen(false);
      setAmount('');
      setCategory('');
      setDescription('');
    }
  };

  // POLISH FEATURE 1: Edit expense dialog
  const handleEditExpense = (expense: Expense) => {
    setEditingId(expense.id);
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
    setEditDescription(expense.description);
  };

  const handleSaveEdit = () => {
    // Find and update the expense
    const updatedExpenses = expenses.map(exp => 
      exp.id === editingId
        ? { 
            ...exp, 
            amount: parseFloat(editAmount), 
            category: editCategory, 
            description: editDescription 
          }
        : exp
    );
    // Re-set expenses (would need onUpdateExpenses callback, using delete+add as workaround)
    if (editingId) {
      onDeleteExpense(editingId);
      onAddExpense(parseFloat(editAmount), editCategory, editDescription);
    }
    setEditingId(null);
  };

  const handleViewAllInsights = () => {
    onViewInsights();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={onBackToHome} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <span className="text-gray-900">Weekly Spending</span>
        <div className="w-6" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto pb-24">
        {/* Spending Circle */}
        <div className="flex flex-col items-center mb-12">
          <div 
            className="relative w-48 h-48 mb-4 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={handleViewAllInsights}
          >
            {/* Outer circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#E2E8F0"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#2C7A7B"
                strokeWidth="8"
                fill="none"
                strokeDasharray="553"
                strokeDashoffset={553 - (553 * (totalSpending / 300))}
                strokeLinecap="round"
              />
            </svg>
            {/* Center amount */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-900">${totalSpending.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-gray-500">Total this week</p>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3 mb-6">
          {categories.map((cat) => {
            const total = getCategoryTotal(cat.name);
            const hasExpenses = total > 0;

            return (
              <Card
                key={cat.name}
                onClick={hasExpenses ? () => onViewInsights(cat.name) : undefined}
                className={`p-4 flex items-center justify-between ${
                  hasExpenses ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    hasExpenses ? 'bg-teal-50' : 'bg-gray-100'
                  }`}>
                    <cat.icon className={`w-6 h-6 ${
                      hasExpenses ? 'text-teal-600' : 'text-gray-400'
                    }`} strokeWidth={2} />
                  </div>
                  <span className="text-gray-900">{cat.name}</span>
                </div>
                {hasExpenses ? (
                  <span className="text-gray-900">${total.toFixed(2)}</span>
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </Card>
            );
          })}

          {/* Empty Placeholders */}
          {[1, 2].map((i) => (
            <Card key={`empty-${i}`} className="p-4 flex items-center justify-between opacity-40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <span className="text-gray-300">—</span>
            </Card>
          ))}
        </div>

        {/* Recent Expenses List */}
        {expenses.length > 0 && (
          <div className="mt-8">
            <h3 className="text-gray-900 font-semibold mb-3">Recent Expenses</h3>
            <div className="space-y-2">
              {expenses.map((expense) => (
                <Card key={expense.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm font-medium">{expense.description}</p>
                    <p className="text-gray-500 text-xs">{expense.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 font-semibold">${expense.amount.toFixed(2)}</p>
                    {/* POLISH FEATURE 1: Delete button */}
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {/* POLISH FEATURE 2: Edit button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => handleEditExpense(expense)}
                          className="p-1 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
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
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Hint text */}
        <p className="text-center text-gray-400 mt-6">
          {expenses.length > 0 ? 'Tap on categories to view insights' : 'Add your first expense'}
        </p>
      </div>

      {/* Floating Add Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="absolute bottom-24 right-8 w-14 h-14 bg-teal-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center text-white"
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Add a new expense manually. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category">Category</Label>
              <div className="col-span-3">
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Optional"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddExpense}
              className="bg-teal-600 hover:bg-teal-700"
              disabled={!amount || !category}
            >
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}