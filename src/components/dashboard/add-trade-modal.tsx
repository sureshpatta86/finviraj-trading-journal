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
import { Plus, CalendarDays, Clock, IndianRupee, TrendingUp, Brain, AlertTriangle } from "lucide-react"
import { enhancedTradeSchema, type EnhancedTradeFormData } from "@/lib/validations"
import { useTradingStore } from "@/store/trading"
import { cn } from "@/lib/utils"

interface AddTradeModalProps {
  trigger?: React.ReactNode
  onTradeAdded?: (trade: EnhancedTradeFormData) => void
}

export function AddTradeModal({ trigger, onTradeAdded }: AddTradeModalProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calculatedRisk, setCalculatedRisk] = useState<number>(0)
  const [riskPercentage, setRiskPercentage] = useState<number>(0)
  const { addEnhancedTrade } = useTradingStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<EnhancedTradeFormData>({
    resolver: zodResolver(enhancedTradeSchema),
  })

  // Watch the values that affect risk calculation
  const entryPrice = watch("entryPrice")
  const stopLoss = watch("stopLoss")
  const quantity = watch("quantity")

  // Auto-calculate risk per trade
  useEffect(() => {
    if (entryPrice && stopLoss && quantity) {
      const riskAmount = Math.abs(entryPrice - stopLoss) * quantity
      const percentage = ((Math.abs(entryPrice - stopLoss) / entryPrice) * 100)
      
      setCalculatedRisk(riskAmount)
      setRiskPercentage(percentage)
      setValue("riskPerTrade", riskAmount)
    } else {
      setCalculatedRisk(0)
      setRiskPercentage(0)
      setValue("riskPerTrade", 0)
    }
  }, [entryPrice, stopLoss, quantity, setValue])

  const onSubmit = async (data: EnhancedTradeFormData) => {
    setIsSubmitting(true)
    try {
      // Use the authenticated user's unique ID for proper data isolation
      if (!session?.user?.id) {
        toast.error("User session not found. Please log in again.", {
          duration: 4000,
          position: "top-right",
        })
        return
      }
      
      const userId = session.user.id
      
      // Add to store (this will call the API)
      await addEnhancedTrade(userId, data)
      
      // Show success toast
      toast.success("Trade logged successfully!", {
        duration: 3000,
        position: "top-right",
      })
      
      // Call optional callback
      onTradeAdded?.(data)
      
      // Reset form and close modal
      reset()
      setIsOpen(false)
      
      console.log("Trade added successfully:", data)
    } catch (error) {
      console.error("Error adding trade:", error)
      toast.error("Failed to log trade. Please try again.", {
        duration: 4000,
        position: "top-right",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const getCurrentTime = () => {
    return new Date().toTimeString().slice(0, 5)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Trade
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Log New Trade
          </DialogTitle>
          <DialogDescription>
            Record your trade details, psychology, and setup information for comprehensive analysis.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Trade Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Trade Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="symbol">Symbol *</Label>
                <Textarea
                  id="symbol"
                  placeholder="e.g., NIFTY 14 Aug 24600 CE, BANKNIFTY 15 Aug 50000 PE, AAPL, MSFT"
                  {...register("symbol")}
                  className={cn("min-h-[60px] resize-none", errors.symbol && "border-red-500")}
                  rows={2}
                />
                {errors.symbol && (
                  <p className="text-sm text-red-500">{errors.symbol.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryDate" className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  Entry Date *
                </Label>
                <Input
                  id="entryDate"
                  type="date"
                  defaultValue={getCurrentDate()}
                  {...register("entryDate")}
                  className={cn(errors.entryDate && "border-red-500")}
                />
                {errors.entryDate && (
                  <p className="text-sm text-red-500">{errors.entryDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryTime" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Entry Time *
                </Label>
                <Input
                  id="entryTime"
                  type="time"
                  defaultValue={getCurrentTime()}
                  {...register("entryTime")}
                  className={cn(errors.entryTime && "border-red-500")}
                />
                {errors.entryTime && (
                  <p className="text-sm text-red-500">{errors.entryTime.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select {...register("type")} className={cn(errors.type && "border-red-500")}>
                  <option value="">Select Type</option>
                  <option value="Call">Call</option>
                  <option value="Put">Put</option>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryPrice">Entry Price *</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.01"
                  placeholder="₹0.00"
                  {...register("entryPrice", { valueAsNumber: true })}
                  className={cn(errors.entryPrice && "border-red-500")}
                />
                {errors.entryPrice && (
                  <p className="text-sm text-red-500">{errors.entryPrice.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="1"
                  placeholder="0"
                  {...register("quantity", { valueAsNumber: true })}
                  className={cn(errors.quantity && "border-red-500")}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Risk Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Risk Management
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.01"
                  placeholder="₹0.00"
                  {...register("stopLoss", { valueAsNumber: true })}
                  className={cn(errors.stopLoss && "border-red-500")}
                />
                {errors.stopLoss && (
                  <p className="text-sm text-red-500">{errors.stopLoss.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskPerTrade" className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Risk Per Trade
                </Label>
                <div className="relative">
                  <div className="flex items-center border rounded-md bg-gray-50 overflow-hidden">
                    <span className="px-3 py-2 text-gray-600 border-r bg-gray-100 flex-shrink-0">₹</span>
                    <input
                      id="riskPerTrade"
                      type="text"
                      value={calculatedRisk.toFixed(2)}
                      className="flex-1 px-3 py-2 bg-transparent text-gray-600 outline-none min-w-0"
                      readOnly
                    />
                    <span className="px-2 py-2 text-green-600 font-medium bg-green-50 border-l flex-shrink-0 text-sm">
                      {riskPercentage.toFixed(2)}%
                    </span>
                  </div>
                  <input
                    {...register("riskPerTrade", { valueAsNumber: true })}
                    type="hidden"
                  />
                </div>
                {errors.riskPerTrade && (
                  <p className="text-sm text-red-500">{errors.riskPerTrade.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="followSetup">Follow the Setup *</Label>
                <Select {...register("followSetup")} className={cn(errors.followSetup && "border-red-500")}>
                  <option value="">Select Option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
                {errors.followSetup && (
                  <p className="text-sm text-red-500">{errors.followSetup.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Psychology & Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Psychology & Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mood">Mood *</Label>
                  <Select {...register("mood")} className={cn(errors.mood && "border-red-500")}>
                    <option value="">Select Mood</option>
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

                <div className="space-y-2">
                  <Label htmlFor="mistakes" className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Mistakes
                  </Label>
                  <Select {...register("mistakes")} className={cn(errors.mistakes && "border-red-500")}>
                    <option value="">Select Mistake (if any)</option>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="setup">Setup Description</Label>
                <Textarea
                  id="setup"
                  placeholder="Describe your trading setup, strategy, and reasoning..."
                  rows={3}
                  {...register("setup")}
                  className={cn(errors.setup && "border-red-500")}
                />
                {errors.setup && (
                  <p className="text-sm text-red-500">{errors.setup.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradeNotes">Trade Notes</Label>
                <Textarea
                  id="tradeNotes"
                  placeholder="Additional notes, observations, or lessons learned..."
                  rows={3}
                  {...register("tradeNotes")}
                  className={cn(errors.tradeNotes && "border-red-500")}
                />
                {errors.tradeNotes && (
                  <p className="text-sm text-red-500">{errors.tradeNotes.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubmitting ? "Adding Trade..." : "Add Trade"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
