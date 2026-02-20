import React from "react";

interface ForeignFormProps {
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

export default function ForeignForm({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  loading,
  editingId,
  setEditingId,
  DSP,
  Society,
  claimTypes,
  currencies,
  Select,
  Input,
  DateInput,
}: ForeignFormProps) {
  // Function to clear all fields and reset the form
  const handleClear = () => {
    setEditingId(null);
    setFormData({
      Coverage_Start_Date: "",
      Coverage_End_Date: "",
      Coverage_Period: "",
      Data_Coverage: "",
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
      Origin: "Foreign",
      Licensor: "",
      Licensee: "",
      Territory: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#FFF9E5] p-6 shadow-xl rounded-md space-y-6 border border-yellow-200"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-3 items-end">
        <Select
          label="Origin"
          name="Origin"
          value={formData.Origin}
          options={["Local", "Foreign"]}
          onChange={handleChange}
        />
        <Select
          label="Division"
          name="Division"
          value={formData.Division}
          options={["Digital", "Non-Digital"]}
          onChange={handleChange}
        />
        <Select
          label="Source"
          name="DSP"
          value={formData.DSP}
          options={DSP}
          onChange={handleChange}
        />
        <Select
          label="Licensor"
          name="Licensor"
          value={formData.Licensor}
          options={["RME", "Direct License", "Socierty"]}
          onChange={handleChange}
        />
        <Select
          label="Licensee"
          name="Licensee"
          value={formData.Licensee}
          options={["ABS-CBN", "GMA", "TV5", "Viva", "Regal", "Other"]}
          onChange={handleChange}
        />

        <Select
          label={formData.Origin === "Foreign" ? "Society" : "Society"}
          name="Society"
          value={formData.Society}
          options={Society}
          onChange={handleChange}
        />

        <Input
          label="Territory"
          name="Territory"
          value={formData.Territory}
          onChange={handleChange}
        />
        <Select
          label={formData.Origin === "Foreign" ? "Right Covered" : "Claim Type"}
          name="Claim_Type"
          value={formData.Claim_Type}
          options={["PR", "Re-Produced"]}
          onChange={handleChange}
        />
        <DateInput
          label={
            formData.Origin === "Foreign"
              ? "Date of Notif Payment"
              : "Deadline of Billing"
          }
          name="Deadline_of_Billing"
          value={formData.Deadline_of_Billing}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div
          style={{ flex: "1 1 150px" }}
          className="border-2 border-yellow-400/30 rounded-lg p-4 bg-white/40"
        >
          <h3 className="font-bold text-sm text-[#004aad] mb-3 uppercase border-b border-yellow-400/30 pb-1">
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
              readOnly
            />
          </div>
        </div>

        <div
          style={{ flex: "1 1 550px" }}
          className="border-2 border-yellow-400/30 rounded-lg p-4 bg-white/40"
        >
          <h3 className="font-bold text-sm text-[#004aad] mb-3 uppercase border-b border-yellow-400/30 pb-1">
            Payment Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <DateInput
              label="Date of Receipt"
              name="Date_Received"
              value={formData.Date_Received}
              onChange={handleChange}
            />
            <Select
              label="Currency"
              name="Currency"
              value={formData.Currency}
              options={currencies}
              onChange={handleChange}
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
              readOnly
            />
            <Input
              label="Variance"
              name="Variance"
              value={formData.Variance}
              readOnly
            />
          </div>
        </div>

        <div
          style={{ flex: "1 1 100%" }}
          className="border-2 border-yellow-400/30 rounded-lg p-5 bg-white/40 flex flex-wrap items-center gap-6 shadow-sm"
        >
          <span className="text-sm font-bold text-[#004aad] uppercase mb-1">
            Current
            <span className="block">Status</span>
          </span>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow">
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
            />
            <Input
              label="BI#"
              name="BI#"
              value={formData["BI#"]}
              onChange={handleChange}
            />
            <Input
              label="Remarks"
              name="Licensing_Remarks"
              value={formData.Licensing_Remarks}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">
              Current Status
            </span>
            <div className="bg-white px-5 py-3 rounded-xl font-black text-[#004aad] uppercase text-xl border-4 border-yellow-400 shadow-inner">
              {formData.Status || "PENDING"}
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-[200px]">
            <button
              type="button"
              onClick={handleClear}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-2 rounded-lg shadow-lg uppercase tracking-wider transition-all disabled:bg-gray-400 cursor-pointer"
            >
              Delete
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-800 text-white font-black py-2 rounded-lg shadow-lg uppercase tracking-wider transition-all disabled:bg-gray-400 cursor-pointer"
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
    </form>
  );
}
