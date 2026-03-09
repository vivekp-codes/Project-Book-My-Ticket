import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";

const UserFooter = () => {
  return (
    /* CHANGES MADE:
       1. Changed mx-6 to mx-4 (to make it wider/closer to the edges)
       2. Kept mb-6 so the bottom rounded corners don't hit the screen edge
       3. Kept rounded-3xl for the smooth corner look
    */
    <footer className="bg-black text-gray-300 pt-10 pb-6 px-3 md:px-12 rounded-3xl overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Defined custom grid columns: 30%, 20%, 30%, 20% */}
        <div className="grid md:grid-cols-[40%_20%_40%] gap-8">
          {/* Logo + About */}
          <div>
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-white text-black p-3 rounded-xl">
                <Ticket size={65} />
              </div>
              <h1 className="text-2xl font-bold leading-tight text-white">
                Book <br /> My <br /> Ticket
              </h1>
            </div>
            <p className="text-gray-400 text-sm">
              Book My Ticket is a full-stack MERN project providing seamless ticket booking and management for users. Modern UI/UX with secure authentication.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/admin" className="hover:text-white">Home</Link></li>
              <li><Link to="/admin/events" className="hover:text-white">Events</Link></li>
              <li><Link to="/admin/users" className="hover:text-white">Users</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-white">Dashboard</Link></li>
              
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Tech Stack</h4>
            <div className="flex flex-wrap gap-4 mb-2 text-3xl">
              <i className="devicon-mongodb-plain colored"></i>
              <i className="devicon-express-original"></i>
              <i className="devicon-react-original colored"></i>
              <i className="devicon-nodejs-plain colored"></i>
             
              <i className="devicon-tailwindcss-plain colored"></i>
            </div>
            <p className="text-gray-400 text-sm">
              Built using MongoDB, Express, React, Node.js, Stripe & TailwindCSS
            </p>
          </div>

          
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
          © 2026 <span className="text-white font-semibold">vivekp-codes</span>. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;