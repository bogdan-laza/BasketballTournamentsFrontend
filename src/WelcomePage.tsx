import { Link } from "react-router-dom";

function WelcomePage(){
    return (
        <div className="relative h-screen w-full bg-cover bg-center"
        style={{backgroundImage:"url('https://sportarena.ro/wp/wp-content/uploads/2021/05/WhatsApp-Image-2021-05-04-at-11.59.30-AM-1.jpeg')"}}
        >
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h1 className="text-7xl md:text-9xl font-extrabold text-white tracking-tighter mb-4 drop-shadow-lg">
                    Hoop<span className="text-orange-500">Zone</span>
                </h1>

                <p className="text-2xl md:text-3xl text-gray-200 font-light mb-12 max-w-2xl drop-shadow-md">
                    Play competitive at any level!
                </p>

                <Link
                    to="/tournaments"
                    className="px-10 py-4 bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-orange-300/30 hover:translate-y-1 transform">
                        View tournaments
                    </Link>
            </div>
        </div>
    );
}

export default WelcomePage;