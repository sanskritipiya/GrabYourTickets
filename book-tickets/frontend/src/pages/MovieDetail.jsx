import { useMemo, useState, useEffect } from "react"
import { useParams, Link, useSearchParams } from "react-router-dom"
import axios from "axios"
import { upcomingReleases } from "../assets/assets"

const MovieDetail = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isUpcoming = searchParams.get("upcoming") === "1"

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  const [showPicker, setShowPicker] = useState(false)
  const [cinemas, setCinemas] = useState([])
  const [loadingShows, setLoadingShows] = useState(false)

  /* ---------- UPCOMING MOVIE ---------- */
  const upcoming = useMemo(() => {
    return upcomingReleases.find((m) => String(m.id) === String(id))
  }, [id])

  /* ---------- FETCH MOVIE ---------- */
  useEffect(() => {
    if (isUpcoming) {
      setLoading(false)
      return
    }

    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/movies/${id}`
        )
        setMovie(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id, isUpcoming])

  const activeMovie = isUpcoming ? upcoming : movie
  const activeMovieId = activeMovie?._id || activeMovie?.id

  /* ---------- FETCH CINEMAS WITH SHOWS ---------- */
  const fetchCinemasAndShows = async () => {
    // Check if movie ID is available
    if (!activeMovieId) {
      console.error("Movie ID not available yet")
      return
    }

    console.log("Fetching shows for movie ID:", activeMovieId)

    try {
      setLoadingShows(true)

      // 1️⃣ Fetch all shows for this movie directly (more efficient)
      const showsRes = await axios.get(
        `http://localhost:3000/api/shows?movieId=${activeMovieId}`
      )

      const allShows = showsRes.data.data || []
      console.log(`Found ${allShows.length} shows for movie ${activeMovieId}`)
      
      if (allShows.length > 0) {
        console.log("Sample show data:", allShows[0])
      }

      if (!allShows.length) {
        console.log("No shows found for this movie")
        console.log("API Response:", showsRes.data)
        setCinemas([])
        return
      }

      // 2️⃣ Get all cinemas to get cinema details
      const cinemaRes = await axios.get(
        "http://localhost:3000/api/cinemas"
      )

      const cinemaList = cinemaRes.data.data || []
      
      // 3️⃣ Group shows by cinema
      const cinemaMap = new Map()
      
      // Initialize map with all cinemas
      cinemaList.forEach(cinema => {
        cinemaMap.set(String(cinema._id), {
          ...cinema,
          shows: []
        })
      })

      // Group shows by cinema
      allShows.forEach(show => {
        const cinemaId = show.cinemaId?._id || show.cinemaId
        const cinemaIdStr = String(cinemaId)
        
        if (cinemaMap.has(cinemaIdStr)) {
          cinemaMap.get(cinemaIdStr).shows.push(show)
        } else {
          // If cinema not found in list, create entry
          console.warn(`Cinema ${cinemaIdStr} not found in cinema list`)
          cinemaMap.set(cinemaIdStr, {
            _id: cinemaId,
            name: show.cinemaId?.name || "Unknown Cinema",
            location: show.cinemaId?.location || "",
            shows: [show]
          })
        }
      })

      // Convert map to array and filter out cinemas with no shows
      const cinemaWithShows = Array.from(cinemaMap.values())
        .filter(cinema => cinema.shows.length > 0)

      console.log(`Grouped shows into ${cinemaWithShows.length} cinemas`)
      setCinemas(cinemaWithShows)
    } catch (err) {
      console.error("Failed to load cinemas & shows", err)
      console.error("Error details:", err.response?.data || err.message)
      setCinemas([])
    } finally {
      setLoadingShows(false)
    }
  }

  /* ---------- BOOK NOW TOGGLE ---------- */
  const handleBookNow = () => {
    if (showPicker) {
      setShowPicker(false)
      return
    }

    // Only show picker if movie is loaded
    if (!activeMovieId) {
      console.error("Cannot fetch shows: Movie ID not available")
      return
    }

    setShowPicker(true)
    fetchCinemasAndShows()
  }

  /* ---------- STATES ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading...
      </div>
    )
  }

  if (!activeMovie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Movie not found
      </div>
    )
  }

  /* ---------- UI ---------- */
  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* MOVIE INFO */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-full md:w-80 flex-shrink-0">
            <img
              src={activeMovie.image || "/images/popcorn.png"}
              alt={activeMovie.title}
              className="w-full h-[500px] object-cover rounded-xl shadow-2xl border-2 border-gray-700"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-white">
              {activeMovie.title}
            </h1>

            {/* Movie Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                {activeMovie.language && (
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">Language:</span>
                    <span className="px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full text-white text-sm">
                      {activeMovie.language}
                    </span>
                  </div>
                )}
                {activeMovie.duration && (
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">Duration:</span>
                    <span className="text-gray-300">{activeMovie.duration} mins</span>
                  </div>
                )}
              </div>

              {activeMovie.genre && (
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">Genre:</span>
                  <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/50 rounded-full text-white text-sm">
                    {activeMovie.genre}
                  </span>
                </div>
              )}
            </div>

            {activeMovie.description && (
              <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed text-base">
                  {activeMovie.description}
                </p>
              </div>
            )}

            {!isUpcoming && (
              <button
                onClick={handleBookNow}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-8 py-4 rounded-lg font-semibold text-white text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {showPicker ? "Hide Showtimes" : "Book Now"}
              </button>
            )}
          </div>
        </div>

        {/* CINEMAS & SHOWS */}
        {showPicker && (
          <div className="mt-12 border-2 border-red-500 rounded-xl p-8">
            <h2 className="text-3xl font-semibold text-white mb-8 text-center">
              Select Showtime
            </h2>

            {loadingShows && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                <p className="text-white mt-4 text-lg">
                  Loading cinemas & shows...
                </p>
              </div>
            )}

            {!loadingShows &&
              cinemas.length > 0 &&
              <div className="space-y-6">
                {cinemas.map((cinema) => {
                  if (!cinema.shows || cinema.shows.length === 0) return null

                  return (
                    <div
                      key={cinema._id}
                      className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-xl p-6 shadow-2xl hover:border-red-500/50 transition-all duration-300"
                    >
                      <div className="mb-5 pb-4 border-b border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-semibold text-white">
                            {cinema.name}
                          </h3>
                        </div>
                        {cinema.location && (
                          <div className="flex items-center gap-2">
                            <p className="text-gray-300 text-base">
                              {cinema.location}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                          Available Showtimes
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {cinema.shows.map((show) => (
                            <Link
                              key={show._id}
                              to={`/booking/${show._id}`}
                              className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 border-2 border-green-500 rounded-lg text-white font-semibold hover:from-green-500 hover:to-emerald-500 hover:border-green-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
                            >
                              {show.showDate && (
                                <span className="block text-xs mb-1 opacity-90 font-normal">
                                  {new Date(show.showDate).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              )}
                              <span className="text-base">{show.time}</span>
                              <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            }

            {!loadingShows &&
              (cinemas.length === 0 || cinemas.every((c) => !c.shows || c.shows.length === 0)) && (
                <div className="text-center py-16 bg-gray-900/50 rounded-xl border-2 border-gray-800">
                  <p className="text-white text-xl mb-2 font-semibold">
                    No shows available for this movie.
                  </p>
                  <p className="text-gray-400 text-base">
                    Please check back later or contact the cinema.
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieDetail