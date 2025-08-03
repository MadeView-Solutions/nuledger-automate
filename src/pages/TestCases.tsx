import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TestCaseGenerator from "@/components/testing/TestCaseGenerator";

const TestCases = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4">
        <TestCaseGenerator />
      </div>
    </DashboardLayout>
  );
};

export default TestCases;