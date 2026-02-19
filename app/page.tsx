'use client';

import Link from 'next/link';
import {
  Zap,
  TrendingUp,
  MessageCircle,
  Lock,
  ArrowRight,
  BarChart3,
  Smartphone,
  Globe,
  Flame,
  CheckCircle,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated Background with Gradient Mesh */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-15" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-15" />
        <div className="absolute inset-0 backdrop-blur-[100px] bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <motion.div
            className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-6 h-6 text-blue-500" />
            SemiCrypto
          </motion.div>

          <motion.div className="hidden md:flex gap-8 items-center text-sm">
            <Link href="#features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#testimonials" className="hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="#faq" className="hover:text-primary transition-colors">
              FAQ
            </Link>
          </motion.div>

          <div className="flex gap-3">
            <Link href="/login">
              <button className="px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors text-sm font-medium">
                Login
              </button>
            </Link>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-gradient-primary text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm font-medium"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
              <p className="text-sm font-medium text-blue-400 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Join 50,000+ traders worldwide
              </p>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Trade Smarter,
            </span>
            <br />
            <span className="text-foreground">Earn Better</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Premium fintech platform with real-time insights, advanced charting, AI-powered analysis,
            and seamless portfolio management. Start trading with confidence.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg bg-gradient-primary text-white font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Start Trading Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="#features">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg border border-blue-500/30 text-foreground hover:bg-blue-500/10 transition-all font-semibold cursor-pointer"
              >
                Explore Features
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-6 mb-16 text-center"
          >
            {[
              { number: '50K+', label: 'Active Traders' },
              { number: '$2.5B+', label: 'Trading Volume' },
              { number: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="p-4">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {stat.number}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Hero Dashboard Preview */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl overflow-hidden border border-blue-500/20 shadow-2xl shadow-blue-500/10"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-cyan-900/20" />
            <div className="relative p-8 md:p-12 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Portfolio Value', value: '$245,832', change: '+12.5%' },
                  { label: 'Today\'s Gain', value: '$4,285', change: '+2.1%' },
                  { label: 'Win Rate', value: '78%', change: '+5.3%' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-2xl font-bold mt-2">{item.value}</p>
                    <p className="text-sm text-green-400 mt-1">{item.change}</p>
                  </div>
                ))}
              </div>

              {/* Chart Preview */}
              <div className="mt-8 h-48 rounded-lg bg-gradient-to-b from-blue-900/20 to-transparent flex items-center justify-center border border-white/5">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Advanced Chart Analytics</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Powerful Features for <span className="bg-gradient-primary bg-clip-text text-transparent">Smart Traders</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to trade with confidence and manage your portfolio effectively
            </p>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: TrendingUp,
                title: 'Real-Time Trading',
                description: 'Lightning-fast execution with live price updates and millisecond latency',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: BarChart3,
                title: 'Advanced Charts',
                description: 'Professional-grade technical analysis with 50+ indicators',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: Lock,
                title: 'Bank-Grade Security',
                description: 'Military-grade encryption and 2FA protection for your account',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: MessageCircle,
                title: 'Community Chat',
                description: 'Connect with 50K+ traders and share insights in real-time',
                color: 'from-yellow-500 to-orange-500',
              },
              {
                icon: Smartphone,
                title: 'Mobile Trading',
                description: 'Full-featured native apps for iOS and Android',
                color: 'from-red-500 to-pink-500',
              },
              {
                icon: Globe,
                title: 'Global Markets',
                description: 'Access crypto, stocks, and commodities 24/7',
                color: 'from-indigo-500 to-blue-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)' }}
                className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur border border-white/10 hover:border-blue-500/30 transition-all group"
              >
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-full h-full text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Highlight */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="grid md:grid-cols-2 gap-12 items-center rounded-2xl p-12 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 backdrop-blur"
          >
            <div>
              <h3 className="text-3xl font-bold mb-6">AI-Powered Analysis</h3>
              <ul className="space-y-4">
                {[
                  'Pattern recognition for market opportunities',
                  'Sentiment analysis from social media',
                  'Risk assessment and alerts',
                  'Portfolio optimization suggestions',
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-3 items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">{item}</span>
                  </motion.div>
                ))}
              </ul>
            </div>
            <motion.div
              className="h-48 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center border border-white/10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Flame className="w-16 h-16 text-blue-400 opacity-50" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Simple, Transparent <span className="bg-gradient-primary bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for your trading style
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Starter',
                price: '$0',
                description: 'Perfect for beginners',
                features: ['Up to 10 trades/month', 'Basic charts', 'Community access', 'Mobile app'],
                highlighted: false,
              },
              {
                name: 'Pro',
                price: '$29',
                description: 'For active traders',
                features: [
                  'Unlimited trades',
                  'Advanced charts & indicators',
                  'AI analysis',
                  'Priority support',
                  'API access',
                  'Custom alerts',
                ],
                highlighted: true,
              },
              {
                name: 'Elite',
                price: '$99',
                description: 'For professionals',
                features: [
                  'Everything in Pro',
                  'Advanced charting engine',
                  'Dedicated account manager',
                  'Custom integrations',
                  'Backtesting tools',
                  'Advanced reporting',
                ],
                highlighted: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className={`relative p-8 rounded-2xl backdrop-blur border transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-blue-400/50 shadow-2xl shadow-blue-500/20'
                    : 'bg-white/5 border-white/10 hover:border-blue-500/30'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-primary text-white text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-primary text-white hover:shadow-lg hover:shadow-blue-500/50'
                      : 'border border-blue-500/30 text-foreground hover:bg-blue-500/10'
                  }`}
                >
                  Get Started
                </motion.button>

                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      className="flex gap-3 items-center text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Loved by <span className="bg-gradient-primary bg-clip-text text-transparent">Traders Worldwide</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what successful traders have to say about SemiCrypto
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Alex Johnson',
                role: 'Professional Trader',
                content:
                  'SemiCrypto has completely transformed my trading strategy. The AI analysis is incredibly accurate.',
                avatar: '👨‍💼',
              },
              {
                name: 'Sarah Chen',
                role: 'Portfolio Manager',
                content:
                  'The advanced charting tools and real-time market data are unmatched. Best platform I\'ve used.',
                avatar: '👩‍💼',
              },
              {
                name: 'Michael Rodriguez',
                role: 'Day Trader',
                content:
                  'Fast execution, low fees, and amazing community. Everything you need in one platform.',
                avatar: '👨‍💻',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur border border-white/10 hover:border-blue-500/30 transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">{testimonial.avatar}</span>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ⭐
                    </span>
                  ))}
                </div>

                <p className="text-muted-foreground italic">&quot;{testimonial.content}&quot;</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Frequently Asked <span className="bg-gradient-primary bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Get answers to common questions about SemiCrypto
            </p>
          </motion.div>

          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                question: 'Is SemiCrypto safe to use?',
                answer:
                  'Yes, we use military-grade encryption, 2FA authentication, and are regulated by financial authorities. Your funds and data are completely secure.',
              },
              {
                question: 'What cryptocurrencies can I trade?',
                answer:
                  'We support 500+ cryptocurrencies including Bitcoin, Ethereum, and all major altcoins. You can also trade stocks and commodities.',
              },
              {
                question: 'Are there any hidden fees?',
                answer:
                  'No hidden fees ever. Trading fees start at 0.1% and decrease with volume. See our pricing page for detailed breakdown.',
              },
              {
                question: 'Can I use SemiCrypto on mobile?',
                answer:
                  'Absolutely. We have full-featured native apps for iOS and Android with all the same features as the web platform.',
              },
            ].map((faq, index) => (
              <motion.details
                key={index}
                variants={itemVariants}
                className="group p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur hover:border-blue-500/30 transition-all cursor-pointer"
              >
                <summary className="flex items-center justify-between cursor-pointer font-semibold">
                  <span>{faq.question}</span>
                  <span className="transition-transform group-open:rotate-180">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </summary>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 text-muted-foreground"
                >
                  {faq.answer}
                </motion.div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center p-16 rounded-3xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

          <motion.div className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to Transform Your Trading?</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join 50,000+ traders who are already making smarter trading decisions with SemiCrypto.
              Start free today, no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-lg bg-gradient-primary text-white font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="#features">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-lg border border-blue-500/50 text-foreground hover:bg-blue-500/10 font-semibold cursor-pointer"
                >
                  View Demo
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                SemiCrypto
              </h4>
              <p className="text-sm text-muted-foreground">Premium fintech trading for everyone</p>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Security', 'Roadmap'],
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Careers', 'Contact'],
              },
              {
                title: 'Legal',
                links: ['Privacy', 'Terms', 'Cookies', 'Compliance'],
              },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-bold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">&copy; 2026 SemiCrypto. All rights reserved.</p>
              <div className="flex gap-4">
                {[
                  { icon: Twitter, href: '#' },
                  { icon: Github, href: '#' },
                  { icon: Linkedin, href: '#' },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    whileHover={{ scale: 1.2, color: '#3b82f6' }}
                    className="text-muted-foreground hover:text-blue-500 transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
