import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../API/Api";

const ChangePassword = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, newPassword, confirmPassword } = form;

        if (!email || !newPassword || !confirmPassword) {
            toast.error("All Fields Are Required");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password Must Be At Least 6 Characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords Do Not Match");
            return;
        }

        try {

            setLoading(true);

            await API.patch("/user/reset-password", form);

            toast.success("Password Changed Successfully");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (err) {
            toast.error(err.response?.data?.message || "Password Reset Failed");
            setLoading(false);
        }
    };

    return (
        <div className="login-main w-screen h-screen flex overflow-hidden">


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


            <div className="w-full md:w-1/2 bg-white px-10 flex flex-col justify-center md:mr-[150px]">


                <div className="flex items-start gap-3 mb-8 md:ml-[100px]">
                    <div className="bg-black text-white p-3 rounded-xl">
                        <Ticket size={65} />
                    </div>
                    <h1 className="text-2xl font-bold leading-tight text-black">
                        Book <br /> My <br /> Ticket
                    </h1>
                </div>


                <h2 className="text-2xl font-semibold mb-2 md:ml-[100px]">
                    Reset Password
                </h2>

                <p className="text-gray-500 mb-6 md:ml-[100px]">
                    Enter your email and new password to reset your account password.
                </p>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 max-w-md md:ml-[100px]"
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        onChange={handleChange}
                        className="w-full rounded-lg px-4 py-2
                        border border-gray-300
                        focus:outline-none
                        focus:border-2 focus:border-black"
                    />

                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        onChange={handleChange}
                        className="w-full rounded-lg px-4 py-2
                        border border-gray-300
                        focus:outline-none
                        focus:border-2 focus:border-black"
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        className="w-full rounded-lg px-4 py-2
                        border border-gray-300
                        focus:outline-none
                        focus:border-2 focus:border-black"
                    />

                    <p className="text-xs text-gray-500">
                        Minimum 6 characters
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Change Password"
                        )}
                    </button>

                </form>

                <p className="text-sm text-gray-600 mt-6 md:ml-[100px]">
                    Remember your password?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-black font-semibold cursor-pointer hover:underline"
                    >
                        Back to Login
                    </span>
                </p>

            </div>
        </div>
    );
};

export default ChangePassword;