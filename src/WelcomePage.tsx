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

                <div className="flex flex-row">
                    <Link
                    to="/signup"
                    className="px-10 py-4 mb-5 bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-orange-300/30 hover:translate-y-0.5 transform">
                        Sign up
                    </Link>

                      <Link
                    to="/login"
                    className="px-10 py-4 mb-5 ml-3 bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-orange-300/30 hover:translate-y-0.5 transform">
                        Log in
                    </Link>

                </div>

                <Link
                    to="/tournaments"
                    className="px-10 py-4 bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-orange-300/30 hover:translate-y-0.5 transform">
                        View tournaments
                    </Link>
            </div>
        </div>
    );
}

export default WelcomePage;

// a bar that has sign up option                                                 done
//change the design for toyrnments to the colors from welcome page
//a bar taht has sign up on all the other pages too if user not signed in
//create the sign up page