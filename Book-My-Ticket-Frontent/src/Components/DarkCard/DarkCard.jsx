import CountUp from "react-countup";

export default function DarkCard({ title, value, gradient, border, isCurrency }) {
    return (
        <div
            className={`
  relative p-6 rounded-2xl
  bg-gradient-to-br ${gradient}
  backdrop-blur-2xl
  border ${border}
  shadow-[0_0_40px_rgba(0,0,0,0.6)]
  transition-all duration-500
  hover:scale-105
  overflow-hidden
`}
        >
            
            <div className="absolute inset-0 rounded-2xl bg-white/5 blur-2xl opacity-30"></div>

            <div className="relative z-10">
                <h3 className="text-gray-300 text-sm font-medium mb-2">
                    {title}
                </h3>
                
                <p className="text-3xl font-bold text-white">
                    {isCurrency && "₹ "}

                    {typeof value === "number" ? (
                        <CountUp
                            key={value}
                            end={value}
                            duration={1.5}
                            separator=","
                        />
                    ) : (
                        value
                    )}
                </p>
            </div>
        </div>
    );
}