import { useEffect, useState } from "react";
import DashboardLayout from "../../../Layouts/DashboardLayout";
import API from "../../../API/Api";
import { Ticket, IndianRupee } from "lucide-react";
import UserFooter from "../../../Components/Footer/Footer";
import { Dialog } from "@headlessui/react";
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";
import { useMemo } from "react";
import CountUp from "react-countup";

export default function PurchasesPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalEventBookings, setModalEventBookings] = useState([]);

    const chartData = useMemo(() => {
        const today = new Date();
        const result = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);

            const dayLabel = d.toLocaleDateString("en-US", {
                weekday: "short",
            });

            const totalForDay = bookings
                .filter(
                    (b) =>
                        new Date(b.createdAt).toDateString() ===
                        d.toDateString()
                )
                .reduce((sum, b) => sum + b.totalAmount, 0);

            result.push({
                day: dayLabel,
                amount: totalForDay,
            });
        }

        return result;
    }, [bookings]);

    const percentageChange = useMemo(() => {
        const today = new Date();
        const startOfThisWeek = new Date(today);
        startOfThisWeek.setDate(today.getDate() - today.getDay());

        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

        const endOfLastWeek = new Date(startOfThisWeek);

        let thisWeekTotal = 0;
        let lastWeekTotal = 0;

        bookings.forEach((b) => {
            const bookingDate = new Date(b.createdAt);

            if (bookingDate >= startOfThisWeek) {
                thisWeekTotal += b.totalAmount;
            } else if (
                bookingDate >= startOfLastWeek &&
                bookingDate < endOfLastWeek
            ) {
                lastWeekTotal += b.totalAmount;
            }
        });

        if (lastWeekTotal === 0) return thisWeekTotal > 0 ? 100 : 0;

        return (((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100).toFixed(1);
    }, [bookings]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await API.get("/bookings/my-bookings");
                setBookings(data);
            } catch (err) {
                console.error("Failed to fetch bookings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);


    const groupedBookings = bookings.reduce((acc, b) => {
        const eventId = b.event?._id;
        if (!eventId) return acc;

        if (!acc[eventId]) acc[eventId] = [];
        acc[eventId].push(b);
        return acc;
    }, {});


    const overallTickets = bookings.reduce((sum, b) => sum + b.quantity, 0);
    const overallSpent = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

    const openModal = (eventBookings) => {
        setModalEventBookings(eventBookings);
        setModalOpen(true);
    };



    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-6">
                <h2 className="text-3xl font-bold mb-8 text-black">
                    My Purchases
                </h2>

                {loading ? (
                    <div>Loading...</div>
                ) : bookings.length === 0 ? (
                    <div className="text-gray-500 text-center mt-20">
                        No bookings yet.
                    </div>
                ) : (
                    <>

                        <div className="mb-12 w-full">
                            <div className="w-full xl:w-[100%] bg-gradient-to-br from-[#111827] to-[#1f2937] 
        rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">


                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-2xl font-semibold flex items-center gap-3">

                                            Purchases Overview
                                        </h3>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Monitor your ticket purchases and spending
                                        </p>
                                    </div>

                                    <div
                                        className={`text-sm font-semibold px-4 py-2 rounded-full ${percentageChange >= 0
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-red-500/20 text-red-400"
                                            }`}
                                    >
                                        {percentageChange >= 0 ? "+" : ""}
                                        {percentageChange}% vs last week
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-6">
                                    <button className="px-6 py-2 bg-white/10 rounded-md text-sm">
                                        Week
                                    </button>
                                </div>


                                <div className="flex flex-col lg:flex-row gap-8">


                                    <div className="w-full lg:w-[90%] h-64 min-w-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                                                <XAxis dataKey="day" stroke="#9ca3af" />
                                                <YAxis stroke="#9ca3af" />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "#111827",
                                                        border: "none",
                                                        borderRadius: "12px",
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="amount"
                                                    stroke="#ffffff"
                                                    strokeWidth={3}
                                                    dot={{
                                                        r: 5,
                                                        fill: "#000000",
                                                        stroke: "#ffffff",
                                                        strokeWidth: 2
                                                    }}
                                                    activeDot={{
                                                        r: 7,
                                                        fill: "#000000",
                                                        stroke: "#ffffff",
                                                        strokeWidth: 2
                                                    }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>


                                    <div className="lg:w-[30%] flex flex-col gap-6">

                                        <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-black/60 via-red-900/30 to-red-500/20 hover:from-black/70 hover:via-red-800/40 hover:to-red-400/30 transition duration-300 shadow-lg">

                                            <p className="text-gray-300 text-sm font-medium mb-2">Total Tickets</p>

                                            <h2 className="text-3xl font-bold mt-1">
                                                <CountUp
                                                    end={overallTickets}
                                                    duration={1.5}
                                                    separator=","
                                                />
                                            </h2>
                                        </div>


                                        <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-black/60 via-green-900/30 to-green-500/20 hover:from-black/70 hover:via-green-800/40 hover:to-emerald-400/30 transition duration-300 shadow-lg">

                                            <p className="text-gray-300 text-sm font-medium mb-2">Total Purchase Amount</p>

                                            <h2 className="text-3xl font-bold mt-1 text-white">
                                                ₹{" "}
                                                <CountUp
                                                    end={overallSpent}
                                                    duration={1.8}
                                                    separator=","
                                                />
                                            </h2>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>




                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Object.values(groupedBookings).map((eventBookings) => {
                                const event = eventBookings[0].event;

                                const totalTickets = eventBookings.reduce(
                                    (sum, b) => sum + b.quantity,
                                    0
                                );

                                const totalAmount = eventBookings.reduce(
                                    (sum, b) => sum + b.totalAmount,
                                    0
                                );

                                return (
                                    <div
                                        key={event._id}
                                        className="bg-[#1f2937] rounded-3xl overflow-hidden shadow-lg
                               hover:shadow-2xl transition-all duration-300
                               hover:-translate-y-2 flex flex-col"
                                    >

                                        <div className="h-52 w-full overflow-hidden">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover transition duration-500 hover:scale-105"
                                            />
                                        </div>


                                        <div className="p-5 text-white flex flex-col flex-grow">

                                            <h4 className="font-semibold text-lg leading-snug mb-4 line-clamp-2 min-h-[56px]">
                                                {event.title}
                                            </h4>


                                            <div className="bg-gray-800 rounded-2xl p-4 mb-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-gray-400 text-sm">
                                                        Total Tickets
                                                    </span>
                                                    <span className="font-bold text-lg">
                                                        {totalTickets}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400 text-sm">
                                                        Total Spent
                                                    </span>
                                                    <span className="font-bold text-lg">
                                                        ₹ {totalAmount.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>


                                            <div className="mt-auto">
                                                <button
                                                    onClick={() => openModal(eventBookings)}
                                                    className="w-full border border-white/30 text-white py-2 rounded-xl
                                     transition-all duration-300
                                     hover:bg-white hover:text-black"
                                                >
                                                    View Purchase History
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                <Dialog
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    className="relative z-50"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm " aria-hidden="true" />

                    <div className="fixed inset-0 flex items-center justify-center p-4 ">
                        <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-2xl p-6">
                            <Dialog.Title className="text-xl font-semibold mb-4">
                                Full Purchase History
                            </Dialog.Title>

                            <div className="grid gap-3 max-h-96 overflow-y-auto custom-scroll">
                                {modalEventBookings.map((b) => (
                                    <div
                                        key={b._id}
                                        className="bg-white-800 rounded-lg p-4 flex justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-black">
                                                {b.quantity} Tickets
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {new Date(b.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="font-bold text-black">
                                            ₹ {b.totalAmount}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-6 py-2 rounded-lg bg-white border border-black text-black hover:bg-gray-100 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>

                <div className="mt-4">
                    <UserFooter />
                </div>
            </div>
        </DashboardLayout>
    );
}