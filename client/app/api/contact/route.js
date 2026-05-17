// Next.js API route kapi form-i hamar
// POST /api/contact — request-y stanum e ev logum (kkam email unurum)
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "baregamyanlilit36@gmail.com",
      subject: `Ուղարկող - ${name} , էլ․Հասցե - ${email} ,`,
      text: message,
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
