"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LogOut, CalendarDays, Clock, IndianRupee, TrendingDown, Calculator } from "lucide-react"
import { exitTradeSchema, type ExitTradeFormData } from "@/lib/validations"
import { type EnhancedTrade } from "@/lib/api/enhanced-trades"
import { cn } from "@/lib/utils"

interface ExitTradeModalProps {
  trade: EnhancedTrade
  trigger?: React.ReactNode
  onTradeExited?: (trade: EnhancedTrade) => void
}

export function ExitTradeModal({ trade, trigger, onTradeExited }: ExitTradeModalProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pnlCalculation, setPnlCalculation] = useState<{
    pnl: number
    pnlPercentage: number
    totalValue: number
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ExitTradeFormData>({
    resolver: zodResolver(exitTradeSchema),
    defaultValues: {
      exitDate: new Date().toISOString().split('T')[0],
      exitTime: new Date().toTimeString().slice(0, 5),
    }
  })

  // Watch exit price for PnL calculation
  const exitPrice = watch('exitPrice')

  // Convert trade values to numbers for calculations
  const entryPrice = typeof trade.entryPrice === 'string' ? parseFloat(trade.entryPrice) : trade.entryPrice
  const quantity = typeof trade.quantity === 'string' ? parseInt(trade.quantity) : trade.quantity

  // Calculate PnL when exit price changes
  React.useEffect(() => {
    if (exitPrice && entryPrice && quantity) {
      const pnl = (exitPrice - entryPrice) * quantity
      const pnlPercentage = ((exitPrice - entryPrice) / entryPrice) * 100
      const totalValue = exitPrice * quantity
      
      setPnlCalculation({
        pnl,
        pnlPercentage,
        totalValue
      })
    } else {
      setPnlCalculation(null)
    }
  }, [exitPrice, entryPrice, quantity])

  const onSubmit = async (data: ExitTradeFormData) => {
    if (!session?.user?.id) {
      toast.error("Please sign in to exit trade")
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/trades/enhanced/${trade.id}/exit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          realizedPnl: pnlCalculation?.pnl || 0,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to exit trade')
      }

      const exitedTrade = await response.json()
      
      toast.success("Trade exited and saved to database successfully!", {
        duration: 3000,
        position: "top-right",
      })
      
      // Call the callback to trigger refresh
      onTradeExited?.(exitedTrade)
      
      // Close modal and reset form
      setIsOpen(false)
      reset()
    } catch (error) {
      console.error('Error exiting trade:', error)
      toast.error("Failed to exit trade. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
      <LogOut className="w-4 h-4 mr-2" />
      Exit
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Exit Trade - {trade.symbol}
          </DialogTitle>
          <DialogDescription>
            Complete your trade by entering exit details and calculating your P&L
          </DialogDescription>
        </DialogHeader>

        {/* Trade Summary */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Trade Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Symbol:</span>
                <span className="ml-2 font-medium">{trade.symbol}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2 font-medium">{trade.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Entry Price:</span>
                <span className="ml-2 font-medium">₹{entryPrice.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Quantity:</span>
                <span className="ml-2 font-medium">{quantity}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Entry Value:</span>
                <span className="ml-2 font-medium">₹{(entryPrice * quantity).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Exit Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingDown className="w-5 h-5" />
                Exit Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Exit Date */}
                <div className="space-y-2">
                  <Label htmlFor="exitDate" className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Exit Date *
                  </Label>
                  <Input
                    id="exitDate"
                    type="date"
                    {...register("exitDate")}
                    className={cn(errors.exitDate && "border-red-500")}
                  />
                  {errors.exitDate && (
                    <p className="text-sm text-red-500">{errors.exitDate.message}</p>
                  )}
                </div>

                {/* Exit Time */}
                <div className="space-y-2">
                  <Label htmlFor="exitTime" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Exit Time *
                  </Label>
                  <Input
                    id="exitTime"
                    type="time"
                    {...register("exitTime")}
                    className={cn(errors.exitTime && "border-red-500")}
                  />
                  {errors.exitTime && (
                    <p className="text-sm text-red-500">{errors.exitTime.message}</p>
                  )}
                </div>
              </div>

              {/* Exit Price */}
              <div className="space-y-2">
                <Label htmlFor="exitPrice" className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  Exit Price *
                </Label>
                <Input
                  id="exitPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("exitPrice", { valueAsNumber: true })}
                  className={cn(errors.exitPrice && "border-red-500")}
                />
                {errors.exitPrice && (
                  <p className="text-sm text-red-500">{errors.exitPrice.message}</p>
                )}
              </div>

              {/* P&L Calculation Display */}
              {pnlCalculation && (
                <div className={cn(
                  "p-4 rounded-lg border",
                  pnlCalculation.pnl >= 0 
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" 
                    : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                )}>
                  <div className={cn(
                    "flex items-center gap-2 font-medium",
                    pnlCalculation.pnl >= 0 
                      ? "text-green-700 dark:text-green-300" 
                      : "text-red-700 dark:text-red-300"
                  )}>
                    <Calculator className="w-4 h-4" />
                    <span>P&L Calculation</span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exit Value:</span>
                      <span className="font-medium">₹{pnlCalculation.totalValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Realized P&L:</span>
                      <span className={cn(
                        "font-medium",
                        pnlCalculation.pnl >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {pnlCalculation.pnl >= 0 ? '+' : ''}₹{pnlCalculation.pnl.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">P&L Percentage:</span>
                      <span className={cn(
                        "font-medium",
                        pnlCalculation.pnlPercentage >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {pnlCalculation.pnlPercentage >= 0 ? '+' : ''}{pnlCalculation.pnlPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Exit Notes */}
              <div className="space-y-2">
                <Label htmlFor="exitNotes">Exit Notes</Label>
                <Textarea
                  id="exitNotes"
                  placeholder="Notes about why you exited, lessons learned, etc..."
                  className="min-h-[80px]"
                  {...register("exitNotes")}
                />
                {errors.exitNotes && (
                  <p className="text-sm text-red-500">{errors.exitNotes.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Exiting Trade..." : "Exit Trade"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
