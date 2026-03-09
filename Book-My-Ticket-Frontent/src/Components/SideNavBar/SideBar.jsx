// import { NavLink, useNavigate } from "react-router-dom";
// import ReactCountryFlag from "react-country-flag";
// import toast from "react-hot-toast";
// import { Ticket } from "lucide-react";
// import { LogOut } from 'lucide-react';
// import { House } from 'lucide-react';
// import { Heart } from "lucide-react";
// import { Wallet } from "lucide-react";
// import { TicketCheck } from "lucide-react";



// import {
//   LayoutDashboard,
//   Calendar,
//   Users,
//   Menu,
//   ChevronDown,
//   User,
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import { useAuth } from "../../Context/AuthContext";

// function SideBar() {
//   const { user, role, logout, setUser } = useAuth();
//   const navigate = useNavigate();

//   const [open, setOpen] = useState(false); 
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     state: "",
//     district: "",
//     profilePic: "",
//   });


//   useEffect(() => {
//     if (showModal && user) {
//       setFormData({
//         username: user.username || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         state: user.address?.state || "",
//         district: user.address?.district || "",
//         profilePic: user.profilePic || "",
//       });
//     }
//   }, [showModal, user]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };


//   const handleSave = async () => {
//     setError("");

//     if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
//       toast.error("Phone Number Must Be 10 Digits");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/api/user/profile", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           phone: formData.phone,
//           profilePic: formData.profilePic,
//           address: {
//             state: formData.state,
//             district: formData.district,
//           },
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         toast.error(data.message || "Failed To Update Details ");
//         return;
//       }

//       setUser(data.user);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       toast.success("User Details Updated Successfully ");
//       setShowModal(false);

//     } catch (error) {
//       console.error(error);
//       toast.error("Server Not Reachable ");
//     }
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formDataImage = new FormData();
//     formDataImage.append("image", file);

//     try {
//       const response = await fetch("http://localhost:5000/api/image/upload", {
//         method: "POST",
//         body: formDataImage,
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         return setError("Image Upload Failed");
//       }

//       setFormData((prev) => ({
//         ...prev,
//         profilePic: data.url,
//       }));
//     } catch (error) {
//       console.error(error);
//       setError("Image Upload Error");
//     }
//   };

//   const linkStyle =
//     "flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200";

  
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setOpen(true); 
//       } else {
//         setOpen(false); 
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize(); 

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <>
      
//       <button
//         onClick={() => setOpen(!open)}
//         className="fixed top-1 left-1 z-50 bg-black text-white p-2 rounded-lg md:hidden"
//       >
//         <Menu size={22} />
//       </button>

      
//       <div
//         className={`fixed top-8 left-12 md:top-5 md:left-5 md:bottom-5 w-72 
//           bg-[#0f172a] text-white border-2 border-white/20 rounded-3xl shadow-2xl 
//           p-6 z-50 transition-transform duration-300
//           ${open ? "translate-x-0" : "-translate-x-[120%]"} 
//           md:translate-x-0`}
//       >

        
//         <div className="flex items-start gap-3 mb-8">
//           <div className="bg-white text-white p-3 rounded-xl">
//             <Ticket size={65} color="black" />
//           </div>
//           <h1 className="text-2xl font-bold leading-tight">
//             Book <br /> My <br /> Ticket
//           </h1>
//         </div>

        
//         <div className="relative mb-8">
//           <div
//             onClick={() => setShowDropdown(!showDropdown)}
//             className="relative flex items-center bg-white/10 p-4 rounded-xl cursor-pointer"
//           >
//             <div className="flex items-center gap-3">
//               <img
//                 src={user?.profilePic || "/Image/Profile.png"}
//                 alt="profile"
//                 className="w-18 h-18 rounded-full object-cover"
//               />
//               <div className="min-w-0">
//                 <p className="font-semibold break-words">{user?.username}</p>
//                 <p className="text-sm text-gray-400 break-words">{user?.email}</p>
//                 {user?.phone && (
//                   <p className="text-xs text-gray-400 mt-1 break-words">+91 {user.phone}</p>
//                 )}
//                 {user?.address && (
//                   <p className="text-xs text-gray-500 mt-1 break-words">
//                     {user?.address?.district && user?.address?.state
//                       ? `${user.address.district}, ${user.address.state}`
//                       : ""}
//                   </p>
//                 )}
//               </div>
//             </div>
//             <div
//               className={`absolute top-3 right-3 w-4 h-4 flex items-center justify-center rounded-full 
//               bg-white/20 hover:bg-white/30 transition-all duration-300`}
//             >
//               <ChevronDown
//                 size={16}
//                 className={`transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
//               />
//             </div>
//           </div>

//           {showDropdown && (
//             <div className="absolute left-0 mt-2 w-full bg-[#111] border border-white/20 rounded-xl p-3 space-y-2 z-50">
//               {role === "USER" && (
//                 <button
//                   onClick={() => {
//                     setShowDropdown(false);
//                     setShowModal(true);
//                   }}
//                   className="flex items-center gap-2 w-full hover:bg-white/10 p-2 rounded-lg"
//                 >
//                   <User size={16} />
//                   Edit Profile
//                 </button>
//               )}
//               <button
//                 onClick={() => {
//                   logout();
//                   navigate("/login");
//                 }}
//                 className="flex items-center gap-2 w-full hover:bg-white/10 p-2 rounded-lg text-red-400"
//               >
//                 <LogOut size={16} />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>

       
//         <nav className="space-y-3">
//           {role === "ADMIN" && (
//             <NavLink
//               to="/admin"
//               end
//               className={({ isActive }) =>
//                 `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
//               }
//               onClick={() => window.innerWidth < 768 && setOpen(false)}
//             >
//               <House size={20} /> Home
//             </NavLink>
//           )}


//           {role === "ADMIN" && (
//             <NavLink
//               to="/admin/events"
//               className={({ isActive }) =>
//                 `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
//               }
//               onClick={() => window.innerWidth < 768 && setOpen(false)}
//             >
//               <Calendar size={20} /> Events
//             </NavLink>
//           )}

//           {role === "ADMIN" && (
//             <NavLink
//               to="/admin/users"
//               className={({ isActive }) =>
//                 `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
//               }
//               onClick={() => window.innerWidth < 768 && setOpen(false)}
//             >
//               <Users size={20} /> Users
//             </NavLink>
//           )}

//           {role === "ADMIN" && (
//             <NavLink
//               to="/admin/dashboard"
//               className={({ isActive }) =>
//                 `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
//               }
//               onClick={() => window.innerWidth < 768 && setOpen(false)}
//             >
//               <LayoutDashboard size={20} /> Dashboard
//             </NavLink>
//           )}
//         </nav>

//         <nav className="space-y-3">
//           {role === "USER" && (
//             <>
              
//               <NavLink
//                 to="/home"
//                 end
//                 className={({ isActive }) =>
//                   `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
//                 }
//                 onClick={() => window.innerWidth < 768 && setOpen(false)}
//               >
//                 <House size={20} /> Home
//               </NavLink>

              
//               <NavLink
//                 to="/user/wishlist"
//                 className={({ isActive }) =>
//                   `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
//                 }
//                 onClick={() => window.innerWidth < 768 && setOpen(false)}
//               >
//                 <Heart size={20} /> Favorites
//               </NavLink>


              
//               <NavLink
//                 to="/user/bookings"
//                 className={({ isActive }) =>
//                   `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
//                 }
//                 onClick={() => window.innerWidth < 768 && setOpen(false)}
//               >
//                 <TicketCheck size={20} /> My Bookings
//               </NavLink>

//               <NavLink
//                 to="/user/purchases"
//                 className={({ isActive }) =>
//                   `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
//                 }
//                 onClick={() => window.innerWidth < 768 && setOpen(false)}
//               >
//                 <Wallet size={20} /> My Purchases
//               </NavLink>


//             </>
//           )}
//         </nav>
//       </div>

    
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[100]">
//           <div className="bg-white text-black w-[420px] p-6 rounded-2xl shadow-2xl transform transition-all duration-300 scale-100">
//             <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
           
//             <div className="flex justify-center mb-5">
//               <div className="relative group cursor-pointer">
//                 <img
//                   src={formData.profilePic || "/Image/Profile.png"}
//                   alt="preview"
//                   className="w-30 h-30 rounded-full object-cover border-1 border-gray-200 shadow-md"
//                   onClick={() => document.getElementById("profileUpload").click()}
//                 />
//                 <div
//                   onClick={() => document.getElementById("profileUpload").click()}
//                   className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition duration-300"
//                 >
//                   +
//                 </div>
//                 <input
//                   id="profileUpload"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                 />
//               </div>
//             </div>

//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               className="w-full border p-2 rounded-lg mb-3"
//               placeholder="Username"
//             />

//             <div className="flex items-center border rounded-lg overflow-hidden mb-3 shadow-sm">
//               <div className="flex items-center gap-2 px-3">
//                 <ReactCountryFlag
//                   countryCode="IN"
//                   svg
//                   style={{ width: "2em", height: "1.5em", borderRadius: "4px" }}
//                 />
//                 <span className="text-sm font-medium">+91</span>
//               </div>
//               <input
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="flex-1 p-2 outline-none"
//                 placeholder="Enter phone number"
//               />
//             </div>

//             {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

//             <div className="flex gap-3 mb-4">
//               <input
//                 type="text"
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className="w-1/2 border p-2 rounded-lg"
//                 placeholder="State"
//               />
//               <input
//                 type="text"
//                 name="district"
//                 value={formData.district}
//                 onChange={handleChange}
//                 className="w-1/2 border p-2 rounded-lg"
//                 placeholder="District"
//               />
//             </div>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-5 py-2 rounded-lg bg-white border border-black text-black hover:bg-gray-100 transition duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition duration-200"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default SideBar;

import { NavLink, useNavigate } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import toast from "react-hot-toast";
import { Ticket } from "lucide-react";
import { LogOut } from 'lucide-react';
import { House } from 'lucide-react';
import { Heart } from "lucide-react";
import { Wallet } from "lucide-react";
import { TicketCheck } from "lucide-react";
import API from "../../API/Api";




import {
  LayoutDashboard,
  Calendar,
  Users,
  Menu,
  ChevronDown,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";

function SideBar() {
  const { user, role, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    profilePic: "",
  });


  useEffect(() => {
    if (showModal && user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        state: user.address?.state || "",
        district: user.address?.district || "",
        profilePic: user.profilePic || "",
      });
    }
  }, [showModal, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSave = async () => {
    setError("");

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      toast.error("Phone Number Must Be 10 Digits");
      return;
    }

    try {
      const response = await API.patch("/user/profile", {
        username: formData.username,
        phone: formData.phone,
        profilePic: formData.profilePic,
        address: {
          state: formData.state,
          district: formData.district,
        },
      });

      const data = response.data;

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("User Details Updated Successfully");
      setShowModal(false);

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed To Update Details"
      );
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImage = new FormData();
    formDataImage.append("image", file);

    try {
      const { data } = await API.post("/image/upload", formDataImage);

      setFormData((prev) => ({
        ...prev,
        profilePic: data.url,
      }));
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Image Upload Failed");
    }
  };

  const linkStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200";


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>

      <button
        onClick={() => setOpen(!open)}
        className="fixed top-1 left-1 z-50 bg-black text-white p-2 rounded-lg md:hidden"
      >
        <Menu size={22} />
      </button>


      <div
        className={`fixed top-8 left-12 md:top-5 md:left-5 md:bottom-5 w-72 
          bg-black text-white border-2 border-white/20 rounded-3xl shadow-2xl 
          p-6 z-50 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-[120%]"} 
          md:translate-x-0`}
      >


        <div className="flex items-start gap-3 mb-8">
          <div className="bg-white text-white p-3 rounded-xl">
            <Ticket size={65} color="black" />
          </div>
          <h1 className="text-2xl font-bold leading-tight">
            Book <br /> My <br /> Ticket
          </h1>
        </div>


        <div className="relative mb-8">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative flex items-center bg-white/10 p-4 rounded-xl cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <img
                src={user?.profilePic || "/Image/Profile.png"}
                alt="profile"
                className="w-18 h-18 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="font-semibold break-words">{user?.username}</p>
                <p className="text-sm text-gray-400 break-words">{user?.email}</p>
                {user?.phone && (
                  <p className="text-xs text-gray-400 mt-1 break-words">+91 {user.phone}</p>
                )}
                {user?.address && (
                  <p className="text-xs text-gray-500 mt-1 break-words">
                    {user?.address?.district && user?.address?.state
                      ? `${user.address.district}, ${user.address.state}`
                      : ""}
                  </p>
                )}
              </div>
            </div>
            <div
              className={`absolute top-3 right-3 w-4 h-4 flex items-center justify-center rounded-full 
              bg-white/20 hover:bg-white/30 transition-all duration-300`}
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
              />
            </div>
          </div>

          {showDropdown && (
            <div className="absolute left-0 mt-2 w-full bg-[#111] border border-white/20 rounded-xl p-3 space-y-2 z-50">
              {role === "USER" && (
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2 w-full hover:bg-white/10 p-2 rounded-lg"
                >
                  <User size={16} />
                  Edit Profile
                </button>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex items-center gap-2 w-full hover:bg-white/10 p-2 rounded-lg text-red-400"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>


        <nav className="space-y-3">
          {role === "ADMIN" && (
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
              }
              onClick={() => window.innerWidth < 768 && setOpen(false)}
            >
              <House size={20} /> Home
            </NavLink>
          )}


          {role === "ADMIN" && (
            <NavLink
              to="/admin/events"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
              }
              onClick={() => window.innerWidth < 768 && setOpen(false)}
            >
              <Calendar size={20} /> Events
            </NavLink>
          )}

          {role === "ADMIN" && (
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
              }
              onClick={() => window.innerWidth < 768 && setOpen(false)}
            >
              <Users size={20} /> Users
            </NavLink>
          )}

          {role === "ADMIN" && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
              }
              onClick={() => window.innerWidth < 768 && setOpen(false)}
            >
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
          )}
        </nav>

        <nav className="space-y-3">
          {role === "USER" && (
            <>

              <NavLink
                to="/home"
                end
                className={({ isActive }) =>
                  `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
                }
                onClick={() => window.innerWidth < 768 && setOpen(false)}
              >
                <House size={20} /> Home
              </NavLink>


              <NavLink
                to="/user/wishlist"
                className={({ isActive }) =>
                  `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
                }
                onClick={() => window.innerWidth < 768 && setOpen(false)}
              >
                <Heart size={20} /> Favorites
              </NavLink>



              <NavLink
                to="/user/bookings"
                className={({ isActive }) =>
                  `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
                }
                onClick={() => window.innerWidth < 768 && setOpen(false)}
              >
                <TicketCheck size={20} /> My Bookings
              </NavLink>

              <NavLink
                to="/user/purchases"
                className={({ isActive }) =>
                  `${linkStyle} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
                }
                onClick={() => window.innerWidth < 768 && setOpen(false)}
              >
                <Wallet size={20} /> My Purchases
              </NavLink>


            </>
          )}
        </nav>
      </div>


      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[100]">
          <div className="bg-white text-black w-[420px] p-6 rounded-2xl shadow-2xl transform transition-all duration-300 scale-100">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <div className="flex justify-center mb-5">
              <div className="relative group cursor-pointer">
                <img
                  src={formData.profilePic || "/Image/Profile.png"}
                  alt="preview"
                  className="w-30 h-30 rounded-full object-cover border-1 border-gray-200 shadow-md"
                  onClick={() => document.getElementById("profileUpload").click()}
                />
                <div
                  onClick={() => document.getElementById("profileUpload").click()}
                  className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition duration-300"
                >
                  +
                </div>
                <input
                  id="profileUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg mb-3"
              placeholder="Username"
            />

            <div className="flex items-center border rounded-lg overflow-hidden mb-3 shadow-sm">
              <div className="flex items-center gap-2 px-3">
                <ReactCountryFlag
                  countryCode="IN"
                  svg
                  style={{ width: "2em", height: "1.5em", borderRadius: "4px" }}
                />
                <span className="text-sm font-medium">+91</span>
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 p-2 outline-none"
                placeholder="Enter phone number"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-1/2 border p-2 rounded-lg"
                placeholder="State"
              />
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-1/2 border p-2 rounded-lg"
                placeholder="District"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg bg-white border border-black text-black hover:bg-gray-100 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



export default SideBar;
