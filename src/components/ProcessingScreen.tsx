import { motion } from 'motion/react';
import { Progress } from './ui/progress';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Check } from 'lucide-react';
import { useState } from 'react';
import React from 'react';

interface ProcessingScreenProps {
  onSkip: (extractedItems?: Array<{ name: string; amount: number; category: string }>) => void;
}

interface ExtractedItem {
  id: string;
  name: string;
  amount: number;
  category: string;
}

export function ProcessingScreen({ onSkip }: ProcessingScreenProps) {
  const [showItems, setShowItems] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedItems, setEditedItems] = useState<ExtractedItem[]>([
    { id: '1', name: 'Cappuccino', amount: 5.00, category: 'Coffee' },
    { id: '2', name: 'Croissant', amount: 2.50, category: 'Food' },
  ]);

  setTimeout(() => {
    if (!showItems) setShowItems(true);
  }, 2000);

  const handleLooksGood = () => {
    onSkip(editedItems);
  };

  const handleUpdateItem = (id: string, field: 'name' | 'amount' | 'category', value: string | number) => {
    setEditedItems(editedItems.map(item => 
      item.id === id 
        ? { ...item, [field]: value }
        : item
    ));
  };

  return (
    <div className="h-full flex flex-col bg-white px-6 py-8">
      <div className="mb-6">
        <h2 className="text-gray-900 text-center">Processing Receipt</h2>
      </div>

      <div className="flex-1 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[280px] mb-6"
        >
          <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-lg">
            <div className="absolute inset-0 p-6 text-gray-600 opacity-40 font-mono">
              <div className="text-center mb-4">
              </div>
              <div className="space-y-2">
                <div>COFFEE SHOP</div>
                <div className="h-px bg-gray-400 my-2" />
                <div>Cappuccino.....$5.00</div>
                <div>Croissant......$2.50</div>
                <div className="h-px bg-gray-400 my-2" />
                <div>Total.........$7.50</div>
              </div>
            </div>
            <motion.div
              className="absolute inset-x-0 h-1 bg-teal-500 shadow-lg shadow-teal-500/50"
              initial={{ top: 0 }}
              animate={{ top: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        </motion.div>

        {!showItems && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-4"
          >
            <p className="text-gray-900 mb-2">Analyzing your receipt...</p>
            <div className="w-full max-w-[280px] mb-4">
              <Progress value={66} className="h-2" />
            </div>
          </motion.div>
        )}

        {showItems && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[280px] space-y-4"
          >
            <div className="flex items-center gap-2 text-teal-600 mb-3">
              <Check className="w-5 h-5" strokeWidth={2.5} />
              <p>Items extracted</p>
            </div>

            {editedItems.map((item) => (
              <Card key={item.id} className="p-4 bg-gray-50 border-2 border-teal-100">
                <div className="space-y-2 mb-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Item</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.amount}
                        onChange={(e) => handleUpdateItem(item.id, 'amount', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Category</label>
                      <select
                        value={item.category}
                        onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="Food">Food</option>
                        <option value="Coffee">Coffee</option>
                        <option value="Transport">Transport</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Button 
              onClick={handleLooksGood}
              className="w-full bg-teal-600 hover:bg-teal-700 mt-4"
            >
              Looks Good
            </Button>
          </motion.div>
        )}
      </div>

      {!showItems && (
        <div className="flex justify-center gap-2 pb-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-teal-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}