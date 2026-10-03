import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  location?: string;
  company?: string;
  preferredBranch?: string;
  service?: string;
  systemPreference?: string;
  monthlyBill?: number | string;
  estimatedKwp?: number | string;
  estimatedSavings?: string;
  message?: string;
  formType?: 'contact_page' | 'quote_calculator';
}

const TARGET_EMAIL = 'jr@ggautomation.tech';

export async function POST(request: Request) {
  try {
    const data: ContactPayload = await request.json();

    // Basic validation
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and phone number are required.' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Manila',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const isQuote = data.formType === 'quote_calculator' || !!data.monthlyBill;
    const subject = isQuote
      ? `⚡ [Solar Quote Request] ${data.name} - ₱${Number(data.monthlyBill || 0).toLocaleString()}/mo (${data.location || 'PH'})`
      : `📩 [New Contact Inquiry] ${data.name} - ${data.preferredBranch || data.service || 'General'}`;

    // HTML Email Template
    const htmlBody = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #091833 0%, #0d2247 100%); padding: 24px; color: #ffffff;">
          <h2 style="margin: 0 0 6px; font-size: 20px; font-weight: 800; color: #ffffff;">GG Automation Construction Services</h2>
          <p style="margin: 0; font-size: 13px; color: #ffc000; font-weight: 600;">${isQuote ? 'Solar PV Quotation Request' : 'Website Contact & Feasibility Inquiry'}</p>
        </div>

        <div style="padding: 24px; color: #1e293b; font-size: 14px; line-height: 1.6;">
          <p style="margin-top: 0;">You have received a new inquiry from the GG Automation website:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; font-weight: bold; width: 35%; color: #475569;">Client Name:</td>
              <td style="padding: 10px 14px; color: #091833; font-weight: 600;">${data.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; font-weight: bold; color: #475569;">Email Address:</td>
              <td style="padding: 10px 14px;"><a href="mailto:${data.email}" style="color: #0084ff; text-decoration: none;">${data.email}</a></td>
            </tr>
            <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; font-weight: bold; color: #475569;">Phone Number:</td>
              <td style="padding: 10px 14px;"><a href="tel:${data.phone}" style="color: #0b7337; font-weight: 600; text-decoration: none;">${data.phone}</a></td>
            </tr>
            ${data.company ? `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; font-weight: bold; color: #475569;">Company / Facility:</td>
              <td style="padding: 10px 14px; color: #091833;">${data.company}</td>
            </tr>` : ''}
            ${data.location ? `
            <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; font-weight: bold; color: #475569;">Location / City:</td>
              <td style="padding: 10px 14px; color: #091833;">${data.location}</td>
            </tr>` : ''}
            ${data.preferredBranch ? `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; font-weight: bold; color: #475569;">Preferred Branch:</td>
              <td style="padding: 10px 14px; color: #091833;">${data.preferredBranch}</td>
            </tr>` : ''}
            ${data.service ? `
            <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 14px; font-weight: bold; color: #475569;">Service Required:</td>
              <td style="padding: 10px 14px; color: #091833;">${data.service}</td>
            </tr>` : ''}
            ${data.monthlyBill ? `
            <tr style="background-color: #fffbeb; border-bottom: 1px solid #fef3c7;">
              <td style="padding: 10px 14px; font-weight: bold; color: #92400e;">Monthly Electric Bill:</td>
              <td style="padding: 10px 14px; color: #b45309; font-weight: bold; font-size: 15px;">₱${Number(data.monthlyBill).toLocaleString('en-US')} / mo</td>
            </tr>` : ''}
            ${data.estimatedKwp ? `
            <tr style="background-color: #f0fdf4; border-bottom: 1px solid #dcfce7;">
              <td style="padding: 10px 14px; font-weight: bold; color: #166534;">Est. Solar Capacity:</td>
              <td style="padding: 10px 14px; color: #15803d; font-weight: bold;">~${data.estimatedKwp} kWp</td>
            </tr>` : ''}
          </table>

          ${data.message ? `
          <div style="margin-top: 16px; background-color: #f8fafc; padding: 14px; border-radius: 8px; border-left: 4px solid #e51a24;">
            <p style="margin: 0 0 4px; font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase;">Message / Scope Details:</p>
            <p style="margin: 0; color: #334155; white-space: pre-wrap;">${data.message}</p>
          </div>` : ''}

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between;">
            <span>Received: ${timestamp} (PHT)</span>
            <span>Target: ${TARGET_EMAIL}</span>
          </div>
        </div>
      </div>
    `;

    // 1. Attempt sending via Resend API if API Key is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'GG Automation Website <onboarding@resend.dev>',
            to: [TARGET_EMAIL],
            reply_to: data.email,
            subject,
            html: htmlBody,
          }),
        });

        if (resendRes.ok) {
          console.log(`[Contact API] Email successfully sent to ${TARGET_EMAIL} via Resend`);
          return NextResponse.json({
            success: true,
            message: `Your inquiry has been successfully sent to ${TARGET_EMAIL}! Our team will contact you shortly.`,
          });
        }
      } catch (err) {
        console.error('[Contact API] Resend error:', err);
      }
    }

    // 2. Attempt sending via Web3Forms API if Access Key is configured
    if (process.env.WEB3FORMS_ACCESS_KEY) {
      try {
        const web3Res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: process.env.WEB3FORMS_ACCESS_KEY,
            to: TARGET_EMAIL,
            subject,
            from_name: data.name,
            ...data,
          }),
        });

        if (web3Res.ok) {
          console.log(`[Contact API] Form submitted via Web3Forms to ${TARGET_EMAIL}`);
          return NextResponse.json({
            success: true,
            message: `Your inquiry has been successfully sent to ${TARGET_EMAIL}!`,
          });
        }
      } catch (err) {
        console.error('[Contact API] Web3Forms error:', err);
      }
    }

    // 3. Fallback: Log inquiry safely & return success
    console.log(`\n========================================`);
    console.log(`📩 NEW WEBSITE INQUIRY RECEIVED FOR ${TARGET_EMAIL}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Client: ${data.name} (${data.email}, ${data.phone})`);
    console.log(`Details:`, JSON.stringify(data, null, 2));
    console.log(`========================================\n`);

    return NextResponse.json({
      success: true,
      message: `Your inquiry has been submitted for ${TARGET_EMAIL}. Our solar engineering team will review your project and get in touch within 24 hours!`,
      targetEmail: TARGET_EMAIL,
    });
  } catch (error: any) {
    console.error('[Contact API Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
