import { useEffect, useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CinemasPage = () => {
  const [cinemas, setCinemas] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    fetchCinemas();
    fetchMovies();
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

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (
      !cinemaData.name ||
      !cinemaData.location ||
      !showData.movieId ||
      !showData.showDate ||
      showData.showTimes.some(t => !t)
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Create cinema
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

      // Create shows
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

      // ✅ SINGLE TOAST MESSAGE (cinemas + shows)
      toast.success("Cinemas and shows added successfully 🎬");

      setIsModalOpen(false);
      resetForm();
      fetchCinemas();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  /* ================= DELETE ================= */

  const handleDeleteCinema = (cinemaId) => {
    if (!window.confirm("Delete this cinema and all its shows?")) return;

    const previousCinemas = cinemas;
    setCinemas(prev => prev.filter(c => c._id !== cinemaId));

    const deleteRequest = fetch(
      `http://localhost:3000/api/cinemas/${cinemaId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    });

    toast.promise(deleteRequest, {
      pending: "Deleting cinema and shows...",
      success: "Cinema and shows deleted successfully 🎟️",
      error: {
        render({ data }) {
          setCinemas(previousCinemas);
          return data?.message || "Failed to delete cinema";
        }
      }
    });
  };

  /* ================= UI ================= */

  return (
    <>
      {/* ✅ TOAST CONTAINER */}
      <ToastContainer position="top-right" autoClose={3000} />

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
              </div>
            ))}
          </div>
        </div>

        {/* MODAL */}
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
