/**
 * Cloudflare Worker for handling contact form submissions
 * Uses Resend for email delivery
 *
 * Environment variables required:
 * - RESEND_API_KEY: Your Resend API key
 * - TO_EMAIL: Email address to receive form submissions
 * - FROM_EMAIL: Verified sender email address in Resend
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    try {
      const data = await request.json();
      const { name, phone, email, service, message } = data;

      // Validate required fields
      if (!name || !phone || !message) {
        return new Response(
          JSON.stringify({ error: 'Name, phone, and message are required' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
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
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.FROM_EMAIL || 'noreply@24hrstairliftrepairs.co.uk',
          to: env.TO_EMAIL || 'srs.24hr@hotmail.com',
          subject: `Website Enquiry from ${name}`,
          html: emailHtml,
          text: emailText,
          reply_to: email || undefined,
        }),
      });

      if (!resendResponse.ok) {
        const errorData = await resendResponse.json();
        console.error('Resend error:', errorData);
        throw new Error('Failed to send email');
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Message sent successfully' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } catch (error) {
      console.error('Error processing form:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send message. Please try again or call us directly.' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}
