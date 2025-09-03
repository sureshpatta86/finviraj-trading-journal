"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
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
import { Edit2, CalendarDays, Clock, IndianRupee, TrendingUp, Brain, AlertTriangle } from "lucide-react"
import { enhancedTradeSchema, type EnhancedTradeFormData } from "@/lib/validations"
import { type EnhancedTrade } from "@/lib/api/enhanced-trades"
import { cn } from "@/lib/utils"

interface EditTradeModalProps {
  trade: EnhancedTrade
  trigger?: React.ReactNode
  onTradeUpdated?: (trade: EnhancedTrade) => void
}

export function EditTradeModal({ trade, trigger, onTradeUpdated }: EditTradeModalProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calculatedRisk, setCalculatedRisk] = useState<number>(0)
  const [riskPercentage, setRiskPercentage] = useState<number>(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<EnhancedTradeFormData>({
    resolver: zodResolver(enhancedTradeSchema),
    defaultValues: trade ? {
      symbol: trade.symbol,
      entryDate: trade.entryDate,
      entryTime: trade.entryTime,
      type: trade.type,
      entryPrice: trade.entryPrice,
      quantity: trade.quantity,
      stopLoss: trade.stopLoss,
      riskPerTrade: trade.riskPerTrade,
      followSetup: trade.followSetup,
      mood: trade.mood,
      tradeNotes: trade.tradeNotes,
      setup: trade.setup,
      mistakes: trade.mistakes,
    } : {}
  })

  // Watch form values for calculations
  const watchedValues = watch()
  const { entryPrice, stopLoss, quantity } = watchedValues

  // Calculate risk when relevant fields change
  useEffect(() => {
    if (entryPrice && stopLoss && quantity) {
      const risk = Math.abs((entryPrice - stopLoss) * quantity)
      setCalculatedRisk(risk)
      
      // Assuming portfolio balance of ₹100,000 for percentage calculation
      const portfolioValue = 100000
      const riskPercent = (risk / portfolioValue) * 100
      setRiskPercentage(riskPercent)
    }
  }, [entryPrice, stopLoss, quantity])

  const onSubmit = async (data: EnhancedTradeFormData) => {
    if (!session?.user?.id) {
      toast.error("Please sign in to update trade")
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/trades/enhanced/${trade.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update trade')
      }

      const updatedTrade = await response.json()
      
      toast.success("Trade updated successfully!")
      onTradeUpdated?.(updatedTrade)
      setIsOpen(false)
      reset()
    } catch (error) {
      console.error('Error updating trade:', error)
      toast.error("Failed to update trade. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Edit2 className="w-4 h-4 mr-2" />
      Edit
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="w-5 h-5" />
            Edit Trade - {trade?.symbol}
          </DialogTitle>
          <DialogDescription>
            Update your trade details and trading psychology notes
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Trade Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5" />
                Trade Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Symbol */}
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol/Strike *</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., NIFTY 19000 CE"
                    {...register("symbol")}
                    className={cn(errors.symbol && "border-red-500")}
                  />
                  {errors.symbol && (
                    <p className="text-sm text-red-500">{errors.symbol.message}</p>
                  )}
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select {...register("type")}>
                    <option value="">Select type</option>
                    <option value="Call">Call</option>
                    <option value="Put">Put</option>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-500">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Entry Date */}
                <div className="space-y-2">
                  <Label htmlFor="entryDate" className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Entry Date *
                  </Label>
                  <Input
                    id="entryDate"
                    type="date"
                    {...register("entryDate")}
                    className={cn(errors.entryDate && "border-red-500")}
                  />
                  {errors.entryDate && (
                    <p className="text-sm text-red-500">{errors.entryDate.message}</p>
                  )}
                </div>

                {/* Entry Time */}
                <div className="space-y-2">
                  <Label htmlFor="entryTime" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Entry Time *
                  </Label>
                  <Input
                    id="entryTime"
                    type="time"
                    {...register("entryTime")}
                    className={cn(errors.entryTime && "border-red-500")}
                  />
                  {errors.entryTime && (
                    <p className="text-sm text-red-500">{errors.entryTime.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Entry Price */}
                <div className="space-y-2">
                  <Label htmlFor="entryPrice" className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4" />
                    Entry Price *
                  </Label>
                  <Input
                    id="entryPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("entryPrice", { valueAsNumber: true })}
                    className={cn(errors.entryPrice && "border-red-500")}
                  />
                  {errors.entryPrice && (
                    <p className="text-sm text-red-500">{errors.entryPrice.message}</p>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...register("quantity", { valueAsNumber: true })}
                    className={cn(errors.quantity && "border-red-500")}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-500">{errors.quantity.message}</p>
                  )}
                </div>

                {/* Stop Loss */}
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss</Label>
                  <Input
                    id="stopLoss"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("stopLoss", { valueAsNumber: true })}
                    className={cn(errors.stopLoss && "border-red-500")}
                  />
                  {errors.stopLoss && (
                    <p className="text-sm text-red-500">{errors.stopLoss.message}</p>
                  )}
                </div>
              </div>

              {/* Risk Calculation Display */}
              {calculatedRisk > 0 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Risk Calculation</span>
                  </div>
                  <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                    <p>Risk per trade: ₹{calculatedRisk.toFixed(2)}</p>
                    <p>Risk percentage: {riskPercentage.toFixed(2)}% of portfolio</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="riskPerTrade">Risk Per Trade (₹)</Label>
                <Input
                  id="riskPerTrade"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("riskPerTrade", { valueAsNumber: true })}
                  className={cn(errors.riskPerTrade && "border-red-500")}
                />
                {errors.riskPerTrade && (
                  <p className="text-sm text-red-500">{errors.riskPerTrade.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Trading Psychology Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5" />
                Trading Psychology
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Follow Setup */}
                <div className="space-y-2">
                  <Label htmlFor="followSetup">Did you follow your setup? *</Label>
                  <Select {...register("followSetup")}>
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                  {errors.followSetup && (
                    <p className="text-sm text-red-500">{errors.followSetup.message}</p>
                  )}
                </div>

                {/* Mood */}
                <div className="space-y-2">
                  <Label htmlFor="mood">Mood before trade *</Label>
                  <Select {...register("mood")}>
                    <option value="">Select mood</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Calm">Calm</option>
                    <option value="Anxious">Anxious</option>
                    <option value="Confident">Confident</option>
                    <option value="Panicked">Panicked</option>
                  </Select>
                  {errors.mood && (
                    <p className="text-sm text-red-500">{errors.mood.message}</p>
                  )}
                </div>
              </div>

              {/* Mistakes */}
              <div className="space-y-2">
                <Label htmlFor="mistakes">Mistakes (if any)</Label>
                <Select {...register("mistakes")}>
                  <option value="">Select mistake</option>
                  <option value="Emotional decision">Emotional decision</option>
                  <option value="FOMO">FOMO</option>
                  <option value="Over trading">Over trading</option>
                  <option value="Poor Risk to reward">Poor Risk to reward</option>
                  <option value="None">None</option>
                </Select>
                {errors.mistakes && (
                  <p className="text-sm text-red-500">{errors.mistakes.message}</p>
                )}
              </div>

              {/* Setup */}
              <div className="space-y-2">
                <Label htmlFor="setup">Setup Description</Label>
                <Textarea
                  id="setup"
                  placeholder="Describe your trading setup and rationale..."
                  className="min-h-[80px]"
                  {...register("setup")}
                />
                {errors.setup && (
                  <p className="text-sm text-red-500">{errors.setup.message}</p>
                )}
              </div>

              {/* Trade Notes */}
              <div className="space-y-2">
                <Label htmlFor="tradeNotes">Trade Notes</Label>
                <Textarea
                  id="tradeNotes"
                  placeholder="Additional notes about this trade..."
                  className="min-h-[80px]"
                  {...register("tradeNotes")}
                />
                {errors.tradeNotes && (
                  <p className="text-sm text-red-500">{errors.tradeNotes.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Trade"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
