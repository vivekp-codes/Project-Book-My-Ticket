import { useNavigate, useSearchParams } from "react-router-dom";
import { Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { toPng } from "html-to-image";

import API from "../../../API/Api";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef(null);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
          setLoading(false);
          return;
        }

        const res = await API.get(
          `/bookings/by-session/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setBooking(res.data);
      } catch (err) {
        console.error("Failed to fetch booking:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, []);

  const handleDownload = async () => {
    const element = ticketRef.current;

    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
    });

   
    const eventName = booking?.event?.title || "event";

    const cleanName = eventName
      .toLowerCase()
      .replace(/\s+/g, "-")        
      .replace(/[^a-z0-9-]/g, "");

    const link = document.createElement("a");
    link.download = `${cleanName}-ticket.png`;
    link.href = dataUrl;
    link.click();
  };



  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-xl">
        Loading your ticket...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="w-screen h-screen relative">

        
        <video
          src="/Video/Coverpage.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        
        <div className="absolute inset-0 flex items-center justify-center px-4">

          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 flex flex-col gap-6">

           
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-black text-white p-3 rounded-xl">
                <Ticket size={50} />
              </div>

              <h1 className="text-2xl font-bold leading-tight text-black">
                Book <br /> My <br /> Ticket
              </h1>
            </div>

            <hr className="border-gray-300" />

            
            <div className="flex justify-center my-6">
              <div className="w-20 h-20 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">

                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#EF4444"
                    strokeWidth="5"
                    fill="none"
                    className="circle"
                  />

                  <line
                    x1="35"
                    y1="35"
                    x2="65"
                    y2="65"
                    stroke="#EF4444"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="cross1"
                  />

                  <line
                    x1="65"
                    y1="35"
                    x2="35"
                    y2="65"
                    stroke="#EF4444"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="cross2"
                  />

                </svg>
              </div>
            </div>

            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-500 mb-2">
                Payment Failed
              </h2>

              <p className="text-gray-600 text-sm">
                Unfortunately your payment could not be completed.
                Please try again to confirm your booking.
              </p>
            </div>

            <hr className="border-gray-300" />

           
            <p className="text-sm text-gray-600 mt-4 text-center">
              Your booking could not be completed. Please try again or explore other events.{" "}
              <span
                onClick={() => navigate("/home")}
                className="text-black font-semibold cursor-pointer hover:underline"
              >
                Go Back to Home
              </span>
            </p>

          </div>

        </div>

        
        <style>{`

      .circle{
        stroke-dasharray:283;
        stroke-dashoffset:283;
        transform:rotate(-90deg);
        transform-origin:50% 50%;
        animation:draw-circle .6s forwards ease-out;
      }

      .cross1{
        stroke-dasharray:40;
        stroke-dashoffset:40;
        animation:draw-cross .3s .6s forwards ease-out;
      }

      .cross2{
        stroke-dasharray:40;
        stroke-dashoffset:40;
        animation:draw-cross .3s .8s forwards ease-out;
      }

      @keyframes draw-circle{
        to{stroke-dashoffset:0;}
      }

      @keyframes draw-cross{
        to{stroke-dashoffset:0;}
      }

      `}</style>

      </div>
    );
  }

  return (
    <div className="w-screen h-screen relative">
      
      <video
        src="/Video/Coverpage.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          ref={ticketRef}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full h-[85vh] sm:h-[650px] overflow-y-auto p-6 sm:p-8 flex flex-col gap-4 relative mx-2 sm:mx-0 custom-scroll"

        >

        
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-black text-white p-3 rounded-xl">
              <Ticket size={50} />
            </div>
            <h1 className="text-2xl font-bold leading-tight text-black">
              Book <br /> My <br /> Ticket
            </h1>
          </div>

          <hr className="border-gray-300" />

         
          <div className="flex gap-4">
            <img
              src={booking.event?.image}
              alt={booking.event?.title}
              className="w-32 h-32 object-cover rounded-xl"
            />

            <div className="flex flex-col justify-center gap-1 text-gray-800">
              <h2 className="font-bold text-lg">
                {booking.event?.title}
              </h2>
              <p className="text-sm">
                {booking.event?.venue}, {booking.event?.city}
              </p>
              <p className="text-sm">
                {booking.event?.date &&
                  new Date(booking.event.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                |{" "}
                {booking.event?.time &&
                  new Date(`1970-01-01T${booking.event.time}`).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </p>
            </div>
          </div>

          <hr className="border-gray-300" />

         
          <div className="w-full flex justify-center my-4">
            <div className="w-20 h-20 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#34D399"
                  strokeWidth="5"
                  fill="none"
                  className="circle"
                />
                <path
                  d="M30 52 L45 67 L72 38"
                  stroke="#34D399"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="tick"
                />
              </svg>
            </div>
          </div>

          <hr className="border-gray-300" />

          
          <div className="text-center text-gray-700 font-medium">
            {booking.selectedSeats?.length > 0 ? (
              <p>Seats: {booking.selectedSeats.join(", ")}</p>
            ) : (
              <p>Number of Tickets: {booking.quantity}</p>
            )}
          </div>

          
          <div className="text-center text-gray-600 text-sm">
            Please carry a valid ID along with this ticket. Show this ticket at
            the entrance to gain access.
          </div>

          <hr className="border-gray-300" />

       
          <div className="text-center text-gray-700 text-sm">
            Payment ID: {booking.paymentId}
          </div>

         


          <p className="text-sm text-gray-600 mt-4 text-center">
            Want to explore more events?{" "}
            <span
              onClick={() => navigate("/home")}
              className="text-black font-semibold cursor-pointer hover:underline"
            >
              Go Back to Home
            </span>
          </p>
        </div>
      </div>

      
      <style>{`
        .circle {
          stroke-dasharray: 283;
          stroke-dashoffset: 283;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          animation: draw-circle 0.6s forwards ease-out;
        }

        .tick {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: draw-tick 0.4s 0.6s forwards ease-out;
        }

        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }

        @keyframes draw-tick {
          to { stroke-dashoffset: 0; }
        }
      `}</style>


    </div>
  );
}