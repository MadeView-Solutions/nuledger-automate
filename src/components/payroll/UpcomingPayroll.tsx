
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { CalendarDays } from "lucide-react";

const upcomingPayrolls = [
  {
    payPeriod: "Jul 1 - Jul 15, 2023",
    payDate: "Jul 20, 2023",
    status: "Processing",
    amount: "$24,125.00",
    progress: 75,
  },
  {
    payPeriod: "Jul 16 - Jul 31, 2023",
    payDate: "Aug 5, 2023",
    status: "Scheduled",
    amount: "$24,125.00",
    progress: 25,
  },
  {
    payPeriod: "Aug 1 - Aug 15, 2023",
    payDate: "Aug 20, 2023",
    status: "Pending",
    amount: "$25,200.00",
    progress: 10,
  },
];

const UpcomingPayroll = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
          Upcoming Payroll Runs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pay Period</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingPayrolls.map((payroll) => (
              <TableRow key={payroll.payPeriod}>
                <TableCell>
                  <div className="font-medium">{payroll.payPeriod}</div>
                  <div className="text-xs text-muted-foreground">Pay date: {payroll.payDate}</div>
                </TableCell>
                <TableCell>{payroll.amount}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{payroll.status}</span>
                      <span>{payroll.progress}%</span>
                    </div>
                    <Progress value={payroll.progress} className="h-1.5" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UpcomingPayroll;
