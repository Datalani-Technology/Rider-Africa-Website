"use client";
import { useState } from "react";
import {
  Home, Car, CheckCircle2, Loader2, ChevronRight,
  FileText, Eye, Download, Send, AlertCircle,
} from "lucide-react";
import FileUploadField from "@/components/FileUploadField";
import jsPDF from "jspdf";

// Lazy Firebase imports — only loaded when submit button is actually pressed
// This prevents Firebase from breaking React hydration on page load
async function savePawnSubmission(data: Record<string, unknown>) {
  const { createPawnSubmission } = await import("@/lib/firestore");
  return createPawnSubmission(data as Parameters<typeof createPawnSubmission>[0]);
}
async function uploadFile(submissionId: string, category: string, file: File) {
  const { uploadPawnFile } = await import("@/lib/storage");
  return uploadPawnFile(submissionId, category, file);
}
async function uploadPhoto(submissionId: string, index: number, file: File) {
  const { uploadPawnPhoto } = await import("@/lib/storage");
  return uploadPawnPhoto(submissionId, index, file);
}

type Tab = "property" | "vehicle";

// ─── Step indicator ────────────────────────────────────────────────────────────
const STEPS = ["Your Details", "Asset Details", "Documents", "Submit"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
              i < current ? "bg-[#0073FF] border-[#0073FF] text-white"
                : i === current ? "bg-amber-500 border-amber-500 text-white"
                : "bg-transparent border-gray-600 text-gray-600"
            }`}>
              {i < current ? <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} /> : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-semibold hidden sm:block ${i === current ? "text-amber-400" : i < current ? "text-[#4DA6FF]" : "text-gray-600"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-8 sm:w-16 mx-1 ${i < current ? "bg-[#0073FF]" : "bg-gray-700"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Section wrapper ────────────────────────────────────────────────────────────
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#131C30] rounded-2xl border border-white/8 overflow-hidden mb-5">
      <div className="bg-[#0D1526] px-5 py-3 border-b border-white/8">
        <p className="text-white font-bold text-sm">{title}</p>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  );
}

const inp = "w-full bg-[#0D1526] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 transition-colors";
const lbl = "block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5";
const req = <span className="text-red-400 text-xs ml-1">*</span>;

// ─── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ value, onChange, leftLabel, rightLabel }: {
  value: boolean; onChange: (v: boolean) => void; leftLabel: string; rightLabel: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className={`text-sm font-semibold ${!value ? "text-amber-400" : "text-gray-500"}`}>{leftLabel}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors ${value ? "bg-amber-500" : "bg-gray-700"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-6" : "translate-x-0"}`} />
      </button>
      <span className={`text-sm font-semibold ${value ? "text-amber-400" : "text-gray-500"}`}>{rightLabel}</span>
    </div>
  );
}

// ─── PDF helpers ───────────────────────────────────────────────────────────────
function generatePreviewPDF(data: Record<string, string>, type: Tab) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`Rider Africa — ${type === "property" ? "Property" : "Vehicle"} Pawn Application`, 20, 25);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleString("en-NA")}`, 20, 33);
  doc.line(20, 37, 190, 37);
  let y = 47;
  Object.entries(data).forEach(([key, val]) => {
    if (!val) return;
    doc.setFont("helvetica", "bold");
    doc.text(`${key}:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(val), 80, y);
    y += 8;
    if (y > 270) { doc.addPage(); y = 20; }
  });
  doc.save(`RiderAfrica_Pawn_Preview_${Date.now()}.pdf`);
}

function generateBlankPawnDoc(type: Tab) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`RIDER AFRICA — ${type === "property" ? "PROPERTY" : "VEHICLE"} PAWN DOCUMENT`, 20, 20);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Please fill in all required fields and upload the completed document.", 20, 30);
  doc.line(20, 35, 190, 35);

  const fields = type === "property"
    ? ["Seller Full Name", "Seller Contact / Phone", "Email Address", "Property Address", "erf Number", "Asking Price (NAD)", "Bond Status", "Bond Holder / Bank", "Occupancy Status", "Digital Signature (Full Name)"]
    : ["Seller Full Name", "Seller Contact / Phone", "Email Address", "Vehicle Make", "Model", "Year", "Colour", "VIN / Chassis Number", "Engine Number", "Odometer (km)", "Asking Price (NAD)", "Payment Terms (Cash/Bank)", "Location (Town/Suburb)", "Digital Signature (Full Name)"];

  let y = 45;
  fields.forEach(field => {
    doc.setFont("helvetica", "bold");
    doc.text(`${field}:`, 20, y);
    doc.line(80, y, 190, y);
    y += 12;
  });
  doc.save(`RiderAfrica_Pawn_Form_${type}_${Date.now()}.pdf`);
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function PawnClient() {
  const [tab, setTab] = useState<Tab>("property");
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successRef, setSuccessRef] = useState("");
  const [error, setError] = useState("");
  const [stepError, setStepError] = useState("");

  // ── Property form state ────
  const [prop, setProp] = useState({
    sellerName: "", sellerPhone: "", sellerEmail: "",
    propertyAddress: "", erfNumber: "", askingPrice: "",
    bondStatus: "No Bond / Clear", bondHolderDetail: "", digitalSignature: "",
  });
  const [propOccupied, setPropOccupied] = useState(false);
  const [propDocs, setPropDocs] = useState<Record<string, File[]>>({
    certifiedId: [], titleDeed: [], deedOfSale: [], powerOfAttorney: [],
    ratesClearance: [], bondCancellation: [], proofOfResidence: [],
    bankLetter: [], taxCertificate: [], filledPawnDoc: [],
  });
  const [propPhotos, setPropPhotos] = useState<File[]>([]);

  // ── Vehicle form state ────
  const [veh, setVeh] = useState({
    sellerName: "", sellerPhone: "", sellerEmail: "",
    vehicleMake: "", vehicleModel: "", vehicleYear: "", vehicleColour: "",
    vinNumber: "", engineNumber: "", odometer: "", askingPrice: "",
    location: "", digitalSignature: "",
  });
  const [vehBankPay, setVehBankPay] = useState(false);
  const [vehDocs, setVehDocs] = useState<Record<string, File[]>>({
    certifiedId: [], natisCert: [], proofOfResidence: [],
    policeClearance: [], filledPawnDoc: [],
  });
  const [vehPhotos, setVehPhotos] = useState<File[]>([]);

  function resetAll() {
    setStep(0); setSuccess(false); setSuccessRef(""); setError("");
    setProp({ sellerName: "", sellerPhone: "", sellerEmail: "", propertyAddress: "", erfNumber: "", askingPrice: "", bondStatus: "No Bond / Clear", bondHolderDetail: "", digitalSignature: "" });
    setPropOccupied(false);
    setPropDocs({ certifiedId: [], titleDeed: [], deedOfSale: [], powerOfAttorney: [], ratesClearance: [], bondCancellation: [], proofOfResidence: [], bankLetter: [], taxCertificate: [], filledPawnDoc: [] });
    setPropPhotos([]);
    setVeh({ sellerName: "", sellerPhone: "", sellerEmail: "", vehicleMake: "", vehicleModel: "", vehicleYear: "", vehicleColour: "", vinNumber: "", engineNumber: "", odometer: "", askingPrice: "", location: "", digitalSignature: "" });
    setVehBankPay(false);
    setVehDocs({ certifiedId: [], natisCert: [], proofOfResidence: [], policeClearance: [], filledPawnDoc: [] });
    setVehPhotos([]);
  }

  function validateStep(): boolean {
    setStepError("");
    if (tab === "property") {
      if (step === 0) {
        if (!prop.sellerName) { setStepError("Seller full name is required."); return false; }
        if (!prop.sellerPhone) { setStepError("Contact phone number is required."); return false; }
        if (!prop.sellerEmail) { setStepError("Email address is required."); return false; }
      }
      if (step === 1) {
        if (!prop.propertyAddress) { setStepError("Property address is required."); return false; }
        if (!prop.askingPrice) { setStepError("Asking price is required."); return false; }
        if (prop.bondStatus !== "No Bond / Clear" && !prop.bondHolderDetail) { setStepError("Bond holder / bank name is required for mortgaged properties."); return false; }
        if (!prop.digitalSignature) { setStepError("Digital signature is required to confirm your submission."); return false; }
      }
      if (step === 2) {
        if (!propDocs.certifiedId.length) { setStepError("Certified ID copy is required."); return false; }
        if (!propDocs.titleDeed.length) { setStepError("Title deed or ownership certificate is required."); return false; }
        if (!propDocs.deedOfSale.length) { setStepError("Signed deed of sale is required."); return false; }
        if (!propDocs.proofOfResidence.length) { setStepError("Proof of residence (FICA) is required."); return false; }
        if (!propDocs.bankLetter.length) { setStepError("Bank letter is required."); return false; }
        if (!propDocs.taxCertificate.length) { setStepError("Tax certificate is required."); return false; }
        if (propPhotos.length < 6) { setStepError(`At least 6 property photos are required — you have ${propPhotos.length}. Please add ${6 - propPhotos.length} more.`); return false; }
      }
      if (step === 3) {
        if (!propDocs.filledPawnDoc.length) { setStepError("Please upload your completed pawn document before submitting."); return false; }
      }
    } else {
      if (step === 0) {
        if (!veh.sellerName) { setStepError("Seller full name is required."); return false; }
        if (!veh.sellerPhone) { setStepError("Contact phone number is required."); return false; }
        if (!veh.sellerEmail) { setStepError("Email address is required."); return false; }
      }
      if (step === 1) {
        if (!veh.vehicleMake) { setStepError("Vehicle make is required."); return false; }
        if (!veh.vehicleModel) { setStepError("Vehicle model is required."); return false; }
        if (!veh.vehicleYear) { setStepError("Vehicle year is required."); return false; }
        if (!veh.vehicleColour) { setStepError("Vehicle colour is required."); return false; }
        if (!veh.vinNumber) { setStepError("VIN / Chassis number is required."); return false; }
        if (!veh.engineNumber) { setStepError("Engine number is required."); return false; }
        if (!veh.odometer) { setStepError("Odometer reading is required."); return false; }
        if (!veh.askingPrice) { setStepError("Asking price is required."); return false; }
        if (!veh.location) { setStepError("Vehicle location (town / suburb) is required."); return false; }
        if (!veh.digitalSignature) { setStepError("Digital signature is required to confirm your submission."); return false; }
      }
      if (step === 2) {
        if (!vehDocs.certifiedId.length) { setStepError("Certified ID copy is required."); return false; }
        if (!vehDocs.natisCert.length) { setStepError("NaTIS / Vehicle registration certificate is required."); return false; }
        if (!vehDocs.proofOfResidence.length) { setStepError("Proof of residence is required."); return false; }
        if (!vehDocs.policeClearance.length) { setStepError("Police clearance or vehicle check consent is required."); return false; }
        if (!vehPhotos.length) { setStepError("At least 1 vehicle photo is required."); return false; }
      }
      if (step === 3) {
        if (!vehDocs.filledPawnDoc.length) { setStepError("Please upload your completed pawn document before submitting."); return false; }
      }
    }
    return true;
  }

  async function handleSubmit() {
    if (!validateStep()) return;
    setError("");
    setSubmitting(true);
    try {
      const submissionId = `pawn_${Date.now()}`;
      const documents: Record<string, string> = {};
      const photos: string[] = [];

      if (tab === "property") {
        // Upload all property documents
        const docMap: Record<string, string> = {
          certifiedId: "certified_id", titleDeed: "title_deed", deedOfSale: "deed_of_sale",
          powerOfAttorney: "power_of_attorney", ratesClearance: "rates_clearance",
          bondCancellation: "bond_cancellation", proofOfResidence: "proof_of_residence",
          bankLetter: "bank_letter", taxCertificate: "tax_certificate", filledPawnDoc: "filled_pawn_doc",
        };
        for (const [key, category] of Object.entries(docMap)) {
          const files = propDocs[key];
          if (files?.length) {
            documents[key] = await uploadFile(submissionId, category, files[0]);
          }
        }
        // Upload photos
        for (let i = 0; i < propPhotos.length; i++) {
          const url = await uploadPhoto(submissionId, i, propPhotos[i]);
          photos.push(url);
        }

        const id = await savePawnSubmission({
          type: "property",
          sellerName: prop.sellerName, sellerPhone: prop.sellerPhone, sellerEmail: prop.sellerEmail,
          propertyAddress: prop.propertyAddress, erfNumber: prop.erfNumber,
          askingPrice: parseFloat(prop.askingPrice) || 0,
          bondStatus: prop.bondStatus, bondHolderDetail: prop.bondHolderDetail,
          occupancyStatus: propOccupied ? "occupied" : "vacant",
          digitalSignature: prop.digitalSignature,
          documents, photos,
        });
        setSuccessRef(id);
      } else {
        // Upload all vehicle documents
        const docMap: Record<string, string> = {
          certifiedId: "certified_id", natisCert: "natis_certificate",
          proofOfResidence: "proof_of_residence", policeClearance: "police_clearance",
          filledPawnDoc: "filled_pawn_doc",
        };
        for (const [key, category] of Object.entries(docMap)) {
          const files = vehDocs[key];
          if (files?.length) {
            documents[key] = await uploadFile(submissionId, category, files[0]);
          }
        }
        for (let i = 0; i < vehPhotos.length; i++) {
          const url = await uploadPhoto(submissionId, i, vehPhotos[i]);
          photos.push(url);
        }

        const id = await savePawnSubmission({
          type: "vehicle",
          sellerName: veh.sellerName, sellerPhone: veh.sellerPhone, sellerEmail: veh.sellerEmail,
          vehicleMake: veh.vehicleMake, vehicleModel: veh.vehicleModel,
          vehicleYear: parseInt(veh.vehicleYear) || undefined,
          vehicleColour: veh.vehicleColour, vinNumber: veh.vinNumber, engineNumber: veh.engineNumber,
          odometer: parseInt(veh.odometer) || undefined,
          askingPrice: parseFloat(veh.askingPrice) || 0,
          paymentTerms: vehBankPay ? "bank" : "cash",
          location: veh.location, digitalSignature: veh.digitalSignature,
          documents, photos,
        });
        setSuccessRef(id);
      }

      setSuccess(true);
    } catch (e) {
      console.error(e);
      setError("Submission failed. Please check your internet connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="pawn-flow bg-[#090E1A] py-20 px-4">
        <div className="max-w-lg mx-auto bg-[#0D1526] rounded-2xl border border-white/8 p-10 text-center">
          <div className="w-20 h-20 bg-green-500/15 border-2 border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" strokeWidth={1.75} />
          </div>
          <h2 className="text-white font-black text-2xl mb-2">Submission Received</h2>
          <p className="text-gray-400 text-sm mb-6">
            Thank you for submitting your {tab} for evaluation. Our team will contact you within{" "}
            <strong className="text-white">24–48 hours</strong>.
          </p>
          <div className="bg-[#131C30] rounded-xl px-5 py-4 mb-6 text-left">
            <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">Reference Number</p>
            <p className="text-amber-400 font-mono font-black text-lg break-all">{successRef}</p>
          </div>
          <p className="text-gray-500 text-xs mb-6">
            Save this reference number. You can quote it when following up with our team at{" "}
            <a href="tel:+264814698594" className="text-amber-400 hover:underline">+264 81 469 8594</a>{" "}
            or{" "}
            <a href="tel:+264817327089" className="text-amber-400 hover:underline">+264 81 732 7089</a>
          </p>
          <button
            onClick={resetAll}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3 rounded-xl text-sm transition-colors"
          >
            Submit Another Item
          </button>
        </div>
      </div>
    );
  }

  // ── Tab + step navigation ────────────────────────────────────────────────
  return (
    <div className="pawn-flow bg-[#090E1A] py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Tab selector */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex gap-1 bg-[#0D1526] border border-white/8 rounded-2xl p-1.5">
            {(["property", "vehicle"] as Tab[]).map(t => (
              <button
                key={t}
                data-pawn-tab={t}
                onClick={() => { setTab(t); setStep(0); setError(""); setStepError(""); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${tab === t ? "bg-amber-500 text-white shadow" : "text-gray-400 hover:text-gray-200"}`}
              >
                {t === "property" ? <Home className="w-4 h-4" strokeWidth={1.75} /> : <Car className="w-4 h-4" strokeWidth={1.75} />}
                {t === "property" ? "Property" : "Vehicle"}
              </button>
            ))}
          </div>
        </div>

        {/* Step bar */}
        <StepBar current={step} />

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* ─────────────────────────── PROPERTY FORM ─────────────────────────── */}
        {tab === "property" && (
          <>
            {step === 0 && (
              <FormSection title="Seller Details">
                <div>
                  <label className={lbl}>Seller Full Name{req}</label>
                  <input className={inp} placeholder="Enter full name" value={prop.sellerName} onChange={e => setProp(p => ({ ...p, sellerName: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Seller Contact / Phone{req}</label>
                  <input className={inp} type="tel" placeholder="+264 81 …" value={prop.sellerPhone} onChange={e => setProp(p => ({ ...p, sellerPhone: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Email Address{req}</label>
                  <input className={inp} type="email" placeholder="your@email.com" value={prop.sellerEmail} onChange={e => setProp(p => ({ ...p, sellerEmail: e.target.value }))} />
                </div>
              </FormSection>
            )}

            {step === 1 && (
              <>
                <FormSection title="Property Details">
                  <div>
                    <label className={lbl}>Property Address{req}</label>
                    <textarea className={inp} rows={2} placeholder="Street address, suburb, city" value={prop.propertyAddress} onChange={e => setProp(p => ({ ...p, propertyAddress: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={lbl}>erf Number</label>
                      <input className={inp} placeholder="erf number" value={prop.erfNumber} onChange={e => setProp(p => ({ ...p, erfNumber: e.target.value }))} />
                    </div>
                    <div>
                      <label className={lbl}>Asking Price (NAD){req}</label>
                      <input className={inp} type="number" min={0} placeholder="Amount" value={prop.askingPrice} onChange={e => setProp(p => ({ ...p, askingPrice: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={lbl}>Bond Status{req}</label>
                      <select className={inp} value={prop.bondStatus} onChange={e => setProp(p => ({ ...p, bondStatus: e.target.value }))}>
                        <option>No Bond / Clear</option>
                        <option>Mortgaged</option>
                        <option>Leasehold</option>
                        <option>Sold Subject to Bond</option>
                        <option>Other</option>
                      </select>
                    </div>
                    {prop.bondStatus === "Mortgaged" && (
                      <div>
                        <label className={lbl}>Bond Holder / Bank{req}</label>
                        <input className={inp} placeholder="Bank / Holder" value={prop.bondHolderDetail} onChange={e => setProp(p => ({ ...p, bondHolderDetail: e.target.value }))} />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={lbl}>Occupancy Status</label>
                    <Toggle value={propOccupied} onChange={setPropOccupied} leftLabel="Vacant" rightLabel="Occupied" />
                  </div>
                </FormSection>
                <FormSection title="Digital Signature">
                  <div>
                    <label className={lbl}>Digital Signature (Type your full name){req}</label>
                    <input className={inp} placeholder="Enter digital signature" value={prop.digitalSignature} onChange={e => setProp(p => ({ ...p, digitalSignature: e.target.value }))} />
                    <p className="text-gray-600 text-xs mt-1">By typing your name, you confirm all information is accurate and truthful.</p>
                  </div>
                </FormSection>
              </>
            )}

            {step === 2 && (
              <>
                <FormSection title="Required Documents">
                  <FileUploadField label="Certified ID copy (pdf/jpg/png)" required accept=".pdf,.jpg,.jpeg,.png" files={propDocs.certifiedId} onFiles={f => setPropDocs(d => ({ ...d, certifiedId: f }))} theme="dark" />
                  <FileUploadField label="Title deed or registered ownership certificate" required accept=".pdf,.jpg,.jpeg,.png" files={propDocs.titleDeed} onFiles={f => setPropDocs(d => ({ ...d, titleDeed: f }))} theme="dark" />
                  <FileUploadField label="Signed deed of sale (pdf)" required accept=".pdf" files={propDocs.deedOfSale} onFiles={f => setPropDocs(d => ({ ...d, deedOfSale: f }))} theme="dark" />
                  <FileUploadField label="Power of attorney (if represented)" optional accept=".pdf" files={propDocs.powerOfAttorney} onFiles={f => setPropDocs(d => ({ ...d, powerOfAttorney: f }))} theme="dark" />
                  <FileUploadField label="Municipal rates clearance (if available)" optional accept=".pdf,.jpg,.jpeg,.png" files={propDocs.ratesClearance} onFiles={f => setPropDocs(d => ({ ...d, ratesClearance: f }))} theme="dark" />
                  <FileUploadField label="Bond cancellation or statement (if mortgaged)" optional accept=".pdf" files={propDocs.bondCancellation} onFiles={f => setPropDocs(d => ({ ...d, bondCancellation: f }))} theme="dark" />
                </FormSection>

                <FormSection title="FICA Documents">
                  <FileUploadField label="Proof of residence (utility bill or letter)" required accept=".pdf,.jpg,.jpeg,.png" files={propDocs.proofOfResidence} onFiles={f => setPropDocs(d => ({ ...d, proofOfResidence: f }))} theme="dark" />
                  <FileUploadField label="Bank letter" required accept=".pdf" files={propDocs.bankLetter} onFiles={f => setPropDocs(d => ({ ...d, bankLetter: f }))} theme="dark" />
                  <FileUploadField label="Tax certificate" required accept=".pdf" files={propDocs.taxCertificate} onFiles={f => setPropDocs(d => ({ ...d, taxCertificate: f }))} theme="dark" />
                </FormSection>

                <FormSection title="Property Photos – exterior, interior, erf signage (min 6)">
                  <FileUploadField
                    label="Select property photos (min 6, up to 20)"
                    required
                    accept="image/*"
                    multiple
                    maxFiles={20}
                    isPhotoSelector
                    files={propPhotos}
                    onFiles={setPropPhotos}
                    theme="dark"
                  />
                  {propPhotos.length > 0 && (
                    <p className="text-amber-400 text-xs font-semibold">{propPhotos.length} photo{propPhotos.length !== 1 ? "s" : ""} selected {propPhotos.length < 6 ? `— need at least ${6 - propPhotos.length} more` : "✓"}</p>
                  )}
                </FormSection>
              </>
            )}

            {step === 3 && (
              <FormSection title="Pawn Document">
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => generatePreviewPDF({
                      "Seller Name": prop.sellerName, "Phone": prop.sellerPhone, "Email": prop.sellerEmail,
                      "Property Address": prop.propertyAddress, "erf Number": prop.erfNumber,
                      "Asking Price (NAD)": prop.askingPrice, "Bond Status": prop.bondStatus,
                      "Occupancy": propOccupied ? "Occupied" : "Vacant", "Digital Signature": prop.digitalSignature,
                    }, "property")}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
                  >
                    <Eye className="w-5 h-5" strokeWidth={2} /> Preview Pawn Doc
                  </button>
                  <button
                    type="button"
                    onClick={() => generateBlankPawnDoc("property")}
                    className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA6900] text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
                  >
                    <Download className="w-5 h-5" strokeWidth={2} /> Download Pawn Document
                  </button>
                </div>
                <div className="pt-2">
                  <FileUploadField
                    label="Upload filled pawn document"
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    files={propDocs.filledPawnDoc}
                    onFiles={f => setPropDocs(d => ({ ...d, filledPawnDoc: f }))}
                    theme="dark"
                  />
                </div>
              </FormSection>
            )}
          </>
        )}

        {/* ─────────────────────────── VEHICLE FORM ─────────────────────────── */}
        {tab === "vehicle" && (
          <>
            {step === 0 && (
              <FormSection title="Seller Details">
                <div>
                  <label className={lbl}>Seller Full Name{req}</label>
                  <input className={inp} placeholder="Enter full name" value={veh.sellerName} onChange={e => setVeh(v => ({ ...v, sellerName: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Seller Contact / Phone{req}</label>
                  <input className={inp} type="tel" placeholder="+264 81 …" value={veh.sellerPhone} onChange={e => setVeh(v => ({ ...v, sellerPhone: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Email Address{req}</label>
                  <input className={inp} type="email" placeholder="your@email.com" value={veh.sellerEmail} onChange={e => setVeh(v => ({ ...v, sellerEmail: e.target.value }))} />
                </div>
              </FormSection>
            )}

            {step === 1 && (
              <>
                <FormSection title="Vehicle Details">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={lbl}>Vehicle Make{req}</label>
                      <input className={inp} placeholder="Make" value={veh.vehicleMake} onChange={e => setVeh(v => ({ ...v, vehicleMake: e.target.value }))} />
                    </div>
                    <div>
                      <label className={lbl}>Model{req}</label>
                      <input className={inp} placeholder="Model" value={veh.vehicleModel} onChange={e => setVeh(v => ({ ...v, vehicleModel: e.target.value }))} />
                    </div>
                    <div>
                      <label className={lbl}>Year{req}</label>
                      <input className={inp} type="number" min={1980} max={2030} placeholder="Year" value={veh.vehicleYear} onChange={e => setVeh(v => ({ ...v, vehicleYear: e.target.value }))} />
                    </div>
                    <div>
                      <label className={lbl}>Colour{req}</label>
                      <input className={inp} placeholder="Colour" value={veh.vehicleColour} onChange={e => setVeh(v => ({ ...v, vehicleColour: e.target.value }))} />
                    </div>
                    <div>
                      <label className={lbl}>VIN / Chassis Number{req}</label>
                      <input className={inp} placeholder="VIN / Chassis" value={veh.vinNumber} onChange={e => setVeh(v => ({ ...v, vinNumber: e.target.value }))} />
                    </div>
                    <div>
                      <label className={lbl}>Engine Number{req}</label>
                      <input className={inp} placeholder="Engine #" value={veh.engineNumber} onChange={e => setVeh(v => ({ ...v, engineNumber: e.target.value }))} />
                    </div>
                    <div>
                      <label className={lbl}>Odometer (km){req}</label>
                      <input className={inp} type="number" min={0} placeholder="Odometer" value={veh.odometer} onChange={e => setVeh(v => ({ ...v, odometer: e.target.value }))} />
                    </div>
                    <div>
                      <label className={lbl}>Asking Price (NAD){req}</label>
                      <input className={inp} type="number" min={0} placeholder="Enter amount" value={veh.askingPrice} onChange={e => setVeh(v => ({ ...v, askingPrice: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Payment Terms</label>
                    <Toggle value={vehBankPay} onChange={setVehBankPay} leftLabel="Cash" rightLabel="Bank Transfer" />
                  </div>
                  <div>
                    <label className={lbl}>Location (Town / Suburb){req}</label>
                    <input className={inp} placeholder="Enter location" value={veh.location} onChange={e => setVeh(v => ({ ...v, location: e.target.value }))} />
                  </div>
                </FormSection>
                <FormSection title="Digital Signature">
                  <div>
                    <label className={lbl}>Digital Signature (Type your full name){req}</label>
                    <input className={inp} placeholder="Enter digital signature" value={veh.digitalSignature} onChange={e => setVeh(v => ({ ...v, digitalSignature: e.target.value }))} />
                    <p className="text-gray-600 text-xs mt-1">By typing your name, you confirm all information is accurate and truthful.</p>
                  </div>
                </FormSection>
              </>
            )}

            {step === 2 && (
              <>
                <FormSection title="Required Documents">
                  <FileUploadField label="Certified ID copy (pdf/jpg/png)" required accept=".pdf,.jpg,.jpeg,.png" files={vehDocs.certifiedId} onFiles={f => setVehDocs(d => ({ ...d, certifiedId: f }))} theme="dark" />
                  <FileUploadField label="Vehicle registration certificate (NaTIS logbook) – front & back" required accept=".pdf,.jpg,.jpeg,.png" multiple maxFiles={2} files={vehDocs.natisCert} onFiles={f => setVehDocs(d => ({ ...d, natisCert: f }))} theme="dark" />
                  <FileUploadField label="Proof of residence (utility bill or letter)" required accept=".pdf,.jpg,.jpeg,.png" files={vehDocs.proofOfResidence} onFiles={f => setVehDocs(d => ({ ...d, proofOfResidence: f }))} theme="dark" />
                  <FileUploadField label="Police clearance (if available) or consent to vehicle check" required accept=".pdf,.jpg,.jpeg,.png" files={vehDocs.policeClearance} onFiles={f => setVehDocs(d => ({ ...d, policeClearance: f }))} theme="dark" />
                </FormSection>

                <FormSection title="10 clear photos – exterior, interior, dash, engine bay, VIN/chassis plate, tyres">
                  <FileUploadField
                    label="Select up to 10 photos"
                    required
                    accept="image/*"
                    multiple
                    maxFiles={10}
                    isPhotoSelector
                    files={vehPhotos}
                    onFiles={setVehPhotos}
                    theme="dark"
                  />
                  {vehPhotos.length > 0 && (
                    <p className="text-amber-400 text-xs font-semibold">{vehPhotos.length} photo{vehPhotos.length !== 1 ? "s" : ""} selected</p>
                  )}
                </FormSection>
              </>
            )}

            {step === 3 && (
              <FormSection title="Pawn Document">
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => generatePreviewPDF({
                      "Seller Name": veh.sellerName, "Phone": veh.sellerPhone, "Email": veh.sellerEmail,
                      "Vehicle Make": veh.vehicleMake, "Model": veh.vehicleModel, "Year": veh.vehicleYear,
                      "Colour": veh.vehicleColour, "VIN": veh.vinNumber, "Engine #": veh.engineNumber,
                      "Odometer": `${veh.odometer} km`, "Asking Price (NAD)": veh.askingPrice,
                      "Payment Terms": vehBankPay ? "Bank Transfer" : "Cash",
                      "Location": veh.location, "Digital Signature": veh.digitalSignature,
                    }, "vehicle")}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
                  >
                    <Eye className="w-5 h-5" strokeWidth={2} /> Preview Pawn Doc
                  </button>
                  <button
                    type="button"
                    onClick={() => generateBlankPawnDoc("vehicle")}
                    className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA6900] text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
                  >
                    <Download className="w-5 h-5" strokeWidth={2} /> Download Pawn Document
                  </button>
                </div>
                <div className="pt-2">
                  <FileUploadField
                    label="Upload filled pawn document"
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    files={vehDocs.filledPawnDoc}
                    onFiles={f => setVehDocs(d => ({ ...d, filledPawnDoc: f }))}
                    theme="dark"
                  />
                </div>
              </FormSection>
            )}
          </>
        )}

        {/* Step validation error */}
        {stepError && (
          <div className="mt-4 flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-red-300 text-sm font-semibold">{stepError}</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-4">
          {step > 0 && (
            <button
              type="button"
              onClick={() => { setStep(s => s - 1); setStepError(""); }}
              className="flex-1 border border-white/10 text-gray-300 hover:text-white py-3.5 rounded-xl text-sm font-bold transition-colors"
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => { if (validateStep()) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-black py-3.5 rounded-xl text-sm transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 bg-[#FF3FAE] hover:bg-[#E0008F] text-white font-black py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60"
            >
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading & Submitting…</>
                : <><Send className="w-4 h-4" strokeWidth={2} /> Submit</>}
            </button>
          )}
        </div>

        <p className="text-gray-600 text-xs text-center mt-4">
          All submissions are encrypted and stored securely. Questions? Call{" "}
          <a href="tel:+264814698594" className="text-amber-500 hover:underline">+264 81 469 8594</a>{" "}
          or{" "}
          <a href="tel:+264817327089" className="text-amber-500 hover:underline">+264 81 732 7089</a>
        </p>
      </div>
    </div>
  );
}
