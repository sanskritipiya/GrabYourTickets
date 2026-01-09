import { useEffect, useState } from "react";
import { Plus, MapPin, AlertTriangle, AlertCircle, CheckCircle, X } from "lucide-react";

const CinemasPage = () => {
  const [cinemas, setCinemas] = useState([]);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [cinemaData, setCinemaData] = useState({
    name: "",
    location: ""
  });

  const [showData, setShowData] = useState({
    movieId: "",
    showDate: "",
    showTimes: [""]
  });

  const token = localStorage.getItem("token");

  // Custom Toast Function
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchCinemas();
    fetchMovies();
    fetchShows();
  }, []);

  const fetchCinemas = async () => {
    const res = await fetch("http://localhost:3000/api/cinemas");
    const data = await res.json();
    setCinemas(data.data || []);
  };

  const fetchMovies = async () => {
    const res = await fetch("http://localhost:3000/api/movies");
    const data = await res.json();
    setMovies(data.data || []);
  };

  const fetchShows = async () => {
    const res = await fetch("http://localhost:3000/api/shows");
    const data = await res.json();
    setShows(data.data || []);
  };

  const addShowTime = () => {
    setShowData({
      ...showData,
      showTimes: [...showData.showTimes, ""]
    });
  };

  const handleShowTimeChange = (index, value) => {
    const updated = [...showData.showTimes];
    updated[index] = value;
    setShowData({ ...showData, showTimes: updated });
  };

  const resetForm = () => {
    setCinemaData({ name: "", location: "" });
    setShowData({ movieId: "", showDate: "", showTimes: [""] });
  };

  const handleSubmit = async () => {
    if (
      !cinemaData.name ||
      !cinemaData.location ||
      !showData.movieId ||
      !showData.showDate ||
      showData.showTimes.some(t => !t)
    ) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      const cinemaRes = await fetch("http://localhost:3000/api/cinemas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cinemaData)
      });

      const cinemaJson = await cinemaRes.json();
      const cinemaId = cinemaJson.data._id;

      await Promise.all(
        showData.showTimes.map(time =>
          fetch("http://localhost:3000/api/shows", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              cinemaId,
              movieId: showData.movieId,
              showDate: showData.showDate,
              time
            })
          })
        )
      );

      showToast("Cinemas and shows added successfully", "success");

      setIsModalOpen(false);
      resetForm();
      fetchCinemas();
      fetchShows();
    } catch (err) {
      showToast("Something went wrong", "error");
    }
  };

  const handleDeleteCinema = async (cinemaId) => {
    if (!window.confirm("Delete this cinema and all its shows?")) return;

    const previousCinemas = cinemas;
    setCinemas(prev => prev.filter(c => c._id !== cinemaId));

    try {
      const res = await fetch(
        `http://localhost:3000/api/cinemas/${cinemaId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      showToast("Cinema and shows deleted successfully", "success");
    } catch (err) {
      setCinemas(previousCinemas);
      showToast(err.message || "Failed to delete cinema", "error");
    }
  };

  const getShowsForCinema = cinemaId =>
    shows.filter(show => show.cinemaId?._id === cinemaId);

  const getToastStyles = () => {
    switch (toast?.type) {
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
          text: "text-yellow-800",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: <AlertCircle className="w-6 h-6 text-red-600" />,
          text: "text-red-800",
        };
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          text: "text-green-800",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: <AlertCircle className="w-6 h-6 text-blue-600" />,
          text: "text-blue-800",
        };
    }
  };

  return (
    <>
      {/* Custom Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div
            className={`${getToastStyles().bg} ${getToastStyles().border} border rounded-lg px-6 py-4 shadow-lg min-w-[400px] max-w-[500px]`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">{getToastStyles().icon}</div>
              <p className={`${getToastStyles().text} font-medium flex-1`}>{toast.message}</p>
              <button
                onClick={() => setToast(null)}
                className={`flex-shrink-0 ${getToastStyles().text} opacity-40 hover:opacity-100 transition-opacity`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Manage Cinemas</h2>
              <p className="text-gray-600 mt-1">
                Add cinemas and schedule shows
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 text-white px-4 py-2 rounded flex items-center hover:bg-red-700"
            >
              <Plus className="mr-2" size={18} />
              Add Cinema / Shows
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cinemas.map(cinema => (
              <div
                key={cinema._id}
                className="bg-white p-5 rounded shadow relative"
              >
                <button
                  onClick={() => handleDeleteCinema(cinema._id)}
                  className="absolute top-3 right-3 text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>

                <h3 className="font-bold text-lg">{cinema.name}</h3>

                <p className="text-gray-600 flex items-center mt-2">
                  <MapPin size={16} className="mr-1" />
                  {cinema.location}
                </p>

                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">Shows</h4>

                  {getShowsForCinema(cinema._id).length === 0 ? (
                    <p className="text-sm text-gray-400">No shows added</p>
                  ) : (
                    <ul className="space-y-2">
                      {getShowsForCinema(cinema._id).map(show => (
                        <li
                          key={show._id}
                          className="bg-gray-100 rounded px-3 py-2 text-sm"
                        >
                          <p className="font-medium">
                            🎬 {show.movieId?.title}
                          </p>
                          <p className="text-gray-600">
                            📅 {show.showDate} ⏰ {show.time}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-6">
                Add Cinema & Shows
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  placeholder="Cinema Name *"
                  value={cinemaData.name}
                  onChange={e =>
                    setCinemaData({ ...cinemaData, name: e.target.value })
                  }
                  className="border p-2 rounded"
                />

                <input
                  placeholder="Location *"
                  value={cinemaData.location}
                  onChange={e =>
                    setCinemaData({ ...cinemaData, location: e.target.value })
                  }
                  className="border p-2 rounded"
                />
              </div>

              <select
                value={showData.movieId}
                onChange={e =>
                  setShowData({ ...showData, movieId: e.target.value })
                }
                className="border p-2 rounded w-full mb-3"
              >
                <option value="">Select Movie *</option>
                {movies.map(movie => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={showData.showDate}
                onChange={e =>
                  setShowData({ ...showData, showDate: e.target.value })
                }
                className="border p-2 rounded w-full mb-3"
              />

              {showData.showTimes.map((time, i) => (
                <input
                  key={i}
                  placeholder="Show Time (e.g. 10:30 AM)"
                  value={time}
                  onChange={e => handleShowTimeChange(i, e.target.value)}
                  className="border p-2 rounded w-full mb-2"
                />
              ))}

              <button
                onClick={addShowTime}
                className="text-red-600 text-sm mb-4"
              >
                + Add another show time
              </button>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CinemasPage;