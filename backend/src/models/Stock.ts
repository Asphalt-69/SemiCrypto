import mongoose, { Schema, Document } from 'mongoose';

export interface IStock extends Document {
  ticker: string;
  name: string;
  type: 'CRYPTO' | 'STOCK' | 'COMMODITY';
  currentPrice: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  marketCap?: number;
  volume: number;
  currency: string;
  exchange?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const stockSchema = new Schema<IStock>(
  {
    ticker: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['CRYPTO', 'STOCK', 'COMMODITY'],
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    previousClose: {
      type: Number,
      required: true,
      min: 0,
    },
    dayHigh: {
      type: Number,
      required: true,
      min: 0,
    },
    dayLow: {
      type: Number,
      required: true,
      min: 0,
    },
    marketCap: {
      type: Number,
    },
    volume: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    exchange: {
      type: String,
    },
    lastUpdated: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for frequently queried fields
stockSchema.index({ ticker: 1 });
stockSchema.index({ type: 1 });
stockSchema.index({ lastUpdated: -1 });

export default mongoose.model<IStock>('Stock', stockSchema);
