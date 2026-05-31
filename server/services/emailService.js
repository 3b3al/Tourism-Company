const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true for port 465, false for 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Format date nicely
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Format currency
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};

class EmailService {
    /**
     * Send booking confirmation email to the tourist
     */
    async sendTouristBookingConfirmation(booking) {
        try {
            const transporter = createTransporter();

            const { tour, guide, tourist, selectedDate, selectedTime, numberOfPeople, totalPrice, specialRequests, contactEmail, contactPhone, _id } = booking;

            const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmation</title>
  <style>
    body { margin: 0; padding: 0; background: #f0f4f8; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 620px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.10); }
    .header { background: linear-gradient(135deg, #1a6b4a 0%, #2ecc71 100%); padding: 40px 32px 32px; text-align: center; }
    .header-icon { font-size: 48px; margin-bottom: 12px; }
    .header h1 { margin: 0; color: #fff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 15px; }
    .booking-ref { background: rgba(255,255,255,0.18); border-radius: 8px; display: inline-block; padding: 6px 18px; margin-top: 16px; color: #fff; font-size: 13px; font-weight: 600; letter-spacing: 1px; }
    .body { padding: 36px 32px; }
    .greeting { font-size: 18px; font-weight: 600; color: #1a2e22; margin-bottom: 6px; }
    .sub { color: #5a7a68; font-size: 14px; margin-bottom: 28px; }
    .section-title { font-size: 12px; font-weight: 700; color: #1a6b4a; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 12px; margin-top: 28px; }
    .card { background: #f7faf8; border: 1px solid #d4edda; border-radius: 12px; padding: 20px 24px; }
    .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e8f0eb; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #5a7a68; font-size: 13px; }
    .detail-value { color: #1a2e22; font-size: 14px; font-weight: 600; text-align: right; }
    .price-row { background: linear-gradient(135deg, #1a6b4a, #2ecc71); border-radius: 10px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
    .price-label { color: rgba(255,255,255,0.9); font-size: 14px; }
    .price-value { color: #fff; font-size: 22px; font-weight: 700; }
    .guide-card { display: flex; align-items: flex-start; gap: 16px; }
    .guide-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #1a6b4a, #2ecc71); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; font-weight: 700; flex-shrink: 0; }
    .guide-info { flex: 1; }
    .guide-name { font-size: 15px; font-weight: 700; color: #1a2e22; margin-bottom: 4px; }
    .guide-contact { font-size: 13px; color: #5a7a68; }
    .special-box { background: #fff8e6; border-left: 4px solid #f4a900; border-radius: 0 8px 8px 0; padding: 12px 16px; font-size: 14px; color: #7a5c00; margin-top: 4px; }
    .footer { background: #f7faf8; border-top: 1px solid #d4edda; padding: 24px 32px; text-align: center; }
    .footer p { color: #8aaa96; font-size: 12px; margin: 0; }
    .footer .brand { font-weight: 700; color: #1a6b4a; font-size: 14px; margin-bottom: 6px; }
    .badge { display: inline-block; background: #d4edda; color: #1a6b4a; border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600; margin-left: 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <div class="header">
      <div class="header-icon">✈️</div>
      <h1>Booking Confirmed!</h1>
      <p>Your adventure is officially booked.</p>
      <div class="booking-ref">REF: ${_id.toString().slice(-8).toUpperCase()}</div>
    </div>

    <!-- Body -->
    <div class="body">
      <div class="greeting">Hi ${tourist.name} 👋</div>
      <div class="sub">Great news! Your booking has been received and is being processed.</div>

      <!-- Tour Details -->
      <div class="section-title">🗺️ Tour Details</div>
      <div class="card">
        <div class="detail-row">
          <span class="detail-label">Tour</span>
          <span class="detail-value">${tour.title}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date</span>
          <span class="detail-value">${formatDate(selectedDate)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time</span>
          <span class="detail-value">${selectedTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Duration</span>
          <span class="detail-value">${tour.duration} hours</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Guests</span>
          <span class="detail-value">${numberOfPeople} ${numberOfPeople === 1 ? 'person' : 'people'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="detail-value">Pending <span class="badge">⏳ Awaiting Confirmation</span></span>
        </div>
      </div>

      <!-- Price -->
      <div class="price-row">
        <span class="price-label">Total Amount</span>
        <span class="price-value">${formatPrice(totalPrice)}</span>
      </div>

      <!-- Your Guide -->
      <div class="section-title">👤 Your Guide</div>
      <div class="card">
        <div class="guide-card">
          <div class="guide-avatar">${guide.name.charAt(0).toUpperCase()}</div>
          <div class="guide-info">
            <div class="guide-name">${guide.name}</div>
            <div class="guide-contact">📧 ${guide.email}</div>
            ${guide.phone ? `<div class="guide-contact">📞 ${guide.phone}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- Special Requests -->
      ${specialRequests ? `
      <div class="section-title">📝 Special Requests</div>
      <div class="special-box">${specialRequests}</div>
      ` : ''}

      <!-- Contact Info -->
      <div class="section-title">📋 Your Contact Info on File</div>
      <div class="card">
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${contactEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone</span>
          <span class="detail-value">${contactPhone}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="brand">🌍 Tourism Company</div>
      <p>Questions? Reply to this email or contact your guide directly.</p>
      <p style="margin-top:8px;">© ${new Date().getFullYear()} Tourism Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

            await transporter.sendMail({
                from: process.env.EMAIL_FROM || `"Tourism Company" <${process.env.EMAIL_USER}>`,
                to: contactEmail,
                subject: `✈️ Booking Confirmed – ${tour.title} on ${formatDate(selectedDate)}`,
                html,
            });

            console.log(`[EmailService] Tourist confirmation sent to ${contactEmail}`);
        } catch (err) {
            console.error('[EmailService] Failed to send tourist confirmation email:', err.message);
        }
    }

    /**
     * Send booking notification email to the guide
     */
    async sendGuideBookingNotification(booking) {
        try {
            const transporter = createTransporter();

            const { tour, guide, tourist, selectedDate, selectedTime, numberOfPeople, totalPrice, specialRequests, contactPhone, contactEmail, _id } = booking;

            const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Booking Notification</title>
  <style>
    body { margin: 0; padding: 0; background: #f0f4f8; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 620px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.10); }
    .header { background: linear-gradient(135deg, #1a3a6b 0%, #4a90d9 100%); padding: 40px 32px 32px; text-align: center; }
    .header-icon { font-size: 48px; margin-bottom: 12px; }
    .header h1 { margin: 0; color: #fff; font-size: 26px; font-weight: 700; }
    .header p { margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 15px; }
    .booking-ref { background: rgba(255,255,255,0.18); border-radius: 8px; display: inline-block; padding: 6px 18px; margin-top: 16px; color: #fff; font-size: 13px; font-weight: 600; letter-spacing: 1px; }
    .body { padding: 36px 32px; }
    .greeting { font-size: 18px; font-weight: 600; color: #1a2240; margin-bottom: 6px; }
    .sub { color: #5a6a8a; font-size: 14px; margin-bottom: 28px; }
    .section-title { font-size: 12px; font-weight: 700; color: #1a3a6b; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 12px; margin-top: 28px; }
    .card { background: #f7f9fc; border: 1px solid #d0ddef; border-radius: 12px; padding: 20px 24px; }
    .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e5ecf5; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #5a6a8a; font-size: 13px; }
    .detail-value { color: #1a2240; font-size: 14px; font-weight: 600; text-align: right; }
    .revenue-row { background: linear-gradient(135deg, #1a3a6b, #4a90d9); border-radius: 10px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
    .revenue-label { color: rgba(255,255,255,0.9); font-size: 14px; }
    .revenue-value { color: #fff; font-size: 22px; font-weight: 700; }
    .tourist-card { display: flex; align-items: flex-start; gap: 16px; }
    .tourist-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #1a3a6b, #4a90d9); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; font-weight: 700; flex-shrink: 0; }
    .tourist-info { flex: 1; }
    .tourist-name { font-size: 15px; font-weight: 700; color: #1a2240; margin-bottom: 4px; }
    .tourist-contact { font-size: 13px; color: #5a6a8a; }
    .special-box { background: #fff8e6; border-left: 4px solid #f4a900; border-radius: 0 8px 8px 0; padding: 12px 16px; font-size: 14px; color: #7a5c00; margin-top: 4px; }
    .action-btn { display: block; width: fit-content; margin: 28px auto 0; background: linear-gradient(135deg, #1a3a6b, #4a90d9); color: #fff; text-decoration: none; padding: 14px 36px; border-radius: 30px; font-size: 15px; font-weight: 600; letter-spacing: 0.5px; }
    .footer { background: #f7f9fc; border-top: 1px solid #d0ddef; padding: 24px 32px; text-align: center; }
    .footer p { color: #8aaac8; font-size: 12px; margin: 0; }
    .footer .brand { font-weight: 700; color: #1a3a6b; font-size: 14px; margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <div class="header">
      <div class="header-icon">🔔</div>
      <h1>New Booking!</h1>
      <p>You have a new tour booking to review.</p>
      <div class="booking-ref">REF: ${_id.toString().slice(-8).toUpperCase()}</div>
    </div>

    <!-- Body -->
    <div class="body">
      <div class="greeting">Hi ${guide.name} 👋</div>
      <div class="sub">A tourist has booked one of your tours. Here are the full details:</div>

      <!-- Tourist Info -->
      <div class="section-title">👤 Tourist Information</div>
      <div class="card">
        <div class="tourist-card">
          <div class="tourist-avatar">${tourist.name.charAt(0).toUpperCase()}</div>
          <div class="tourist-info">
            <div class="tourist-name">${tourist.name}</div>
            <div class="tourist-contact">📧 ${contactEmail}</div>
            <div class="tourist-contact">📞 ${contactPhone}</div>
          </div>
        </div>
      </div>

      <!-- Tour Details -->
      <div class="section-title">🗺️ Tour Details</div>
      <div class="card">
        <div class="detail-row">
          <span class="detail-label">Tour</span>
          <span class="detail-value">${tour.title}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date</span>
          <span class="detail-value">${formatDate(selectedDate)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time</span>
          <span class="detail-value">${selectedTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Duration</span>
          <span class="detail-value">${tour.duration} hours</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Number of Guests</span>
          <span class="detail-value">${numberOfPeople} ${numberOfPeople === 1 ? 'person' : 'people'}</span>
        </div>
      </div>

      <!-- Revenue -->
      <div class="revenue-row">
        <span class="revenue-label">Booking Revenue</span>
        <span class="revenue-value">${formatPrice(totalPrice)}</span>
      </div>

      <!-- Special Requests -->
      ${specialRequests ? `
      <div class="section-title">📝 Tourist's Special Requests</div>
      <div class="special-box">${specialRequests}</div>
      ` : ''}

    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="brand">🌍 Tourism Company</div>
      <p>Log in to your dashboard to confirm or manage this booking.</p>
      <p style="margin-top:8px;">© ${new Date().getFullYear()} Tourism Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

            await transporter.sendMail({
                from: process.env.EMAIL_FROM || `"Tourism Company" <${process.env.EMAIL_USER}>`,
                to: guide.email,
                subject: `🔔 New Booking: ${tourist.name} booked "${tour.title}" on ${formatDate(selectedDate)}`,
                html,
            });

            console.log(`[EmailService] Guide notification sent to ${guide.email}`);
        } catch (err) {
            console.error('[EmailService] Failed to send guide notification email:', err.message);
        }
    }
}

module.exports = new EmailService();
