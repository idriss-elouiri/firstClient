import React from "react";
import CostAndProfitReport from "./Report";
import DistributionManagement from "./DistributionManagement";
import DistributionReport from "./DistributionReport";
import ProfitAnalysis from "./ProfitAnalysis";
import UnpaidClientsReport from "./UnpaidClientsReport";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">لوحة التحكم</h1>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4 space-y-6">
        {/* Section: Cost and Profit Report */}
        <section className="bg-white p-4 rounded-lg shadow-md">
          <CostAndProfitReport />
        </section>

        {/* Section: Distribution Management */}
    
        <section className="bg-white p-4 rounded-lg shadow-md">
          <UnpaidClientsReport />
        </section>

        {/* Section: Distribution Report */}
        <section className="bg-white p-4 rounded-lg shadow-md">
          <DistributionReport />
        </section>

        {/* Section: Profit Analysis */}
        <section className="bg-white p-4 rounded-lg shadow-md">
          <ProfitAnalysis />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
