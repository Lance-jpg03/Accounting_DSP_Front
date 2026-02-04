"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import Image from "next/image";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

const ROLE = {
  LEGAL: 1,
  ACCOUNTING: 2,
  LICENSING: 3,
};
const generateCollectionId = (
  dspName: string,
  existingRecords: DSPRecord[],
) => {
  const prefix = dspName.trim().substring(0, 3).toUpperCase().padEnd(3, "X");
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const datePart = `${year}${month}`;
  const matches = existingRecords.filter(
    (r) => r.DSP === dspName && r.Collection_ID?.includes(datePart),
  );
  const nextNumber = matches.length + 1;
  const counter = String(nextNumber).padStart(5, "0");
  return `${prefix}-${datePart}-${counter}`;
};
interface DspData {
  Coverage_Period: string;
  Licensor: string;
  Claim_Type: string;
  Email_Subject: string;
  Status: string;
  Confirm_Date: string;
  Deadline_of_Billing: string;
  Date_Received: string;
  Gross: string;
  Currency: string;
  Exchange_Rate: string;
  Peso_Value: string;
  Remarks: string;
  Remarks2: string;
  DSP: string;
  billing_date: string;
  Collection_ID?: string;
  "SI#": string;
  "BI#": string;
  Division: string;
  Amount_Received: string;
  Bank_Charge: string;
  Total_Amount: string;
  Year_Period: string;
  Quarter_Period: string;
  Variance: string;
}
interface DSPRecord {
  Collection_ID: string;
  Coverage_Period: string | null;
  Licensor: string;
  Claim_Type: string;
  Email_Subject: string;
  Status: string;
  Confirm_Date: string;
  Deadline_of_Billing: string;
  Date_Received: string;
  Gross: number | null;
  Currency: string;
  Exchange_Rate: number | null;
  Peso_Value: number | null;
  Remarks: string;
  Remarks2: string;
  DSP: string | null;
  billing_date: string | null;
  "SI#": string;
  "BI#": string;
  Division: string;
  Amount_Received: number | null;
  Bank_Charge: number | null;
  Total_Amount: number | null;
  Year_Period: string | null;
  Quarter_Period: string | null;
  Variance: number | null; // Added to match Database column
}
const DSP = [
  "Spotify",
  "YouTube",
  "TikTok",
  "Apple Music",
  "Apple TV",
  "Amazon/HBO/Discovery",
  "Hayu",
  "Twitch",
  "CapCut",
  "Kumu",
  "Huawei",
  "Netflix",
  "Facebook",
  "WhatsApp",
  "Concerts & Events",
  "Foreign",
  "RME",
];
const claimTypes = [
  "Back-Claim",
  "Post-Claim",
  "Pre-Claim",
  "Residual",
  "GEC",
  "MG",
  "Flat Fee",
  "Shorts",
];
const licensors = ["FILSCAP", "CASH", "APRA"];
const statuses = ["Pending", "Billed"];
const currencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "HKD",
  "NZD",
  "SEK",
  "KRW",
  "SGD",
  "NOK",
  "MXN",
  "INR",
  "PHP",
];
const START_YEAR = 2020;
const END_YEAR = new Date().getFullYear();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const monthlyOptions: string[] = [];
const quarterlyOptions: string[] = [];
for (let year = END_YEAR; year >= START_YEAR; year--) {
  for (const month of months) {
    monthlyOptions.push(`${month} ${year}`);
  }
  quarterlyOptions.push(`${year}-Q1`, `${year}-Q2`, `${year}-Q3`, `${year}-Q4`);
}
const dspCoverageMode: Record<string, "monthly" | "quarterly"> = {
  Spotify: "monthly",
  TikTok: "monthly",
  "Apple Music": "monthly",
  YouTube: "quarterly",
  Netflix: "quarterly",
  "Apple TV": "quarterly",
  "Amazon/HBO/Discovery": "monthly",
};
const formatDateDisplay = (dateStr: string | null | undefined) => {
  if (!dateStr || dateStr === "") return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
};
function Section({
  title,
  children,
  disabled = false,
  columns = "grid-cols-1 md:grid-cols-2",
}: any) {
  return (
    <div
      className={`border rounded overflow-hidden bg-[#FFF9E5] shadow-sm h-full flex flex-col ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="bg-[#004aad] p-3 border-b">
        <h2 className="font-bold text-lg text-white uppercase tracking-wider">
          {title}
        </h2>
      </div>

      <div className={`p-4 grid ${columns} gap-4 w-full`}>{children}</div>
    </div>
  );
}
function Input({ label, disabled, ...props }: any) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-xs">{label}</label>
      <input
        {...props}
        disabled={disabled}
        className="p-2 border rounded bg-white disabled:bg-gray-200 disabled:text-gray-500 text-sm shadow-sm"
      />
    </div>
  );
}
function Select({ label, options, disabled, ...props }: any) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-xs">{label}</label>
      <select
        {...props}
        disabled={disabled}
        className="p-2 border rounded bg-white disabled:bg-gray-200 disabled:text-gray-500 text-sm shadow-sm"
      >
        <option value="">-- SELECT --</option>
        {options.map((o: string) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
function DateInput({ disabled, ...props }: any) {
  return <Input {...props} type="date" disabled={disabled} />;
}
export default function DSPPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [roleFlag, setRoleFlag] = useState<number>(0);
  const [coverageMode, setCoverageMode] = useState<
    "monthly" | "quarterly" | ""
  >("");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<DSPRecord[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [selectedDSP, setSelectedDSP] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("desc"); // New State
  const [currentPage, setCurrentPage] = useState(1);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const ROWS_PER_PAGE = 10;

  const [formData, setFormData] = useState<DspData>({
    Coverage_Period: "",
    Licensor: "",
    Claim_Type: "",
    Email_Subject: "",
    Status: "",
    Confirm_Date: "",
    Deadline_of_Billing: "",
    Date_Received: "",
    Gross: "",
    Currency: "",
    Exchange_Rate: "",
    Peso_Value: "",
    Remarks: "",
    Remarks2: "",
    billing_date: "",
    DSP: "",
    "SI#": "",
    "BI#": "",
    Division: "",
    Amount_Received: "",
    Bank_Charge: "",
    Total_Amount: "",
    Year_Period: "",
    Quarter_Period: "",
    Variance: "0",
  });

  // ADDED MATH FUNCTION: Handles Peso conversion, Bank Charge, and Variance
  useEffect(() => {
    const gross = parseFloat(formData.Gross) || 0;
    const exchangeRate = parseFloat(formData.Exchange_Rate) || 0;
    const amountReceived = parseFloat(formData.Amount_Received) || 0;
    const bankCharge = parseFloat(formData.Bank_Charge) || 0;
    const totalAmount = parseFloat(formData.Total_Amount) || 0;

    const calculatedPeso = (gross * exchangeRate).toFixed(2);
    const calculatedVariance = (gross - totalAmount).toFixed(2);

    setFormData((prev) => {
      let updates: Partial<DspData> = {};
      if (prev.Peso_Value !== calculatedPeso)
        updates.Peso_Value = calculatedPeso;
      if (prev.Variance !== calculatedVariance)
        updates.Variance = calculatedVariance;

      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [formData.Gross, formData.Exchange_Rate, formData.Total_Amount]);

  const isDisabled = (allowedRoles: number[]) => {
    if (!mounted) return true;
    return !allowedRoles.includes(roleFlag);
  };

  useEffect(() => {
    setMounted(true);
    const role = Number(getCookie("roleFlag"));
    setRoleFlag(role);
    fetchDSP();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDSP, sortOrder]);

  const fetchDSP = async () => {
    setTableLoading(true);
    try {
      const res = await fetch(`${API_BASE}/dsp`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : (data.data ?? []));
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setTableLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      router.replace("/");
    }
  };

  const dspSummary = useMemo(() => {
    const map: Record<string, number> = {};
    DSP.forEach((dsp) => (map[dsp] = 0));
    records.forEach((r) => {
      if (r.DSP && map[r.DSP] !== undefined) map[r.DSP]++;
    });
    return map;
  }, [records]);

  const filteredRecords = useMemo(() => {
    let result =
      selectedDSP === "ALL"
        ? [...records]
        : records.filter((r) => r.DSP === selectedDSP);

    result.sort((a, b) => {
      const dateA = a.billing_date ? new Date(a.billing_date).getTime() : 0;
      const dateB = b.billing_date ? new Date(b.billing_date).getTime() : 0;
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [records, selectedDSP, sortOrder]);

  const totalPages = Math.ceil(filteredRecords.length / ROWS_PER_PAGE);
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredRecords.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  const specialClaims = ["Back-Claim", "GEC", "Pre-Claim"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Auto-update Amount Received when Gross is typed
    if (name === "Gross") {
      const val = value;
      const amt = parseFloat(val) || 0;
      const charge = (amt * 0.1).toFixed(2);
      const total = (amt - parseFloat(charge)).toFixed(2);
      setFormData((p: DspData) => ({
        ...p,
        Gross: val,
        Amount_Received: val,
        Bank_Charge: charge,
        Total_Amount: total,
      }));
      return;
    }

    if (name === "Amount_Received") {
      const amt = parseFloat(value) || 0;
      const charge = (amt * 0.1).toFixed(2);
      const total = (amt - parseFloat(charge)).toFixed(2);
      setFormData((p: DspData) => ({
        ...p,
        Amount_Received: value,
        Bank_Charge: charge,
        Total_Amount: total,
      }));
      return;
    }

    if (name === "DSP") {
      setCoverageMode(dspCoverageMode[value] || "");
      setFormData((p: DspData) => ({ ...p, DSP: value, Coverage_Period: "" }));
      return;
    }
    if (name === "Claim_Type" && !specialClaims.includes(value)) {
      setFormData((p: DspData) => ({
        ...p,
        Claim_Type: value,
        Email_Subject: "",
      }));
      return;
    }

    // 10% Bank Charge and Resulting Total Amount
    if (name === "Amount_Received") {
      const amt = parseFloat(value) || 0;
      const charge = (amt * 0.1).toFixed(2);
      const total = (amt - parseFloat(charge)).toFixed(2);
      setFormData((p: DspData) => ({
        ...p,
        Amount_Received: value,
        Bank_Charge: charge,
        Total_Amount: total,
      }));
      return;
    }

    setFormData((p: DspData) => ({ ...p, [name]: value }));
  };

  const handleEditClick = (record: DSPRecord) => {
    setEditingId(record.Collection_ID);
    setFormData({
      DSP: record.DSP || "",
      Coverage_Period: record.Coverage_Period || "",
      Licensor: record.Licensor || "",
      Claim_Type: record.Claim_Type || "",
      Email_Subject: record.Email_Subject || "",
      Status: record.Status || "",
      Confirm_Date: record.Confirm_Date
        ? record.Confirm_Date.split("T")[0]
        : "",
      Deadline_of_Billing: record.Deadline_of_Billing
        ? record.Deadline_of_Billing.split("T")[0]
        : "",
      Date_Received: record.Date_Received
        ? record.Date_Received.split("T")[0]
        : "",
      Gross: record.Gross?.toString() || "",
      Currency: record.Currency || "",
      Exchange_Rate: record.Exchange_Rate?.toString() || "",
      Peso_Value: record.Peso_Value?.toString() || "",
      Remarks: record.Remarks || "",
      Remarks2: record.Remarks2 || "",
      billing_date: record.billing_date
        ? record.billing_date.split("T")[0]
        : "",
      "SI#": record["SI#"] || "",
      "BI#": record["BI#"] || "",
      Division: record.Division || "",
      Amount_Received: record.Amount_Received?.toString() || "",
      Bank_Charge: record.Bank_Charge?.toString() || "",
      Total_Amount: record.Total_Amount?.toString() || "",
      Year_Period: record.Year_Period || "",
      Quarter_Period: record.Quarter_Period || "",
      Variance: record.Variance?.toString() || "0",
    });
    if (record.DSP) setCoverageMode(dspCoverageMode[record.DSP] || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedId(null);

    let dataToSubmit = { ...formData };
    if (!editingId) {
      dataToSubmit.Collection_ID = generateCollectionId(formData.DSP, records);
    }
    const url = editingId ? `${API_BASE}/dsp/${editingId}` : `${API_BASE}/dsp`;
    const method = editingId ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to save DSP record");
      }
      const result = await response.json();
      setGeneratedId(result.Collection_ID);
      setEditingId(null);
      setFormData({
        Coverage_Period: "",
        Licensor: "",
        Claim_Type: "",
        Email_Subject: "",
        Status: "",
        Confirm_Date: "",
        Deadline_of_Billing: "",
        Date_Received: "",
        Gross: "",
        Currency: "",
        Exchange_Rate: "",
        Peso_Value: "",
        Remarks: "",
        Remarks2: "",
        billing_date: "",
        DSP: "",
        "SI#": "",
        "BI#": "",
        Division: "",
        Amount_Received: "",
        Bank_Charge: "",
        Total_Amount: "",
        Year_Period: "",
        Quarter_Period: "",
        Variance: "0",
      });
      fetchDSP();
    } catch (err: any) {
      console.error("Save failed", err);
      alert(`Save failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  const exportToExcel = () => {
    const headers = [
      "Collection ID",
      "DSP",
      "Coverage Period",
      "Licensor",
      "Claim Type",
      "Status",
      "Email Subject",
      "Confirm Date",
      "Deadline of Billing",
      "Date Received",
      "Currency",
      "Gross",
      "Exchange Rate",
      "Peso Value",
      "Remarks",
      "Remarks 2",
      "Billing Date",
      "SI#",
      "BI#",
      "Division",
      "Amount Received",
      "Total Amount",
      "Year Period",
      "Quarter Period",
      "Variance",
    ];
    const rows = filteredRecords.map((r) => [
      r.Collection_ID ?? "",
      r.DSP ?? "",
      r.Coverage_Period ?? "",
      r.Licensor ?? "",
      r.Claim_Type ?? "",
      r.Status ?? "",
      r.Email_Subject ?? "",
      r.Confirm_Date ?? "",
      r.Deadline_of_Billing ?? "",
      r.Date_Received ?? "",
      r.Currency ?? "",
      r.Gross ?? "",
      r.Exchange_Rate ?? "",
      r.Peso_Value ?? "",
      r.Remarks ?? "",
      r.Remarks2 ?? "",
      r.billing_date ?? "",
      r["SI#"] ?? "",
      r["BI#"] ?? "",
      r.Division ?? "",
      r.Amount_Received ?? "",
      r.Total_Amount ?? "",
      r.Year_Period ?? "",
      r.Quarter_Period ?? "",
      r.Variance ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dsp_records.csv";
    link.click();
  };
  return (
    <div className="min-h-screen w-full bg-[url('/BG.png')] lg:bg-[url('/BG-laptop.png')] bg-fixed bg-no-repeat bg-[length:100%_100%] bg-center">
      <div className="relative w-full bg-[#004aad] p-3 sticky top-0 z-50">
        <div className="w-full px-1 relative z-10 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/omni.png" alt="LOGO" width={200} height={50} />
            <div className="text-white text-xl">
            Foreign Revenue Tracker
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-6 py-2 rounded transition-all shadow-md uppercase text-xs"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="p-4 space-y-8">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-[#FFF9E5] p-4 items-stretch shadow-lg rounded-sm"
        >
          <div className="lg:col-span-2">
            <Section
              title="DDD/Legal Form"
              columns="grid-cols-1 md:grid-cols-5"
              disabled={isDisabled([ROLE.LEGAL])}
            >
              <Select
                label="Division"
                name="Division"
                value={formData.Division}
                options={["Digital", "Non-Digital"]}
                onChange={handleChange}
              />
              <Select
                label="Omni Play"
                name="DSP"
                value={formData.DSP}
                options={DSP}
                onChange={handleChange}
              />
              <Select
                label="Coverage Period"
                name="Coverage_Period"
                value={formData.Coverage_Period}
                options={
                  coverageMode === "monthly" ? monthlyOptions : quarterlyOptions
                }
                onChange={handleChange}
              />
              <Select
                label="Year"
                name="Year_Period"
                value={formData.Year_Period}
                options={Array.from(
                  { length: END_YEAR - START_YEAR + 1 },
                  (_, i) => (END_YEAR - i).toString(),
                )}
                onChange={handleChange}
              />
              <Select
                label="Quarter"
                name="Quarter_Period"
                value={formData.Quarter_Period}
                options={Array.from({ length: 4 }, (_, i) => `Q${i + 1}`)}
                onChange={handleChange}
              />
              <Select
                label="Licensor"
                name="Licensor"
                value={formData.Licensor}
                options={licensors}
                onChange={handleChange}
              />
              <Select
                label="Claim Type"
                name="Claim_Type"
                value={formData.Claim_Type}
                options={claimTypes}
                onChange={handleChange}
              />
              <Input
                label="Email Subject"
                name="Email_Subject"
                value={formData.Email_Subject}
                onChange={handleChange}
              />
              <DateInput
                label="Confirm Date"
                name="Confirm_Date"
                value={formData.Confirm_Date}
                onChange={handleChange}
              />
              <DateInput
                label="Deadline of Billing"
                name="Deadline_of_Billing"
                value={formData.Deadline_of_Billing}
                onChange={handleChange}
              />
              <Input
                label="Gross"
                name="Gross"
                type="number"
                value={formData.Gross || ""}
                onChange={handleChange}
              />
              <Select
                label="Currency"
                name="Currency"
                value={formData.Currency}
                options={currencies}
                onChange={handleChange}
              />
              <div className="w-[320%]">
                <Input
                  label="Remarks"
                  name="Remarks"
                  value={formData.Remarks}
                  onChange={handleChange}
                />
              </div>
            </Section>
          </div>
          <div className="lg:col-span-1">
            <Section
              title="Accounting Form"
              columns="grid-cols-3"
              disabled={isDisabled([ROLE.ACCOUNTING])}
            >
              <DateInput
                label="Date Received"
                name="Date_Received"
                value={formData.Date_Received}
                onChange={handleChange}
              />
              <Input
                label="SI#"
                name="SI#"
                type="number"
                value={formData["SI#"] || ""}
                onChange={handleChange}
              />
              <Input
                label="BI#"
                name="BI#"
                type="text"
                value={formData["BI#"] || ""}
                onChange={handleChange}
              />
              <Input
                label="Amount"
                name="Amount_Received"
                type="number"
                value={formData.Amount_Received || ""}
                onChange={handleChange}
              />
              <Input
                label="Bank Charge"
                name="Bank_Charge"
                type="number"
                value={formData.Bank_Charge || ""}
                onChange={handleChange}
              />
              <Input
                label="Total Amount"
                name="Total_Amount"
                type="number"
                value={formData.Total_Amount || ""}
                onChange={handleChange}
              />
              <Input
                label="Exchange Rate"
                name="Exchange_Rate"
                type="number"
                value={formData.Exchange_Rate || ""}
                onChange={handleChange}
              />
              <div className="w-[220%]">
                <Input
                  label="Peso Value"
                  name="Peso_Value"
                  type="number"
                  value={formData.Peso_Value || ""}
                  onChange={handleChange}
                />
              </div>
            </Section>
          </div>
          <div className="lg:col-span-1">
            <Section
              title="Licensing Form"
              columns="grid-cols-1"
              disabled={isDisabled([ROLE.LICENSING])}
            >
              <DateInput
                label="Billing Date"
                name="billing_date"
                value={formData.billing_date}
                onChange={handleChange}
              />
              <Select
                label="Status"
                name="Status"
                value={formData.Status}
                options={statuses}
                onChange={handleChange}
              />
              <Input
                label="Remarks"
                name="Remarks2"
                value={formData.Remarks2}
                onChange={handleChange}
              />
            </Section>
          </div>
          <div className="col-span-full flex gap-4 ">
            <button
              type="submit"
              disabled={
                loading ||
                isDisabled([ROLE.LEGAL, ROLE.ACCOUNTING, ROLE.LICENSING])
              }
              className={`${
                editingId
                  ? "bg-orange-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } text-white text-xs font-bold py-2 px-6 rounded disabled:bg-gray-400`}
            >
              {loading
                ? "Saving…"
                : editingId
                  ? "Update DSP Record"
                  : "Save DSP Record"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    Coverage_Period: "",
                    Licensor: "",
                    Claim_Type: "",
                    Email_Subject: "",
                    Status: "",
                    Confirm_Date: "",
                    Deadline_of_Billing: "",
                    Date_Received: "",
                    Gross: "",
                    Currency: "",
                    Exchange_Rate: "",
                    Peso_Value: "",
                    Remarks: "",
                    Remarks2: "",
                    billing_date: "",
                    DSP: "",
                    "SI#": "",
                    "BI#": "",
                    Division: "",
                    Amount_Received: "",
                    Bank_Charge: "",
                    Total_Amount: "",
                    Year_Period: "",
                    Quarter_Period: "",
                    Variance: "0",
                  });
                }}
                className="bg-gray-500 text-white text-xs font-bold py-2 px-6 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        <h2 className="text-xl font-bold -mt-4 mb-4">
          DSP and Foreign records logged
        </h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-end">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold block mb-1 uppercase text-gray-500">
                Filter by DSP
              </label>
              <select
                value={selectedDSP}
                onChange={(e) => setSelectedDSP(e.target.value)}
                className="dspSelect"
              >
                <option value="ALL">All DSPs ({records.length})</option>
                {DSP.map((dsp) => (
                  <option key={dsp} value={dsp}>
                    {dsp} ({dspSummary[dsp]})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold block mb-1 uppercase text-gray-500">
                Sort Billing Date
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="billing"
              >
                <option value="desc">Latest to Oldest</option>
                <option value="asc">Oldest to Latest</option>
              </select>
            </div>
            <button onClick={exportToExcel} className="excel">
              EXPORT EXCEL
            </button>
          </div>
        </div>
        {tableLoading ? (
          <p className="text-sm italic">Loading records…</p>
        ) : (
          <div className="w-full border border-gray-300 rounded-sm overflow-hidden shadow-sm flex flex-col">
            <table className="w-full table-fixed border-collapse text-[10px] font-sans">
              <thead className="bg-[#f2f2f2] border-b border-gray-300">
                <tr className="divide-x divide-gray-300">
                  <th className="w-[6%] px-1 py-1.5 text-center font-bold text-gray-700">
                    ID
                  </th>
                  <th className="w-[5%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Division
                  </th>
                  <th className="w-[5%] px-1 py-1.5 text-center font-bold text-gray-700">
                    DSP
                  </th>
                  <th className="w-[8%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Period
                  </th>
                  <th className="w-[6%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Licensor
                  </th>
                  <th className="w-[7%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Claim
                  </th>
                  <th className="w-[10%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Subject
                  </th>
                  <th className="w-[5%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Confirm
                  </th>
                  <th className="w-[5%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Deadline
                  </th>
                  <th className="w-[6%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Gross
                  </th>
                  <th className="w-[4%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Curr
                  </th>
                  <th className="w-[6%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Rate
                  </th>
                  <th className="w-[6%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Remarks
                  </th>
                  <th className="w-[7%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Received
                  </th>
                  <th className="w-[4%] px-1 py-1.5 text-center font-bold text-gray-700">
                    SI#
                  </th>
                  <th className="w-[4%] px-1 py-1.5 text-center font-bold text-gray-700">
                    BI#
                  </th>
                  <th className="w-[4%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Amount
                  </th>
                  <th className="w-[4%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Charge
                  </th>
                  <th className="w-[4%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Total
                  </th>
                  <th className="w-[4%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Rate
                  </th>
                  <th className="w-[7%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Peso
                  </th>
                  <th className="w-[6%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Billing
                  </th>
                  <th className="w-[4%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Status
                  </th>
                  <th className="w-[4%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Remarks
                  </th>
                  <th className="w-[4%] px-1 py-1.5 text-center font-bold text-gray-700">
                    Variance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedRecords.map((r) => (
                  <tr
                    key={r.Collection_ID}
                    className={`border-b border-gray-300 divide-x divide-gray-300 hover:bg-gray-50 transition-colors ${
                      editingId === r.Collection_ID ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-1 py-1 text-blue-600 font-bold">
                      <button
                        onClick={() => handleEditClick(r)}
                        className="hover:underline text-left w-full truncate"
                      >
                        {r.Collection_ID}
                      </button>
                    </td>
                    <td className="px-1 py-1 text-center truncate">
                      {r.Division}
                    </td>
                    <td className="px-1 py-1 text-center truncate">{r.DSP}</td>
                    <td className="px-1 py-1 text-center truncate">
                      {r.Coverage_Period}
                    </td>
                    <td className="px-1 py-1 text-center">{r.Licensor}</td>
                    <td className="px-1 py-1 text-center">{r.Claim_Type}</td>
                    <td className="px-1 py-1 truncate">{r.Email_Subject}</td>
                    <td className="px-1 py-1 text-center">
                      {formatDateDisplay(r.Confirm_Date)}
                    </td>
                    <td className="px-1 py-1 text-center">
                      {formatDateDisplay(r.Deadline_of_Billing)}
                    </td>
                    <td className="px-1 py-1 text-center">{r.Gross}</td>
                    <td className="px-1 py-1 text-center">{r.Currency}</td>
                    <td className="px-1 py-1 text-center">{r.Exchange_Rate}</td>
                    <td
                      className="px-1 py-1 truncate text-center"
                      title={r.Remarks || ""}
                    >
                      {r.Remarks}
                    </td>
                    <td className="px-1 py-1 text-center">
                      {formatDateDisplay(r.Date_Received)}
                    </td>
                    <td className="px-1 py-1 text-center">{r["SI#"]}</td>
                    <td className="px-1 py-1 text-center">{r["BI#"]}</td>
                    <td className="px-1 py-1 text-center">
                      {r.Amount_Received}
                    </td>
                    <td className="px-1 py-1 text-center">{r.Bank_Charge}</td>
                    <td className="px-1 py-1 text-center">{r.Total_Amount}</td>
                    <td className="px-1 py-1 text-center">{r.Exchange_Rate}</td>
                    <td className="px-1 py-1 text-center">{r.Peso_Value}</td>
                    <td className="px-1 py-1 text-center">
                      {formatDateDisplay(r.billing_date)}
                    </td>
                    <td className="px-1 py-1 text-center">{r.Status}</td>
                    <td
                      className="px-1 py-1 truncate text-center"
                      title={r.Remarks2 || ""}
                    >
                      {r.Remarks2}
                    </td>
                    <td
                      className={`px-1 py-1 text-center w-full truncate ${Number(r.Variance) !== 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {r.Variance || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-white p-1 relative flex justify-center items-center border-t border-gray-300">
              <div className="absolute left-4 text-[11px] text-gray-700 hidden lg:block">
                Showing
                <span className="font-semibold">
                  {filteredRecords.length === 0
                    ? 0
                    : (currentPage - 1) * ROWS_PER_PAGE + 1}
                </span>
                to
                <span className="font-semibold">
                  {Math.min(
                    currentPage * ROWS_PER_PAGE,
                    filteredRecords.length,
                  )}
                </span>
                of
                <span className="font-semibold">{filteredRecords.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || tableLoading}
                  className="pagination"
                >
                  PREV
                </button>
                <div className="page">
                  PAGE {currentPage} / {totalPages || 1}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={
                    currentPage === totalPages ||
                    totalPages === 0 ||
                    tableLoading
                  }
                  className="pagination"
                >
                  NEXT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
