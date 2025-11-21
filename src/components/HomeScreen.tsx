import { Menu, Coffee, UtensilsCrossed, Car, Settings, User, Bell, HelpCircle, Shield, BarChart3, Calendar, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { useState } from 'react';
import type { Expense } from '../types';
import React from 'react';

interface HomeScreenProps {
  onScanReceipt: () => void;
  expenses: Expense[];
  onCategoryClick: (category: string) => void;
  onViewWeeklySummary: () => void;
  onViewPrivacy: () => void;
  onViewOverview: () => void;
  onAddExpense: (amount: number, category: string, description: string) => void;
}

export function HomeScreen({ 
  onScanReceipt, 
  expenses, 
  onCategoryClick,
  onViewWeeklySummary,
  onViewPrivacy,
  onViewOverview,
  onAddExpense
}: HomeScreenProps) {
  const [openAdd, setOpenAdd] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Calculate totals by category
  const getCategoryTotal = (categoryName: string): number => {
    return expenses
      .filter(expense => expense.category === categoryName)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const categories = [
    { name: 'Food', icon: UtensilsCrossed },
    { name: 'Coffee', icon: Coffee },
    { name: 'Transport', icon: Car },
  ];

  const menuItems = [
    { icon: Calendar, label: 'Weekly Reflection', description: 'Review your week', onClick: onViewWeeklySummary },
    { icon: BarChart3, label: 'Spending Overview', description: 'View trends and history', onClick: onViewOverview },
    { icon: Shield, label: 'Privacy & Data', description: 'Control your data', onClick: onViewPrivacy },
    { icon: User, label: 'Profile', description: 'View and edit your profile', onClick: null },
    { icon: Settings, label: 'Settings', description: 'App preferences', onClick: null },
    { icon: Bell, label: 'Notifications', description: 'Manage alerts', onClick: null },
    { icon: HelpCircle, label: 'Help & Support', description: 'Get assistance', onClick: null },
  ];

  const handleAddExpense = () => {
    if (amount && category) {
      onAddExpense(parseFloat(amount), category, description);
      setOpenAdd(false);
      setAmount('');
      setCategory('');
      setDescription('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Manage your expense tracker settings
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-start gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  onClick={item.onClick || undefined}
                  disabled={!item.onClick}
                >
                  <item.icon className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <div className="flex-1">
                    <div className="text-gray-900">{item.label}</div>
                    <div className="text-gray-500">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="space-y-2">
              <p className="text-gray-500 px-3">Version 1.0.0</p>
              <p className="text-gray-400 px-3">Mid-Semester Prototype</p>
            </div>
          </SheetContent>
        </Sheet>
        <span className="text-gray-900">Expense Tracker</span>
        <div className="w-6" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Scan Button */}
        <div className="mb-16">
          <button
            onClick={onScanReceipt}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 flex flex-col items-center justify-center text-white"
          >
            <svg
              className="w-16 h-16 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Scan Receipt</span>
          </button>
        </div>

        {/* Category List */}
        <div className="w-full space-y-3">
          {categories.map((cat) => {
            const total = getCategoryTotal(cat.name);
            const hasExpenses = total > 0;
            
            return (
              <Card 
                key={cat.name} 
                onClick={() => hasExpenses && onCategoryClick(cat.name)}
                className={`p-4 flex items-center justify-between transition-shadow ${
                  hasExpenses ? 'cursor-pointer hover:shadow-md' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    hasExpenses ? 'bg-teal-50' : 'bg-gray-100'
                  }`}>
                    <cat.icon className={`w-5 h-5 ${
                      hasExpenses ? 'text-teal-600' : 'text-gray-400'
                    }`} strokeWidth={2} />
                  </div>
                  <span className="text-gray-900">{cat.name}</span>
                </div>
                <span className={hasExpenses ? 'text-gray-900' : 'text-gray-400'}>
                  {hasExpenses ? `$${total.toFixed(2)}` : '—'}
                </span>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Navigation Hint */}
      <div className="px-6 py-3 text-center text-gray-400">
        {expenses.length > 0 ? 'Tap categories to view insights' : 'Tap the button to scan your first receipt'}
      </div>

      {/* Floating Add Button */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
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
            <Button variant="outline" onClick={() => setOpenAdd(false)}>
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