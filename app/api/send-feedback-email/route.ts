import { NextRequest, NextResponse } from "next/server";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG, ADMIN_EMAIL } from "@/lib/emailConfig";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedback_type, subject, message, user_email, sent_time } = body;

    // Validate required fields
    if (!feedback_type || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email using EmailJS
    const templateParams = {
      feedback_type,
      subject,
      message,
      user_email: user_email || "Anonymous",
      sent_time: sent_time || new Date().toLocaleString("id-ID"),
      to_email: ADMIN_EMAIL,
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    return NextResponse.json({
      success: true,
      status: response.status,
      message: "Email sent successfully",
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error.message || error.text,
      },
      { status: 500 }
    );
  }
}

// Allow CORS for mobile app
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
