// DPO Group API v6 helper (server-side only)
// Docs: https://docs.dpogroup.com/api/

const DPO_API_URL = "https://secure.3gdirectpay.com/API/v6/";
const DPO_PAY_URL = "https://secure.3gdirectpay.com/payv2.php?ID=";

export type DpoOrderData = {
  amount: number;        // in N$ (NAD)
  orderId: string;
  description: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  returnUrl: string;
  backUrl: string;
};

export async function createPaymentToken(order: DpoOrderData): Promise<{ token: string; paymentUrl: string }> {
  const companyToken = process.env.DPO_COMPANY_TOKEN ?? "";
  const serviceType = process.env.DPO_SERVICE_TYPE ?? "";

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${companyToken}</CompanyToken>
  <Request>createToken</Request>
  <Transaction>
    <PaymentAmount>${order.amount.toFixed(2)}</PaymentAmount>
    <PaymentCurrency>NAD</PaymentCurrency>
    <CompanyRef>${order.orderId}</CompanyRef>
    <RedirectURL>${order.returnUrl}</RedirectURL>
    <BackURL>${order.backUrl}</BackURL>
    <CompanyRefUnique>0</CompanyRefUnique>
    <CustomerEmail>${order.customerEmail}</CustomerEmail>
    <CustomerPhone>${order.customerPhone}</CustomerPhone>
    <CustomerFirstName>${order.customerName.split(" ")[0]}</CustomerFirstName>
    <CustomerLastName>${order.customerName.split(" ").slice(1).join(" ") || "."}</CustomerLastName>
    <TransactionSource>web</TransactionSource>
  </Transaction>
  <Services>
    <Service>
      <ServiceType>${serviceType}</ServiceType>
      <ServiceDescription>${order.description}</ServiceDescription>
      <ServiceDate>${new Date().toISOString().slice(0, 10).replace(/-/g, "/")}</ServiceDate>
    </Service>
  </Services>
</API3G>`;

  const res = await fetch(DPO_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/xml" },
    body: xml,
  });

  const text = await res.text();
  const token = extractXmlValue(text, "TransToken");
  const resultCode = extractXmlValue(text, "Result");

  if (resultCode !== "000" || !token) {
    const explanation = extractXmlValue(text, "ResultExplanation");
    throw new Error(`DPO token creation failed: ${explanation || resultCode}`);
  }

  return { token, paymentUrl: `${DPO_PAY_URL}${token}` };
}

export async function verifyPaymentToken(token: string): Promise<{ paid: boolean; transRef: string }> {
  const companyToken = process.env.DPO_COMPANY_TOKEN ?? "";

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${companyToken}</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>${token}</TransactionToken>
</API3G>`;

  const res = await fetch(DPO_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/xml" },
    body: xml,
  });

  const text = await res.text();
  const result = extractXmlValue(text, "Result");
  const transRef = extractXmlValue(text, "TransactionApproval") ?? "";

  return { paid: result === "000", transRef };
}

function extractXmlValue(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}>([^<]*)<\\/${tag}>`));
  return match ? match[1] : "";
}
