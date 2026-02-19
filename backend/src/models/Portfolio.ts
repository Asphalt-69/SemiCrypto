import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  holdings: Array<{
    ticker: string;
    quantity: number;
    averageCost: number;
    currentPrice: number;
    totalValue: number;
    gainLoss: number;
    gainLossPercent: number;
    lastUpdated: Date;
  }>;
  cash: number;
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSchema = new Schema<IPortfolio>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    holdings: [
      {
        ticker: {
          type: String,
          uppercase: true,
        },
        quantity: {
          type: Number,
          default: 0,
        },
        averageCost: {
          type: Number,
          default: 0,
        },
        currentPrice: {
          type: Number,
          default: 0,
        },
        totalValue: {
          type: Number,
          default: 0,
        },
        gainLoss: {
          type: Number,
          default: 0,
        },
        gainLossPercent: {
          type: Number,
          default: 0,
        },
        lastUpdated: {
          type: Date,
          default: () => new Date(),
        },
      },
    ],
    cash: {
      type: Number,
      default: 10000, // Starting cash
      min: 0,
    },
    totalValue: {
      type: Number,
      default: 10000,
      min: 0,
    },
    totalInvested: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalGainLoss: {
      type: Number,
      default: 0,
    },
    totalGainLossPercent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
portfolioSchema.index({ userId: 1 });

export default mongoose.model<IPortfolio>('Portfolio', portfolioSchema);
