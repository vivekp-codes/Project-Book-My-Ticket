import { useEffect, useState } from "react";
import { useRef } from "react";
import API from "../../../API/Api";
import DashboardLayout from "../../../Layouts/DashboardLayout";
import { toPng } from "html-to-image";
import download from "downloadjs";
import UserFooter from "../../../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const cardRefs = useRef({});

    const fetchBookings = async () => {
        try {
            const { data } = await API.get("/bookings/my-bookings");
            setBookings(data);
        } catch (error) {
            console.log("Error fetching bookings:", error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        try {
            await API.put(`/bookings/cancel/${id}`);
            fetchBookings();
        } catch (error) {
            console.log("Cancel failed", error);
        }
    };

    const handleDownload = (id) => {
        const node = cardRefs.current[id];
        if (!node) return;

        toPng(node, { cacheBust: true, pixelRatio: 2 })
            .then((dataUrl) => {
                download(dataUrl, `ticket-${id}.png`);
            })
            .catch((err) => {
                console.error("Failed to download ticket", err);
            });
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-6">
                <h2 className="text-3xl font-bold mb-6">My Bookings</h2>

                {bookings.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                        No bookings found.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                ref={(el) => (cardRefs.current[booking._id] = el)}
                                className="relative bg-[#1f2937] text-white rounded-2xl shadow-lg 
             hover:shadow-2xl transition overflow-hidden "
                            >

                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
                                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>

                                <div className="flex flex-col md:flex-row">


                                    <div className="md:w-1/4">
                                        <img
                                            src={booking.event.image}
                                            alt={booking.event.title}
                                            className="h-48 md:h-full w-full object-cover"
                                        />
                                    </div>


                                    <div className="md:w-1/2 p-6 border-r border-dashed border-gray-500">
                                        <h3 className="text-2xl font-bold mb-3 tracking-wide">
                                            {booking.event.title}
                                        </h3>

                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {booking.event.description}
                                        </p>
                                    </div>


                                    <div className="md:w-1/4 p-6 flex flex-col justify-between">

                                        <div className="space-y-3 text-sm">

                                            <div>
                                                <p className="text-gray-400 text-xs uppercase tracking-wide">
                                                    Event Date
                                                </p>
                                                <p className="font-semibold">
                                                    {new Date(booking.event.date).toDateString()}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400 text-xs uppercase tracking-wide">
                                                    Venue
                                                </p>
                                                <p className="font-semibold">
                                                    {booking.event.venue},{booking.event.city}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400 text-xs uppercase tracking-wide">
                                                    Seats / Tickets
                                                </p>
                                                <p className="font-semibold">
                                                    {Array.isArray(booking.selectedSeats) && booking.selectedSeats.length > 0
                                                        ? booking.selectedSeats.join(", ")
                                                        : booking.quantity}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-gray-400 text-xs uppercase tracking-wide">
                                                    Total Amount
                                                </p>
                                                <p className="font-semibold">
                                                    ₹ {booking.totalAmount}
                                                </p>
                                            </div>
                                        </div>


                                        <button
                                            onClick={() => handleDownload(booking._id)}

                                            className="w-full border border-white/30 text-white py-2 rounded-xl 
             transition-all duration-300 hover:bg-white hover:text-black mt-2.5"
                                        >
                                            Download Ticket
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-4">
                    <UserFooter />
                </div>
            </div>
        </DashboardLayout>
    );
}