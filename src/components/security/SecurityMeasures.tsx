
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import SecurityMeasuresHeader from "./security-measures/SecurityMeasuresHeader";
import SecurityMeasuresTabs from "./security-measures/SecurityMeasuresTabs";
import SecurityMeasuresFooter from "./security-measures/SecurityMeasuresFooter";

const SecurityMeasures = () => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <SecurityMeasuresHeader />
      </CardHeader>
      <CardContent>
        <SecurityMeasuresTabs />
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <SecurityMeasuresFooter />
      </CardFooter>
    </Card>
  );
};

export default SecurityMeasures;
