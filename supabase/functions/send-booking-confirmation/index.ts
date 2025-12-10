import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vendorName: string;
  eventDate: string;
  eventType?: string;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Received booking confirmation request");

  try {
    const { 
      customerName, 
      customerEmail, 
      customerPhone,
      vendorName, 
      eventDate,
      eventType,
      notes 
    }: BookingConfirmationRequest = await req.json();

    console.log(`Processing booking for ${customerName} with ${vendorName} on ${eventDate}`);

    if (!customerName || !customerEmail || !vendorName || !eventDate) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #1a1a1a; margin: 0; font-size: 28px;">Booking Request Received!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px;">Hello <strong>${customerName}</strong>,</p>
          
          <p style="font-size: 16px;">Thank you for your booking request! We've received your inquiry and the vendor will be in touch shortly.</p>
          
          <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #D4AF37; margin-top: 0; font-size: 18px;">Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Vendor:</td>
                <td style="padding: 8px 0; font-weight: bold;">${vendorName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Event Date:</td>
                <td style="padding: 8px 0; font-weight: bold;">${eventDate}</td>
              </tr>
              ${eventType ? `
              <tr>
                <td style="padding: 8px 0; color: #666;">Event Type:</td>
                <td style="padding: 8px 0; font-weight: bold;">${eventType}</td>
              </tr>
              ` : ''}
              ${notes ? `
              <tr>
                <td style="padding: 8px 0; color: #666;">Notes:</td>
                <td style="padding: 8px 0;">${notes}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <p style="font-size: 14px; color: #666;">Your contact details:</p>
          <ul style="color: #666; font-size: 14px;">
            <li>Email: ${customerEmail}</li>
            <li>Phone: ${customerPhone || 'Not provided'}</li>
          </ul>
          
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
          
          <p style="font-size: 14px; color: #888;">If you have any questions, please don't hesitate to contact us.</p>
          
          <p style="font-size: 14px; color: #888; margin-bottom: 0;">Best regards,<br><strong>Events Hub Team</strong></p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
          <p>© 2024 Events Hub Nigeria. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Events Hub <onboarding@resend.dev>",
        to: [customerEmail],
        subject: `Booking Request Confirmed - ${vendorName}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Email sent successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Booking confirmation sent",
        emailId: data.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
