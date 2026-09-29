/*
  POST /api/contact
  Sends a contact-form message via the Resend REST API.
  Requires RESEND_API_KEY in the environment (.env).
  All three fields (name, email, message) must be present and non-empty.
*/

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Where the contact message is delivered.
// NOTE: While using the shared onboarding@resend.dev sender with no verified
// domain, Resend only allows delivery to your own account email. To send to
// any address, verify a domain at resend.com/domains and update FROM_ADDRESS.
const TO_ADDRESS = "axelpalacioos@gmail.com";
// Resend's shared onboarding sender works without a verified domain.
const FROM_ADDRESS = "Portfolio Contact <onboarding@resend.dev>";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, message } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
    message?: unknown;
  };

  // Validate: all three fields required and non-empty.
  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  const cleanMessage = typeof message === "string" ? message.trim() : "";

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return Response.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(cleanEmail)) {
    return Response.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      reply_to: cleanEmail,
      subject: `Mensaje de trabajo de ${cleanName}`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\n${cleanMessage}`,
    }),
  });

  if (!res.ok) {
    return Response.json(
      { error: "Failed to send message." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
