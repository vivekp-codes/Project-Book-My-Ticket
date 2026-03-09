import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import DashboardLayout from "../../../Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, Ticket, IndianRupee, Clock, MapPin, Tag, TicketCheck } from "lucide-react";
import AdminFooter from "../../../Components/Footer/AdminFooter";
import API from "../../../API/Api";



export default function AdminHome() {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalEvent, setModalEvent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    expectedRevenue: 0,
    actualRevenue: 0,
    totalSoldTickets: 0,
  });

  const handleViewEvent = async (id) => {
    try {
      setModalLoading(true);
      const res = await API.get(`/events/${id}`);
      setModalEvent(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch event details");
    } finally {
      setModalLoading(false);
    }
  };





  const categories = [
    "All",
    "Concert",
    "Workshop",
    "Race",
    "Seminar",
    "Festival",
  ];

  useEffect(() => {
    fetch("https://project-book-my-ticket-backend.onrender.com/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);






  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await API.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    getEvents();
  }, []);


  const latestThree = events.slice(0, 3);

  useEffect(() => {
    if (latestThree.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === latestThree.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [latestThree]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-6">


        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mb-14">


          <div className="lg:col-span-7">


            <div className="mb-8 w-full">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black-400"
                />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-black-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                />
              </div>
            </div>


            <h3 className="text-2xl font-semibold mb-6">
              Upcoming Events
            </h3>

            {latestThree.length > 0 && (
              <div className="relative rounded-2xl overflow-hidden shadow-xl h-[420px]">

                <img
                  src={latestThree[currentIndex].image}
                  alt="event"
                  className="w-full h-full object-cover transition duration-700"
                />

                <div className="absolute inset-0 bg-black/60"></div>

                <div className="absolute bottom-0 p-6 text-white space-y-2">
                  <h4 className="text-2xl font-bold">
                    {latestThree[currentIndex].title}
                  </h4>

                  <p className="text-gray-200 text-sm max-w-xl">
                    {latestThree[currentIndex].description}
                  </p>

                  <p className="text-sm text-gray-300">
                    {latestThree[currentIndex].date?.slice(0, 10)} |{" "}
                    {latestThree[currentIndex].time}
                  </p>

                  <p className="text-sm text-gray-300">
                    {latestThree[currentIndex].venue},{" "}
                    {latestThree[currentIndex].city}
                  </p>
                </div>

              </div>
            )}

          </div>


          <div className="lg:col-span-3">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[9/16.5]">

              <img
                src="/Image/AdminPage.jpg"
                alt="manage"
                className="w-full h-full object-cover"
              />


              <div className="absolute inset-0 bg-black/60"></div>


              <div className="absolute inset-0 flex items-end">
                <div className="w-full p-6 text-white text-left">

                  <h3 className="text-2xl font-bold mb-2">
                    Manage Your Events
                  </h3>

                  <p className="text-gray-200 text-sm mb-4 max-w-xs">
                    Control bookings, edit events, and track ticket sales.
                  </p>

                  <button
                    onClick={() => navigate("/admin/events")}
                    className="border border-white text-white px-6 py-2 rounded-lg transition-all duration-300 hover:bg-white hover:text-black"
                  >
                    Manage Events
                  </button>

                </div>
              </div>

            </div>
          </div>


        </div>



        <div>


          <h3 className="text-2xl font-semibold mb-6">
            All Events
          </h3>


          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-lg
 text-sm font-medium transition-all duration-300
        ${selectedCategory === cat
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
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


                  <h4 className="font-semibold text-lg leading-snug mb-2 line-clamp-2 min-h-[56px]">
                    {event.title}
                  </h4>


                  <p className="text-sm text-gray-400 mb-4">
                    {event.city} • {event.date?.slice(0, 10)}
                  </p>


                  <div className="mt-auto">
                    <button
                      onClick={() => handleViewEvent(event._id)}
                      className="w-full border border-white/30 text-white py-2 rounded-xl 
             transition-all duration-300 hover:bg-white hover:text-black"
                    >
                      View Event Details
                    </button>

                  </div>

                </div>
              </div>
            ))}
          </div>


        </div>


        {modalEvent && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm 
                flex items-center justify-center 
                z-50 
                lg:pl-[120px]">



            <div className="bg-white rounded-3xl 
                w-[95%] max-w-4xl 
                h-[85vh] 
                shadow-2xl 
                flex flex-col">


              {modalLoading ? (
                <div className="flex items-center justify-center h-full">
                  Loading...
                </div>
              ) : (
                <>

                  <div className="overflow-y-auto p-8 space-y-8 custom-scroll">


                    <img
                      src={modalEvent.image}
                      alt={modalEvent.title}
                      className="w-full h-72 lg:h-[420px] object-cover rounded-2xl"

                    />


                    <h2 className="text-3xl font-bold">
                      {modalEvent.title}
                    </h2>


                    <p className="text-gray-600 leading-relaxed">
                      {modalEvent.description}
                    </p>


                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">



                      <div className="md:col-span-3 flex items-center gap-4 p-4 bg-gray-50 rounded-2xl shadow-sm">

                        <div className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-2xl">
                          <Calendar size={24} />
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Date</p>
                          <h3 className="font-semibold">
                            {modalEvent.date?.slice(0, 10)}
                          </h3>
                        </div>
                      </div>


                      <div className="md:col-span-3 flex items-center gap-4 p-4 bg-gray-50 rounded-2xl shadow-sm">

                        <div className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-2xl">
                          <Clock size={24} />
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Time</p>
                          <h3 className="font-semibold">
                            {modalEvent.time}
                          </h3>
                        </div>
                      </div>


                      <div className="md:col-span-6 flex items-center gap-4 p-4 bg-gray-50 rounded-2xl shadow-sm">

                        <div className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-2xl">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Venue</p>
                          <h3 className="font-semibold">
                            {modalEvent.venue}, {modalEvent.city}
                          </h3>
                        </div>
                      </div>

                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">


                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl shadow-sm">
                        <div className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-2xl">
                          <Tag size={24} />
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Category</p>
                          <h3 className="font-semibold">
                            {modalEvent.category}
                          </h3>
                        </div>
                      </div>


                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl shadow-sm">
                        <div className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-2xl">
                          <IndianRupee size={24} />
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Price</p>
                          <h3 className="font-semibold">
                            ₹ {modalEvent.price?.toLocaleString()}
                          </h3>
                        </div>
                      </div>


                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl shadow-sm">
                        <div className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-2xl">
                          <Ticket size={24} />
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Total Tickets</p>
                          <h3 className="font-semibold">
                            {modalEvent.totalTickets}
                          </h3>
                        </div>
                      </div>


                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl shadow-sm">
                        <div className="w-14 h-14 flex items-center justify-center bg-black text-white rounded-2xl">
                          <TicketCheck size={24} />
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Sold Tickets</p>
                          <h3 className="font-semibold">
                            {modalEvent.soldTickets}
                          </h3>
                        </div>
                      </div>

                    </div>

                  </div>


                  <div className="rounded-3xl p-6 flex justify-end gap-4 bg-white">

                    <button
                      onClick={() => setModalEvent(null)}
                      className="px-6 py-2 rounded-lg bg-white border border-black text-black hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>

                  </div>
                </>
              )}
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
