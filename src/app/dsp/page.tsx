"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import Image from "next/image";
import ForeignForm from "./foreignForm";
import LocalForm from "./localForms";
import { LICENSEE_DATA } from "./licenseeList";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

const generateCollectionId = (
  dspName: string,
  existingRecords: DSPRecord[],
) => {
  if (!dspName) return "";

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

const formatDisplayNumber = (val: any, decimals: number = 2) => {
  const num = parseFloat(String(val).replace(/,/g, ""));
  if (isNaN(num)) return (0).toFixed(decimals);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

const formatInputNumber = (val: string) => {
  if (!val) return "";
  const cleanVal = val.replace(/[^0-9.]/g, "");
  const parts = cleanVal.split(".");

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, 4)}` : parts[0];
};

interface DspData {
  Coverage_Start_Date: string;
  Coverage_End_Date: string;
  Coverage_Period: string;
  Society: string;
  Claim_Type: string;
  Email_Subject: string;
  Status: string;
  Notification_date: string;
  Deadline_of_Billing: string;
  Date_Received: string;
  Gross: string;
  Currency: string;
  Exchange_Rate: string;
  Peso_Value: string;
  DDM_Remarks: string;
  Licensing_Remarks: string;
  DSP: string;
  Date_billed: string;
  Collection_ID?: string;
  "SI#": string;
  "BI#": string;
  Division: string;
  Amount_Received: string;
  Bank_Charge: string;
  Total_Amount: string;
  Variance: string;
  Data_Coverage?: string;
  Origin: string;
  Licensor: string;
  Licensee: string;
  Territory: string;
  "%VAT": string;
  Total_Gross_Amount?: string;
  CWT: string;
  Rights_Covered?: string;
  Contract_Status?: string;
  Covered_Service?: string;
  Source_Type?: string;
  Category?: string;
  Establishment?: string;
}

interface DSPRecord {
  Collection_ID: string;
  Coverage_Period: string | null;
  Society: string;
  Claim_Type: string;
  Email_Subject: string;
  Status: string;
  Notification_date: string;
  Deadline_of_Billing: string;
  Date_Received: string;
  Gross: number | null;
  Currency: string;
  Exchange_Rate: number | null;
  Peso_Value: number | null;
  DDM_Remarks: string;
  Licensing_Remarks: string;
  DSP: string | null;
  Date_billed: string | null;
  "SI#": string;
  "BI#": string;
  Division: string;
  Amount_Received: number | null;
  Bank_Charge: number | null;
  Total_Amount: number | null;
  Variance: number | null;
  Data_Coverage?: string;
  Origin: string;
  Licensor: string;
  Licensee: string;
  Territory: string;
  "%VAT": string;
  Total_Gross_Amount?: string;
  CWT: string;
  Rights_Covered?: string;
  Contract_Status?: string;
  Covered_Service?: string;
  Source_Type?: string;
  Category?: string;
  Establishment?: string;
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
  "Meta",
  "WhatsApp",
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
  "MG Balance",
  "Foreign",
  "Flat Fee GEC",
];

const Society = [
  "AACIMH",
  "ABRAC",
  "ABRAMUS",
  "ACAM",
  "ACCESS",
  "ACDAM",
  "ACEMLA",
  "ACUM",
  "ADAGP",
  "ADAVIS",
  "ADDAF",
  "ADIFACORM",
  "AEPI",
  "AGADU",
  "AGICOA",
  "AIE",
  "AIPO",
  "AKM",
  "AKVAPOT",
  "ALBAUTOR",
  "AMCOS",
  "AMRA",
  "AMUS",
  "ANCO",
  "APA",
  "APDAYC",
  "APOLLON",
  "APRA",
  "APS",
  "ARAI",
  "ARGENTORES",
  "ARTIS",
  "ARTISJUS",
  "ASCAP",
  "ASS",
  "AUSTRO-MECHANA",
  "AUTD",
  "AUTODIA",
  "AUTVIS",
  "AWA",
  "AYPA",
  "AZAUTO",
  "BAMU",
  "BDS",
  "BEEM",
  "BGDA",
  "BILDU",
  "BILL",
  "BMI",
  "BMDA",
  "BSDA",
  "BUCUDA",
  "BUMA",
  "CASH",
  "CCAH",
  "CDM",
  "CEDAR",
  "CEI",
  "CFA",
  "CHA (HDS ZAMP)",
  "CHAMP",
  "CISAC",
  "CMO",
  "CMRRA",
  "COLOMBIA",
  "COMPASS",
  "COPYDAN",
  "COS",
  "COSOCO",
  "CPRA",
  "CRC",
  "CRIA",
  "DACE",
  "DAC",
  "DAMA",
  "DAP",
  "DDO",
  "DEKIG",
  "DILIA",
  "DIRECTORS UK",
  "DMC",
  "EA",
  "EAU",
  "EDDA",
  "EDITIONS",
  "EFJA",
  "EKO",
  "EPIKOUREI",
  "ERATO",
  "ESMAA",
  "EUROPA",
  "FAMA",
  "FILJ",
  "FILSCAP",
  "FIP",
  "GCA",
  "GEA",
  "GEMA",
  "GESAC",
  "GESTOR",
  "GHS",
  "GLO",
  "GRAMEX",
  "GRAMMO",
  "GRUP",
  "GVL",
  "HAFOX",
  "HARRY FOX",
  "HDS",
  "HFA",
  "HU",
  "HUNG",
  "ICG",
  "IFPI",
  "IMRO",
  "INDAA",
  "IPRS",
  "ISG",
  "ITA",
  "IVCA",
  "JAMMS",
  "JASRAC",
  "KAMP",
  "KODA",
  "KOMCA",
  "KOOP",
  "KOPAM",
  "KOPYK",
  "KSAU",
  "LATGA",
  "LATINAUTOR",
  "MACA",
  "MACP",
  "MCSC",
  "MCT",
  "MCSZ",
  "MCUK",
  "MESAM",
  "MH",
  "MINT",
  "MOM",
  "MOSCAP",
  "MRCSN",
  "MSG",
  "MUMES",
  "MUSERK",
  "MUST",
  "NORD-DOC",
  "OSA",
  "PRS",
  "RAO",
  "ROMS",
  "SABAM",
  "SACEM",
  "SACEMLUXEMBOURG",
  "SACENC",
  "SACM",
  "SACVEN",
  "SADAIC",
  "SAIF",
  "SAMRO",
  "SAS",
  "SAYCO",
  "SESAC",
  "SGACEDOM",
  "SGAE",
  "SIAE",
  "SOCAN",
  "SODRAC",
  "SOMAS",
  "SONGCODE",
  "SOZA",
  "STIM",
  "SUISA",
  "TASC",
  "TONO",
  "UBC",
  "UCMRADA",
  "UCOSO",
  "VCPMC",
  "WAMI",
  "WID CENTRE",
];

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
  columns = "grid-cols-1",
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
        className="p-2 border rounded bg-white disabled:bg-gray-200 disabled:text-gray-500 text-black text-sm shadow-sm"
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
        className="p-2 border rounded bg-white disabled:bg-gray-200 disabled:text-gray-500 text-black text-sm shadow-sm"
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [roleFlag, setRoleFlag] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<DSPRecord[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [selectedDSP, setSelectedDSP] = useState("ALL");
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [showBilledOnly, setShowBilledOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const ROWS_PER_PAGE = 10;

  const initialFormState: DspData = {
    Coverage_Start_Date: "",
    Coverage_End_Date: "",
    Coverage_Period: "",
    Society: "",
    Claim_Type: "",
    Email_Subject: "",
    Status: "Pending",
    Notification_date: "",
    Deadline_of_Billing: "",
    Date_Received: "",
    Gross: "",
    Currency: "",
    Exchange_Rate: "55",
    Peso_Value: "",
    DDM_Remarks: "",
    Licensing_Remarks: "",
    Date_billed: "",
    DSP: "",
    "SI#": "",
    "BI#": "",
    Division: "",
    Amount_Received: "",
    Bank_Charge: "",
    Total_Amount: "",
    Variance: "0.00",
    Data_Coverage: "",
    Origin: "",
    Licensor: "",
    Licensee: "",
    Territory: "",
    "%VAT": "",
    Total_Gross_Amount: "",
    CWT: "",
    Rights_Covered: "",
    Contract_Status: "",
    Covered_Service: "",
    Source_Type: "",
    Category: "",
    Establishment: "",
  };

  const [formData, setFormData] = useState<DspData>(initialFormState);

  useEffect(() => {
    if (formData.Coverage_Start_Date && formData.Coverage_End_Date) {
      const start = new Date(formData.Coverage_Start_Date);
      const end = new Date(formData.Coverage_End_Date);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const getQ = (date: Date) => Math.floor(date.getMonth() / 3) + 1;
        const startPart = `${start.getFullYear()}(Q${getQ(start)})`;
        const endPart = `${end.getFullYear()}(Q${getQ(end)})`;

        const automatedDataCoverage = `${startPart}-${endPart}`;
        const rangePeriod = `${formData.Coverage_Start_Date} to ${formData.Coverage_End_Date}`;

        setFormData((prev) => ({
          ...prev,
          Data_Coverage: automatedDataCoverage,
          Coverage_Period: rangePeriod,
        }));
      }
    }
  }, [formData.Coverage_Start_Date, formData.Coverage_End_Date]);

  useEffect(() => {
    const exchangeRate =
      parseFloat(String(formData.Exchange_Rate).replace(/,/g, "")) || 0;
    const amountReceived =
      parseFloat(String(formData.Amount_Received).replace(/,/g, "")) || 0;
    const bankCharge =
      parseFloat(String(formData.Bank_Charge).replace(/,/g, "")) || 0;
    const grossAmount =
      parseFloat(String(formData.Gross).replace(/,/g, "")) || 0;

    const vatInput =
      parseFloat(String(formData["%VAT"]).replace(/,/g, "")) || 0;
    const cwtInput = parseFloat(String(formData.CWT).replace(/,/g, "")) || 0;

    const vatDecimal = vatInput / 100;
    const cwtDecimal = cwtInput / 100;

    const calculatedTotalGrossVal = grossAmount + grossAmount * vatDecimal;

    const calculatedTotalAmountVal =
      calculatedTotalGrossVal - amountReceived * cwtDecimal - bankCharge;

    const calculatedPesoVal = calculatedTotalAmountVal * exchangeRate;

    const calculatedTotalGross = formatDisplayNumber(
      calculatedTotalGrossVal,
      2,
    );
    const calculatedTotalAmount = formatDisplayNumber(
      calculatedTotalAmountVal,
      2,
    );
    const calculatedPeso = formatDisplayNumber(calculatedPesoVal, 2);

    const calculatedVarianceVal =
      calculatedTotalAmountVal - (amountReceived + bankCharge);
    const calculatedVariance = formatDisplayNumber(calculatedVarianceVal, 2);

    setFormData((prev) => {
      let updates: Partial<DspData> = {};

      if (prev.Total_Gross_Amount !== calculatedTotalGross)
        updates.Total_Gross_Amount = calculatedTotalGross;

      if (prev.Peso_Value !== calculatedPeso)
        updates.Peso_Value = calculatedPeso;
      if (prev.Total_Amount !== calculatedTotalAmount)
        updates.Total_Amount = calculatedTotalAmount;
      if (prev.Variance !== calculatedVariance)
        updates.Variance = calculatedVariance;

      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [
    formData.Gross,
    formData.Exchange_Rate,
    formData.Amount_Received,
    formData.Bank_Charge,
    formData["%VAT"],
    formData.CWT,
  ]);

  useEffect(() => {
    setMounted(true);
    const role = Number(getCookie("roleFlag"));
    setRoleFlag(role);
    fetchDSP();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDSP, sortOrder, showPendingOnly, showBilledOnly, searchQuery]);

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
      await fetch(`${API_BASE}/logout`, {
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

    if (showPendingOnly) result = result.filter((r) => r.Status === "Pending");
    if (showBilledOnly) result = result.filter((r) => r.Status === "Billed");

    if (searchQuery.trim() !== "") {
      result = result.filter((r) =>
        r.Email_Subject?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    result.sort((a, b) => {
      const dateA = a.Date_billed ? new Date(a.Date_billed).getTime() : 0;
      const dateB = b.Date_billed ? new Date(b.Date_billed).getTime() : 0;
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [
    records,
    selectedDSP,
    sortOrder,
    showPendingOnly,
    showBilledOnly,
    searchQuery,
  ]);

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

    if (name === "Origin") {
      setFormData({
        ...initialFormState,
        Origin: value,
      });
      setEditingId(null);
      return;
    }

    if (name === "Date_billed") {
      setFormData((p: DspData) => ({
        ...p,
        Date_billed: value,
        Status:
          value !== ""
            ? "For Billing"
            : p.Status === "For Billing" || p.Status === "Billed"
              ? "Pending"
              : p.Status,
      }));
      return;
    }

    if (name === "SI#" || name === "BI#") {
      setFormData((p: DspData) => {
        const updated = { ...p, [name]: value };
        const isBothFilled =
          updated["SI#"].trim() !== "" && updated["BI#"].trim() !== "";

        return {
          ...updated,
          Status: isBothFilled
            ? "Billed"
            : p.Date_billed !== ""
              ? "For Billing"
              : "Pending",
        };
      });
      return;
    }

    if (
      [
        "Gross",
        "Amount_Received",
        "Bank_Charge",
        "%VAT",
        "CWT",
        "Exchange_Rate",
      ].includes(name)
    ) {
      setFormData((p: DspData) => ({ ...p, [name]: formatInputNumber(value) }));
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

    setFormData((p: DspData) => {
      let updated = { ...p, [name]: value };

      if (name === "Licensee") {
        const found = LICENSEE_DATA.find((item) => item.COMPANY === value);
        if (found) {
          updated.Category = found.CATEGORY;
          updated.Establishment = found.ESTABLISHMENT;
        }
      }

      return updated;
    });
  };

  const handleEditClick = (record: DSPRecord) => {
    setEditingId(record.Collection_ID);
    let startDate = "";
    let endDate = "";
    if (record.Coverage_Period && record.Coverage_Period.includes(" to ")) {
      [startDate, endDate] = record.Coverage_Period.split(" to ");
    }

    setFormData({
      Coverage_Start_Date: startDate,
      Coverage_End_Date: endDate,
      DSP: record.DSP || "",
      Coverage_Period: record.Coverage_Period || "",
      Data_Coverage: record.Data_Coverage || "",
      Society: record.Society || "",
      Claim_Type: record.Claim_Type || "",
      Email_Subject: record.Email_Subject || "",
      Status: record.Status || "Pending",
      Notification_date: record.Notification_date
        ? record.Notification_date.split("T")[0]
        : "",
      Deadline_of_Billing: record.Deadline_of_Billing
        ? record.Deadline_of_Billing.split("T")[0]
        : "",
      Date_Received: record.Date_Received
        ? record.Date_Received.split("T")[0]
        : "",
      Gross: formatInputNumber(record.Gross?.toString() || ""),
      Currency: record.Currency || "",
      Exchange_Rate: formatDisplayNumber(record.Exchange_Rate, 4),
      Peso_Value: formatDisplayNumber(record.Peso_Value, 2),
      DDM_Remarks: record.DDM_Remarks || "",
      Licensing_Remarks: record.Licensing_Remarks || "",
      Date_billed: record.Date_billed ? record.Date_billed.split("T")[0] : "",
      "SI#": record["SI#"] || "",
      "BI#": record["BI#"] || "",
      Division: record.Division || "",
      Amount_Received: formatInputNumber(
        record.Amount_Received?.toString() || "",
      ),
      Bank_Charge: formatInputNumber(record.Bank_Charge?.toString() || ""),
      Total_Amount: formatDisplayNumber(record.Total_Amount, 2),
      Variance: formatDisplayNumber(record.Variance, 2),
      Origin: record.Origin || "",
      Licensor: record.Licensor || "",
      Licensee: record.Licensee || "",
      Territory: record.Territory || "",
      "%VAT": record["%VAT"] || "",
      Total_Gross_Amount: record.Total_Gross_Amount || "",
      CWT: record.CWT || "",
      Rights_Covered: record.Rights_Covered || "",
      Contract_Status: record.Contract_Status || "",
      Covered_Service: record.Covered_Service || "",
      Source_Type: record.Source_Type || "",
      Category: record.Category || "",
      Establishment: record.Establishment || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedId(null);

    let finalCollectionId = editingId;
    if (!editingId) {
      finalCollectionId = generateCollectionId(formData.DSP, records);
    }

    const dataToSubmit = {
      ...formData,
      Collection_ID: finalCollectionId,
      Gross: formData.Gross.replace(/,/g, ""),
      Amount_Received: formData.Amount_Received.replace(/,/g, ""),
      Bank_Charge: formData.Bank_Charge.replace(/,/g, ""),
      Total_Amount: formData.Total_Amount.replace(/,/g, ""),
      Peso_Value: formData.Peso_Value.replace(/,/g, ""),
      Variance: formData.Variance.replace(/,/g, ""),
      Exchange_Rate: formData.Exchange_Rate.replace(/,/g, ""),
    };

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

      setFormData(initialFormState);

      fetchDSP();
      alert("Record saved successfully!");
    } catch (err: any) {
      console.error("Save failed", err);
      alert(`Save failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;

        const parseCSV = (csvText: string) => {
          const rows = [];
          let currRow = [];
          let currCol = "";
          let inQuotes = false;
          for (let i = 0; i < csvText.length; i++) {
            const char = csvText[i];
            const next = csvText[i + 1];
            if (inQuotes) {
              if (char === '"') {
                if (next === '"') {
                  currCol += '"';
                  i++;
                } else {
                  inQuotes = false;
                }
              } else {
                currCol += char;
              }
            } else {
              if (char === '"') {
                inQuotes = true;
              } else if (char === ",") {
                currRow.push(currCol.trim());
                currCol = "";
              } else if (char === "\n" || char === "\r") {
                currRow.push(currCol.trim());
                if (currRow.join("").length > 0) rows.push(currRow);
                currRow = [];
                currCol = "";
                if (char === "\r" && next === "\n") i++;
              } else {
                currCol += char;
              }
            }
          }
          if (currRow.length > 0 || currCol !== "") {
            currRow.push(currCol.trim());
            rows.push(currRow);
          }
          return rows;
        };

        const allRows = parseCSV(text);
        if (allRows.length < 2) return;

        const rawHeaders = allRows[0];
        const dataRows = allRows.slice(1);

        const headerMap: Record<number, string> = {};
        rawHeaders.forEach((h, idx) => {
          const clean = h.toLowerCase().replace(/[^a-z0-9#%]/g, "");

          if (clean === "society")
            headerMap[idx] = "Society"; // Exact match priority
          else if (clean.includes("collectionid"))
            headerMap[idx] = "Collection_ID";
          else if (clean.includes("origin")) headerMap[idx] = "Origin";
          else if (clean.includes("division")) headerMap[idx] = "Division";
          else if (clean.includes("dsp")) headerMap[idx] = "DSP";
          else if (clean.includes("licensee")) headerMap[idx] = "Licensee";
          else if (clean.includes("licensor")) headerMap[idx] = "Licensor";
          else if (clean.includes("territory")) headerMap[idx] = "Territory";
          else if (clean.includes("claimtype")) headerMap[idx] = "Claim_Type";
          else if (clean.includes("rights")) headerMap[idx] = "Rights_Covered";
          else if (clean.includes("contract"))
            headerMap[idx] = "Contract_Status";
          else if (clean.includes("service"))
            headerMap[idx] = "Covered_Service";
          else if (clean.includes("sourcetype")) headerMap[idx] = "Source_Type";
          else if (clean.includes("category")) headerMap[idx] = "Category";
          else if (clean.includes("establishment"))
            headerMap[idx] = "Establishment";
          else if (clean.includes("coverageperiod"))
            headerMap[idx] = "Coverage_Period";
          else if (clean.includes("coveragestart"))
            headerMap[idx] = "Coverage_Start_Date";
          else if (clean.includes("coverageend"))
            headerMap[idx] = "Coverage_End_Date";
          else if (clean.includes("datacoverage"))
            headerMap[idx] = "Data_Coverage";
          else if (clean.includes("notificationdate"))
            headerMap[idx] = "Notification_date";
          else if (clean.includes("deadlineofbilling"))
            headerMap[idx] = "Deadline_of_Billing";
          else if (clean.includes("datereceived"))
            headerMap[idx] = "Date_Received";
          else if (
            clean.includes("billingdate") ||
            clean.includes("datebilled")
          )
            headerMap[idx] = "Date_billed";
          else if (clean === "gross") headerMap[idx] = "Gross";
          else if (clean.includes("vat")) headerMap[idx] = "%VAT";
          else if (clean.includes("totalgross"))
            headerMap[idx] = "Total_Gross_Amount";
          else if (clean.includes("cwt")) headerMap[idx] = "CWT";
          else if (clean.includes("amountreceived"))
            headerMap[idx] = "Amount_Received";
          else if (clean.includes("bankcharge")) headerMap[idx] = "Bank_Charge";
          else if (clean.includes("totalamount"))
            headerMap[idx] = "Total_Amount";
          else if (clean.includes("exchangerate"))
            headerMap[idx] = "Exchange_Rate";
          else if (clean.includes("pesovalue")) headerMap[idx] = "Peso_Value";
          else if (clean.includes("variance")) headerMap[idx] = "Variance";
          else if (clean === "currency") headerMap[idx] = "Currency";
          else if (clean.includes("si#")) headerMap[idx] = "SI#";
          else if (clean.includes("bi#")) headerMap[idx] = "BI#";
          else if (clean === "status") headerMap[idx] = "Status";
          else if (clean.includes("emailsubject"))
            headerMap[idx] = "Email_Subject";
          else if (clean.includes("licensingremarks"))
            headerMap[idx] = "Licensing_Remarks";
          else if (clean.includes("ddm") || clean.includes("legal"))
            headerMap[idx] = "DDM_Remarks";
        });

        let localExistingRecords = [...records];

        const jsonRecords = dataRows.map((row) => {
          let obj: any = {};
          row.forEach((val, idx) => {
            const key = headerMap[idx];
            if (!key) return;

            if (
              [
                "Gross",
                "Amount_Received",
                "Bank_Charge",
                "Total_Amount",
                "Exchange_Rate",
                "Peso_Value",
                "Variance",
                "%VAT",
                "Total_Gross_Amount",
                "CWT",
              ].includes(key) &&
              key !== "Society"
            ) {
              const cleanNum = val.replace(/[^\d.-]/g, "");
              obj[key] = cleanNum === "" || cleanNum === "-" ? "0" : cleanNum;
            }
            // Date Fields
            else if (
              [
                "Notification_date",
                "Deadline_of_Billing",
                "Date_Received",
                "Date_billed",
                "Coverage_Start_Date",
                "Coverage_End_Date",
              ].includes(key)
            ) {
              if (!val || val === "-" || val === "") {
                obj[key] = null;
              } else {
                const d = new Date(val);
                obj[key] = isNaN(d.getTime())
                  ? null
                  : d.toISOString().split("T")[0];
              }
            }
            else {
              obj[key] = val;
            }
          });

          if (!obj.Collection_ID || obj.Collection_ID === "") {
            obj.Collection_ID = generateCollectionId(
              obj.DSP || "UNK",
              localExistingRecords,
            );
          }
          localExistingRecords.push(obj);
          return obj;
        });

        setLoading(true);
        let successCount = 0;
        let failCount = 0;

        for (const record of jsonRecords) {
          const response = await fetch(`${API_BASE}/dsp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(record),
          });

          if (response.ok) successCount++;
          else {
            const errorMsg = await response.json();
            console.error(`Row ${record.Collection_ID} failed:`, errorMsg);
            failCount++;
          }
        }
        alert(
          `Ingestion Finished!\nSuccess: ${successCount}\nFailed: ${failCount}`,
        );
        fetchDSP();
      } catch (err: any) {
        console.error("Bulk Error:", err);
        alert("Error parsing CSV. Check console for details.");
      } finally {
        setLoading(false);
        if (e.target) e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleDelete = async (collectionId: string) => {
    if (!confirm(`Are you sure you want to delete record ${collectionId}?`))
      return;
    try {
      const response = await fetch(`${API_BASE}/dsp/${collectionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      setRecords((prev) =>
        prev.filter((r) => r.Collection_ID !== collectionId),
      );

      if (editingId === collectionId) {
        setEditingId(null);
        setFormData(initialFormState);
      }

      alert("Record deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting record. Please try again.");
    }
  };


  const exportToExcel = () => {
    const headers = [
      "Collection ID",
      "Origin",
      "Division",
      "DSP",
      "Licensee",
      "Licensor",
      "Society",
      "Category",
      "Establishment",
      "Territory",
      "Coverage Period",
      "Data Coverage",
      "Claim Type",
      "Email Subject",
      "Rights Covered",
      "Contract Status",
      "Covered Service",
      "Source Type",
      "Notification Date",
      "Deadline of Billing",
      "Date Received",
      "Billing Date",
      "Status",
      "Currency",
      "Gross",
      "%VAT",
      "Total Gross Amount",
      "Amount Received",
      "CWT",
      "Bank Charge",
      "Total Amount",
      "Exchange Rate",
      "Peso Value",
      "Variance",
      "Society Deducted",
      "% Deducted",
      "SI#",
      "BI#",
      "DDM Remarks",
      "Licensing Remarks",
    ];

    const rows = filteredRecords.map((r: any) => {
      // Logic calculations
      const gross = Number(String(r.Gross).replace(/,/g, "")) || 0;
      const amountReceived =
        Number(String(r.Amount_Received).replace(/,/g, "")) || 0;
      const societyDeducted = gross - amountReceived;
      const percentDeducted = gross !== 0 ? societyDeducted / gross : 0;

      let varianceValue = Number(String(r.Variance).replace(/,/g, "")) || 0;
      if (r.DSP === "Foreign") {
        varianceValue = societyDeducted - amountReceived;
      }

      return [
        r.Collection_ID ?? "",
        r.Origin ?? "",
        r.Division ?? "",
        r.DSP ?? "",
        r.Licensee ?? "",
        r.Licensor ?? "",
        r.Society ?? "",
        r.Category ?? "",
        r.Establishment ?? "",
        r.Territory ?? "",
        r.Coverage_Period ?? "",
        r.Data_Coverage ?? "",
        r.Claim_Type ?? "",
        r.Email_Subject ?? "",
        r.Rights_Covered ?? "",
        r.Contract_Status ?? "",
        r.Covered_Service ?? "",
        r.Source_Type ?? "",
        r.Notification_date ?? "",
        r.Deadline_of_Billing ?? "",
        r.Date_Received ?? "",
        r.Date_billed ?? "",
        r.Status ?? "",
        r.Currency ?? "",
        formatDisplayNumber(r.Gross, 2),
        r["%VAT"] ?? "",
        r.Total_Gross_Amount ?? "",
        formatDisplayNumber(r.Amount_Received, 2),
        r.CWT ?? "",
        formatDisplayNumber(r.Bank_Charge, 2),
        formatDisplayNumber(r.Total_Amount, 2),
        formatDisplayNumber(r.Exchange_Rate, 4),
        formatDisplayNumber(r.Peso_Value, 2),
        formatDisplayNumber(varianceValue, 2),
        societyDeducted.toFixed(2),
        (percentDeducted * 100).toFixed(2) + "%",
        r["SI#"] ?? "",
        r["BI#"] ?? "",
        r.DDM_Remarks ?? "",
        r.Licensing_Remarks ?? "",
      ];
    });

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    link.download = `${timestamp}_Revenue_Tracker.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen w-full bg-[url('/BG.png')] lg:bg-[url('/BG-laptop.png')] bg-fixed bg-no-repeat bg-[length:100%_100%] bg-center text-black">
      <div className="relative w-full bg-[#004aad] p-3 sticky top-0 z-50">
        <div className="w-full px-1 relative z-10 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/omni.png" alt="LOGO" width={200} height={50} />
            <div className="text-white text-xl ml-4 font-bold">
              Unified Revenue Tracking System
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded transition-all shadow-md uppercase text-xs"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="p-4 space-y-8">
        {formData.Origin === "Multi-Territorial" ? (
          <ForeignForm
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            editingId={editingId}
            setEditingId={setEditingId}
            DSP={DSP}
            Society={Society}
            claimTypes={claimTypes}
            currencies={currencies}
            Select={Select}
            Input={Input}
            DateInput={DateInput}
            handleDelete={handleDelete}
          />
        ) : formData.Origin === "Mono-Territorial" ? (
          <LocalForm
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            editingId={editingId}
            setEditingId={setEditingId}
            DSP={DSP}
            Society={Society}
            claimTypes={claimTypes}
            currencies={currencies}
            Select={Select}
            Input={Input}
            DateInput={DateInput}
            handleDelete={handleDelete}
          />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 bg-[#FFF9E5] p-4 items-stretch shadow-lg rounded-sm"
          >
            <div style={{ flex: "40%", minWidth: "300px" }}>
              <Section
                title="Choose Origin"
                columns="grid-cols-1 md:grid-cols-5"
              >
                <Select
                  label="Origin"
                  name="Origin"
                  value={formData.Origin}
                  options={["Mono-Territorial", "Multi-Territorial"]}
                  onChange={handleChange}
                />
              </Section>
            </div>
          </form>
        )}

        <h2 className="text-xl font-bold -mt-4 mb-4">
          Sources Revenue Records
        </h2>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-end gap-2 flex-wrap">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold block mb-1 uppercase text-black">
                Search Email Subject
              </label>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-1.5 border rounded text-xs bg-white w-48 shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold block mb-1 uppercase text-black">
                Filter by DSP
              </label>
              <select
                value={selectedDSP}
                onChange={(e) => setSelectedDSP(e.target.value)}
                className="p-1.5 border rounded text-xs bg-white shadow-sm"
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
              <label className="text-[10px] font-bold block mb-1 uppercase text-black">
                Sort Billing Date
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="p-1.5 border rounded text-xs bg-white shadow-sm"
              >
                <option value="desc">Latest to Oldest</option>
                <option value="asc">Oldest to Latest</option>
              </select>
            </div>
            <button
              onClick={() => {
                setShowPendingOnly(!showPendingOnly);
                if (!showPendingOnly) setShowBilledOnly(false);
              }}
              className={`text-[10px] font-bold px-3 py-1.5 rounded transition-all shadow-sm uppercase h-[34px] min-w-[120px] ${showPendingOnly ? "bg-orange-500 text-white" : "bg-white text-gray-700"}`}
            >
              {showPendingOnly ? "Showing Pending" : "Show Pending"}
            </button>
            <button
              onClick={() => {
                setShowBilledOnly(!showBilledOnly);
                if (!showBilledOnly) setShowPendingOnly(false);
              }}
              className={`text-[10px] font-bold px-3 py-1.5 rounded transition-all shadow-sm uppercase h-[34px] min-w-[120px] ${showBilledOnly ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
            >
              {showBilledOnly ? "Showing Billed" : "Show Billed"}
            </button>

            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleBulkUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-700 hover:bg-blue-800 text-white text-[10px] font-bold px-4 py-2 rounded shadow-sm h-[34px]"
            >
              BULK INGEST
            </button>

            <button
              onClick={exportToExcel}
              className="bg-yellow-500 hover:bg-yellow-700 text-white text-[10px] font-bold px-4 py-2 rounded shadow-sm h-[34px]"
            >
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
                  <th className="w-[6%] bg-blue-100 p-1">ID</th>
                  <th className="w-[5%] bg-blue-100 p-1">Division</th>
                  <th className="w-[5%] bg-blue-100 p-1">Source</th>
                  <th className="w-[6%] bg-blue-100 p-1">Coverage Period</th>
                  <th className="w-[6%] bg-blue-100 p-1">Data Coverage</th>
                  <th className="w-[6%] bg-blue-100 p-1">Society</th>
                  <th className="w-[7%] bg-blue-100 p-1">Claim</th>
                  <th className="w-[10%] bg-blue-100 p-1">Email Subject</th>
                  <th className="w-[5%] bg-blue-100 p-1">Notification Date</th>
                  <th className="w-[5%] bg-blue-100 p-1">Deadline</th>
                  <th className="w-[6%] bg-blue-100 p-1">Gross Amount</th>
                  <th className="w-[4%] bg-blue-100 p-1">Currency</th>
                  <th className="w-[6%] bg-blue-100 p-1">DDM/Legal Remarks</th>
                  <th className="w-[5%] bg-red-100 p-1">Date Received</th>
                  <th className="w-[4%] bg-red-100 p-1">SI#</th>
                  <th className="w-[4%] bg-red-100 p-1">BI#</th>
                  <th className="w-[4%] bg-red-100 p-1">Amount Received</th>
                  <th className="w-[4%] bg-red-100 p-1">Bank Charge</th>
                  <th className="w-[4%] bg-red-100 p-1">Total Amt</th>
                  <th className="w-[4%] bg-red-100 p-1">Exchange Rate</th>
                  <th className="w-[6%] bg-red-100 p-1">Peso Value</th>
                  <th className="w-[6%] bg-yellow-100 p-1">Billing Date</th>
                  <th className="w-[4%] bg-yellow-100 p-1">Status</th>
                  <th className="w-[4%] bg-yellow-100 p-1">LIC Rem.</th>
                  <th className="w-[4%] px-1 py-1.5 text-center font-bold text-white bg-[#004aad]">
                    Variance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {paginatedRecords.map((r) => (
                  <tr
                    key={r.Collection_ID}
                    className={`border-b border-gray-300 divide-x divide-gray-300 hover:bg-gray-50 transition-colors ${editingId === r.Collection_ID ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-1 py-1 text-blue-600 font-bold">
                      <button
                        onClick={() => handleEditClick(r)}
                        className="hover:underline text-left w-full truncate"
                      >
                        {r.Collection_ID}
                      </button>
                    </td>
                    <td className="px-1 py-1 text-left truncate">
                      {r.Division}
                    </td>
                    <td className="px-1 py-1 text-center truncate">{r.DSP}</td>
                    <td className="px-1 py-1 text-center truncate">
                      {r.Coverage_Period}
                    </td>
                    <td className="px-1 py-1 text-center truncate font-semibold">
                      {r.Data_Coverage}
                    </td>
                    <td className="px-1 py-1 text-center">{r.Society}</td>
                    <td className="px-1 py-1 text-center truncate">
                      {r.Claim_Type}
                    </td>
                    <td className="px-1 py-1 truncate">{r.Email_Subject}</td>
                    <td className="px-1 py-1 text-center">
                      {formatDateDisplay(r.Notification_date)}
                    </td>
                    <td className="px-1 py-1 text-center">
                      {formatDateDisplay(r.Deadline_of_Billing)}
                    </td>
                    <td className="px-1 py-1 text-right">
                      {formatDisplayNumber(r.Gross, 2)}
                    </td>
                    <td className="px-1 py-1 text-center">{r.Currency}</td>
                    <td
                      className="px-1 py-1 truncate text-center"
                      title={r.DDM_Remarks || ""}
                    >
                      {r.DDM_Remarks}
                    </td>
                    <td className="px-1 py-1 text-center">
                      {formatDateDisplay(r.Date_Received)}
                    </td>
                    <td className="px-1 py-1 text-center">{r["SI#"]}</td>
                    <td className="px-1 py-1 text-center truncate">
                      {r["BI#"]}
                    </td>
                    <td className="px-1 py-1 text-right">
                      {formatDisplayNumber(r.Amount_Received, 2)}
                    </td>
                    <td className="px-1 py-1 text-right">
                      {formatDisplayNumber(r.Bank_Charge, 2)}
                    </td>
                    <td className="px-1 py-1 text-right">
                      {formatDisplayNumber(r.Total_Amount, 2)}
                    </td>
                    <td className="px-1 py-1 text-right">
                      {formatDisplayNumber(r.Exchange_Rate, 4)}
                    </td>
                    <td className="px-1 py-1 text-right">
                      {formatDisplayNumber(r.Peso_Value, 2)}
                    </td>
                    <td className="px-1 py-1 text-center">
                      {formatDateDisplay(r.Date_billed)}
                    </td>
                    <td className="px-1 py-1 text-center">{r.Status}</td>
                    <td
                      className="px-1 py-1 truncate text-center"
                      title={r.Licensing_Remarks || ""}
                    >
                      {r.Licensing_Remarks}
                    </td>
                    <td
                      className={`px-1 py-1 text-right w-full truncate ${Number(String(r.Variance).replace(/,/g, "")) !== 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {formatDisplayNumber(r.Variance, 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-white p-1 relative flex justify-center items-center border-t border-gray-300">
              <div className="absolute left-4 text-[11px] text-gray-700 hidden lg:block">
                Showing{" "}
                <span className="font-semibold">
                  {filteredRecords.length === 0
                    ? 0
                    : (currentPage - 1) * ROWS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(
                    currentPage * ROWS_PER_PAGE,
                    filteredRecords.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold">{filteredRecords.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || tableLoading}
                  className="px-3 py-1 border rounded text-[10px] bg-gray-100 disabled:opacity-50"
                >
                  PREV
                </button>
                <div className="text-[10px]">
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
                  className="px-3 py-1 border rounded text-[10px] bg-gray-100 disabled:opacity-50"
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
