import React, { useEffect } from "react";
import { LICENSEE_DATA } from "./licenseeList";

interface LocalFormProps {
  formData: any;
  setFormData: (data: any) => void;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  DSP: string[];
  Society: string[];
  claimTypes: string[];
  currencies: string[];
  Select: any;
  Input: any;
  DateInput: any;
}

const Source = ["Broadcast", "Live Concert/Events", "General", "Reproduction"];

const Source_Type = [
  "TERRESTRIAL TELEVISION",
  "CABLE TELEVISION",
  "RADIO BROADCAST",
  "LIVE CONCERT/EVENT/ELECTION",
  "HOTEL",
  "RESTAURANT/FOOD CHAIN",
  "MUSIC LOUNGE/KTV",
  "RETAIL",
  "WELLNESS",
  "TRANSPORT",
  "CINEMA",
  "AMUSEMENT",
  "DANCE SCHOOLS/HOSPITALS/MOH",
  "SYNCHRONIZATION",
  "MECHANICAL",
];

const dgSource_type = [
  "MUSIC STREAMING",
  "MESSAGING PLATFORM",
  "OTT",
  "LIVE-STREAMING PLATFORM",
  "USER UPLOADED CONTENT",
  "NON-DSP",
  "OTHERS",
];

const CATEGORY_OPTIONS = [
  "FREE TV",
  "CABLE TV",
  "RADIO",
  "CONCERT/EVENT",
  "ONLINE EVENTS",
  "HOTEL/RESORT/INN",
  "RESTAURANT",
  "MUSIC LOUNGE",
  "MALL/RETAIL",
  "WELLNESS",
  "TRANSPORT",
  "CINEMA",
  "AMUSEMENT",
  "HOSPITAL",
  "DANCE SCHOOL/STUDIO",
  "MUSIC-ON-HOLD",
  "SYNCHRONIZATION",
  "MECHANICAL",
];

export default function LocalForm({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  loading,
  editingId,
  setEditingId,
  DSP,
  claimTypes,
  currencies,
  Select,
  Input,
  DateInput,
}: LocalFormProps) {
  useEffect(() => {
    if (formData.Origin === "Local") {
      setFormData((prev: any) => ({
        ...prev,
        Division: prev.Division || "Digital",
        DSP: prev.DSP || "Local",
      }));
    }
  }, [formData.Origin, setFormData]);
  const handleClear = () => {
    setEditingId(null);
    setFormData({
      Origin: "Local",
      Division: "Digital",
      DSP: "Local",
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
      Currency: "PHP",
      Exchange_Rate: "1",
      Peso_Value: "",
      DDM_Remarks: "",
      Licensing_Remarks: "",
      Date_billed: "",
      "SI#": "",
      "BI#": "",
      Amount_Received: "",
      Bank_Charge: "0",
      Total_Amount: "",
      Variance: "0.00",
      Data_Coverage: "",
      Licensor: "",
      Licensee: "",
      Territory: "PH-FILSCAP",
      "%VAT": "0",
      Total_Gross_Amount: "",
      CWT: "0",
    });
  };

  const isNonDigital = formData.Division === "Non-Digital";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#FFF9E5] p-2 shadow-xl rounded-md space-y-2 border border-yellow-200"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 items-end">
        <div className="lg:col-span-1">
          <Select
            label="Origin"
            name="Origin"
            value={formData.Origin}
            options={["Local", "Foreign"]}
            onChange={handleChange}
          />
        </div>

        <div className="lg:col-span-1">
          <Select
            label="Division"
            name="Division"
            options={["Digital", "Non-Digital"]}
            value={formData.Division}
            onChange={handleChange}
          />
        </div>

        <div className="lg:col-span-1">
          <Select
            label="Source"
            name="DSP"
            value={formData.DSP}
            options={isNonDigital ? Source : DSP}
            onChange={handleChange}
          />
        </div>
        <div className="lg:col-span-1">
          <Select
            label="Source Type"
            name="Source_Type"
            value={formData.Source_Type}
            options={isNonDigital ? Source_Type : dgSource_type}
            onChange={handleChange}
          />
        </div>
        <div className="lg:col-span-1">
          <Select
            label="Category"
            name="Category"
            value={formData.Category}
            options={isNonDigital ? CATEGORY_OPTIONS : DSP}
            onChange={handleChange}
          />
        </div>

        {isNonDigital ? (
          <>

            <div className="lg:col-span-1">
              <Select
                label="Category"
                name="Category"
                value={formData.Category}
                options={CATEGORY_OPTIONS}
                onChange={handleChange}
              />
            </div>
            <div className="lg:col-span-2">
              <Input
                label="Licensee"
                name="Licensee"
                value={formData.Licensee}
                onChange={handleChange}
                list="licensee-options"
              />
            </div>
            <div className="lg:col-span-2">
              <Input
                label="Establishment"
                name="Establishment"
                value={formData.Establishment}
                onChange={handleChange}
              />
            </div>

            <div className="lg:col-span-1">
              <Select
                label="Contract Status"
                name="Contract_Status"
                value={formData.Contract_Status}
                options={["New", "Renewed", "Continuous"]}
                onChange={handleChange}
              />
            </div>
            <div className="lg:col-span-1">
              <Input
                label="Territory"
                name="Territory"
                value={"PH"}
                onChange={handleChange}
                disabled={true}
              />
            </div>
            <div className="lg:col-span-1">
              <Select
                label="Covered Service"
                name="Covered_Service"
                value={formData.Covered_Service}
                options={["AVOD", "SVOD", ""]}
                onChange={handleChange}
              />
            </div>
            <div className="lg:col-span-1">
              <Select
                label="Claim Type"
                name="Claim_Type"
                value={formData.Claim_Type}
                options={claimTypes}
                onChange={handleChange}
              />
            </div>
            <div className="lg:col-span-1">
              <Select
                label="Right Covered"
                name="Rights_Covered"
                value={formData.Rights_Covered}
                options={["PR", "MR"]}
                onChange={handleChange}
              />
            </div>
            <div className="lg:col-span-1 ">
              <DateInput
                label="Notification Date"
                name="Notification_date"
                value={formData.Notification_date}
                onChange={handleChange}
              />
            </div>
            <div className="lg:col-span-1 -translate-y-2">
              <Select
                label="CUR [FGN]"
                name="Currency"
                value={formData.Currency}
                options={currencies}
                onChange={handleChange}
              />
            </div>
            <div className="lg:col-span-1 -translate-y-2">
              <Input
                label="Gross"
                name="Gross"
                value={formData.Gross}
                onChange={handleChange}
              />
            </div>

            <div className="lg:col-span-6 border-2 border-yellow-400/30 rounded-lg p-2 bg-white/40">
              <h3 className="font-bold text-[10px] text-[#004aad]  uppercase">
                Period Covered
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <DateInput
                  label="Start Date"
                  name="Coverage_Start_Date"
                  value={formData.Coverage_Start_Date}
                  onChange={handleChange}
                />
                <DateInput
                  label="End Date"
                  name="Coverage_End_Date"
                  value={formData.Coverage_End_Date}
                  onChange={handleChange}
                />
                <Input
                  label="Data Coverage"
                  name="Data_Coverage"
                  value={formData.Data_Coverage}
                  disabled={true}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="lg:col-span-1">
              <Select
                label="Contract Status"
                name="Contract_Status"
                value={formData.Contract_Status}
                options={["New", "Renewed"]}
                onChange={handleChange}
              />
            </div>
            <div className="lg:col-span-2">
              <Input
                label="Licensee"
                name="Licensee"
                value={formData.Licensee}
                onChange={handleChange}
                list="licensee-options"
              />
            </div>

            <div className="lg:col-span-1">
              <Input
                label="Territory"
                name="Territory"
                value={"PH"}
                onChange={handleChange}
                disabled={true} // Abled in Digital
              />
            </div>
            <div className="lg:col-span-1">
              <Select
                label="Covered Service"
                name="Covered_Service"
                value={formData.Covered_Service}
                options={["AVOD", "SVOD", "SHORTS", "OTT", "MUSIC"]}
                onChange={handleChange}
              />
            </div>
            <div className="lg:col-span-1">
              <Select
                label="Claim Type"
                name="Claim_Type"
                options={claimTypes}
                value={formData.Claim_Type}
                onChange={handleChange}
              />
            </div>
            <div className="lg:col-span-2">
              <Select
                label="Rights Covered"
                name="Rights_Covered"
                value={formData.Rights_Covered}
                options={["PR", "MR"]}
                onChange={handleChange}
              />
            </div>
            <div className="lg:col-span-1">
              <DateInput
                label="Notification Date"
                name="Notification_date"
                value={formData.Notification_date}
                onChange={handleChange}
              />
            </div>
            <div className="lg:col-span-1">
              <Select
                label="Currency"
                name="Currency"
                value={formData.Currency}
                options={currencies}
                onChange={handleChange}
              />
            </div>
            <div className="lg:col-span-1">
              <Input
                label="Gross "
                name="Gross"
                value={formData.Gross}
                onChange={handleChange}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap ">
        {!isNonDigital && (
          <div className="border-2 border-yellow-400/30 rounded-lg p-1 bg-white/40">
            <h3 className="font-bold text-[10px] text-[#004aad]  uppercase ">
              Period Covered
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <DateInput
                label="Start Date"
                name="Coverage_Start_Date"
                value={formData.Coverage_Start_Date}
                onChange={handleChange}
              />
              <DateInput
                label="End Date"
                name="Coverage_End_Date"
                value={formData.Coverage_End_Date}
                onChange={handleChange}
              />
              <Input
                label="Data Coverage"
                name="Data_Coverage"
                value={formData.Data_Coverage}
                disabled={true}
              />
            </div>
          </div>
        )}

        <div
          style={{ flex: "550px" }}
          className="border-2 border-yellow-400/30 rounded-lg p-1 bg-white/40"
        >
          <h3 className="font-bold text-[10px] text-[#004aad]  uppercase ">
            Payment Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-9 gap-3">
            <DateInput
              label="Date of Receipt"
              name="Date_Received"
              value={formData.Date_Received}
              onChange={handleChange}
            />
            <Input
              label="CUR [FGN]"
              name="Currency"
              value={formData.Currency}
              disabled={true}
            />
            <Input
              label="Amount Received"
              name="Amount_Received"
              value={formData.Amount_Received}
              onChange={handleChange}
            />
            <Input
              label="% VAT"
              name="%VAT"
              value={formData["%VAT"] || ""} // Ensure it's never undefined
              onChange={handleChange}
            />
            <Input
              label="Total Gross"
              name="Total_Gross_Amount"
              value={formData.Total_Gross_Amount || ""}
              disabled={true}
            />
            <Input
              label="Forex Rate"
              name="Exchange_Rate"
              type="number"
              value={formData.Exchange_Rate}
              onChange={handleChange}
            />
            <Input
              label="PHP Amount"
              name="Peso_Value"
              value={formData.Peso_Value}
              disabled={true}
            />
            <Input
              label="CWT"
              name="CWT"
              type="number"
              value={formData.CWT || ""}
              onChange={handleChange}
            />
            <Input
              label="Total Amount"
              name="Total_Amount"
              value={formData.Total_Amount}
              disabled={true}
            />
          </div>
        </div>

        <div
          style={{ flex: "1 1 100%" }}
          className="border-2 border-yellow-400/30 rounded-lg p-2 bg-white/40 flex flex-wrap items-center gap-6 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-grow">
            <DateInput
              label="Billing Date"
              name="Date_billed"
              value={formData.Date_billed}
              onChange={handleChange}
            />
            <Input
              label="SI#"
              name="SI#"
              value={formData["SI#"]}
              onChange={handleChange}
              disabled={!formData.Date_billed || formData.Date_billed === ""}
            />
            <Input
              label="BI#"
              name="BI#"
              value={formData["BI#"]}
              onChange={handleChange}
              disabled={!formData.Date_billed || formData.Date_billed === ""}
            />
            <Input
              label="Remarks"
              name="Licensing_Remarks"
              value={formData.Licensing_Remarks}
              onChange={handleChange}
            />
            <Input
              label="Variance"
              name="Variance"
              value={formData.Variance}
              disabled={true}
            />
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">
              Current Status
            </span>
            <div className="bg-white px-5 py-4 rounded-sm font-black text-[#004aad] uppercase text-xl border-4 border-yellow-400 shadow-inner">
              {formData.Status || "PENDING"}
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-[200px]">
            <button
              type="button"
              onClick={handleClear}
              className="w-full bg-red-500 hover:bg-red-800 text-white font-black py-1 px-4 rounded-lg uppercase transition-all active:scale-95 disabled:bg-gray-400 cursor-pointer"
            >
              Delete
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004aad] hover:bg-blue-800 text-white font-black py-1 px-4 rounded-lg uppercase transition-all active:scale-95 disabled:bg-gray-400 cursor-pointer"
            >
              {loading
                ? "Processing..."
                : editingId
                  ? "Update Record"
                  : "Save Record"}
            </button>
          </div>
        </div>
      </div>
      <datalist id="licensee-options">
        {LICENSEE_DATA.map((item, index) => (
          <option key={index} value={item.COMPANY} />
        ))}
      </datalist>
    </form>
  );
}
