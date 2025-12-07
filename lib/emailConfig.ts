// EmailJS Configuration
// Credentials diambil dari environment variables (.env.local)
// Cara setup: Lihat .env.example

export const EMAILJS_CONFIG = {
  // Public Key dari EmailJS Dashboard
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY",

  // Service ID (email service yang digunakan)
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID",

  // Template ID untuk feedback
  TEMPLATE_ID:
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID",
};

// Email admin yang akan menerima feedback
export const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@nerocars.com";

// Check if EmailJS is configured
export const isEmailJsConfigured = () => {
  return (
    EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY" &&
    EMAILJS_CONFIG.SERVICE_ID !== "YOUR_SERVICE_ID" &&
    EMAILJS_CONFIG.TEMPLATE_ID !== "YOUR_TEMPLATE_ID"
  );
};

/*
 * CARA SETUP EMAILJS:
 *
 * 1. Buka https://www.emailjs.com/ dan daftar (gratis)
 *
 * 2. Tambah Email Service:
 *    - Dashboard > Email Services > Add New Service
 *    - Pilih provider (Gmail, Outlook, Yahoo, dll)
 *    - Connect akun email Anda
 *    - Copy Service ID
 *
 * 3. Buat Email Template:
 *    - Dashboard > Email Templates > Create New Template
 *    - Gunakan template ini:
 *
 *    Subject: [NeroCars] Feedback Baru: {{feedback_type}} - {{subject}}
 *
 *    Body:
 *    Ada feedback baru dari website NeroCars!
 *
 *    Jenis: {{feedback_type}}
 *    Judul: {{subject}}
 *
 *    Pesan:
 *    {{message}}
 *
 *    ---
 *    Pengirim: {{user_email}}
 *    Waktu: {{sent_time}}
 *
 *    ---
 *    Dikirim dari NeroCars Feedback System
 *
 *    - Copy Template ID
 *
 * 4. Get Public Key:
 *    - Dashboard > Account > General
 *    - Copy Public Key
 *
 * 5. Update file ini dengan credentials Anda
 *
 * 6. Test di form feedback!
 */
