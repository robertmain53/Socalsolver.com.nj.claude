/**
 * Advanced Business Intelligence Dashboard
 * Real-time insights, predictive analytics, and executive reporting
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Line, Bar, Pie, Area } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface DashboardProps {
 timeRange: {
 start: Date;
 end: Date;
 };
 refreshInterval?: number;
}

export function BusinessIntelligenceDashboard({ timeRange, refreshInterval = 30000 }: DashboardProps) {
 const [data, setData] = useState<any>({});
 const [loading, setLoading] = useState(true);
 const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'users', 'calculations']);
 const [viewType, setViewType] = useState<'overview' | 'detailed' | 'executive'>('overview');

 useEffect(() => {
 fetchDashboardData();
 
 const interval = setInterval(fetchDashboardData, refreshInterval);
 return () => clearInterval(interval);
 }, [timeRange, refreshInterval]);

 const fetchDashboardData = async () => {
 try {
 setLoading(true);
 const response = await fetch('/api/analytics/dashboard', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 timeRange,
 metrics: selectedMetrics,
 viewType
 })
 });
 
 const dashboardData = await response.json();
 setData(dashboardData);
 } catch (error) {
 console.error('Failed to fetch dashboard data:', error);
 } finally {
 setLoading(false);
 }
 };

 const kpis = useMemo(() => {
 return [
 {
 title: 'Total Revenue',
 value: data.revenue?.total || 0,
 change: data.revenue?.change || 0,
 format: 'currency',
 icon: '💰'
 },
 {
 title: 'Active Users',
 value: data.users?.active || 0,
 change: data.users?.change || 0,
 format: 'number',
 icon: '👥'
 },
 {
 title: 'Calculations/Day',
 value: data.calculations?.perDay || 0,
 change: data.calculations?.change || 0,
 format: 'number',
 icon: '🧮'
 },
 {
 title: 'Conversion Rate',
 value: data.conversions?.rate || 0,
 change: data.conversions?.change || 0,
 format: 'percentage',
 icon: '📈'
 },
 {
 title: 'Avg Revenue/User',
 value: data.revenue?.perUser || 0,
 change: data.revenue?.userChange || 0,
 format: 'currency',
 icon: '💵'
 },
 {
 title: 'Customer LTV',
 value: data.ltv?.value || 0,
 change: data.ltv?.change || 0,
 format: 'currency',
 icon: '⭐'
 }
 ];
 }, [data]);

 if (loading) {
 return (
 <div className="min-h-screen bg-gray-50 flex items-center justify-center">
 <div className="text-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
 <p className="text-gray-600">Loading dashboard data...</p>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-gray-50">
 {/* Header */}
 <header className="bg-white shadow-sm border-b">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex justify-between items-center py-4">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Business Intelligence</h1>
 <p className="text-gray-600">
 {format(timeRange.start, 'MMM d')} - {format(timeRange.end, 'MMM d, yyyy')}
 </p>
 </div>
 
 <div className="flex items-center space-x-4">
 <select
 value={viewType}
 onChange={(e) => setViewType(e.target.value as any)}
 className="border border-gray-300 rounded-lg px-3 py-2"
 >
 <option value="overview">Overview</option>
 <option value="detailed">Detailed</option>
 <option value="executive">Executive</option>
 </select>
 
 <button
 onClick={fetchDashboardData}
 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
 >
 Refresh
 </button>
 </div>
 </div>
 </div>
 </header>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 {/* KPI Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
 {kpis.map((kpi, index) => (
 <KPICard key={index} {...kpi} />
 ))}
 </div>

 {/* Main Charts */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
 {/* Revenue Trend */}
 <ChartCard
 title="Revenue Trend"
 subtitle="Daily revenue over time"
 >
 <RevenueChart data={data.revenueTimeline || []} />
 </ChartCard>

 {/* User Growth */}
 <ChartCard
 title="User Growth"
 subtitle="New users and total active users"
 >
 <UserGrowthChart data={data.userGrowth || []} />
 </ChartCard>
 </div>

 {/* Secondary Charts */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
 {/* Calculator Usage */}
 <ChartCard
 title="Calculator Usage"
 subtitle="Most popular calculators"
 >
 <CalculatorUsageChart data={data.calculatorUsage || []} />
 </ChartCard>

 {/* Conversion Funnel */}
 <ChartCard
 title="Conversion Funnel"
 subtitle="User journey analysis"
 >
 <ConversionFunnelChart data={data.conversionFunnel || []} />
 </ChartCard>

 {/* Geographic Distribution */}
 <ChartCard
 title="Geographic Usage"
 subtitle="Users by country"
 >
 <GeographicChart data={data.geographic || []} />
 </ChartCard>
 </div>

 {/* Detailed Tables */}
 {viewType === 'detailed' && (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <DetailedTable
 title="Top Performing Calculators"
 data={data.topCalculators || []}
 columns={[
 { key: 'name', label: 'Calculator' },
 { key: 'usage', label: 'Usage', format: 'number' },
 { key: 'conversion', label: 'Conversion', format: 'percentage' },
 { key: 'revenue', label: 'Revenue', format: 'currency' }
 ]}
 />

 <DetailedTable
 title="User Segments"
 data={data.userSegments || []}
 columns={[
 { key: 'segment', label: 'Segment' },
 { key: 'users', label: 'Users', format: 'number' },
 { key: 'ltv', label: 'LTV', format: 'currency' },
 { key: 'churn', label: 'Churn', format: 'percentage' }
 ]}
 />
 </div>
 )}

 {/* Executive Summary */}
 {viewType === 'executive' && (
 <ExecutiveSummary data={data.executiveSummary || {}} />
 )}

 {/* Insights and Alerts */}
 <InsightsPanel insights={data.insights || []} alerts={data.alerts || []} />
 </div>
 </div>
 );
}

function KPICard({ title, value, change, format, icon }: any) {
 const formatValue = (val: number, fmt: string) => {
 switch (fmt) {
 case 'currency':
 return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
 case 'percentage':
 return `${val.toFixed(1)}%`;
 case 'number':
 return val.toLocaleString();
 default:
 return val.toString();
 }
 };

 const isPositive = change >= 0;

 return (
 <div className="bg-white rounded-lg shadow p-6">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-gray-600 text-sm">{title}</p>
 <p className="text-2xl font-bold text-gray-900">{formatValue(value, format)}</p>
 </div>
 <div className="text-2xl">{icon}</div>
 </div>
 
 <div className="mt-4 flex items-center">
 <span className={`flex items-center text-sm ${
 isPositive ? 'text-green-600' : 'text-red-600'
 }`}>
 {isPositive ? '↗' : '↘'}
 {Math.abs(change).toFixed(1)}%
 </span>
 <span className="text-gray-500 text-sm ml-2">vs last period</span>
 </div>
 </div>
 );
}

function ChartCard({ title, subtitle, children }: any) {
 return (
 <div className="bg-white rounded-lg shadow">
 <div className="px-6 py-4 border-b">
 <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
 <p className="text-gray-600 text-sm">{subtitle}</p>
 </div>
 <div className="p-6">
 {children}
 </div>
 </div>
 );
}

function RevenueChart({ data }: { data: any[] }) {
 return (
 <div className="h-64">
 <Area
 data={data}
 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
 width={400}
 height={250}
 >
 <XAxis dataKey="date" />
 <YAxis />
 <CartesianGrid strokeDasharray="3 3" />
 <Tooltip />
 <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
 </Area>
 </div>
 );
}

function UserGrowthChart({ data }: { data: any[] }) {
 return (
 <div className="h-64">
 <Line
 data={data}
 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
 width={400}
 height={250}
 >
 <XAxis dataKey="date" />
 <YAxis />
 <CartesianGrid strokeDasharray="3 3" />
 <Tooltip />
 <Line type="monotone" dataKey="newUsers" stroke="#10b981" strokeWidth={2} />
 <Line type="monotone" dataKey="totalUsers" stroke="#3b82f6" strokeWidth={2} />
 </Line>
 </div>
 );
}

function CalculatorUsageChart({ data }: { data: any[] }) {
 return (
 <div className="h-64">
 <Bar
 data={data}
 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
 width={300}
 height={250}
 >
 <XAxis dataKey="name" />
 <YAxis />
 <CartesianGrid strokeDasharray="3 3" />
 <Tooltip />
 <Bar dataKey="usage" fill="#8884d8" />
 </Bar>
 </div>
 );
}

function ConversionFunnelChart({ data }: { data: any[] }) {
 return (
 <div className="h-64">
 <Bar
 data={data}
 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
 width={300}
 height={250}
 >
 <XAxis dataKey="stage" />
 <YAxis />
 <CartesianGrid strokeDasharray="3 3" />
 <Tooltip />
 <Bar dataKey="users" fill="#f59e0b" />
 </Bar>
 </div>
 );
}

function GeographicChart({ data }: { data: any[] }) {
 return (
 <div className="h-64">
 <Pie
 data={data}
 cx={150}
 cy={125}
 labelLine={false}
 outerRadius={80}
 fill="#8884d8"
 dataKey="users"
 width={300}
 height={250}
 >
 <Tooltip />
 </Pie>
 </div>
 );
}

function DetailedTable({ title, data, columns }: any) {
 const formatValue = (value: any, format: string) => {
 switch (format) {
 case 'currency':
 return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
 case 'percentage':
 return `${value.toFixed(1)}%`;
 case 'number':
 return value.toLocaleString();
 default:
 return value;
 }
 };

 return (
 <div className="bg-white rounded-lg shadow">
 <div className="px-6 py-4 border-b">
 <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
 </div>
 <div className="overflow-x-auto">
 <table className="min-w-full divide-y divide-gray-200">
 <thead className="bg-gray-50">
 <tr>
 {columns.map((column: any) => (
 <th
 key={column.key}
 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
 >
 {column.label}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="bg-white divide-y divide-gray-200">
 {data.map((row: any, index: number) => (
 <tr key={index}>
 {columns.map((column: any) => (
 <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
 {formatValue(row[column.key], column.format || 'text')}
 </td>
 ))}
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
}

function ExecutiveSummary({ data }: { data: any }) {
 return (
 <div className="bg-white rounded-lg shadow p-6 mb-8">
 <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h3>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <h4 className="font-medium text-gray-900 mb-2">Key Achievements</h4>
 <ul className="text-sm text-gray-600 space-y-1">
 {data.achievements?.map((achievement: string, index: number) => (
 <li key={index} className="flex items-start">
 <span className="text-green-500 mr-2">✓</span>
 {achievement}
 </li>
 ))}
 </ul>
 </div>
 
 <div>
 <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
 <ul className="text-sm text-gray-600 space-y-1">
 {data.improvements?.map((improvement: string, index: number) => (
 <li key={index} className="flex items-start">
 <span className="text-orange-500 mr-2">⚠</span>
 {improvement}
 </li>
 ))}
 </ul>
 </div>
 </div>
 
 <div className="mt-6 pt-6 border-t">
 <h4 className="font-medium text-gray-900 mb-2">Strategic Recommendations</h4>
 <div className="text-sm text-gray-600">
 {data.recommendations?.map((rec: string, index: number) => (
 <p key={index} className="mb-2">{index + 1}. {rec}</p>
 ))}
 </div>
 </div>
 </div>
 );
}

function InsightsPanel({ insights, alerts }: { insights: any[]; alerts: any[] }) {
 return (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* AI Insights */}
 <div className="bg-white rounded-lg shadow">
 <div className="px-6 py-4 border-b">
 <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
 </div>
 <div className="p-6">
 {insights.length === 0 ? (
 <p className="text-gray-500 text-center py-8">No insights available</p>
 ) : (
 <div className="space-y-4">
 {insights.map((insight, index) => (
 <div key={index} className="border-l-4 border-blue-500 pl-4">
 <h4 className="font-medium text-gray-900">{insight.title}</h4>
 <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
 <div className="mt-2 flex items-center text-xs text-gray-500">
 <span>Confidence: {insight.confidence}%</span>
 <span className="mx-2">•</span>
 <span>Impact: {insight.impact}</span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>

 {/* Alerts */}
 <div className="bg-white rounded-lg shadow">
 <div className="px-6 py-4 border-b">
 <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
 </div>
 <div className="p-6">
 {alerts.length === 0 ? (
 <p className="text-gray-500 text-center py-8">No active alerts</p>
 ) : (
 <div className="space-y-4">
 {alerts.map((alert, index) => (
 <div key={index} className={`border-l-4 pl-4 ${
 alert.severity === 'high' ? 'border-red-500' :
 alert.severity === 'medium' ? 'border-orange-500' :
 'border-yellow-500'
 }`}>
 <h4 className="font-medium text-gray-900">{alert.title}</h4>
 <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
 <div className="mt-2 flex items-center text-xs text-gray-500">
 <span>Triggered: {alert.triggeredAt}</span>
 <span className="mx-2">•</span>
 <span className="capitalize">{alert.severity} priority</span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
