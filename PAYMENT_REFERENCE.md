# Payment System Implementation Reference

This document provides a technical overview of the payment gateway integration for the Tourism Company application.

## 1. Architecture Overview
The system follows a **Modular Gateway Architecture**, allowing for multiple payment methods to be toggled or added without disrupting the core booking logic.

## 2. Backend Components (Node.js/Express)

### A. Configuration (`server/config/paymentGateways.js`)
Acts as the central registry for payment methods.
- **Role:** Defines which gateways are active and their metadata.
- **Security:** Uses `process.env` for sensitive keys.
- **Scalability:** To add a new method (e.g., PayPal), simply add a new object to this file.

### B. Controller Logic (`server/controllers/paymentController.js`)
Handles the interaction with external APIs.
- **Stripe Checkout:** Uses the Stripe SDK to create a hosted session. It converts amounts to cents and attaches a `client_reference_id` (the Booking ID) for tracking.
- **Webhook Handling:** A critical security feature. It listens for `checkout.session.completed` events from Stripe. It **must** verify the signature using the `STRIPE_WEBHOOK_SECRET` to prevent fraud.

### C. Routing & Webhook Middleware (`server/server.js`)
**CRITICAL TECHNICAL DETAIL:** Stripe webhooks require the **raw request body** for signature verification.
- In `server.js`, the webhook route is placed **BEFORE** `express.json()`.
- It uses `express.raw({ type: 'application/json' })` to ensure the data is not modified by Express before verification.

---

## 3. Frontend Components (Angular)

### A. Payment Service (`client/src/app/services/payment.service.ts`)
The bridge between the UI and the payment API.
- Fetches active payment methods.
- Requests the Stripe Checkout URL and handles the hard redirect via `window.location.href`.

### B. User Flow Components
1. **Payment Component:** Loads booking details using the ID from the URL. Displays the total amount and allows the user to select a method.
2. **Invoice Component:** The destination after a successful payment (`/payment/success/:id`). It generates a professional receipt and allows the user to print/download it.
3. **Bank Instructions:** A static-logic view for users choosing manual bank transfer, providing IBAN and reference codes.

---

## 4. The Complete Flow
1. **Booking:** Tourist clicks "Book Tour" $\rightarrow$ `BookingService.createBooking()` creates a record with `paymentStatus: 'pending'`.
2. **Redirection:** Frontend redirects user to `/payment/:bookingId`.
3. **Initialization:** User selects "Stripe" $\rightarrow$ Frontend calls `/api/payments/create-checkout-session`.
4. **Stripe Session:** Backend returns a unique URL $\rightarrow$ Frontend redirects user to **Stripe.com**.
5. **Success Event:** User pays $\rightarrow$ Stripe sends a **Webhook** to the backend.
6. **Confirmation:** Backend verifies signature $\rightarrow$ Updates MongoDB to `paymentStatus: 'paid'` and `status: 'confirmed'`.
7. **Invoice:** User is redirected back to the Frontend Invoice page to see their receipt.

---

## 5. Post-Implementation Setup
To activate the system, the following environment variables in `server/.env` must be populated:
- `STRIPE_SECRET_KEY`: Private key from Stripe Dashboard.
- `STRIPE_PUBLISHABLE_KEY`: Public key for the client (if used directly).
- `STRIPE_WEBHOOK_SECRET`: Unique secret generated when you create a Webhook endpoint in Stripe.
- `FRONTEND_URL`: Used by Stripe to redirect the user back (e.g., `http://localhost:4200`).
