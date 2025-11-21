import { ChevronLeft, Shield, Download, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import React from 'react';

interface PrivacyControlsScreenProps {
  onBack: () => void;
  onClearAllExpenses: () => void;
}

export function PrivacyControlsScreen({ onBack, onClearAllExpenses }: PrivacyControlsScreenProps) {
  const [shareWithFamily, setShareWithFamily] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState(true);

  const handleExportData = () => {
    console.log('Exporting data...');
    alert('Data export feature coming soon!');
  };

  // POLISH FEATURE 3: Clear all data - actually works now
  const handleDeleteAllData = () => {
    onClearAllExpenses();
    alert('All expense data has been cleared.');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <span className="text-gray-900">Privacy & Data</span>
        <div className="w-6" />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto space-y-6">
        {/* Privacy Statement */}
        <Card className="p-6 bg-teal-50 border-2 border-teal-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-gray-900 mb-2">Your data is never shared without your permission</p>
              <p className="text-gray-600">All expense data stays on your device</p>
            </div>
          </div>
        </Card>

        {/* Privacy Toggles */}
        <Card className="p-6 space-y-6">
          <h3 className="text-gray-900 font-semibold">Privacy Settings</h3>

          {/* Share with family/friends */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="share-family" className="text-gray-900 cursor-pointer font-medium">
                Share with family/friends
              </Label>
              <p className="text-gray-500 mt-1 text-sm">
                Allow others to view your spending summary
              </p>
            </div>
            <Switch
              id="share-family"
              checked={shareWithFamily}
              onCheckedChange={setShareWithFamily}
            />
          </div>

          <Separator />

          {/* Notifications */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="notifications" className="text-gray-900 cursor-pointer font-medium">
                Notifications
              </Label>
              <p className="text-gray-500 mt-1 text-sm">
                Receive weekly reflection reminders
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <Separator />

          {/* Category suggestions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Label htmlFor="category-suggestions" className="text-gray-900 cursor-pointer font-medium">
                Category suggestions
              </Label>
              <p className="text-gray-500 mt-1 text-sm">
                AI learns your spending patterns to suggest categories
              </p>
            </div>
            <Switch
              id="category-suggestions"
              checked={categorySuggestions}
              onCheckedChange={setCategorySuggestions}
            />
          </div>
        </Card>

        {/* Data Usage Explanation */}
        <Card className="p-6 bg-gray-50">
          <h3 className="text-gray-900 mb-4 font-semibold">What We Collect</h3>
          <div className="space-y-3">
            <div>
              <p className="text-gray-900 font-medium">What data we collect:</p>
              <p className="text-gray-600 text-sm">Amounts, categories, dates</p>
            </div>
            <div>
              <p className="text-gray-900 font-medium">What we DON'T collect:</p>
              <p className="text-gray-600 text-sm">Merchant names, personal details</p>
            </div>
          </div>
        </Card>

        {/* Data Control Buttons */}
        <div className="space-y-3 pb-8">
          <Button
            onClick={handleExportData}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" strokeWidth={2} />
            Export My Data
          </Button>

          {/* POLISH FEATURE 3: Clear all data button - now works */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" strokeWidth={2} />
                Delete All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your expense data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAllData}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}