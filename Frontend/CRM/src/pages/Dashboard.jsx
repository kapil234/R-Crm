
 

import React, { useEffect, useState, useMemo, useCallback,useContext } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import SummaryApi from "../common";
import Context from "../context";

function Dashboard() {
  // ================= FETCH =================
  const { leads, deals, followUps, activities, loading } = useContext(Context);

  // ================= MEMOIZED DATA =================

  const {
    formattedLeads,
    formattedDeals,
    totalLeads,
    converted,
    lostLeads,
    totalDeals,
    closedDeals,
    activeDeals,
    totalRevenue,
    totalCommission,
    conversionRate,
    leadStatusData,
    monthlyData,
    agentData
  } = useMemo(() => {

    const formattedLeads =leads.map(l => ({
      stage: l.status || "Lead"
    }));

    const formattedDeals = deals.map(d => ({
      stage: d.stage,
      price: d.price || 0,
      agent: d.agentId?.name || "Unknown",
      createdAt: d.createdAt
    }));

    const totalLeads = formattedLeads.length;
    const converted = formattedLeads.filter(l => l.stage === "Closed").length;
    const lostLeads = formattedLeads.filter(l => l.stage === "Lost").length;

    const totalDeals = formattedDeals.length;
    const closedDeals = formattedDeals.filter(d => d.stage === "Closed").length;
    const activeDeals = totalDeals - closedDeals;

    const totalRevenue = formattedDeals
      .filter(d => d.stage === "Closed")
      .reduce((sum, d) => sum + d.price, 0);

    const totalCommission = totalRevenue * 0.02;

    const conversionRate = totalLeads
      ? ((converted / totalLeads) * 100).toFixed(1)
      : 0;

    const leadStatusData = [
      { name: "New", value: formattedLeads.filter(l => l.stage === "New").length },
      { name: "Qualified", value: formattedLeads.filter(l => l.stage === "Qualified").length },
      { name: "Converted", value: converted },
      { name: "Lost", value: lostLeads }
    ];

    // Monthly
  
    const monthlyMap = {};

formattedDeals.forEach((deal) => {
  if (deal.stage !== "Closed") return;

  const date = deal.createdAt ? new Date(deal.createdAt) : new Date();
  const monthIndex = date.getMonth(); // 👈 key fix
  const monthName = date.toLocaleString("default", { month: "short" });

  if (!monthlyMap[monthIndex]) {
    monthlyMap[monthIndex] = {
      month: monthName,
      monthIndex,
      sales: 0,
      revenue: 0
    };
  }

  monthlyMap[monthIndex].sales += 1;
  monthlyMap[monthIndex].revenue += deal.price;
});

    const monthlyData = Object.values(monthlyMap).sort(
  (a, b) => a.monthIndex - b.monthIndex
);

    // Agent stats
    const agentStats = formattedDeals.reduce((acc, deal) => {
      if (!acc[deal.agent]) acc[deal.agent] = { deals: 0, revenue: 0 };

      acc[deal.agent].deals += 1;

      if (deal.stage === "Closed") {
        acc[deal.agent].revenue += deal.price;
      }

      return acc;
    }, {});

    const agentData = Object.keys(agentStats).map(name => ({
      name,
      deals: agentStats[name].deals,
      revenue: agentStats[name].revenue
    }));

    return {
      formattedLeads,
      formattedDeals,
      totalLeads,
      converted,
      lostLeads,
      totalDeals,
      closedDeals,
      activeDeals,
      totalRevenue,
      totalCommission,
      conversionRate,
      leadStatusData,
      monthlyData,
      agentData
    };

  }, [leads,deals, followUps, activities]);

  // ================= EXPORT =================
  const handleExport = useCallback(() => {
  const doc = new jsPDF();

  // ================= TITLE =================
  doc.setFontSize(18);
  doc.text("CRM Dashboard Report", 14, 20);

  // ================= SUMMARY =================
  autoTable(doc, {
    startY: 30,
    head: [["Metric", "Value"]],
    body: [
      ["Total Leads", totalLeads],
      ["Converted Leads", converted],
      ["Lost Leads", lostLeads],
      ["Conversion Rate", conversionRate + "%"],
      ["Total Deals", totalDeals],
      ["Closed Deals", closedDeals],
      ["Active Deals", activeDeals],
      ["Total Revenue", totalRevenue],
      ["Total Commission", totalCommission],
    ]
  });

  // ================= AGENT PERFORMANCE =================
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Agent", "Deals", "Revenue"]],
    body: agentData.map(a => [
      a.name,
      a.deals,
      a.revenue
    ])
  });

  // ================= MONTHLY DATA =================
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Month", "Sales", "Revenue"]],
    body: monthlyData.map(m => [
      m.month,
      m.sales,
      m.revenue
    ])
  });

  // ================= FOLLOW UPS =================
  

  doc.save("CRM_Full_Report.pdf");

}, [
  totalLeads,
  converted,
  lostLeads,
  totalDeals,
  closedDeals,
  activeDeals,
  totalRevenue,
  totalCommission,
  conversionRate,
  agentData,
  monthlyData,
]);
  const COLORS = ["#6366F1", "#F59E0B", "#22C55E", "#EF4444"];

 if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">CRM Dashboard</h1>
          <p className="text-gray-500 text-sm">Overview</p>
        </div>
        <button onClick={handleExport} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto shadow-md">
          Export
        </button>
      </div>

      {/* ROW 1: STATS - Conversion Rate moved to Leads Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-start">
            <h2 className="text-sm opacity-80">Leads</h2>
            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">{conversionRate}% Rate</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">{totalLeads}</h1>
          <div className="text-[10px] sm:text-xs mt-1">
            <span>Conv: {converted}</span> | <span>Lost: {lostLeads}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-2xl shadow-sm">
          <h2 className="text-sm opacity-80">Deals</h2>
          <h1 className="text-2xl md:text-3xl font-bold">{totalDeals}</h1>
          <div className="text-xs mt-1">Active: {activeDeals} | Closed: {closedDeals}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-5 rounded-2xl shadow-sm sm:col-span-2 md:col-span-1">
          <h2 className="text-sm opacity-80">Revenue</h2>
          <h1 className="text-2xl md:text-3xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</h1>
          <p className="text-xs mt-1">Comm: ₹{(totalCommission / 1000).toFixed(1)}K</p>
        </div>
      </div>

      {/* ROW 2: GRAPHS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="mb-4 font-semibold text-gray-700">Lead Status</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leadStatusData} dataKey="value">
                  {leadStatusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
  <h2 className="mb-4 font-semibold text-gray-700">Revenue vs Sales</h2>
  <div className="h-[250px] w-full"> {/* Added w-full to ensure it respects parent width */}
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={monthlyData} 
        /* 
           Reduced left/right margins so the Y-axis labels 
           don't push the chart outside the mobile screen 
        */
        margin={{ top: 5, right: 5, left: -20, bottom: 5 }} 
      >
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 10 }} 
          minTickGap={5} // Prevents labels from overlapping on small screens
        />
        <YAxis 
          yAxisId="left" 
          tick={{ fontSize: 10 }} 
          width={35} // Fixed width prevents the axis from expanding too much
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          tick={{ fontSize: 10 }} 
          width={35} // Fixed width prevents the axis from expanding too much
        />
        <Tooltip />
        <Legend iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        <Line 
          yAxisId="left" 
          type="monotone" 
          dataKey="sales" 
          stroke="#6366F1" 
          strokeWidth={3} 
          dot={{ r: 3 }} // Smaller dots for mobile
        />
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey="revenue" 
          stroke="#22C55E" 
          strokeWidth={3} 
          dot={{ r: 3 }} // Smaller dots for mobile
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
      </div>

      {/* ROW 3: ACTIVITY - Fixed Table Overflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="font-semibold mb-3">Activity</h2>
          <div className="flex-1 overflow-y-auto max-h-[300px]">
            {/* table-fixed and percentage widths prevent horizontal scroll */}
            <table className="w-full table-fixed border-collapse">
              <thead className="sticky top-0 bg-white z-10 border-b text-gray-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="text-left py-2 w-1/4">Agent</th>
                  <th className="text-left w-1/4">Action</th>
                  <th className="text-left w-1/3">Message</th>
                  <th className="text-right w-1/6">Time</th>
                </tr>
              </thead>
              <tbody className="text-[11px] md:text-sm">
                {activities.map((a) => (
                  <tr key={a._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-gray-700 truncate pr-1">{a.userName}</td>
                    <td className="py-3 text-gray-500 truncate pr-1">{a.action}</td>
                    <td className="py-3 text-gray-600 break-words leading-relaxed pr-2">
                      {a.message}
                    </td>
                    <td className="py-3 text-right text-gray-400">
                      <div className="text-[9px] whitespace-nowrap">
                        {new Date(a.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-[8px]">{new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="font-semibold mb-3">Follow-ups</h2>
          <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3">
            {followUps.length === 0 && <p className="text-gray-400 text-xs italic">No follow-ups today</p>}
            {followUps.map((f, i) => (
              <div key={i} className="flex justify-between items-start gap-3 p-2 bg-gray-50 rounded-lg">
                <span className="text-[11px] text-gray-700 leading-snug">{f.message}</span>
                <span className="text-[9px] text-indigo-500 font-bold whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm">
                  {new Date(f.meta?.nextAction).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AGENT PERFORMANCE */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold mb-3">Agent Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] md:text-sm border-collapse min-w-[300px]">
            <thead className="border-b text-gray-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-center py-2">Deals</th>
                <th className="text-right py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {agentData.map((a, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-700">{a.name}</td>
                  <td className="py-3 text-center text-gray-600">{a.deals}</td>
                  <td className="py-3 text-right font-bold text-green-600">₹{a.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;