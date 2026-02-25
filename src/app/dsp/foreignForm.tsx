import React, { useEffect } from "react";

const SOCIETY_MAP: Record<string, string> = {
  ABRAMUS: "BR",
  ACAM: "CR",
  ACDAM: "CU",
  ACUM: "IL",
  AEPI: "GR",
  AKM: "AT",
  APDAYC: "PE",
  APRA: "AU",
  ARTISJUS: "HU",
  ASCAP: "US",
  AUTODIA: "GR",
  BMI: "US",
  "BUMA/STEMRA": "NL",
  CASH: "HK",
  "CHA (HDS ZAMP)": "HR",
  COMPASS: "SG",
  GEMA: "DE",
  IMRO: "IE",
  IPRS: "IN",
  HAFOX: "HU",
  JASRAC: "JP",
  KODA: "DK",
  KOMCA: "KR",
  LATGA: "LT",
  MACA: "MO",
  MACP: "MY",
  MCSC: "CN",
  MCT: "TH",
  MESAM: "TR",
  MOSCAP: "MN",
  MRCSN: "NP",
  MUST: "TW",
  OSA: "CZ",
  PRS: "GB",
  RAO: "RU",
  SABAM: "BE",
  SACEM: "FR",
  SACM: "MX",
  SACVEN: "VE",
  SADAIC: "AR",
  SAMRO: "ZA",
  SAS: "SA",
  SAYCO: "CO",
  SESAC: "US",
  SGAE: "ES",
  SIAE: "IT",
  SOCAN: "CA",
  SODRAC: "CA",
  SOZA: "SK",
  STIM: "SE",
  SUISA: "CH",
  TONO: "NO",
  UBC: "BR",
  UCMRADA: "RO",
  VCPMC: "VN",
  WAMI: "ID",
  FILSCAP: "PH",
};

const SOCIETY_FULL_NAMES: Record<string, string> = {
  ABRAMUS: "Associação Brasileira de Música e Artes",
  ACAM: "Association of Composers and Authors of Costa Rica",
  ACDAM: "Agencia Cubana de Derecho de Autor Musical",
  ACUM: "Society of Authors, Composers and Music Publishers in Israel",
  AEPI: "Hellenic Society for the Protection of Intellectual Property",
  AKM: "Staatlich genehmigte Gesellschaft der Autoren, Komponisten und Musikverleger",
  APDAYC: "Asociación Peruana de Autores y Compositores",
  APRA: "Australasian Performing Right Association",
  ARTISJUS: "Hungarian Bureau for the Protection of Authors' Rights",
  ASCAP: "American Society of Composers, Authors and Publishers",
  AUTODIA: "Auto-Management Organization of Greek Music Composers and Authors",
  BMI: "Broadcast Music, Inc.",
  "BUMA/STEMRA": "Buma/Stemra (Netherlands)",
  CASH: "Composers and Authors Society of Hong Kong",
  "CHA (HDS ZAMP)": "Croatian Composers' Society",
  COMPASS: "Composers and Authors Society of Singapore",
  GEMA: "Gesellschaft für musikalische Aufführungs- und mechanische Vervielfătigungsrechte",
  IMRO: "Irish Multi-Purpose Organisation",
  IPRS: "The Indian Performing Right Society Limited",
  HAFOX: "Hungarian Alliance of Fingerstyle Guitarists",
  JASRAC: "Japanese Society for Rights of Authors, Composers and Publishers",
  KODA: "Koda (Denmark)",
  KOMCA: "Korea Music Copyright Association",
  LATGA: "Lithuanian Association of Related Rights",
  MACA: "Macao Association of Composers, Authors & Publishers",
  MACP: "Music Authors' Copyright Protection (Malaysia)",
  MCSC: "Music Copyright Society of China",
  MCT: "Music Copyright (Thailand) Co., Ltd.",
  MESAM: "Türkiye Musiki Eseri Sahipleri Meslek Birliği",
  MOSCAP: "Mongolian Society of Composers, Authors and Publishers",
  MRCSN: "Music Royalty Collection Society Nepal",
  MUST: "Music Copyright Society of Chinese Taipei",
  OSA: "Ochranný svaz autorský (Czech Republic)",
  PRS: "Performing Right Society",
  RAO: "Russian Authors' Society",
  SABAM: "Belgian Association of Authors, Composers and Publishers",
  SACEM: "Société des auteurs, compositeurs et éditeurs de musique",
  SACM: "Sociedad de Autores y Compositores de México",
  SACVEN: "Sociedad de Autores y Compositores de Venezuela",
  SADAIC: "Sociedad Argentina de Autores y Compositores de Música",
  SAMRO: "Southern African Music Rights Organisation",
  SAS: "Saudi Authority for Intellectual Property",
  SAYCO: "Sociedad de Autores y Compositores de Colombia",
  SESAC: "SESAC (US)",
  SGAE: "Sociedad General de Autores y Editores",
  SIAE: "Società Italiana degli Autori ed Editori",
  SOCAN: "Society of Composers, Authors and Music Publishers of Canada",
  SODRAC:
    "Society for Reproduction Rights of Authors, Composers and Publishers in Canada",
  SOZA: "Slovak Performing and Mechanical Rights Society",
  STIM: "Swedish Performing Rights Society",
  SUISA: "Swiss Society for the Rights of Authors of Musical Works",
  TONO: "Tono (Norway)",
  UBC: "União Brasileira de Compositores",
  UCMRADA: "Romanian Collective Management Organisation for Musical Works",
  VCPMC: "Vietnam Music Copyright Protection Center",
  WAMI: "Wahana Musik Indonesia",
  FILSCAP: "Filipino Society of Composers, Authors and Publishers",
};

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
  territories,
}: any) {
  // Force state to Foreign when this form is active
  useEffect(() => {
    if (formData.Origin === "Foreign") {
      setFormData((prev: any) => ({
        ...prev,
        DSP: "Foreign",
        Division: "Digital",
      }));
    }
  }, [formData.Origin, setFormData]);

  useEffect(() => {
    if (formData.Society) {
      const updates: any = {};
      if (SOCIETY_MAP[formData.Society]) {
        updates.Territory = SOCIETY_MAP[formData.Society];
      }
      if (SOCIETY_FULL_NAMES[formData.Society]) {
        updates.Licensee = SOCIETY_FULL_NAMES[formData.Society];
      }
      if (Object.keys(updates).length > 0) {
        setFormData((prev: any) => ({ ...prev, ...updates }));
      }
    }
  }, [formData.Society, setFormData]);

  const handleClear = () => {
    setEditingId(null);
    setFormData({
      Origin: "Foreign",
      Division: "Digital",
      DSP: "Foreign",
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
      Currency: "USD",
      Exchange_Rate: "55",
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
      Licensor: "FILSCAP",
      Licensee: "FILSCAP",
      Territory: "",
      "%VAT": "0",
      Total_Gross_Amount: "",
      CWT: "0",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#FFF9E5] p-6 shadow-xl rounded-md space-y-6 border border-yellow-200"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-11 gap-3 items-end -mt-4">
        <Select
          label="Origin"
          name="Origin"
          value={formData.Origin}
          options={["Local", "Foreign"]}
          onChange={handleChange}
        />

        <Input
          label="Division"
          name="Division"
          value={formData.Division}
          onChange={handleChange}
          disabled={true}
        />

        <Select
          label="Source"
          name="DSP"
          value={formData.DSP}
          options={["Society", "Non-Society"]}
          onChange={handleChange}
        />

        <Select
          label="Licensor"
          name="Licensor"
          value={formData.Licensor}
          options={["RME", "Direct License", "Society"]}
          onChange={handleChange}
        />

        <Select
          label="Society"
          name="Society"
          options={Society}
          value={formData.Society}
          onChange={handleChange}
          placeholder="FILSCAP"
        />

        <Input
          label="Licensee"
          name="Licensee"
          value={formData.Licensee}
          onChange={handleChange}
          disabled={true}
        />

        <Input
          label="Territory"
          name="Territory"
          value={formData.Territory}
          onChange={handleChange}
          disabled={true}
        />
        <Select
          label="Rights Covered"
          name="Rights_Covered"
          value={formData.Rights_Covered}
          options={["PR", "MR"]}
          onChange={handleChange}
        />

        <DateInput
          label="Notification Date"
          name="Notification_date"
          value={formData.Notification_date}
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
          label="Gross Amount"
          name="Gross"
          value={formData.Gross}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div
          style={{ flex: "200px" }}
          className="border-2 border-yellow-400/30 rounded-lg p-1 bg-white/40"
        >
          <h3 className="font-bold text-sm text-[#004aad] mb-3 uppercase border-b border-yellow-400/30 ">
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

        <div
          style={{ flex: "550px" }}
          className="border-2 border-yellow-400/30 rounded-lg p-1 bg-white/40"
        >
          <h3 className="font-bold text-sm text-[#004aad] mb-3 uppercase border-b border-yellow-400/30 ">
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
              label="Currency"
              name="Currency"
              value={formData.Currency}
              onChange={handleChange}
              disabled={true}
            />
            <Input
              label="Amount Received"
              name="Amount_Received"
              value={formData.Amount_Received}
              onChange={handleChange}
            />
            <Input
              label=" %VAT"
              name="%VAT"
              value={formData["%VAT"]}
              onChange={handleChange}
            />
            <Input
              label="Total Gross "
              name="Total_Gross_Amount"
              value={formData.Total_Gross_Amount}
              disabled={true}
            />
            <Input
              label="Exchange Rate"
              name="Exchange_Rate"
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
              value={formData.CWT}
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
    </form>
  );
}
