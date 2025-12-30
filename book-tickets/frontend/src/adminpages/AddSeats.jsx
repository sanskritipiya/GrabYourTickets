import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SeatsPage() {
  const [cinemas, setCinemas] = useState([]);
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]); // ✅ NEW
  const [seatLayouts, setSeatLayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddSeats, setShowAddSeats] = useState(false);

  const [seatConfig, setSeatConfig] = useState({
    cinemaId: "",
    showId: "",
    movieId: "",      // ✅ NEW
    movieName: "",    // ✅ NEW
    hallName: "",
    rows: 5,
    columns: 8,
  });

  /* =======================
     FETCH CINEMAS
  ======================== */
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/cinemas")
      .then(res => setCinemas(res.data?.data || []))
      .catch(() => toast.error("Failed to load cinemas"));
  }, []);

  /* =======================
     FETCH SHOWS
  ======================== */
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/shows")
      .then(res => setShows(res.data?.data || []))
      .catch(() => toast.error("Failed to load shows"));
  }, []);

  /* =======================
     FETCH MOVIES (✅ NEW)
  ======================== */
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/movies")
      .then(res => setMovies(res.data?.data || []))
      .catch(() => toast.error("Failed to load movies"));
  }, []);

  /* =======================
     FETCH SEATS
  ======================== */
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
            hallName: seat.hallName,
            showId: seat.showId?._id,
            showLabel: seat.showId?.time || "Show",
            seats: [],
          };
        }
        grouped[key].seats.push(seat);
      });

      setSeatLayouts(Object.values(grouped));
    } catch {
      toast.error("Failed to load seat layouts");
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  /* =======================
     GENERATE SEATS
  ======================== */
  const generateSeats = (rows, columns) => {
    const seats = [];
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= columns; c++) {
        seats.push({ row: r, column: c });
      }
    }
    return seats;
  };

  /* =======================
     CREATE SEATS
  ======================== */
  const handleCreateSeatLayout = async () => {
    if (
      !seatConfig.cinemaId ||
      !seatConfig.showId ||
      !seatConfig.movieId ||     // ✅ NEW
      !seatConfig.movieName ||   // ✅ NEW
      !seatConfig.hallName
    ) {
      toast.warn("Cinema, Show, Movie and Hall Name required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Admin login required");

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3000/api/seats",
        {
          cinemaId: seatConfig.cinemaId,
          showId: seatConfig.showId,
          movieId: seatConfig.movieId,       // ✅ NEW
          movieName: seatConfig.movieName,   // ✅ NEW
          hallName: seatConfig.hallName,
          seats: generateSeats(seatConfig.rows, seatConfig.columns),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Seats created 🎉");
      setShowAddSeats(false);
      fetchSeats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     DELETE SEATS
  ======================== */
  const handleDeleteSeats = async (
    cinemaId,
    hallName,
    showId,
    cinemaName
  ) => {
    if (!window.confirm(`Delete seats for ${cinemaName} - ${hallName}?`)) return;

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Admin login required");

    try {
      await axios.delete("http://localhost:3000/api/seats", {
        data: { cinemaId, hallName, showId },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Seats deleted");
      fetchSeats();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =======================
     ROW LABEL
  ======================== */
  const rowLabel = n => String.fromCharCode(64 + n);

  /* =======================
     RENDER SEATS
  ======================== */
  const renderSavedLayouts = () => (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-6">Created Seat Layouts</h3>

      {seatLayouts.map((layout, idx) => {
        const rowsMap = {};
        layout.seats.forEach(seat => {
          if (!rowsMap[seat.row]) rowsMap[seat.row] = [];
          rowsMap[seat.row].push(seat);
        });

        return (
          <div key={idx} className="mb-6 p-4 border rounded bg-gray-50">
            <div className="flex justify-between mb-2">
              <h4 className="font-semibold">
                {layout.cinemaName} — {layout.hallName} ({layout.showLabel})
              </h4>

              <button
                onClick={() =>
                  handleDeleteSeats(
                    layout.cinemaId,
                    layout.hallName,
                    layout.showId,
                    layout.cinemaName
                  )
                }
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {Object.keys(rowsMap)
              .sort((a, b) => a - b)
              .map(row => (
                <div key={row} className="flex gap-1 items-center mb-1">
                  <span className="w-8 text-xs font-semibold">
                    {rowLabel(Number(row))}
                  </span>

                  {rowsMap[row]
                    .sort((a, b) => a.column - b.column)
                    .map(seat => (
                      <div
                        key={seat._id}
                        className={`w-6 h-6 rounded bg-gray-700 text-white text-xs 
                        flex items-center justify-center ${
                          seat.status === "BOOKED" ? "opacity-50" : ""
                        }`}
                      >
                        {seat.column}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-white">
      <ToastContainer />

      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-bold">Manage Theater Seats</h2>
        <button
          onClick={() => setShowAddSeats(true)}
          className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add Seats
        </button>
      </div>

      {showAddSeats && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white w-[520px] p-6 border border-red-500 rounded">
            <h3 className="text-xl font-bold mb-4 text-red-600">
              Add Seat Layout
            </h3>

            {/* CINEMA */}
            <select
              className="border px-3 py-2 rounded w-full mb-3"
              value={seatConfig.cinemaId}
              onChange={e =>
                setSeatConfig({ ...seatConfig, cinemaId: e.target.value })
              }
            >
              <option value="">Select Cinema</option>
              {cinemas.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* SHOW */}
            <select
              className="border px-3 py-2 rounded w-full mb-3"
              value={seatConfig.showId}
              onChange={e =>
                setSeatConfig({ ...seatConfig, showId: e.target.value })
              }
            >
              <option value="">Select Show</option>
              {shows.map(s => (
                <option key={s._id} value={s._id}>
                  {s.time}
                </option>
              ))}
            </select>

            {/* MOVIE (✅ NEW) */}
            <select
              className="border px-3 py-2 rounded w-full mb-3"
              value={seatConfig.movieId}
              onChange={e => {
                const movie = movies.find(m => m._id === e.target.value);
                setSeatConfig({
                  ...seatConfig,
                  movieId: movie?._id || "",
                  movieName: movie?.title || "",
                });
              }}
            >
              <option value="">Select Movie</option>
              {movies.map(m => (
                <option key={m._id} value={m._id}>
                  {m.title}
                </option>
              ))}
            </select>

            {/* HALL */}
            <input
              placeholder="Hall Name"
              className="border px-3 py-2 rounded w-full mb-3"
              value={seatConfig.hallName}
              onChange={e =>
                setSeatConfig({ ...seatConfig, hallName: e.target.value })
              }
            />

            <div className="flex gap-2 mb-3">
              <input
                type="number"
                placeholder="Rows"
                className="border px-3 py-2 rounded w-full"
                value={seatConfig.rows}
                onChange={e =>
                  setSeatConfig({ ...seatConfig, rows: +e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Columns"
                className="border px-3 py-2 rounded w-full"
                value={seatConfig.columns}
                onChange={e =>
                  setSeatConfig({ ...seatConfig, columns: +e.target.value })
                }
              />
            </div>

            <button
              onClick={handleCreateSeatLayout}
              className="bg-red-600 text-white px-6 py-2 rounded"
            >
              {loading ? "Creating..." : "Add Seats"}
            </button>
          </div>
        </div>
      )}

      {renderSavedLayouts()}
    </div>
  );
}
