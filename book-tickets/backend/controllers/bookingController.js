const Booking = require("../models/Booking");
const Seat = require("../models/Seat");
const Show = require("../models/Show");
const sendBookingEmail = require("../utils/sendBookingEmail");

const SEAT_PRICE = 800;

/* ================= CREATE BOOKING ================= */
exports.createBooking = async (req, res) => {
  try {
    const { showId, seatIds } = req.body;
    const user = req.user;

    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // 🚫 BLOCK ADMIN FROM BOOKING
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins cannot book tickets from user portal",
      });
    }

    if (!showId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Show ID and seats are required",
      });
    }

    const show = await Show.findById(showId)
      .populate("movieId")
      .populate("cinemaId");

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    // 🎬 Movie image handling
    let movieImageUrl = show.movieId?.image;
    if (movieImageUrl && !movieImageUrl.startsWith("http")) {
      const baseUrl = process.env.BASE_URL || "http://localhost:5000";
      movieImageUrl = `${baseUrl}${movieImageUrl.startsWith("/") ? "" : "/"}${movieImageUrl}`;
    }

    // ✅ Only AVAILABLE seats
    const seats = await Seat.find({
      _id: { $in: seatIds },
      showId,
      status: "AVAILABLE",
    });

    if (seats.length !== seatIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some seats are already booked",
      });
    }

    const totalAmount = seats.length * SEAT_PRICE;

    // ✅ Create booking
    const booking = await Booking.create({
      userId: user.id,
      showId,
      seatIds,
      totalAmount,
      bookingStatus: "CONFIRMED",
    });

    // 🔒 Mark seats as BOOKED
    await Seat.updateMany(
      { _id: { $in: seatIds } },
      { $set: { status: "BOOKED" } }
    );

    // 📅 Format booking date for email
      const bookingDateFormatted = new Date(
      booking.bookingDate
    ).toLocaleDateString("en-US", {
      dateStyle: "medium",
    });


    // 📧 Send email
    let emailSent = false;
    try {
      await sendBookingEmail({
        to: user.email,
        userName: user.name,
        movieTitle: show.movieId?.title,
        movieImage: movieImageUrl,
        cinemaName: show.cinemaId?.name,
        hallName: seats[0]?.hallName,
        showTime: show.time,
        bookingDate: bookingDateFormatted, // ✅ added
        seats: seats.map((s) => s.seatNumber),
        totalAmount,
      });
      emailSent = true;
    } catch (err) {
      console.error("EMAIL ERROR:", err.message);
    }

    res.status(201).json({
      success: true,
      message: emailSent
        ? "Booking confirmed and confirmation email sent successfully"
        : "Booking confirmed successfully (email failed)",
      emailSent,
      data: {
        bookingId: booking._id,
        bookingDate: booking.bookingDate,
      },
    });
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Booking failed",
    });
  }
};

/* ================= GET USER BOOKINGS ================= */
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate({
        path: "showId",
        populate: ["movieId", "cinemaId"],
      })
      .populate("seatIds")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("GET USER BOOKINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

/* ================= GET BOOKING BY ID ================= */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "showId",
        populate: ["movieId", "cinemaId"],
      })
      .populate("seatIds");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error("GET BOOKING ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

/* ================= CANCEL BOOKING ================= */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (booking.bookingStatus === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    booking.bookingStatus = "CANCELLED";
    await booking.save();

    await Seat.updateMany(
      { _id: { $in: booking.seatIds } },
      { $set: { status: "AVAILABLE" } }
    );

    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

/* ================= GET ALL BOOKINGS (ADMIN) ================= */
exports.getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate({
        path: "showId",
        populate: ["movieId", "cinemaId"],
      })
      .populate("seatIds")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("GET ALL BOOKINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

/* ================= DELETE BOOKING (ADMIN) ================= */
exports.deleteBooking = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId && booking.bookingStatus !== "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled or N/A bookings can be deleted",
      });
    }

    if (booking.seatIds?.length > 0) {
      await Seat.updateMany(
        { _id: { $in: booking.seatIds } },
        { $set: { status: "AVAILABLE" } }
      );
    }

    await booking.deleteOne();

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BOOKING ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
    });
  }
};

/* ================= FORCE DELETE BOOKING (ADMIN) ================= */
exports.forceDeleteBooking = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.seatIds?.length > 0) {
      await Seat.updateMany(
        { _id: { $in: booking.seatIds } },
        { $set: { status: "AVAILABLE" } }
      );
    }

    await booking.deleteOne();

    res.json({
      success: true,
      message: "Booking force deleted successfully",
    });
  } catch (error) {
    console.error("FORCE DELETE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to force delete booking",
    });
  }
};
