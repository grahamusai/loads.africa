import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { recipientEmail, recipientName, loadDetails } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Loads Africa <support@iadvertiz.com>',
      to: recipientEmail,
      subject: 'New Load Posted',
      html: `
        <h2>Hello ${recipientName},</h2>
        <p>A new load has been posted that may interest you:</p>
        <ul>
          <li>Origin: ${loadDetails.origin}</li>
          <li>Destination: ${loadDetails.destination}</li>
          <li>Cargo: ${loadDetails.cargo_name}</li>
          <li>Weight: ${loadDetails.weight} kg</li>
        </ul>
        <p>Log in to view more details and book this load.</p>
      `
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
