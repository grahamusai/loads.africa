import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/app/dashboard/components/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, firstName, userType } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Loads Africa <support@iadvertiz.com>',
      to: email,
      subject: 'Welcome to Loads Africa',
      react: WelcomeEmail({ name: firstName, userType }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
