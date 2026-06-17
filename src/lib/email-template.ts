export function emailTemplate({
  title,
  preheader = "",
  body,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  preheader?: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const LOGO = "https://riderafrica.com/logo.png";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
  ${preheader ? `<span style="display:none;max-height:0;overflow:hidden">${preheader}</span>` : ""}
</head>
<body style="margin:0;padding:0;background:#F0F4FF;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FF;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Letterhead header -->
          <tr>
            <td style="background:linear-gradient(135deg,#003EA6 0%,#0073FF 100%);border-radius:16px 16px 0 0;padding:28px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="${LOGO}" alt="Rider Africa" width="44" height="44"
                      style="border-radius:10px;display:block;float:left;margin-right:14px;" />
                    <div style="overflow:hidden;">
                      <p style="margin:0;color:#ffffff;font-size:18px;font-weight:900;line-height:1.2;">Rider Africa</p>
                      <p style="margin:2px 0 0;color:#93C5FD;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Logistics (Pty) Ltd</p>
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <p style="margin:0;color:#93C5FD;font-size:11px;line-height:1.6;">
                      Reg. No. 20250760<br/>
                      Swakopmund, Namibia
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider accent -->
          <tr>
            <td style="background:#0073FF;height:3px;"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 36px 28px;border-left:1px solid #E5EBF8;border-right:1px solid #E5EBF8;">
              <h2 style="margin:0 0 20px;color:#0A0F2E;font-size:20px;font-weight:800;">${title}</h2>
              <div style="color:#374151;font-size:14px;line-height:1.8;">
                ${body}
              </div>
              ${ctaLabel && ctaHref ? `
              <div style="margin-top:28px;text-align:center;">
                <a href="${ctaHref}"
                  style="display:inline-block;background:#0073FF;color:#ffffff;font-weight:700;font-size:14px;padding:13px 32px;border-radius:10px;text-decoration:none;">
                  ${ctaLabel}
                </a>
              </div>` : ""}
            </td>
          </tr>

          <!-- Footer letterhead -->
          <tr>
            <td style="background:#0A0F2E;border-radius:0 0 16px 16px;padding:20px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;color:#6B7DB3;font-size:11px;line-height:1.7;">
                      <strong style="color:#93C5FD;">Rider Africa Logistics (Pty) Ltd</strong><br/>
                      Reg. 20250760 · BIPA Companies Act 2004<br/>
                      695 Vrede Rede, Mondesa, Swakopmund, Namibia<br/>
                      <a href="mailto:admin@riderafrica.com" style="color:#6B7DB3;">admin@riderafrica.com</a> ·
                      <a href="https://riderafrica.com" style="color:#6B7DB3;">riderafrica.com</a>
                    </p>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <p style="margin:0;color:#374151;font-size:10px;">
                      🇳🇦 Proudly Namibian
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom note -->
          <tr>
            <td style="padding:16px 0;text-align:center;">
              <p style="margin:0;color:#9CA3AF;font-size:11px;">
                This email was sent by Rider Africa Logistics (Pty) Ltd.<br/>
                If you did not request this, please ignore it.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
