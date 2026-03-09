import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import API from "../../../API/Api";
import toast from "react-hot-toast";
import DashboardLayout from "../../../Layouts/DashboardLayout";
import AdminFooter from "../../../Components/Footer/AdminFooter";



export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [userBookings, setUserBookings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [topUsers, setTopUsers] = useState([]);


    const handleViewUserBookings = async (userId) => {
        try {
            const res = await API.get(`/bookings/admin/user-bookings/${userId}`);
            setUserBookings(res.data);
            setSelectedUser(res.data[0]?.user); 
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching user bookings", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await API.get("/user/all-users");
            setUsers(data);
        } catch (error) {
            toast.error("Failed To Fetch Users");
        }
    };

    
    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        fetchUsers();
        fetchTopUsers();
    }, []);

    const fetchTopUsers = async () => {
        try {
            const { data } = await API.get("/bookings/admin/top-users");
            setTopUsers(data);
        } catch (error) {
            console.log("Failed to fetch top users");
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-6">

               
                <h1 className="text-3xl font-bold mb-6">Users</h1>

               
                <div className="mb-8 w-full lg:w-[70%]">
                    <div className="relative">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-black-400"
                        />
                        <input
                            type="text"
                            placeholder="Search users by username..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border border-black-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                        />
                    </div>
                </div>

              
                <div className="mb-10 bg-[#1f2937] text-white p-8 rounded-3xl">

                    <h2 className="text-2xl font-semibold mb-1">Top Users</h2>
                    <p className="text-gray-300 text-sm mb-8">
                        This section highlights the users who have purchased the most tickets and contributed the highest revenue.
                        It provides a clear view of the most active and valuable customers on the platform.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {topUsers.map((userData, index) => {

                            const rankColors = [
                                "bg-yellow-500",  
                                "bg-gray-300",     
                                "bg-amber-700"     
                            ];

                            return (
                                <div
                                    key={userData._id}
                                    className="bg-[#374151] rounded-2xl shadow-md 
             hover:bg-[#3f4a5a] transition relative overflow-hidden"
                                >

                                    
                                    <div
                                        className={`absolute top-3 left-3 w-7 h-7 
    flex items-center justify-center 
    text-xs font-bold text-white rounded-full z-10
    ${index === 0
                                                ? "bg-yellow-500"
                                                : index === 1
                                                    ? "bg-gray-400"
                                                    : "bg-amber-700"
                                            }`}
                                    >
                                        {index + 1}
                                    </div>

                                    
                                    <div className="block sm:hidden">

                                        
                                        <img
                                            src={
                                                userData.user?.profilePic ||
                                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                            }
                                            alt="profile"
                                            className="w-full h-48 object-cover"
                                        />

                                        <div className="p-4 text-center">

                                            <h3 className="text-base font-semibold">
                                                {userData.user?.username}
                                            </h3>

                                            <p className="text-xs text-gray-300 mb-3">
                                                {userData.user?.email}
                                            </p>

                                            <div className="flex justify-between text-sm mt-2">
                                                <div className="flex-1">
                                                    <p className="text-gray-400 text-[10px] uppercase">
                                                        Total Tickets
                                                    </p>
                                                    <p className="font-semibold">
                                                        {userData.totalTickets}
                                                    </p>
                                                </div>

                                                <div className="flex-1">
                                                    <p className="text-gray-400 text-[10px] uppercase">
                                                        Total Amount
                                                    </p>
                                                    <p className="font-semibold">
                                                        ₹ {userData.totalAmount}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    
                                    <div className="hidden sm:flex items-center gap-5 p-4">

                                        <img
                                            src={
                                                userData.user?.profilePic ||
                                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                            }
                                            alt="profile"
                                            className="w-24 h-24 rounded-xl object-cover"
                                        />

                                        <div className="flex-1">

                                            <h3 className="text-base font-semibold">
                                                {userData.user?.username}
                                            </h3>

                                            <p className="text-xs text-gray-300 mb-2">
                                                {userData.user?.email}
                                            </p>

                                            <div className="flex justify-between text-sm mt-2">

                                              
                                                <div className="flex flex-col items-center">
                                                    <p className="text-gray-400 text-xs uppercase text-center">
                                                        Total Tickets
                                                    </p>
                                                    <p className="font-semibold text-center">
                                                        {userData.totalTickets}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-center">
                                                    <p className="text-gray-400 text-xs uppercase text-center">
                                                        Total Amount
                                                    </p>
                                                    <p className="font-semibold text-center">
                                                        ₹ {userData.totalAmount}
                                                    </p>
                                                </div>

                                            </div>

                                        </div>
                                    </div>

                                </div>
                            );
                        })}

                    </div>
                </div>


                
                <h1 className="text-2xl font-bold mb-6">All Users</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className="bg-gradient-to-br from-[#111827] to-[#1f2937]
      rounded-3xl overflow-hidden shadow-lg 
      hover:shadow-2xl hover:-translate-y-2
      transition-all duration-300  flex flex-col"
                        >

                            
                            <div className="h-56 w-full overflow-hidden">
                                <img
                                    src={
                                        user.profilePic
                                            ? user.profilePic
                                            : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                    }
                                    alt="profile"
                                    className="w-full h-full object-cover transition duration-500 hover:scale-110"
                                    onError={(e) =>
                                    (e.target.src =
                                        "https://cdn-icons-png.flaticon.com/512/149/149071.png")
                                    }
                                />
                            </div>

                           
                            <div className="p-5 text-white flex flex-col flex-grow">

                                <h2 className="text-lg font-semibold mb-1">
                                    {user.username}
                                </h2>

                                <p className="text-sm text-gray-400 mb-3">
                                    {user.email}
                                </p>

                                <div className="space-y-2 text-sm text-gray-300 mb-4">

                                    {(user?.phone || user?.address?.state || user?.address?.district) ? (

                                        <div className="space-y-1">

                                            {user?.phone && (
                                                <p>
                                                    <span className="text-gray-400">Phone:</span> {user.phone}
                                                </p>
                                            )}

                                            {(user?.address?.state || user?.address?.district) && (
                                                <p>
                                                    <span className="text-gray-400">Location:</span>{" "}
                                                    {user.address?.state}
                                                    {user.address?.district ? `, ${user.address.district}` : ""}
                                                </p>
                                            )}

                                        </div>

                                    ) : (

                                        <p className="text-gray-400">
                                            User has not added contact details
                                        </p>

                                    )}

                                    <p className="text-xs text-gray-400">
                                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                                    </p>

                                </div>

                                
                                <div className="mt-auto">
                                    <button
                                        onClick={() => handleViewUserBookings(user._id)}
                                        className="w-full border border-white/30 text-white py-2 rounded-xl 
            transition-all duration-300 hover:bg-white hover:text-black"
                                    >
                                        View User Bookings
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start pt-20 z-50">

                        <div className="bg-white w-[95%] max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative lg:ml-70">



                            
                            <div className="flex items-center gap-6 p-6 border-b border-black/10 ">

                                <img
                                    src={
                                        selectedUser?.profilePic ||
                                        "/Image/DammyUser.png"
                                    }
                                    alt="profile"
                                    className="w-24 h-24 rounded-2xl object-cover"
                                />

                                <div className="text-black">
                                    <h2 className="text-xl font-semibold">
                                        {selectedUser?.username}
                                    </h2>
                                    <p className="text-gray-700">{selectedUser?.email}</p>
                                </div>

                            </div>

                            
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[400px] overflow-y-auto custom-scroll">

                                {userBookings.length > 0 ? (
                                    userBookings.map((booking) => (
                                        <div
                                            key={booking._id}
                                            className="bg-[#1f2937] rounded-2xl overflow-hidden shadow-md"
                                        >
                                            <div className="h-40 overflow-hidden">
                                                <img
                                                    src={booking.event?.image}
                                                    alt="event"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="p-4 text-white">
                                                <h3 className="text-sm font-semibold">
                                                    {booking.event?.title}
                                                </h3>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    Tickets: {booking.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 col-span-full">
                                        No bookings found for this user.
                                    </p>
                                )}

                            </div>

                            <div className="p-4  flex justify-end bg-white">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 rounded-lg bg-white border border-black text-black hover:bg-gray-100 transition">
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                <div className="mt-4">
                    <AdminFooter />
                </div>

            </div>
        </DashboardLayout>
    );
}
