'use client';

import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Navbar Placeholder */}
      <nav className="h-16 border-b border-border bg-card/50 backdrop-blur-sm px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">Profile · Settings</div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Portfolio Value', value: '$0.00', change: '+0%' },
              { label: 'Today\'s Gain', value: '$0.00', change: '+0%' },
              { label: 'Allocation', value: '0%', change: 'Risk: Low' },
              { label: 'Cash Available', value: '$0.00', change: 'Ready' },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg glass-effect-dark border border-border"
              >
                <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-primary mt-2">{card.change}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Chart Placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 p-6 rounded-lg glass-effect-dark border border-border aspect-video flex items-center justify-center"
            >
              <div className="text-center">
                <LayoutDashboard className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground">Performance charts coming soon...</p>
              </div>
            </motion.div>

            {/* Holdings Placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-lg glass-effect-dark border border-border flex items-center justify-center"
            >
              <div className="text-center">
                <p className="text-muted-foreground">Your holdings will appear here</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
