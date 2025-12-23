const Booking = require("../models/Booking");
const Seat = require("../models/Seat");
const Show = require("../models/Show");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { showId, seatIds, userEmail } = req.body;

    if (!showId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "showId and seatIds are required",
      });
    }

    // Get user from email if not logged in
    let user;
    if (req.user && req.user.id) {
      user = await User.findById(req.user.id);
    } else if (userEmail) {
      user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found. Please login or provide valid email.",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "User authentication required or provide userEmail",
      });
    }

    // Verify show exists
    const show = await Show.findById(showId)
      .populate("movieId", "title image")
      .populate("cinemaId", "name location");

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    // Verify all seats exist and are available
    const seats = await Seat.find({ _id: { $in: seatIds } });

    if (seats.length !== seatIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some seats not found",
      });
    }

    // Check if any seat is already booked
    const bookedSeats = seats.filter((seat) => seat.status === "BOOKED");
    if (bookedSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some seats are already booked",
        bookedSeats: bookedSeats.map((s) => ({
          row: s.row,
          column: s.column,
        })),
      });
    }

    // Calculate total amount
    const totalAmount = seats.reduce((sum, seat) => {
      const price = seat.type === "PREMIUM" ? 300 : 200;
      return sum + price;
    }, 0);

    // Create booking
    const booking = await Booking.create({
      userId: user._id,
      showId,
      seatIds,
      totalAmount,
      bookingStatus: "CONFIRMED",
    });

    // Update seat status to BOOKED
    await Seat.updateMany(
      { _id: { $in: seatIds } },
      { $set: { status: "BOOKED" } }
    );

    // Populate booking data for email
    const bookingData = await Booking.findById(booking._id)
      .populate("showId")
      .populate("seatIds")
      .populate("userId", "name email");

    // Send confirmation email
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 20px; }
            .booking-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .seat-info { display: inline-block; margin: 5px; padding: 5px 10px; background: #e5e7eb; border-radius: 3px; }
            .total { font-size: 20px; font-weight: bold; color: #dc2626; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 GrabYourTickets</h1>
              <h2>Booking Confirmed!</h2>
            </div>
            <div class="content">
              <p>Dear ${user.name},</p>
              <p>Your booking has been confirmed successfully!</p>
              
              <div class="booking-details">
                <h3>Booking Details</h3>
                <p><strong>Movie:</strong> ${show.movieId.title}</p>
                <p><strong>Cinema:</strong> ${show.cinemaId.name}</p>
                <p><strong>Location:</strong> ${show.cinemaId.location}</p>
                <p><strong>Date:</strong> ${show.showDate}</p>
                <p><strong>Time:</strong> ${show.time}</p>
                <p><strong>Booking ID:</strong> ${booking._id}</p>
              </div>

              <div class="booking-details">
                <h3>Seats</h3>
                ${seats
                  .map(
                    (seat) =>
                      `<span class="seat-info">Row ${seat.row}, Seat ${seat.column} (${seat.type})</span>`
                  )
                  .join("")}
              </div>

              <div class="booking-details">
                <p class="total">Total Amount: ₹${totalAmount}</p>
              </div>

              <p>Thank you for choosing GrabYourTickets. Enjoy your movie!</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} GrabYourTickets. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "🎬 Booking Confirmed - GrabYourTickets",
        html: emailHtml,
      });

      console.log(`Booking confirmation email sent to ${user.email}`);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        bookingId: booking._id,
        booking: bookingData,
        totalAmount,
        seats: seats.map((s) => ({
          id: s._id,
          row: s.row,
          column: s.column,
          type: s.type,
        })),
      },
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const bookings = await Booking.find({ userId })
      .populate("showId")
      .populate({
        path: "showId",
        populate: [
          { path: "movieId", select: "title image" },
          { path: "cinemaId", select: "name location" },
        ],
      })
      .populate("seatIds")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const booking = await Booking.findById(id)
      .populate("showId")
      .populate({
        path: "showId",
        populate: [
          { path: "movieId", select: "title image" },
          { path: "cinemaId", select: "name location" },
        ],
      })
      .populate("seatIds")
      .populate("userId", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user owns this booking or is admin
    if (booking.userId._id.toString() !== userId && req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== userId) {
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

    // Update booking status
    booking.bookingStatus = "CANCELLED";
    await booking.save();

    // Free up seats
    await Seat.updateMany(
      { _id: { $in: booking.seatIds } },
      { $set: { status: "AVAILABLE" } }
    );

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

