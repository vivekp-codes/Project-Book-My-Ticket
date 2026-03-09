import { useEffect, useState } from "react";
import API from "../../../API/Api";
import DashboardLayout from "../../../Layouts/DashboardLayout";
import CountUp from "react-countup";
import AdminFooter from "../../../Components/Footer/AdminFooter";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import DarkCard from "../../../Components/DarkCard/DarkCard";

export default function AdminDashboard() {

    const [analytics, setAnalytics] = useState({});
    const now = new Date();

    const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
    const [selectedWeek, setSelectedWeek] = useState(
        Math.ceil(now.getDate() / 7)
    );

    useEffect(() => {
        fetchAnalytics();
    }, [selectedMonth, selectedWeek]);

    const fetchAnalytics = async () => {
        try {
            const res = await API.get(
                `/dashboard/stats?month=${selectedMonth}&week=${selectedWeek}`
            );
            setAnalytics(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const monthPercentageChange =
        analytics.monthRevenue && analytics.lastMonthRevenue
            ? (
                ((analytics.monthRevenue - analytics.lastMonthRevenue) /
                    analytics.lastMonthRevenue) *
                100
            ).toFixed(1)
            : 0;

    const weekPercentage =
        analytics.lastWeekRevenue > 0
            ? (
                ((analytics.weekRevenue - analytics.lastWeekRevenue) /
                    analytics.lastWeekRevenue) *
                100
            ).toFixed(1)
            : 0;



    const getWeeksInMonth = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return Math.ceil(daysInMonth / 7);
    };

    const getWeekDateRange = () => {
        const year = new Date().getFullYear();
        const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();

        const startDay = (selectedWeek - 1) * 7 + 1;
        const endDay = Math.min(selectedWeek * 7, daysInMonth);

        const start = new Date(year, selectedMonth, startDay);
        const end = new Date(year, selectedMonth, endDay);

        return `${start.getDate()} ${start.toLocaleString("default", {
            month: "short",
        })} - ${end.getDate()} ${end.toLocaleString("default", {
            month: "short",
        })}`;
    };

    useEffect(() => {
        const year = new Date().getFullYear();
        const totalWeeks = getWeeksInMonth(year, selectedMonth);

        if (selectedWeek > totalWeeks) {
            setSelectedWeek(totalWeeks);
        }
    }, [selectedMonth]);



    const format = (num) => num?.toLocaleString("en-IN") || 0;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-6">

                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>


                <div className="bg-[#1f2937] text-white p-8 rounded-3xl shadow-2xl space-y-8 mb-6">


                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

                        <div>
                            <h1 className="text-3xl font-bold">
                                Revenue Performance Overview
                            </h1>
                            <p className="text-gray-400 mt-2 ">
                                Track ticket sales performance and revenue growth.
                                Compare weekly trends and monitor overall platform earnings.
                            </p>
                        </div>



                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        <DarkCard
                            title="Total Tickets"
                            value={analytics.totalTickets || 0}
                            gradient="from-red-500/20 via-rose-500/10 to-black/60"
                            border="border-red-400/40"
                        />

                        <DarkCard
                            title="Sold Tickets"
                            value={analytics.totalSoldTickets || 0}
                            gradient="from-blue-500/20 via-cyan-400/10 to-black/60"
                            border="border-blue-400/40"
                        />

                        <DarkCard
                            title="Total Bookings"
                            value={analytics.totalBookings || 0}
                            gradient="from-orange-400/20 via-yellow-300/10 to-black/60"
                            border="border-amber-300/40"
                        />

                        <DarkCard
                            title="Revenue Earned"
                            value={analytics.actualRevenue || 0}
                            isCurrency
                            gradient="from-emerald-400/20 via-green-300/10 to-black/60"
                            border="border-emerald-400/40"
                        />

                    </div>


                    <div className="space-y-4">

                        <div>
                            <h2 className="text-2xl font-semibold">Overall Revenue</h2>
                            <p className="text-gray-400 text-sm mt-1">
                                Monthly revenue distribution across all events.
                                Analyze sales momentum and financial growth trends.
                            </p>
                        </div>

                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={analytics.monthlyChart || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#111827",
                                        border: "none",
                                        borderRadius: "12px",
                                        color: "#ffffff"
                                    }}
                                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                                />
                                <Bar
                                    dataKey="revenue"
                                    fill="#ffffff"
                                    radius={[8, 8, 0, 0]}
                                    isAnimationActive={true}
                                    animationDuration={1200}
                                    animationEasing="ease-out"
                                />
                            </BarChart>
                        </ResponsiveContainer>

                    </div>

                </div>


                <div className="bg-[#1f2937] text-white p-8 rounded-3xl shadow-xl space-y-8 mb-6">


                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

                        <div>
                            <h2 className="text-2xl font-bold">
                                Monthly Revenue Analytics
                            </h2>
                            <p className="text-gray-400 mt-2 ">
                                Analyze revenue and ticket sales performance for the selected month.
                                Compare growth with previous month trends.
                            </p>
                        </div>


                        <div
                            className={`text-sm font-semibold px-4 py-2 rounded-full w-fit
            ${monthPercentageChange >= 0
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                        >
                            {monthPercentageChange >= 0 ? "+" : ""}
                            {monthPercentageChange}% vs previous month
                        </div>
                    </div>


                    <div className="flex justify-end">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="bg-white/10 text-white border border-gray-600 rounded-lg px-4 py-2"
                        >
                            {Array.from({ length: 12 }).map((_, i) => (
                                <option key={i} value={i} className="text-black">
                                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className="flex flex-col lg:flex-row gap-8">


                        <div className="w-full lg:w-[70%] h-72 min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.dailyChart || []}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#374151"
                                    />

                                    <XAxis
                                        dataKey="day"
                                        stroke="#ffffff"
                                        tick={{ fill: "#ffffff" }}
                                    />

                                    <YAxis
                                        stroke="#ffffff"
                                        tick={{ fill: "#ffffff" }}
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#000000",
                                            border: "none",
                                            borderRadius: "10px",
                                            color: "#ffffff",
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.6)"
                                        }}
                                        labelStyle={{ color: "#ffffff" }}
                                        itemStyle={{ color: "#ffffff" }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#ffffff"
                                        strokeWidth={2.5}
                                        isAnimationActive={true}
                                        animationDuration={1200}
                                        dot={{
                                            r: 4,
                                            fill: "#ffffff",
                                            stroke: "#000000",
                                            strokeWidth: 2
                                        }}
                                        activeDot={{
                                            r: 6,
                                            fill: "#ffffff"
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>


                        <div className="lg:w-[30%] flex flex-col gap-6">

                            <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-black/60 via-emerald-900/30 to-emerald-500/20 hover:from-black/70 hover:via-emerald-800/40 hover:to-emerald-400/30 transition duration-300 shadow-lg">

                                <p className="text-gray-300 text-sm font-medium mb-2">Month Revenue</p>

                                <h2 className="text-3xl font-bold mt-1 text-white">
                                    ₹{" "}
                                    <CountUp
                                        key={analytics.monthRevenue}
                                        end={analytics.monthRevenue || 0}
                                        duration={1.6}
                                        separator=","
                                    />
                                </h2>
                            </div>



                            <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-black/60 via-yellow-900/30 to-yellow-500/20 hover:from-black/70 hover:via-yellow-800/40 hover:to-yellow-400/30 transition duration-300 shadow-lg">

                                <p className="text-gray-300 text-sm font-medium mb-2">Tickets Sold</p>

                                <h2 className="text-3xl font-bold mt-1 text-white">
                                    <CountUp
                                        key={analytics.monthTickets}
                                        end={analytics.monthTickets || 0}
                                        duration={1.6}
                                        separator=","
                                    />
                                </h2>
                            </div>

                        </div>

                    </div>

                </div>


                <div className="bg-[#1f2937] text-white p-8 rounded-3xl shadow-xl space-y-8 mb-6">


                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

                        <div>
                            <h2 className="text-2xl font-bold">
                                Weekly Revenue Analytics
                            </h2>
                            <p className="text-gray-400 mt-2">
                                Monitor weekly ticket sales performance and revenue trends.
                                Compare results with the previous week to track growth momentum.
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {getWeekDateRange()}
                            </p>
                        </div>


                        <div
                            className={`text-sm font-semibold px-6 py-2 rounded-full 
    whitespace-nowrap inline-flex items-center justify-center
    transition-all duration-300 hover:scale-105
    ${weekPercentage >= 0
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                        >
                            {weekPercentage >= 0 ? "+" : ""}
                            {weekPercentage}% vs last week
                        </div>
                    </div>


                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 w-full">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="w-full sm:w-auto bg-white/10 text-white border border-gray-600 rounded-lg px-4 py-2"
                        >
                            {Array.from({ length: 12 }).map((_, i) => (
                                <option key={i} value={i} className="text-black">
                                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedWeek}
                            onChange={(e) => setSelectedWeek(Number(e.target.value))}
                            className="w-full sm:w-auto bg-white/10 text-white border border-gray-600 rounded-lg px-4 py-2"
                        >
                            {Array.from(
                                {
                                    length: getWeeksInMonth(
                                        new Date().getFullYear(),
                                        selectedMonth
                                    ),
                                },
                                (_, i) => (
                                    <option key={i + 1} value={i + 1} className="text-black">
                                        Week {i + 1}
                                    </option>
                                )
                            )}
                        </select>
                    </div>


                    <div className="flex flex-col lg:flex-row gap-8">


                        <div className="w-full lg:w-[70%] h-72 min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.weeklyDailyChart || []}>

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#374151"
                                    />

                                    <XAxis
                                        dataKey="day"
                                        stroke="#ffffff"
                                        tick={{ fill: "#ffffff" }}
                                    />

                                    <YAxis
                                        stroke="#ffffff"
                                        tick={{ fill: "#ffffff" }}
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#000000",
                                            border: "none",
                                            borderRadius: "10px",
                                            color: "#ffffff",
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.6)"
                                        }}
                                        labelStyle={{ color: "#ffffff" }}
                                        itemStyle={{ color: "#ffffff" }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#ffffff"
                                        strokeWidth={2.5}
                                        isAnimationActive={true}
                                        animationDuration={1200}
                                        dot={{
                                            r: 4,
                                            fill: "#ffffff",
                                            stroke: "#000000",
                                            strokeWidth: 2
                                        }}
                                        activeDot={{
                                            r: 6,
                                            fill: "#ffffff"
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>


                        <div className="lg:w-[30%] flex flex-col gap-6">


                            <div className="relative p-6 rounded-2xl backdrop-blur-xl 
                bg-gradient-to-br from-black/60 via-emerald-900/30 to-emerald-500/20
                hover:from-black/70 hover:via-emerald-800/40 hover:to-emerald-400/30
                transition duration-300 shadow-lg">

                                <p className="text-gray-300 text-sm font-medium mb-2">
                                    Week Revenue
                                </p>

                                <h2 className="text-3xl font-bold text-white">
                                    ₹{" "}
                                    <CountUp
                                        key={analytics.weekRevenue}
                                        end={analytics.weekRevenue || 0}
                                        duration={1.6}
                                        separator=","
                                    />
                                </h2>
                            </div>


                            <div className="relative p-6 rounded-2xl backdrop-blur-xl 
                bg-gradient-to-br from-black/60 via-yellow-900/30 to-yellow-500/20
                hover:from-black/70 hover:via-yellow-800/40 hover:to-yellow-400/30
                transition duration-300 shadow-lg">

                                <p className="text-gray-300 text-sm font-medium mb-2">
                                    Tickets Sold
                                </p>

                                <h2 className="text-3xl font-bold text-white">
                                    <CountUp
                                        key={analytics.weekTickets}
                                        end={analytics.weekTickets || 0}
                                        duration={1.6}
                                        separator=","
                                    />
                                </h2>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="mt-4">
                    <AdminFooter />
                </div>

            </div>
        </DashboardLayout>
    );
}


