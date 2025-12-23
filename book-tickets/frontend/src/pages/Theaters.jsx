import { useEffect, useState } from "react";
import Footer from "../components/Footer";

const Theatres = () => {
  const [theatres, setTheatres] = useState([]);

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const res = await fetch("/api/cinemas"); // router.get("/", getAllCinemas)
        const data = await res.json();
        setTheatres(data);
      } catch (error) {
        console.error("Failed to fetch cinemas:", error);
      }
    };

    fetchCinemas();
  }, []);

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Our Theatres</h1>
        <p className="text-gray-400 mb-12">Find and visit our premium cinema halls</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {theatres.map((theatre) => (
            <div
              key={theatre.id}
              className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-red-500/20 transition"
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-white">{theatre.name}</h2>
                  <span className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold">
                    ⭐ {theatre.rating}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">📍 Location</p>
                  <p className="text-white font-medium">{theatre.location}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">🏢 Address</p>
                  <p className="text-white font-medium">{theatre.address}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">📞 Phone</p>
                  <a
                    href={`tel:${theatre.phone}`}
                    className="text-red-500 hover:text-red-400 font-medium transition"
                  >
                    {theatre.phone}
                  </a>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">🪑 Screens</p>
                  <p className="text-white font-medium">
                    {theatre.screens} Screens • {theatre.seating} Seats
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">✨ Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {theatre.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Theatres;
