
import React from "react";
import SmartFormulaGenerator from "@/components/ai/SmartFormulaGenerator";
import PayrollAutomation from "@/components/payroll/PayrollAutomation";
import FinanceChatbot from "@/components/chatbot/FinanceChatbot";
import IntegrationsSummary from "@/components/integrations/IntegrationsSummary";

const AIFeaturesSection = () => {
  return (
    <>
      <SmartFormulaGenerator />
      <PayrollAutomation />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <FinanceChatbot />
        <IntegrationsSummary />
      </div>
    </>
  );
};

export default AIFeaturesSection;
