import { useEffect, useState } from "react";
import API from "../../../API/Api";
import { Heart, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserFooter from "../../../Components/Footer/Footer";
import DashboardLayout from "../../../Layouts/DashboardLayout";

export default function WishlistPage() {
    const [wishlistEvents, setWishlistEvents] = useState([]);
    const navigate = useNavigate();


    const fetchWishlist = async () => {
        try {
            const { data } = await API.get("/wishlist");
            setWishlistEvents(data);
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);


    const handleRemove = async (eventId) => {
        try {
            await API.delete(`/wishlist/remove/${eventId}`);
            fetchWishlist();
        } catch (error) {
            console.error("Failed to remove:", error);
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-6">
                <h2 className="text-3xl font-bold mb-6">My Favorites</h2>

                {wishlistEvents.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                        Your wishlist is empty.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistEvents.map((wishlistItem) => {
                            const event = wishlistItem.event;
                            return (
                                <div
                                    key={wishlistItem._id}
                                    className="bg-[#1f2937] rounded-3xl overflow-hidden shadow-lg 
                 hover:shadow-2xl transition-all duration-300 flex flex-col"
                                >

                                    <div className="h-52 w-full overflow-hidden">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition duration-500 hover:scale-105"
                                        />
                                    </div>


                                    <div className="p-5 text-white flex flex-col flex-grow">
                                        <h4 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[56px]">
                                            {event.title}
                                        </h4>
                                        <p className="text-sm text-gray-400 mb-4">
                                            {event.city} • {event.date?.slice(0, 10)}
                                        </p>


                                        <div className="mt-auto flex gap-3">


                                            <button
                                                onClick={() => handleRemove(event._id)}
                                                className="w-12 h-12 flex items-center justify-center border border-white/30 
                       rounded-full text-red-500 transition-all duration-300 hover:bg-white hover:text-red-500"
                                            >
                                                <Heart size={23} fill="red" stroke="red" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="mt-4">
                    <UserFooter />
                </div>
            </div>
        </DashboardLayout>
    );
}