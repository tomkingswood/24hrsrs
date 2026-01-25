import type { APIRoute } from 'astro';

export const prerender = false;

interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message: string;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: ContactFormData = await request.json();
    const { name, phone, email, service, message } = data;

    // Validate required fields
    if (!name || !phone || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, phone, and message are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get environment variables (set in Cloudflare Pages)
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    const TO_EMAIL = import.meta.env.TO_EMAIL || 'srs.24hr@hotmail.com';
    const FROM_EMAIL = import.meta.env.FROM_EMAIL || 'onboarding@resend.dev';

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Build email content
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Email:</strong> ${email ? escapeHtml(email) : 'Not provided'}</p>
      <p><strong>Service:</strong> ${service ? escapeHtml(service) : 'Not specified'}</p>
      <h3>Message:</h3>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        Sent from the 24hr Stairlift Repairs website contact form
      </p>
    `;

    const emailText = `
New Contact Form Submission

Name: ${name}
Phone: ${phone}
Email: ${email || 'Not provided'}
Service: ${service || 'Not specified'}

Message:
${message}

---
Sent from the 24hr Stairlift Repairs website contact form
    `.trim();

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: `Website Enquiry from ${name}`,
        html: emailHtml,
        text: emailText,
        reply_to: email || undefined,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error('Resend error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Message sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing form:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send message. Please try again or call us directly.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
