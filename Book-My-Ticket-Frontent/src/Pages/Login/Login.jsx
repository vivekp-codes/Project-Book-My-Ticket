import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../API/Api";
import { useAuth } from "../../Context/AuthContext";



const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = form;

        if (!email || !password) {
            toast.error("Please Enter Email And Password");
            return;
        }

        if (password.length < 6) {
            toast.error("Password Must Be At Least 6 Characters");
            return;
        }

        try {
            setLoading(true);

            const res = await API.post("/user/login", form);

            const { token, user } = res.data;
            login(user, token);

            if (user.role === "ADMIN") {
                toast.success("Admin Login Successful !");
            } else {
                toast.success("Login Successful !");
            }

            setTimeout(() => {
                if (user.role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate("/home");
                }
            }, 1200);

        } catch (err) {
            toast.error(err.response?.data?.message || "Login Failed");
            setLoading(false);
        }
    };

    return (
        <div className=" login-main w-screen h-screen flex overflow-hidden">


            <div className="hidden md:block w-1/2 relative bg-black w-[1000px]">
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


            <div className="w-full md:w-1/2 bg-white px-10 flex flex-col justify-center md:mr-[150px] ">


                <div className="flex items-start gap-3 mb-8 md:ml-[100px]">
                    <div className="bg-black text-white p-3 rounded-xl">
                        <Ticket size={65} />
                    </div>
                    <h1 className="text-2xl font-bold leading-tight text-black">
                        Book <br /> My <br /> Ticket
                    </h1>
                </div>

                <h2 className="text-2xl font-semibold mb-2 md:ml-[100px]">
                    Welcome back
                </h2>
                <p className="text-gray-500 mb-6 md:ml-[100px]">
                    Login to continue booking your favorite events.
                </p>


                <form onSubmit={handleSubmit} className="space-y-4 max-w-md md:ml-[100px]">

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
                            Minimum 6 characters
                        </p>
                    </div>

                    <p
                        onClick={() => navigate("/reset-password")}
                        className="text-xs text-right mt-1 text-gray-500 cursor-pointer hover:underline"
                    >
                        Forgot Password?
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Login"
                        )}
                    </button>

                </form>


                <p className="text-sm text-gray-600 mt-6 md:ml-[100px]">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-black font-semibold cursor-pointer hover:underline "
                    >
                        Sign up
                    </span>
                </p>
            </div>

        </div>
    );
};

export default Login;
