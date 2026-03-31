import React, { useEffect, useState } from "react";
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
  handleDelete: any;
  onCancel: () => void;
  }

const Source = ["Broadcast", "Live Concert/Events", "General", "Reproduction"];

const Source_Type = [
  "Terrestrial Television",
  "Cable Television",
  "Radio Broadcast",
  "Live Concert/Event/Election",
  "Hotel",
  "Restaurant/Food Chain",
  "Music Lounge/KTV",
  "Retail",
  "Wellness",
  "Transport",
  "Cinema",
  "Amusement",
  "Dance Schools/Hospitals/MOH",
  "Synchronization",
  "Mechanical",
];

const dgSource_type = [
  "Music Streaming",
  "Messaging Platform",
  "OTT",
  "Live-Streaming Platform",
  "User Uploaded Content",
  "Non-DSP",
  "Others",
];

const CATEGORY_OPTIONS = [
  "Free TV",
  "Cable TV",
  "Radio",
  "Concert/Event",
  "Online Events",
  "Hotel/Resort/Inn",
  "Restaurant",
  "Music Lounge",
  "Mall/Retail",
  "Wellness",
  "Transport",
  "Cinema",
  "Amusement",
  "Hospital",
  "Dance School/Studio",
  "Music-on-Hold",
  "Synchronization",
  "Mechanical",
];

const SOURCE_CATEGORY_MAP: Record<string, string[]> = {
  Broadcast: ["Free TV", "Cable TV", "Radio"],
  "Live Concert/Events": ["Concert/Event", "Online Events"],
  General: [
    "Hotel/Resort/Inn",
    "Restaurant",
    "Music Lounge",
    "Mall/Retail",
    "Wellness",
    "Transport",
    "Cinema",
    "Amusement",
    "Hospital",
    "Dance School/Studio",
    "Music-on-Hold",
  ],
  Reproduction: ["Synchronization", "Mechanical"],
};

const SOURCE_TYPE_FILTER_MAP: Record<string, string[]> = {
  Broadcast: ["Terrestrial Television", "Cable Television", "Radio Broadcast"],
  "Live Concert/Events": ["Live Concert/Event/Election"],
  General: [
    "Hotel",
    "Restaurant/Food Chain",
    "Music Lounge/KTV",
    "Retail",
    "Wellness",
    "Transport",
    "Cinema",
    "Amusement",
    "Dance Schools/Hospitals/MOH",
  ],
  Reproduction: ["Synchronization", "Mechanical"],
};

const TYPE_TO_CATEGORY_MAP: Record<string, string[]> = {
  "Terrestrial Television": ["Free TV",],
  "Cable Television": ["Cable TV"],
  "Radio Broadcast": ["Radio"],
};

export default function LocalForm({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  loading,
  editingId,
  DSP,
  claimTypes,
  handleDelete,
  currencies,
  Select,
  Input,
  DateInput,
}: LocalFormProps) {


  useEffect(() => {
    if (formData.Division === "Digital" && formData.DSP) {
      const dsp = formData.DSP.toLowerCase();
      let newSourceType = formData.Source_Type;
      let newCategory = formData.Category;
      let newCoveredService = formData.Covered_Service;

      if (dsp === "youtube" || dsp === "capcut" || dsp === "tiktok") {
        newSourceType = "User Uploaded Content";
        newCategory = formData.DSP
      } else if (["disney", "netflix", "amazon", "hbo", "apple tv", "hayu", "huawei"].some(s => dsp.includes(s))) {
        newSourceType = "OTT";
        newCategory = formData.DSP;
        newCoveredService = "OTT";
      } else if (dsp === "twitch" || dsp === "kumu") {
        newSourceType = "Live-Streaming Platform";
        newCategory = formData.DSP
        newCoveredService = "MUSIC";
      } else if (dsp === "whatsapp") {
        newSourceType = "Messaging Platform";
        newCategory = formData.DSP
        newCoveredService = "MUSIC";
      } else if (dsp === "spotify" || dsp === "apple music") {
        newSourceType = "Music Streaming";
        newCategory = "Spotify";
        newCoveredService = "MUSIC";
      }

      if (
        newSourceType !== formData.Source_Type ||
        newCategory !== formData.Category ||
        newCoveredService !== formData.Covered_Service
      ) {
        setFormData((prev: any) => ({
          ...prev,
          Source_Type: newSourceType,
          Category: newCategory,
          Covered_Service: newCoveredService,
        }));
      }
    }
  }, [formData.DSP, formData.Division, setFormData]);

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);
  const isAdmin = userRole === "1";
  const isSubAdmin = userRole === "2";
  const isUser = userRole === "3";

  useEffect(() => {
    if (formData.Origin === "Mono-Territorial") {
      setFormData((prev: any) => ({
        ...prev,
        Division: prev.Division || "Digital",
        DSP: prev.DSP || "Local",
      }));
    }
  }, [formData.Origin, setFormData]);

  useEffect(() => {
    if (!formData.Licensee || formData.Licensee.trim() === "") {
      setFormData((prev: any) => ({
        ...prev,
        Establishment: "",
        Category: "",
      }));
    }
  }, [formData.Licensee, setFormData]);

  useEffect(() => {
    if (formData.Source_Type === "Radio Broadcast") {
      setFormData((prev: any) => ({
        ...prev,
        Category: "Radio",
      }));
    }
  }, [formData.Source_Type, setFormData]);

  useEffect(() => {
    if (formData.Source_Type === "Cable Television") {
      setFormData((prev: any) => ({
        ...prev,
        Category: "Cable TV",
      }));
    }
  }, [formData.Source_Type, setFormData]);

  useEffect(() => {
    if (formData.Source_Type === "Terrestrial Television") {
      setFormData((prev: any) => ({
        ...prev,
        Category: "Free TV",
      }));
    }
  }, [formData.Source_Type, setFormData]);

  const isNonDigital = formData.Division === "Non-Digital";
  const isLockedAfterSave = !!editingId;

  const getFilteredCategories = () => {
    if (!isNonDigital) {
      return [...DSP, "Non-DSP", "Others"];
    }
    const typeSpecific = TYPE_TO_CATEGORY_MAP[formData.Source_Type];
    if (typeSpecific) return typeSpecific;
    return SOURCE_CATEGORY_MAP[formData.DSP] || CATEGORY_OPTIONS;
  };

  const getFilteredSourceTypes = () => {
    if (!isNonDigital) return dgSource_type;
    return SOURCE_TYPE_FILTER_MAP[formData.DSP] || Source_Type;
  };

  // Helper for dynamic Covered Service options
  const getCoveredServiceOptions = () => {
    const dsp = formData.DSP?.toLowerCase();
    if (formData.Division === "Digital" && (dsp === "youtube" || dsp === "capcut")) {
      return ["AVOD", "SVOD", "SHORTS", "OTT"];
    }
    return ["AVOD", "SVOD", "SHORTS", "OTT", "MUSIC"];
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#FFF9E5] p-2 shadow-xl rounded-md space-y-2 border border-yellow-200"
    >
      <fieldset disabled={isUser} className="contents">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 items-end">
          <div className="lg:col-span-1">
            <Select
              label="Origin"
              name="Origin"
              value={formData.Origin}
              options={["Mono-Territorial", "Multi-Territorial"]}
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
              options={getFilteredSourceTypes()}
              onChange={handleChange}
            />
          </div>
          <div className="lg:col-span-1">
            <Select
              label="Category"
              name="Category"
              value={formData.Category}
              options={getFilteredCategories()}
              onChange={handleChange}
              // Use .includes() to return a boolean true/false
              disabled={["Radio Broadcast", "Terrestrial Television", "Cable Television"].includes(formData.Source_Type)}
            />
          </div>
          {isNonDigital ? (
            <>
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
                  label="Establishment"
                  name="Establishment"
                  value={formData.Establishment}
                  onChange={handleChange}
                  disabled={true}
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
                  options={["Head Office", "Cebu", "Legal"]}
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
                  disabled={true}
                />
              </div>
              <div className="lg:col-span-1">
                <Select
                  label="Right Covered"
                  name="Rights_Covered"
                  value={formData.Rights_Covered}
                  options={["PR", "MR", "PR & MR"]}
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
              <div className="lg:col-span-1 ">
                <Select
                  label="CUR [FGN]"
                  name="Currency"
                  value={formData.Currency}
                  options={currencies}
                  onChange={handleChange}
                />
              </div>
              <div className="lg:col-span-1 ">
                <Input
                  label="Gross"
                  name="Gross"
                  value={formData.Gross}
                  onChange={handleChange}
                />
              </div>

              <div className="lg:col-span-8 border-2 border-yellow-400/30 rounded-lg p-2 bg-white/40">
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
                  options={["New", "Renewed", "Continuous"]}
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
                  disabled={true}
                />
              </div>
              <div className="lg:col-span-1">
                <Select
                  label="Covered Service"
                  name="Covered_Service"
                  value={formData.Covered_Service}
                  options={getCoveredServiceOptions()}
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
                  options={["PR", "MR", "PR & MR"]}
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
                value={formData["%VAT"] || ""}
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
                disabled={
                  !formData.Date_billed ||
                  formData.Date_billed === "" ||
                  isLockedAfterSave
                }
              />
              <Input
                label="BI#"
                name="BI#"
                value={formData["BI#"]}
                onChange={handleChange}
                disabled={
                  !formData.Date_billed ||
                  formData.Date_billed === "" ||
                  isLockedAfterSave
                }
              />
              <Input
                label="Remarks"
                name="Licensing_Remarks"
                value={formData.Licensing_Remarks}
                onChange={handleChange}
                disabled={isLockedAfterSave}
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
              {editingId && (
                <button
                  type="button"
                  onClick={() => handleDelete(editingId)}
                  className="w-full bg-red-500 hover:bg-red-800 text-white font-black py-1 px-4 rounded-lg uppercase transition-all active:scale-95 disabled:bg-gray-400 cursor-pointer"
                >
                  Delete Row
                </button>
              )}

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
      </fieldset>
      </form>
    );
  }