import { z } from "zod"

export const tradeSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").max(20, "Symbol too long"),
  side: z.enum(["buy", "sell"], {
    required_error: "Side is required",
  }),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  fees: z.number().min(0, "Fees cannot be negative").default(0),
  executedAt: z.date({
    required_error: "Execution date is required",
  }),
  strategy: z.string().max(100, "Strategy name too long").optional(),
  notes: z.string().max(1000, "Notes too long").optional(),
})

export const portfolioSchema = z.object({
  name: z.string().min(1, "Portfolio name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  initialBalance: z.number().min(0, "Initial balance cannot be negative"),
})

export const positionSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").max(20, "Symbol too long"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  averagePrice: z.number().min(0.01, "Price must be greater than 0"),
  currentPrice: z.number().min(0, "Current price cannot be negative").optional(),
})

export const userRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
})

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type TradeFormData = z.infer<typeof tradeSchema>
export type PortfolioFormData = z.infer<typeof portfolioSchema>
export type PositionFormData = z.infer<typeof positionSchema>
export type UserRegistrationData = z.infer<typeof userRegistrationSchema>
export type UserLoginData = z.infer<typeof userLoginSchema>
