import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, DollarSign, FileText, Building, Link2, Tag, CheckCircle } from "lucide-react";
import { Expense } from "@/types/expense";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface ExpenseDetailDialogProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExpenseDetailDialog = ({ expense, open, onOpenChange }: ExpenseDetailDialogProps) => {
  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Expense Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{expense.description}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-xl font-bold">{formatCurrency(expense.amount)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(expense.date)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <Badge variant={expense.type === "case-specific" ? "default" : "secondary"}>
                      {expense.type === "case-specific" ? "Case-Specific" : "Operating"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge 
                      variant={
                        expense.status === "approved" ? "default" :
                        expense.status === "reimbursed" ? "secondary" : "outline"
                      }
                    >
                      {expense.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {expense.vendor && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Vendor</p>
                      <p className="font-medium">{expense.vendor}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Category Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{expense.category.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Recoverable</p>
                  <Badge variant={expense.category.recoverable ? "default" : "secondary"}>
                    {expense.category.recoverable ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category Type</p>
                  <Badge variant="outline">
                    {expense.category.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Case Link Info */}
          {expense.caseId && expense.caseName && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Linked Case
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Case ID</p>
                    <p className="font-medium">{expense.caseId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Case Name</p>
                    <p className="font-medium">{expense.caseName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Expense ID</p>
                <p className="font-mono text-sm">{expense.id}</p>
              </div>
              {expense.category.recoverable && (
                <div className="p-3 bg-secondary/20 rounded-lg">
                  <p className="text-sm font-medium text-secondary-foreground">
                    💡 This expense is recoverable from the client
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Include in settlement calculations and client billing
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button>
              Edit Expense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDetailDialog;