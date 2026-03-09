import { useState, useEffect } from "react";
import API from "../../../API/Api";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";
import DashboardLayout from "../../../Layouts/DashboardLayout";
import AdminFooter from "../../../Components/Footer/AdminFooter";


export default function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const [topEvents, setTopEvents] = useState([]);
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalUsers: 0,
        expectedRevenue: 0,
        actualRevenue: 0,
        totalSoldTickets: 0,
    });


    useEffect(() => {
        fetch("http://localhost:5000/api/dashboard/stats")
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch((err) => console.error(err));
    }, []);




    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "Concert",
        venue: "",
        city: "",
        date: "",
        time: "",
        price: "",
        image: "",
        seatArrangement: false,
        layoutType: "",
        rows: 5,
        cols: 5,
        totalTickets: 0,
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const res = await API.get("/events");
        setEvents(res.data);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => {
            
            if (name === "rows" || name === "cols") {
                return {
                    ...prev,
                    [name]: Math.max(1, Number(value)),
                };
            }

            return {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            };
        });
    };


    const handleImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await API.post("/image/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

        
            setForm((prev) => ({
                ...prev,
                image: res.data.url,
            }));

            toast.success("Image Uploaded");
        } catch (err) {
            toast.error("Image Upload Failed");
        }
    };


    const calculateTotalSeats = () => {
        if (form.layoutType === "grid") {
            return form.rows * form.cols;
        }
        if (form.layoutType === "round") {
            return form.rows * 8;
        }
        return 0;
    };

    const generateSeats = () => {
        let seats = [];
        if (form.layoutType === "grid") {
            for (let r = 1; r <= form.rows; r++) {
                for (let c = 1; c <= form.cols; c++) {
                    seats.push({ seatNumber: `${r}-${c}`, isBooked: false });
                }
            }
        }
        if (form.layoutType === "round") {
            for (let r = 1; r <= form.rows; r++) {
                for (let c = 1; c <= 8; c++) {
                    seats.push({ seatNumber: `R${r}-${c}`, isBooked: false });
                }
            }
        }
        return seats;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

       
        if (!form.title || !form.venue || !form.city || !form.date || !form.time || !form.price) {
            toast.error("Please Fill All Required Fields");
            return;
        }

       
        if (!form.seatArrangement && form.totalTickets <= 0) {
            toast.error("Total Ticket Count Must Be Greater Than 0");
            return;
        }

       
        if (form.seatArrangement) {
            if (form.rows < 1 || form.cols < 1) {
                toast.error("Rows And Columns Must Be At Least 1");
                return;
            }

            if (form.rows * form.cols > 500) {
                toast.error("Seat Limit Exceeded (Max 500)");
                return;
            }
        }

        const payload = {
            ...form,
            totalTickets: form.seatArrangement
                ? calculateTotalSeats()
                : form.totalTickets,
            seats: form.seatArrangement ? generateSeats() : [],
        };

        try {
            await API.post("/events/create", payload);
            toast.success("Event Published");

            setShowModal(false);
            fetchEvents();

        } catch (err) {
            toast.error("Failed To Create Event");
        }
    };


    const handleDelete = async () => {
        try {
            await API.delete(`/events/${selectedEventId}`);


            setEvents((prevEvents) =>
                prevEvents.filter((event) => event._id !== selectedEventId)
            );

            setShowDeleteModal(false);
            toast.success("Event Deleted Successfully");

        } catch (error) {
            console.error(error);
            toast.error("Failed To Delete Event");
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await API.put(`/events/${editEvent._id}`, editEvent);

            
            setEvents((prev) =>
                prev.map((ev) =>
                    ev._id === editEvent._id ? res.data.event : ev
                )
            );

            setShowEditModal(false);
            toast.success("Event Updated Successfully");

        } catch (error) {
            console.error(error);
            toast.error("Failed To Update Event");
        }
    };

    useEffect(() => {
        fetchTopEvents();
    }, []);

    const fetchTopEvents = async () => {
        try {
            const res = await API.get("/bookings/admin/top-events");
            setTopEvents(res.data);
        } catch (error) {
            console.error("Failed To Fetch Top Events");
        }
    };






    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-6">


                <h1 className="text-3xl font-bold mb-6">Add / Edit Events</h1>


                <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#1f2937] text-white px-8 py-4 rounded-lg mt-4 "
                >
                    + Add Event
                </button>


                <div className="mt-10 mb-12 bg-[#1f2937] text-white p-8 rounded-3xl">

                    <h2 className="text-2xl font-semibold mb-1">Top Events</h2>

                    <p className="text-gray-300 text-sm mb-8">
                        This section highlights the events that have recorded the highest number of ticket sales.
                        It provides a clear overview of the most popular events based on audience attendance.
                    </p>

                    
                    <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topEvents.map((event, index) => (
                            <div
                                key={event.eventId}
                                className="flex items-center gap-5 bg-[#374151] 
                p-4 rounded-2xl shadow-md hover:bg-[#3f4a5a] transition relative"
                            >
                                
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <div
                                        className={`absolute -top-2 -left-2 w-7 h-7 flex items-center justify-center text-xs font-bold text-white rounded-full shadow-lg ${index === 0
                                            ? "bg-yellow-500"
                                            : index === 1
                                                ? "bg-gray-400"
                                                : "bg-amber-700"
                                            }`}
                                    >
                                        {index + 1}
                                    </div>
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-24 h-24 rounded-xl object-cover"
                                    />
                                </div>

                                
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold">{event.title}</h3>
                                    <div className="flex justify-between mt-3 text-sm">
                                        <div className="flex flex-col items-center">
                                            <p className="text-gray-400 text-xs uppercase text-center">Total Tickets</p>
                                            <p className="font-semibold text-center">{event.totalTickets}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-gray-400 text-xs uppercase text-center">Sold</p>
                                            <p className="font-semibold text-center">{event.soldTickets}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-gray-400 text-xs uppercase text-center">Balance</p>
                                            <p className="font-semibold text-center">{event.balanceTickets}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                   
                    <div className="block sm:hidden space-y-6">
                        {topEvents.map((event, index) => (
                            <div
                                key={event.eventId}
                                className="bg-[#374151] rounded-2xl shadow-md overflow-hidden"
                            >
                                
                                <div className="relative">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    
                                    <div
                                        className={`absolute top-2 left-2 w-7 h-7 
            flex items-center justify-center text-xs font-bold text-white 
            rounded-full shadow-lg ${index === 0
                                                ? "bg-yellow-500"
                                                : index === 1
                                                    ? "bg-gray-400"
                                                    : "bg-amber-700"
                                            }`}
                                    >
                                        {index + 1}
                                    </div>
                                </div>

                               
                                <div className="p-4 text-center space-y-2">
                                    <h3 className="text-base font-semibold">{event.title}</h3>

                                    <div className="flex justify-around text-sm mt-2">
                                        <div className="flex flex-col items-center">
                                            <p className="text-gray-400 text-[10px] uppercase">Total Tickets</p>
                                            <p className="font-semibold">{event.totalTickets}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-gray-400 text-[10px] uppercase">Sold</p>
                                            <p className="font-semibold">{event.soldTickets}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-gray-400 text-[10px] uppercase">Balance</p>
                                            <p className="font-semibold">{event.balanceTickets}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>




               
                {showModal && (
                    <div className=" fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/60 z-[100] ">

                        <div className="bg-white w-full max-w-[1000px] max-h-[90vh] overflow-y-auto p-6 md:p-8 lg:p-10 rounded-2xl shadow-2xl lg:ml-[250px] custom-scroll mx-4 mt-[40px] lg:mt-0  ">



                            <h2 className="text-2xl font-semibold mb-8 text-black">
                                Create Event
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-8">

                               
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

                                    <input name="title" placeholder="Title" onChange={handleChange} className="w-full rounded-lg px-4 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-2 focus:border-black"
                                    />
                                    <input name="venue" placeholder="Venue" onChange={handleChange} className="w-full rounded-lg px-4 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-2 focus:border-black"
                                    />
                                    <input name="city" placeholder="City" onChange={handleChange} className="w-full rounded-lg px-4 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-2 focus:border-black"
                                    />
                                    <input name="price" type="number" placeholder="Price" onChange={handleChange} className="w-full rounded-lg px-4 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-2 focus:border-black"
                                    />
                                    <div className="grid grid-cols-2 gap-4 sm:col-span-2 lg:col-span-2">
                                        <input
                                            name="date"
                                            type="date"
                                            onChange={handleChange}
                                            className="w-full rounded-lg px-2 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-2 focus:border-black"
                                        />

                                        <input
                                            name="time"
                                            type="time"
                                            onChange={handleChange}
                                            className="w-full rounded-lg px-4 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-2 focus:border-black"
                                        />
                                    </div>

                                </div>

                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


                                    <select name="category" onChange={handleChange} className="w-full rounded-lg px-4 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-2 focus:border-black h-[50px]"
                                    >
                                        <option value="" disabled selected>
                                            Select Category
                                        </option>
                                        <option value="Concert">Concert</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Race">Race</option>
                                        <option value="Seminar">Seminar</option>
                                        <option value="Festival">Festival</option>
                                    </select>


                                    <textarea name="description"
                                        placeholder="Description"
                                        onChange={handleChange}
                                        className="w-full rounded-lg px-4 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-2 focus:border-black custom-scroll text-justify"

                                    />



                                    <div className="w-full">


                                        <div className="relative w-full h-40">
                                            
                                            <input
                                                type="file"
                                                onChange={handleImage}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />

                                            <div className="w-full h-full rounded-2xl border-2 border-dashed  border-gray-400 bg-white hover:border-black transition-all duration-300 flex items-center justify-center overflow-hidden">

                                               
                                                {form.image ? (
                                                    <img
                                                        src={form.image}
                                                        alt="preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                   
                                                    <div className="flex flex-col items-center justify-center text-center">
                                                        <h1>+</h1>

                                                        <p className="text-black text-sm">
                                                            Add Event Poster
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                               
                                <div className="border-t border-gray-700 pt-6">

                                    
                                    <div className="flex items-center gap-4 mb-4">
                                        <span>Seat Arrangement</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.seatArrangement}
                                                onChange={() =>
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        seatArrangement: !prev.seatArrangement,
                                                        layoutType: !prev.seatArrangement ? "grid" : "",
                                                        rows: 1,
                                                        cols: 1,
                                                    }))
                                                }
                                                className="sr-only peer"
                                            />

                                            <div className="w-11 h-6 bg-black rounded-full peer peer-checked:bg-black
                     after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                     after:bg-white after:h-5 after:w-5 after:rounded-full
                     after:transition-all peer-checked:after:translate-x-full">
                                            </div>
                                        </label>
                                    </div>

                                    {!form.seatArrangement && (
                                        <input
                                            type="number"
                                            name="totalTickets"
                                            placeholder="Total Ticket Count"
                                            onChange={handleChange}
                                            className=" rounded-lg px-4 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-2 focus:border-black w-[200px]"

                                        />
                                    )}

                                    {form.seatArrangement && (
                                        <div className="grid grid-cols-1 lg:grid-cols-[300px_auto] gap-6 items-start">


                                            <div>
                                                <div className="w-[200px] rounded-lg px-4 py-2 bg-gray-100 text-black border border-gray-400 mb-3 text-sm font-medium">
                                                    Layout: Grid
                                                </div>


                                                <div className="flex gap-3">
                                                    <input
                                                        type="number"
                                                        name="rows"
                                                        min="1"
                                                        placeholder="Rows"
                                                        onChange={handleChange}
                                                        className="w-[100px] rounded-lg px-4 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-2 focus:border-black"
                                                    />

                                                    <input
                                                        type="number"
                                                        name="cols"
                                                        min="1"
                                                        placeholder="Columns"
                                                        onChange={handleChange}
                                                        className="w-[100px] rounded-lg px-4 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-2 focus:border-black"
                                                    />
                                                </div>

                                                <div className="w-[200px] rounded-lg px-4 py-2 bg-gray-100 text-black border border-gray-400 mt-3 text-sm">
                                                    Total Seats: {calculateTotalSeats()}
                                                </div>
                                            </div>

                                            
                                            <div className="border border-gray-300 p-4 rounded-lg max-h-[250px] overflow-auto custom-scroll">
                                                <h3 className="text-sm font-medium mb-2">Live Preview</h3>

                                                
                                                <div className="bg-black text-center text-white py-2 rounded mb-4 text-sm font-semibold tracking-wide w-[300px] mx-auto">

                                                    STAGE
                                                </div>

                                                {[...Array(Number(form.rows || 0))].map((_, r) => {
                                                    const rowLetter = String.fromCharCode(65 + r);

                                                    return (
                                                        <div key={r} className="flex gap-2 mb-2 justify-center items-center">

                                                            {/* Row Label */}
                                                            <span className="text-xs font-medium w-6">
                                                                {rowLetter}
                                                            </span>

                                                            {[...Array(Number(form.cols || 0))].map((_, c) => (
                                                                <div
                                                                    key={c}
                                                                    className="w-6 h-6 bg-black text-white text-[10px] flex items-center justify-center rounded-sm"
                                                                >
                                                                    {rowLetter}{c + 1}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                        </div>

                                    )}
                                </div>

                               
                                <div className="flex justify-end gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 rounded-lg border border-gray-400 text-black"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="px-6 py-2 rounded-lg bg-black text-white"
                                    >
                                        Publish Event
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">








                    {events.map((event) => (
                        <div
                            key={event._id}
                            className="relative rounded-2xl overflow-hidden shadow-lg group"
                        >
                            
                            <div className="aspect-[3/4] sm:aspect-[4/3] md:aspect-video w-full">

                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                                />
                            </div>

                           
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-back/40 to-transparent"></div>

                            
                            <div className="absolute bottom-0 p-5 w-full space-y-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-white leading-tight">
                                        {event.title}
                                    </h3>

                                </div>

                                <p className="text-base text-gray-200">
                                    {event.venue}, {event.city}
                                </p>

                                <p className="text-sm text-gray-300">
                                    {event.date?.slice(0, 10)} | {event.time}
                                </p>
                                <div className="pt-2">
                                    <span className="text-sm font-semibold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/40 shadow-lg">
                                        ₹ {event.price}
                                    </span>
                                </div>



                                <div className="flex mt-4 w-full">
                                    <button
                                        onClick={() => {
                                            setSelectedEventId(event._id);
                                            setShowDeleteModal(true);
                                        }}
                                        className="w-1/2 bg-white/20 text-white py-2.5 rounded-l-xl text-sm backdrop-blur-sm hover:bg-white hover:text-black hover:cursor-pointer transition duration-300"
                                    >
                                        Delete
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditEvent(event);
                                            setShowEditModal(true);
                                        }}
                                        className="w-1/2 bg-white/20 text-white py-2.5 rounded-r-xl text-sm backdrop-blur-sm hover:bg-white hover:text-black hover:cursor-pointer transition duration-300 border-l border-white/30"
                                    >
                                        Edit
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl">

                            <div className="flex justify-center mb-4">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <AlertTriangle size={28} className="text-red-600" />
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold mb-6 text-gray-800">
                                Are you sure you want to delete this event?
                            </h2>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-5 py-2 rounded-lg bg-white border border-black text-black hover:bg-gray-100 transition duration-200"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition duration-200"
                                >
                                    Yes, Delete
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {showEditModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm 
                flex justify-center md:items-center 
                z-50 overflow-y-auto md:overflow-hidden">

                        <div className="bg-white rounded-2xl p-6 sm:p-8 
                w-full max-w-[700px] mx-4 shadow-2xl
                mt-16 mb-10 md:mt-0 md:mb-0
                max-h-[85vh] md:max-h-full
                overflow-y-auto md:overflow-visible custom-scroll">



                            <h2 className="text-2xl font-semibold mb-8 text-gray-800">
                                Edit Event
                            </h2>

                            <div className="space-y-6">

                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    <input
                                        type="text"
                                        value={editEvent.title}
                                        onChange={(e) =>
                                            setEditEvent({ ...editEvent, title: e.target.value })
                                        }
                                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Title"
                                    />

                                    <input
                                        type="text"
                                        value={editEvent.venue}
                                        onChange={(e) =>
                                            setEditEvent({ ...editEvent, venue: e.target.value })
                                        }
                                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Venue"
                                    />

                                    <input
                                        type="text"
                                        value={editEvent.city}
                                        onChange={(e) =>
                                            setEditEvent({ ...editEvent, city: e.target.value })
                                        }
                                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="City"
                                    />
                                </div>

                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                   
                                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                        <input
                                            type="date"
                                            value={editEvent.date}
                                            onChange={(e) =>
                                                setEditEvent({ ...editEvent, date: e.target.value })
                                            }
                                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />

                                        <input
                                            type="time"
                                            value={editEvent.time}
                                            onChange={(e) =>
                                                setEditEvent({ ...editEvent, time: e.target.value })
                                            }
                                            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>

                                   
                                    <input
                                        type="number"
                                        value={editEvent.price}
                                        onChange={(e) =>
                                            setEditEvent({ ...editEvent, price: e.target.value })
                                        }
                                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Price"
                                    />

                                </div>


                               
                                <textarea
                                    value={editEvent.description}
                                    onChange={(e) =>
                                        setEditEvent({ ...editEvent, description: e.target.value })
                                    }
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black h-28 custom-scroll "
                                    placeholder="Description"
                                />

                            </div>

                            
                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-6 py-2 rounded-lg bg-white border border-black text-black hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleUpdate}
                                    className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
                                >
                                    Save Changes
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
