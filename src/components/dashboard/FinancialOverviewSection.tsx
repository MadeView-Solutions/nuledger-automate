
import React from "react";
import Stats from "@/components/dashboard/Stats";
import RecentActivity from "@/components/dashboard/RecentActivity";

const FinancialOverviewSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <div className="lg:col-span-2">
        <Stats />
      </div>
      <div>
        <RecentActivity />
      </div>
    </div>
  );
};

export default FinancialOverviewSection;
