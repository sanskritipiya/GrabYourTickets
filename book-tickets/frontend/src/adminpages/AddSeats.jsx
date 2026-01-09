import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, X, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

export default function SeatsPage() {
  const [cinemas, setCinemas] = useState([]);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [seatLayouts, setSeatLayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddSeats, setShowAddSeats] = useState(false);
  const [toast, setToast] = useState(null);

  const [seatConfig, setSeatConfig] = useState({
    cinemaId: "",
    movieId: "",
    movieName: "",
    showId: "",
    hallName: "",
    rows: 5,
    columns: 8,
  });

  // Custom Toast Function
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/cinemas")
      .then(res => setCinemas(res.data?.data || []))
      .catch(() => showToast("Failed to load cinemas", "error"));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/movies")
      .then(res => setMovies(res.data?.data || []))
      .catch(() => showToast("Failed to load movies", "error"));
  }, []);

  const fetchShowsByMovie = async movieId => {
    if (!movieId) {
      setShows([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3000/api/shows?movieId=${movieId}`
      );
      setShows(res.data?.data || []);
    } catch {
      showToast("Failed to load shows", "error");
    }
  };

  const fetchSeats = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/seats");

      const grouped = {};
      res.data.seats.forEach(seat => {
        const key = `${seat.cinemaId?.name}-${seat.hallName}-${seat.showId?._id}`;

        if (!grouped[key]) {
          grouped[key] = {
            cinemaName: seat.cinemaId?.name,
            cinemaId: seat.cinemaId?._id,
            movieName: seat.movieName || "Unknown Movie",
            hallName: seat.hallName,
            showId: seat.showId?._id,
            showDate: seat.showId?.showDate || "N/A",
            showTime: seat.showId?.time || "N/A",
            seats: [],
          };
        }
        grouped[key].seats.push(seat);
      });

      setSeatLayouts(Object.values(grouped));
    } catch {
      showToast("Failed to load seat layouts", "error");
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  const generateSeats = (rows, columns) => {
    const seats = [];
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= columns; c++) {
        seats.push({ row: r, column: c });
      }
    }
    return seats;
  };

  const handleCreateSeatLayout = async () => {
    const { cinemaId, movieId, movieName, showId, hallName } = seatConfig;

    if (!cinemaId || !movieId || !movieName || !showId || !hallName) {
      showToast("Cinema, Movie, Show and Hall are required", "warning");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Admin login required", "error");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3000/api/seats",
        {
          cinemaId,
          showId,
          movieId,
          movieName,
          hallName,
          seats: generateSeats(seatConfig.rows, seatConfig.columns),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("Seats created successfully", "success");
      setShowAddSeats(false);
      setSeatConfig({
        cinemaId: "",
        movieId: "",
        movieName: "",
        showId: "",
        hallName: "",
        rows: 5,
        columns: 8,
      });
      fetchSeats();
    } catch (err) {
      showToast(err.response?.data?.message || "Creation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSeats = async (
    cinemaId,
    hallName,
    showId,
    cinemaName
  ) => {
    if (!cinemaId || !hallName || !showId) {
      showToast("Missing delete parameters", "error");
      return;
    }

    if (!window.confirm(`Delete seats for ${cinemaName} - ${hallName}?`)) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Admin login required", "error");
      return;
    }

    try {
      await axios({
        method: "DELETE",
        url: "http://localhost:3000/api/seats",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          cinemaId,
          hallName,
          showId,
        },
      });

      showToast("Seats deleted successfully", "success");
      fetchSeats();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const renderSavedLayouts = () => {
    if (seatLayouts.length === 0) {
      return (
        <div className="mt-6 text-center py-12">
          <p className="text-gray-500 text-sm">No seat layouts created yet</p>
        </div>
      );
    }

    return (
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-3">Created Seat Layouts</h3>

        {seatLayouts.map((layout, idx) => {
          const rowsMap = {};
          layout.seats.forEach(seat => {
            if (!rowsMap[seat.row]) rowsMap[seat.row] = [];
            rowsMap[seat.row].push(seat);
          });

          return (
            <div key={idx} className="mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-base font-semibold text-gray-800">
                    {layout.cinemaName} — {layout.hallName}
                  </h4>
                  <p className="text-sm text-red-600 font-medium mt-0.5">
                    🎬 {layout.movieName}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {layout.showDate} | {layout.showTime}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleDeleteSeats(
                      layout.cinemaId,
                      layout.hallName,
                      layout.showId,
                      layout.cinemaName
                    )
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>

              <div className="flex justify-center gap-6 mb-3 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-green-500"></div>
                  <span className="text-xs font-medium">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-red-500"></div>
                  <span className="text-xs font-medium">Booked</span>
                </div>
              </div>

              <div className="flex flex-col items-center mb-3">
                <div className="text-xs font-bold text-gray-700 mb-1.5">SCREEN</div>
                <div className="w-2/3 h-0.5 bg-gradient-to-r from-transparent via-gray-800 to-transparent rounded-full"></div>
              </div>

              <div className="w-full flex justify-center">
                <div className="inline-block">
                  <div className="flex flex-col gap-1">
                    {Object.keys(rowsMap)
                      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                      .map(row => (
                        <div key={row} className="flex gap-1 items-center">
                          <span className="w-5 text-center text-xs font-bold text-gray-700 flex-shrink-0">
                            {row}
                          </span>

                          {rowsMap[row]
                            .sort((a, b) => a.column - b.column)
                            .map(seat => (
                              <div
                                key={seat._id}
                                className={`w-7 h-7 rounded flex items-center justify-center text-white font-bold text-[10px] transition-all flex-shrink-0 ${
                                  seat.status === "BOOKED" 
                                    ? "bg-red-500 cursor-not-allowed" 
                                    : "bg-green-500"
                                }`}
                              >
                                {seat.seatNumber}
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
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

      <div className="w-full px-4 py-4">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Manage Theater Seats</h2>
            <button
              onClick={() => setShowAddSeats(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm flex items-center gap-1.5 transition-colors shadow-md flex-shrink-0"
            >
              <Plus size={16} /> Add Seats
            </button>
          </div>

          {showAddSeats && (
            <div className="bg-white w-full max-w-4xl mx-auto mb-4 p-4 border-2 border-red-600 rounded-lg shadow-lg relative">
              <button
                onClick={() => setShowAddSeats(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Add Seat Layout
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Cinema <span className="text-red-600">*</span>
                  </label>
                  <select
                    className="border border-gray-300 px-2.5 py-1.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    value={seatConfig.cinemaId}
                    onChange={e =>
                      setSeatConfig({
                        ...seatConfig,
                        cinemaId: e.target.value,
                        movieId: "",
                        movieName: "",
                        showId: "",
                      })
                    }
                  >
                    <option value="">Select Cinema</option>
                    {cinemas.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Movie <span className="text-red-600">*</span>
                  </label>
                  <select
                    className="border border-gray-300 px-2.5 py-1.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    value={seatConfig.movieId}
                    onChange={e => {
                      const movieId = e.target.value;
                      const movie = movies.find(m => m._id === movieId);

                      setSeatConfig({
                        ...seatConfig,
                        movieId,
                        movieName: movie?.title || "",
                        showId: "",
                      });

                      fetchShowsByMovie(movieId);
                    }}
                  >
                    <option value="">Select Movie</option>
                    {movies.map(m => (
                      <option key={m._id} value={m._id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Show Time <span className="text-red-600">*</span>
                  </label>
                  <select
                    className="border border-gray-300 px-2.5 py-1.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                    value={seatConfig.showId}
                    disabled={!seatConfig.movieId}
                    onChange={e =>
                      setSeatConfig({ ...seatConfig, showId: e.target.value })
                    }
                  >
                    <option value="">
                      {seatConfig.movieId
                        ? "Select Show Time"
                        : "Select Movie First"}
                    </option>

                    {shows.map(s => (
                      <option key={s._id} value={s._id}>
                        {s.showDate} — {s.time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Hall Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Hall 1"
                    className="border border-gray-300 px-2.5 py-1.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    value={seatConfig.hallName}
                    onChange={e =>
                      setSeatConfig({ ...seatConfig, hallName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Rows <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="5"
                    min="1"
                    max="26"
                    className="border border-gray-300 px-2.5 py-1.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    value={seatConfig.rows}
                    onChange={e =>
                      setSeatConfig({ ...seatConfig, rows: +e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Columns <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="8"
                    min="1"
                    max="20"
                    className="border border-gray-300 px-2.5 py-1.5 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    value={seatConfig.columns}
                    onChange={e =>
                      setSeatConfig({ ...seatConfig, columns: +e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                onClick={handleCreateSeatLayout}
                disabled={loading}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded w-full text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Add Seats"}
              </button>
            </div>
          )}

          {renderSavedLayouts()}
        </div>
      </div>
    </div>
  );
}