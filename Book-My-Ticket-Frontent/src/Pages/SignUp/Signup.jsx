import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../API/Api";


const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, email, password, confirmPassword } = form;

        if (!username || !email || !password || !confirmPassword) {
            toast.error("Please Fill All Required Fields");
            return;
        }

        if (password.length < 6) {
            toast.error("Password Must Be At Least 6 Characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords Do Not Match");
            return;
        }

        try {
            setLoading(true);

            await API.post("/user/signup", form);

            toast.success("Signup Successful !");

            setTimeout(() => navigate("/login"), 1500);

        } catch (err) {
            toast.error(err.response?.data?.message || "Signup Failed");
            setLoading(false);
        }
    };

    return (

        <div className="w-screen h-screen flex overflow-hidden">


            <div className=" w-full md:w-1/2 bg-white px-10 flex flex-col justify-center md:ml-[150px] ">


                <div className="flex items-start gap-3 mb-8">
                    <div className="bg-black text-white p-3 rounded-xl">
                        <Ticket size={65} />
                    </div>
                    <h1 className="text-2xl font-bold leading-tight text-black">
                        Book <br /> My <br /> Ticket
                    </h1>
                </div>

                <h2 className="text-2xl font-semibold mb-2 ">
                    Create your account
                </h2>
                <p className="text-gray-500 mb-6">
                    Start booking events, shows and experiences in seconds.
                </p>


                <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

                    <input
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        className="w-full rounded-lg px-4 py-2
               border border-gray-300
               focus:outline-none
               focus:border-2 focus:border-black"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email address"
                        onChange={handleChange}
                        className="w-full rounded-lg px-4 py-2
               border border-gray-300
               focus:outline-none
               focus:border-2 focus:border-black"
                    />

                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full rounded-lg px-4 py-2
                 border border-gray-300
                 focus:outline-none
                 focus:border-2 focus:border-black"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Use at least 6 characters
                        </p>
                    </div>

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        onChange={handleChange}
                        className="w-full rounded-lg px-4 py-2
               border border-gray-300
               focus:outline-none
               focus:border-2 focus:border-black"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Sign Up"
                        )}
                    </button>

                </form>


                <p className="text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-black font-semibold cursor-pointer hover:underline"
                    >
                        Login
                    </span>
                </p>
            </div>


            <div className="hidden md:block w-[1000px] relative bg-black">
                <video
                    src="/Video/Coverpage.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>


        </div>
    );
};

export default Signup;
