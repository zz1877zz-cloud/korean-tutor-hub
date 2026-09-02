export async function sendAdminMail(subject: string, text: string) {
    const key = process.env.RESEND_API_KEY
    const to = process.env.ADMIN_NOTIFY_EMAIL
  
    if (!key || !to) {
      return {
        skipped: true,
        reason: !key ? "NO_API_KEY" : "NO_ADMIN_EMAIL",
      }
    }
  
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Korean Tutor Hub <beth.t@example.com>",
        to,
        subject,
        text,
      }),
    })
  
    const body = await res.text()
    return {
      skipped: false,
      status: res.status,
      body,
    }
  }