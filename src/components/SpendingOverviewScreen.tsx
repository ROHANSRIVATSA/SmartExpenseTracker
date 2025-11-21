import { ChevronLeft, Download, List, MessageCircle, TrendingDown, TrendingUp } from 'lucide-react@0.487.0';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { Expense } from '../types';
import { getTrendMessage, getProgressMessage } from '../utils/coachResponses';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeekData {
  weekNumber: number;
  weekLabel: string;
  total: number;
  topCategory: string;
  expenses: Expense[];
}

interface SpendingOverviewScreenProps {
  onBack: () => void;
  currentWeekExpenses: Expense[];
  previousWeeks?: WeekData[];
}

export function SpendingOverviewScreen({ 
  onBack, 
  currentWeekExpenses,
  previousWeeks = []
}: SpendingOverviewScreenProps) {
  // Calculate current week total
  const currentWeekTotal = currentWeekExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Get top category for current week
  const categoryTotals: { [key: string]: number } = {};
  currentWeekExpenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });
  const currentTopCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  // Get previous week total for comparison
  const previousWeekTotal = previousWeeks[0]?.total || 0;
  const trendMessage = getTrendMessage(currentWeekTotal, previousWeekTotal);
  const isIncrease = currentWeekTotal > previousWeekTotal;

  // Prepare chart data (last 4 weeks including current)
  const chartData = [
    ...previousWeeks.slice(0, 3).reverse().map(week => ({
      week: week.weekLabel,
      amount: week.total,
    })),
    { week: 'This Week', amount: currentWeekTotal }
  ];

  // Calculate total weeks tracked
  const weeksTracked = previousWeeks.length + 1;
  const progressMessage = getProgressMessage(weeksTracked);

  // Calculate monthly total (last 4 weeks)
  const monthlyTotal = currentWeekTotal + previousWeeks.slice(0, 3).reduce((sum, week) => sum + week.total, 0);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <span className="text-gray-900">Spending Overview</span>
        <div className="w-6" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto space-y-6">
        {/* Current Week Card */}
        <Card className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200">
          <h3 className="text-gray-900 mb-4">This Week</h3>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-teal-600" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                ${currentWeekTotal.toFixed(2)}
              </p>
              <p className="text-gray-600 mt-1">Top: {currentTopCategory}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              {isIncrease ? (
                <TrendingUp className="w-5 h-5 text-red-500" strokeWidth={2} />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-500" strokeWidth={2} />
              )}
              <span className={isIncrease ? 'text-red-600' : 'text-green-600'}>
                {trendMessage}
              </span>
            </div>
          </div>

          {/* Mini chart */}
          {chartData.length > 1 && (
            <div className="h-32 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    stroke="#cbd5e1"
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    stroke="#cbd5e1"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#2C7A7B" 
                    strokeWidth={2}
                    dot={{ fill: '#2C7A7B', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Previous Weeks List */}
        {previousWeeks.length > 0 && (
          <div>
            <h3 className="text-gray-900 mb-3">Previous Weeks</h3>
            <div className="space-y-3">
              {previousWeeks.map((week) => (
                <Card 
                  key={week.weekNumber} 
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900">{week.weekLabel}</p>
                      <p className="text-gray-500">Top: {week.topCategory}</p>
                    </div>
                    <p className="text-gray-900">${week.total.toFixed(2)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Insights */}
        {weeksTracked >= 4 && (
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100">
            <h3 className="text-gray-900 mb-3">Last 4 Weeks</h3>
            <p className="text-gray-900 mb-2">
              Total: <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                ${monthlyTotal.toFixed(2)}
              </span>
            </p>
            <p className="text-gray-600">
              Average per week: ${(monthlyTotal / 4).toFixed(2)}
            </p>
          </Card>
        )}

        {/* Coach Insight for Trends */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <p className="text-gray-900" style={{ lineHeight: '1.6' }}>
                {progressMessage}
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-8">
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" strokeWidth={2} />
            Export Data
          </Button>
          <Button variant="outline" className="w-full">
            <List className="w-4 h-4 mr-2" strokeWidth={2} />
            View All Expenses
          </Button>
          <Button onClick={onBack} className="w-full bg-teal-600 hover:bg-teal-700">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
