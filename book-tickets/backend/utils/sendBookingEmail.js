const nodemailer = require("nodemailer");

// ICON URL//
const locationIcon = "https://res.cloudinary.com/dcm3jmdwd/image/upload/v1767770409/location_rgpplv.png";
const ticketsIcon = "https://res.cloudinary.com/dcm3jmdwd/image/upload/v1767770361/hall_vbizf1.jpg";
const calendarIcon = "https://res.cloudinary.com/dcm3jmdwd/image/upload/v1767770280/calendar_uumdti.png";
const clockIcon = "https://res.cloudinary.com/dcm3jmdwd/image/upload/v1767770421/clock_ok9uwa.png";
const peopleIcon = "https://res.cloudinary.com/dcm3jmdwd/image/upload/v1767770280/people_eqr8sx.png";
const chairIcon = "https://res.cloudinary.com/dcm3jmdwd/image/upload/v1767770280/chair_yppwgm.png";

//  CREATE TRANSPORTER //
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log("✅ Email transporter configured");
} else {
  console.warn("⚠️ EMAIL NOT CONFIGURED: EMAIL_USER and EMAIL_PASS required in .env file");
}

// EMAIL TEMPLATE//
const generateTicketEmailHTML = ({
  userName = "there",
  movieTitle,
  movieImage = null,
  cinemaName,
  hallName,
  bookingDate,
  showTime,
  seats = [],
  totalAmount,
}) => {
  const seatLabels = seats.length ? seats.join(", ") : "N/A";
  const ticketCount = seats.length || 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Movie Ticket Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffebee;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffebee; padding: 30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="550" style="background-color: #ffffff; max-width: 550px;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #cc0000; padding: 25px 30px; text-align: left;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Grab Your Tickets</h1>
              <p style="margin: 6px 0 0 0; color: #ffffff; font-size: 15px; font-weight: 400;">Your Movie Ticket Confirmation</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 15px 30px;">
              <p style="margin: 0; color: #374151; font-size: 16px; font-weight: 600;">Hello ${userName}!</p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Your movie ticket booking is confirmed! Get ready for an unforgettable cinematic experience.</p>
            </td>
          </tr>

          <!-- Ticket Card -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 2px solid #fecaca; border-radius: 12px;">
                <tr>
                  <td style="padding: 25px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <!-- Movie Poster -->
                        <td width="140" valign="top" style="padding-right: 18px;">
                          ${movieImage 
                            ? `<img src="${movieImage}" alt="${movieTitle}" style="width: 140px; height: 210px; border-radius: 8px; display: block; object-fit: cover;" />`
                            : `<table cellpadding="0" cellspacing="0" border="0" style="width: 140px; height: 210px; border-radius: 8px; background-color: #000000;">
                                <tr>
                                  <td align="center" valign="middle">
                                    <div style="color: #e50914; font-size: 24px; font-weight: 700; margin-bottom: 15px;">NETFLIX</div>
                                    <div style="width: 100px; height: 3px; background-color: #e50914;"></div>
                                  </td>
                                </tr>
                              </table>`
                          }
                        </td>

                        <!-- Movie Details -->
                        <td valign="top">
                          <!-- Title -->
                          <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 22px; font-weight: 700; line-height: 1.2;">${movieTitle}</h2>

                          <!-- Cinema & Hall (Side by Side) -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 10px;">
                            <tr>
                              <td width="50%" valign="top" style="padding-right: 8px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td width="20" valign="top" style="padding-top: 1px;">
                                      <img src="${locationIcon}" width="14" height="14" alt="location" style="display: block;" />
                                    </td>
                                    <td style="padding-left: 6px;">
                                      <p style="margin: 0 0 2px 0; color: #9ca3af; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1;">CINEMA</p>
                                      <p style="margin: 0; color: #111827; font-size: 12px; font-weight: 600; line-height: 1.3;">${cinemaName}</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td width="50%" valign="top" style="padding-left: 8px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td width="20" valign="top" style="padding-top: 1px;">
                                      <img src="${peopleIcon}" width="14" height="14" alt="hall" style="display: block;" />
                                    </td>
                                    <td style="padding-left: 6px;">
                                      <p style="margin: 0 0 2px 0; color: #9ca3af; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1;">HALL</p>
                                      <p style="margin: 0; color: #111827; font-size: 12px; font-weight: 600; line-height: 1.3;">${hallName}</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- Date & Time (Side by Side) -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 10px;">
                            <tr>
                              <td width="50%" valign="top" style="padding-right: 8px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td width="20" valign="top" style="padding-top: 1px;">
                                      <img src="${calendarIcon}" width="14" height="14" alt="date" style="display: block;" />
                                    </td>
                                    <td style="padding-left: 6px;">
                                      <p style="margin: 0 0 2px 0; color: #9ca3af; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1;">BOOKING DATE</p>
                                      <p style="margin: 0; color: #111827; font-size: 12px; font-weight: 600; line-height: 1.3;">${bookingDate}</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td width="50%" valign="top" style="padding-left: 8px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td width="20" valign="top" style="padding-top: 1px;">
                                      <img src="${clockIcon}" width="14" height="14" alt="time" style="display: block;" />
                                    </td>
                                    <td style="padding-left: 6px;">
                                      <p style="margin: 0 0 2px 0; color: #9ca3af; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1;">TIME</p>
                                      <p style="margin: 0; color: #111827; font-size: 12px; font-weight: 600; line-height: 1.3;">${showTime}</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- Tickets & Seats (Side by Side) -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px;">
                            <tr>
                              <td width="50%" valign="top" style="padding-right: 8px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td width="20" valign="top" style="padding-top: 1px;">
                                      <img src="${ticketsIcon}" width="14" height="14" alt="tickets" style="display: block;" />
                                    </td>
                                    <td style="padding-left: 6px;">
                                      <p style="margin: 0 0 2px 0; color: #9ca3af; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1;">TICKETS</p>
                                      <p style="margin: 0; color: #111827; font-size: 12px; font-weight: 600; line-height: 1.3;">${ticketCount} Ticket${ticketCount !== 1 ? 's' : ''}</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td width="50%" valign="top" style="padding-left: 8px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                  <tr>
                                    <td width="20" valign="top" style="padding-top: 1px;">
                                      <img src="${chairIcon}" width="14" height="14" alt="seats" style="display: block;" />
                                    </td>
                                    <td style="padding-left: 6px;">
                                      <p style="margin: 0 0 2px 0; color: #9ca3af; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1;">SEATS</p>
                                      <p style="margin: 0; color: #111827; font-size: 12px; font-weight: 600; line-height: 1.3;">${seatLabels}</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- Total Amount -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
                            <tr>
                              <td>
                                <p style="margin: 0; color: #6b7280; font-size: 12px;">Total Amount</p>
                              </td>
                              <td align="right">
                                <p style="margin: 0; color: #cc0000; font-size: 24px; font-weight: 700;">₹${totalAmount}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <p style="margin: 0 0 6px 0; color: #6b7280; font-size: 12px;">Enjoy your movie! 🎬</p>
              <p style="margin: 0; color: #374151; font-size: 11px; font-weight: 500;">© 2024 Grab Your Tickets. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// =================== SEND EMAIL ===================
const sendBookingEmail = async ({
  to,
  userName = "there",
  movieTitle,
  movieImage = null,
  cinemaName,
  hallName,
  bookingDate,
  showTime,
  seats = [],
  totalAmount,
}) => {
  if (!transporter) throw new Error("Email service not configured");
  if (!to) throw new Error("Recipient email missing");

  const html = generateTicketEmailHTML({
    userName,
    movieTitle,
    movieImage,
    cinemaName,
    hallName,
    bookingDate,
    showTime,
    seats,
    totalAmount,
  });

  return transporter.sendMail({
    from: `"Grab Your Tickets" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🎟️ Ticket Confirmed: ${movieTitle}`,
    html,
  });
};

module.exports = sendBookingEmail;
