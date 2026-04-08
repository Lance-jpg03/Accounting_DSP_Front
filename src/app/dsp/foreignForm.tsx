import { useEffect, useState, useMemo, useRef } from "react";

const SOCIETY_MAP: Record<string, string> = {
  AACIMH: "HN",
  ABRAC: "BR",
  ABRAMUS: "BR",
  ACAM: "CR",
  ACCESS: "CA",
  ACDAM: "CU",
  ACEMLA: "PR",
  ACUM: "IL",
  ADAGP: "FR",
  ADAVIS: "CU",
  ADDAF: "BR",
  ADIFACORM: "GT",
  AEPI: "GR",
  AGADU: "UR",
  AGICOA: "CH",
  AIE: "ES",
  AIPO: "IT",
  AKM: "AT",
  AKVAPOT: "KZ",
  ALBAUTOR: "AL",
  AMCOS: "AU",
  AMRA: "US",
  AMUS: "BA",
  ANCO: "CO",
  APA: "PY",
  APDAYC: "PE",
  APOLLON: "GR",
  APRA: "AU",
  APS: "PY",
  ARAI: "ID",
  ARGENTORES: "AR",
  ARTIS: "ES",
  ARTISJUS: "HU",
  ASCAP: "US",
  ASS: "AZ",
  "AUSTRO-MECHANA": "AT",
  AUTD: "EE",
  AUTODIA: "GR",
  AUTVIS: "BR",
  AWA: "DE",
  AYPA: "TR",
  AZAUTO: "AZ",
  BAMU: "BG",
  BDS: "BG",
  BEEM: "IL",
  BGDA: "PG",
  BILDU: "ES",
  BILL: "IL",
  BMI: "US",
  BMDA: "MA",
  BSDA: "RO",
  BUCUDA: "CF",
  BUMA: "NL",
  CASH: "HK",
  CCAH: "CN",
  CDM: "FR",
  CEDAR: "ES",
  CEI: "ES",
  CFA: "FR",
  "CHA (HDS ZAMP)": "HR",
  CHAMP: "US",
  CISAC: "FR",
  CMO: "PL",
  CMRRA: "CA",
  COLOMBIA: "CO",
  COMPASS: "SG",
  COPYDAN: "DK",
  COS: "CY",
  COSOCO: "CG",
  CPRA: "JP",
  CRC: "CA",
  CRIA: "CA",
  DACE: "TR",
  DAC: "AR",
  DAMA: "ES",
  DAP: "AR",
  DDO: "DE",
  DEKIG: "HU",
  DILIA: "CZ",
  "DIRECTORS UK": "GB",
  DMC: "FR",
  EA: "EE",
  EAU: "EE",
  EDDA: "IS",
  EDITIONS: "FR",
  EFJA: "FR",
  EKO: "GR",
  EPIKOUREI: "GR",
  ERATO: "GR",
  ESMAA: "AE",
  EUROPA: "BE",
  FAMA: "AR",
  FILJ: "FR",
  FILSCAP: "PH",
  FIP: "FR",
  GCA: "GE",
  GEA: "GR",
  GEMA: "DE",
  GESAC: "BE",
  GESTOR: "CZ",
  GHS: "GB",
  GLO: "US",
  GRAMEX: "FI",
  GRAMMO: "GR",
  GRUP: "TR",
  GVL: "DE",
  HAFOX: "HU",
  "HARRY FOX": "US",
  HDS: "HR",
  HFA: "US",
  HU: "HU",
  HUNG: "HU",
  ICG: "US",
  IFPI: "CH",
  IMRO: "IE",
  INDAA: "IN",
  IPRS: "IN",
  ISG: "GB",
  ITA: "IT",
  IVCA: "GB",
  JAMMS: "JM",
  JASRAC: "JP",
  KAMP: "KE",
  KODA: "DK",
  KOMCA: "KR",
  KOOP: "NL",
  KOPAM: "KR",
  KOPYK: "KR",
  KSAU: "KZ",
  LATGA: "LT",
  LATINAUTOR: "UY",
  MACA: "MO",
  MACP: "MY",
  MCSC: "CN",
  MCT: "TH",
  MCSZ: "ZM",
  MCUK: "GB",
  MESAM: "TR",
  MH: "HU",
  MINT: "DE",
  MOM: "FR",
  MOSCAP: "MN",
  MRCSN: "NP",
  MSG: "TR",
  MUMES: "TR",
  MUSERK: "US",
  MUST: "TW",
  "NORD-DOC": "SE",
  OSA: "CZ",
  PRS: "GB",
  RAO: "RU",
  ROMS: "RU",
  SABAM: "BE",
  SACEM: "FR",
  SACEMLUXEMBOURG: "LU",
  SACENC: "FR",
  SACM: "MX",
  SACVEN: "VE",
  SADAIC: "AR",
  SAIF: "FR",
  SAMRO: "ZA",
  SAS: "SA",
  SAYCO: "CO",
  SESAC: "US",
  SGACEDOM: "DO",
  SGAE: "ES",
  SIAE: "IT",
  SOCAN: "CA",
  SODRAC: "CA",
  SOMAS: "MZ",
  SONGCODE: "US",
  SOZA: "SK",
  STIM: "SE",
  SUISA: "CH",
  TASC: "TZ",
  TONO: "NO",
  UBC: "BR",
  UCMRADA: "RO",
  UCOSO: "UG",
  VCPMC: "VN",
  WAMI: "ID",
  "WID CENTRE": "US"
};

const SOCIETY_FULL_NAMES: Record<string, string> = {
  AACIMH: "Association of Authors, Composers, Performers and Musicians of Honduras",
  ABRAC: "Brazilian Association of Authors, Composers and Music Publishers",
  ABRAMUS: "Brazilian Association of Music and Arts",
  ACAM: "Costa Rican Association of Authors and Musical Composers",
  ACCESS: "The Canadian Copyright Licensing Agency",
  ACDAM: "Cuban Agency of Musical Copyright",
  ACEMLA: "Latin-American Association of Authors and Music Publishers, Inc.",
  ACUM: "Society of Authors, Composers and Music Publishers in Israel",
  ADAGP: "Authors' Society in Graphical and Plastic Arts",
  ADAVIS: "Music Industry Copyright Agency",
  ADDAF: "Association for the Defense of Authors' Rights",
  ADIFACORM: "Guatemalan Association of Authors and Musical Composers",
  AEPI: "Hellenic Society for the Protection of Intellectual Property",
  AGADU: "Uruguayan Authors' General Society",
  AGICOA: "Association of International Collective Management of Audiovisual Works",
  AIE: "Performers’ Management Association",
  AIPO: "Italian Association of Authors and Music Publishers",
  AKM: "AKM Authors, Composers and Music Publishers Registered Cooperative with Limited Liability",
  AKVAPOT: "Kazakhstan Authors and Composers Society",
  ALBAUTOR: "Albanian Society of Authors, Composers and Publishers",
  AMCOS: "Australasian Mechanical Copyright Owners Society Limited",
  AMRA: "American Music Rights Association",
  AMUS: "Association of Composers - Music Authors",
  ANCO: "Colombian Association of Performers and Music Publishers",
  APA: "Paraguayan Association of Authors",
  APDAYC: "Peruvian Society of Authors and Composers",
  APOLLON: "Greek Association for the Protection of Intellectual Property",
  APRA: "Australasian Performing Right Association Limited",
  APS: "Paraguayan Performers Association",
  ARAI: "Indonesian Association of Authors and Music Publishers",
  ARGENTORES: "Argentine Society of Authors",
  ARTIS: "Performers Management Association",
  ARTISJUS: "Society Artisjus Hungarian Bureau for the Protection of Authors' Rights",
  ASCAP: "American Society of Composers, Authors and Publishers",
  ASS: "Azerbaijan Society of Authors",
  "AUSTRO-MECHANA": "Austrian Society for Authors, Composers and Music Publishers",
  AUTD: "Estonian Association of Authors",
  AUTODIA: "Greek Music Composers and Authors Auto-management Organization",
  AUTVIS: "Brazilian Society of Visual Artists Rights",
  AWA: "Authors’ Welfare Association",
  AYPA: "Turkish Association of Authors and Music Publishers",
  AZAUTO: "Azerbaijan Copyright Agency",
  BAMU: "Bulgarian Association of Musical Artists",
  BDS: "Bulgarian Association of Music Publishers",
  BEEM: "The Israeli Bureau for Collective Management of Rights of Authors and Composers",
  BGDA: "Guinea Copyright Office",
  BILDU: "Spanish Association of Authors, Composers and Music Publishers",
  BILL: "Israeli Association of Authors and Music Publishers",
  BMI: "Broadcast Music, Inc.",
  BMDA: "Moroccan Copyright Bureau",
  BSDA: "Romanian Society for Copyright and Neighbouring Rights",
  BUCUDA: "Burkina Faso Copyright Bureau",
  BUMA: "Buma (Netherlands)",
  CASH: "Composers and Authors Society of Hong Kong Limited",
  CCAH: "Copyright Center of Authors and Music Publishers of China",
  CDM: "French Music Centre",
  CEDAR: "Spanish Association of Authors and Music Publishers",
  CEI: "Spanish Center for Intellectual Property",
  CFA: "French Authors' Society",
  "CHA (HDS ZAMP)": "Croatian Composers' Society",
  CHAMP: "California Association of Music Publishers",
  CISAC: "International Confederation of Societies of Authors and Composers",
  CMO: "Polish Copyright Management Organization",
  CMRRA: "Canadian Musical Reproduction Rights Agency Ltd.",
  COLOMBIA: "Colombian Society of Authors and Composers",
  COMPASS: "Composers and Authors Society of Singapore Ltd",
  COPYDAN: "Danish Copyright Association",
  COS: "Cyprus Organization of Authors and Composers",
  COSOCO: "Congolese Copyright Bureau",
  CPRA: "Japanese Center for Performance Rights",
  CRC: "Canadian Retransmission Collective",
  CRIA: "Canadian Recording Industry Association",
  DACE: "Turkish Association of Authors and Music Publishers",
  DAC: "Argentine Directors of Cinematography",
  DAMA: "Spanish Audiovisual Management Association",
  DAP: "Argentine Performers Association",
  DDO: "German Directors Organization",
  DEKIG: "Hungarian Association of Authors and Music Publishers",
  DILIA: "Czech Association of Authors and Music Publishers",
  "DIRECTORS UK": "Directors UK",
  DMC: "French Music Copyright Organization",
  EA: "Estonian Authors' Society",
  EAU: "Estonian Association of Authors and Music Publishers",
  EDDA: "Icelandic Association of Authors and Music Publishers",
  EDITIONS: "French Music Publishers Association",
  EFJA: "French Association of Authors and Music Publishers",
  EKO: "Greek Association of Authors and Music Publishers",
  EPIKOUREI: "Greek Performers' Rights Society",
  ERATO: "Greek Association for the Protection of Performers' Rights",
  ESMAA: "Emirates Society for Management of Authors Rights",
  EUROPA: "European Association of Authors and Music Publishers",
  FAMA: "Argentine Association of Authors and Music Publishers",
  FILJ: "French Federation of Authors and Music Publishers",
  FILSCAP: "Filipino Society of Composers, Authors and Publishers",
  FIP: "French Association of Authors and Music Publishers",
  GCA: "Georgian Copyright Association",
  GEA: "Greek Association for the Collective Management of Performers' Rights",
  GEMA: "Gesellschaft für musikalische Aufführungs- und mechanische Vervielfătigungsrechte",
  GESAC: "European Grouping of Societies of Authors and Composers",
  GESTOR: "The Union for the Protection of Authorship of Czech Republic",
  GHS: "Great Britain Health and Safety Executive",
  GLO: "United States Copyright Management Organization",
  GRAMEX: "Finnish Performance Rights Society",
  GRAMMO: "Greek Association for the Collective Management of Rights of Phonogram Producers",
  GRUP: "Turkish Performance Rights Society",
  GVL: "German Performance Rights Society",
  HAFOX: "Hungarian Alliance of Fingerstyle Guitarists",
  "HARRY FOX": "Harry Fox Agency",
  HDS: "Croatian Composers Society",
  HFA: "Harry Fox Agency",
  HU: "Hungarian Society of Authors and Music Publishers",
  HUNG: "Hungarian Performance Rights Society",
  ICG: "International Cinematographers Guild",
  IFPI: "International Federation of the Phonographic Industry",
  IMRO: "Irish Music Rights Organisation Limited",
  INDAA: "Indian Association of Authors and Music Publishers",
  IPRS: "The Indian Performing Right Society Limited",
  ISG: "International Screenwriters Guild",
  ITA: "Italian Copyright Organization",
  IVCA: "International Visual Communication Association",
  JAMMS: "Jamaica Music Society",
  JASRAC: "Japanese Society for Rights of Authors, Composers and Publishers",
  KAMP: "Kenya Association of Music Producers",
  KODA: "Koda (Denmark)",
  KOMCA: "Korea Music Copyright Association",
  KOOP: "Netherlands Copyright Management Organization",
  KOPAM: "Korean Association of Performance Rights",
  KOPYK: "Korean Association of Music Producers",
  KSAU: "Kazakhstan Society of Authors",
  LATGA: "Lithuanian Association of Related Rights",
  LATINAUTOR: "Ibero-American Copyright Organization",
  MACA: "Macao Association of Composers, Authors & Publishers",
  MACP: "Music Authors' Copyright Protection (Malaysia) Berhad",
  MCSC: "Music Copyright Society of China",
  MCT: "Music Copyright (Thailand) Co., Ltd.",
  MCSZ: "Music Copyright Society of Zambia",
  MCUK: "Music Copyright United Kingdom",
  MESAM: "Türkiye Musiki Eseri Sahipleri Meslek Birliği",
  MH: "Hungarian Music Publishers Association",
  MINT: "Mint Digital Services",
  MOM: "French Performance Rights Society",
  MOSCAP: "Mongolian Society of Composers, Authors and Publishers",
  MRCSN: "Music Royalty Collection Society Nepal",
  MSG: "Turkish Music Union",
  MUMES: "Turkish Performance Rights Society",
  MUSERK: "Muserk LLC",
  MUST: "Music Copyright Society of Chinese Taipei",
  "NORD-DOC": "NORD-DOC",
  OSA: "Ochranný svaz autorský (Czech Republic)",
  PRS: "Performing Right Society Limited",
  RAO: "Russian Authors' Society",
  ROMS: "Russian Organization on Management of Rights",
  SABAM: "Belgian Association of Authors, Composers and Publishers",
  SACEM: "Société des auteurs, compositeurs et éditeurs de musique",
  SACEMLUXEMBOURG: "SACEM Luxembourg",
  SACENC: "Society of Authors Composers and Music Publishers of New Caledonia",
  SACM: "Society of Authors and Composers of Mexico",
  SACVEN: "Society of Authors and Composers of Venezuela",
  SADAIC: "Argentine Society of Authors and Composers of Music",
  SAIF: "Authors Society of Visual Arts and Fix Image",
  SAMRO: "Southern African Music Rights Organisation NPC",
  SAS: "Saudi Authority for Intellectual Property",
  SAYCO: "Society of Authors and Composers of Colombia",
  SESAC: "SESAC (US)",
  SGACEDOM: "General society of dominican Authors, Composers, and Music Publishers, Inc.",
  SGAE: "Sociedad General de Autores y Editores",
  SIAE: "Società Italiana degli Autori ed Editori",
  SOCAN: "Society of Composers, Authors and Music Publishers of Canada",
  SODRAC: "Society for Reproduction Rights of Authors, Composers and Publishers in Canada",
  SOMAS: "Mozambican Authors' Society",
  SONGCODE: "SONGCODE",
  SOZA: "Slovak Performing and Mechanical Rights Society",
  STIM: "Swedish Performing Rights Society",
  SUISA: "Swiss Society for the Rights of Authors of Musical Works",
  TASC: "Tanzania Society of Authors, Composers and Publishers",
  TONO: "Tono (Norway)",
  UBC: "União Brasileira de Compositores",
  UCMRADA: "Romanian Collective Management Organisation for Musical Works",
  UCOSO: "Uganda Copyright and Neighbouring Rights Society",
  VCPMC: "Vietnam Music Copyright Protection Center",
  WAMI: "Wahana Musik Indonesia",
  "WID CENTRE": "WID Center"
};

const dgCategories = [
  "Music Streaming",
  "Messaging Platform",
  "OTT",
  "Live-Streaming Platform",
  "User Uploaded Content",
  "Non-DSP",
];

export default function ForeignForm({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  loading,
  editingId,
  setEditingId,
  Society,
  DSP,
  handleDelete,
  currencies,
  Select,
  Input,
  DateInput,
  onCancel
}: any) {
  const isDigital = formData.Division === "Digital";
  const isLockedAfterSave = !!editingId;
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // If Billing Date is empty, set it to today
    if (!formData.Date_billed) {
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev: any) => ({
        ...prev,
        Date_billed: today,
      }));
    }
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  // PERMISSION LOGIC
  const isAdmin = userRole === "1";
  const canDelete = isAdmin;

  // 1. Origin Logic
  useEffect(() => {
    if (formData.Origin === "Multi-Territorial") {
      setFormData((prev: any) => ({
        ...prev,
        DSP: "Foreign",
        Division: "Non-Digital",
      }));
    }
  }, [formData.Origin, setFormData]);

  // 2. Society Auto-mapping & CLEAR LOGIC
  useEffect(() => {
    if (!formData.Society || formData.Society === "" || formData.Society === "- SELECT -") {
      setFormData((prev: any) => ({
        ...prev,
        Licensee: "",
        Territory: "",
      }));
      return;
    }

    if (formData.Society) {
      const updates: any = {};
      if (SOCIETY_MAP[formData.Society])
        updates.Territory = SOCIETY_MAP[formData.Society];
      if (SOCIETY_FULL_NAMES[formData.Society])
        updates.Licensee = SOCIETY_FULL_NAMES[formData.Society];

      if (Object.keys(updates).length > 0) {
        setFormData((prev: any) => ({ ...prev, ...updates }));
      }
    }
  }, [formData.Society, setFormData]);

  // 3. Digital Source/Category Logic
  useEffect(() => {
    if (formData.Division === "Digital" && formData.DSP) {
      const dsp = formData.DSP.toLowerCase();
      let newSourceType = formData.DSP; // Mirror Source to Source Type
      let newCategory = formData.Category;
      let newCoveredService = formData.Covered_Service;

      if (["youtube", "capcut", "tiktok"].some((s) => dsp.includes(s))) {
        newCategory = "User Uploaded Content";
      } else if (
        ["disney", "netflix", "amazon", "hbo", "apple tv", "hayu", "huawei"].some((s) => dsp.includes(s))
      ) {
        newCategory = "OTT";
        newCoveredService = "OTT";
      } else if (dsp === "twitch" || dsp === "kumu") {
        newCategory = "Live-Streaming Platform";
        newCoveredService = "MUSIC";
      } else if (dsp === "whatsapp") {
        newCategory = "Messaging Platform";
        newCoveredService = "MUSIC";
      } else if (dsp === "spotify" || dsp === "apple music") {
        newCategory = "Music Streaming";
        newCoveredService = "MUSIC";
      }

      setFormData((prev: any) => ({
        ...prev,
        Source_Type: newSourceType,
        Category: newCategory,
        Covered_Service: newCoveredService,
      }));
    }
  }, [formData.DSP, formData.Division, setFormData]);

  useEffect(() => {
    if (formData.Division === "Non-Digital" && formData.DSP === "Live Concert/Events/Election") {
      setFormData((prev: any) => ({
        ...prev,
        Covered_Service: "International"
      }));
    }
    if (formData.Covered_Service !== "Head Office") {
      setFormData((prev: any) => ({
        ...prev,
        Covered_Service: "Head Office"
      }));
    }
  }, [formData.DSP, formData.Division, setFormData]);

  // 4. Calculations Logic
  useEffect(() => {
    const gross = parseFloat(formData.Gross) || 0;
    const received = parseFloat(formData.Amount_Received) || 0;
    const vatPercent = parseFloat(formData["%VAT"]) || 0;
    const exRate = parseFloat(formData.Exchange_Rate) || 0;
    const cwt = parseFloat(formData.CWT) || 0;

    const totalGross = received / (1 + vatPercent / 100);
    const pesoValue = totalGross * exRate;
    const totalAmount = pesoValue - cwt;
    const variance = gross - totalGross;

    setFormData((prev: any) => ({
      ...prev,
      Total_Gross_Amount: totalGross.toFixed(2),
      Peso_Value: pesoValue.toFixed(2),
      Total_Amount: totalAmount.toFixed(2),
      Variance: variance.toFixed(2),
    }));
  }, [
    formData.Gross,
    formData.Amount_Received,
    formData["%VAT"],
    formData.Exchange_Rate,
    formData.CWT,
    setFormData,
  ]);

  const getFilteredSocieties = () => {
    if (formData.Licensor === "RME") return ["MINT", "MUSERK", "ESMAA"];
    return Society;
  };

  const getFilteredSourceTypes = () => {
    if (isDigital) return [formData.DSP || "Select Source"]; // Mirror Source
    if (formData.DSP === "Non-Society") return ["Foreign"];
    if (formData.DSP === "Live Concert/Events/Election") return ["LIVE CONCERT/EVENT", "ONLINE EVENTS"];
    return ["Broadcast", "Live Concert/Events/Election", "General", "Reproduction"];
  };

  const getFilteredCategories = () => {
    if (isDigital) return dgCategories;
    if (formData.DSP === "Non-Society") return ["Muserk", "Mint"];
    if (formData.DSP === "Live Concert/Events/Election") return ["Concert/Event/Election"];
    return [...DSP, "Non-DSP", "Others"];
  };

  const getCoveredServiceOptions = () => {
    if (formData.Division === "Non-Digital" && formData.DSP === "Live Concert/Events/Election") {
      return ["International"];
    }
    return ["Head Office", "Cebu", "Legal", "Election"];
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#FFF9E5] p-6 shadow-xl rounded-md space-y-6 border border-yellow-200"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 items-end -mt-4">
        <Select
          label="Division"
          name="Division"
          value={formData.Division}
          options={["Non-Digital", "Digital"]}
          onChange={handleChange}
        />
        <Select
          label="Origin"
          name="Origin"
          value={formData.Origin}
          options={["Mono-territorial", "Multi-Territorial"]}
          onChange={handleChange}
        />
        <Select
          label="Source"
          name="DSP"
          value={formData.DSP}
          options={isDigital ? DSP : ["Society", "Non-Society", "Live Concert/Events/Election"]}
          onChange={handleChange}
        />
        <Select
          label="Licensor"
          name="Licensor"
          value={formData.Licensor}
          options={["RME", "Direct License", "Society"]}
          onChange={handleChange}
          disabled={isDigital}
        />
        <Select
          label="Source Type"
          name="Source_Type"
          value={formData.Source_Type}
          options={getFilteredSourceTypes()}
          onChange={handleChange}
        />
        <Select
          label="Category"
          name="Category"
          value={formData.Category}
          options={getFilteredCategories()}
          onChange={handleChange}
        />
        <Select
          label="Society"
          name="Society"
          options={getFilteredSocieties()}
          value={formData.Society}
          onChange={handleChange}
          disabled={formData.Licensor === "Direct License"}
        />
        <Input
          label="Licensee"
          name="Licensee"
          value={formData.Licensee}
          onChange={handleChange}
          disabled={formData.Licensor !== "Direct License"}
        />
        <Input
          label="Territory"
          name="Territory"
          value={formData.Territory}
          disabled={true}
        />
        <Select
          label="Covered Service"
          name="Covered_Service"
          value={formData.Covered_Service}
          options={getCoveredServiceOptions()}
          onChange={handleChange}
        />
        <Select
          label="Rights Covered"
          name="Rights_Covered"
          value={formData.Rights_Covered}
          options={["PR", "MR", "PR & MR", "Synch"]}
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
        <div style={{ flex: "1 1 200px" }} className="border-2 border-yellow-400/30 rounded-lg p-2 bg-white/40">
          <h3 className="font-bold text-sm text-[#004aad] mb-3 uppercase border-b border-yellow-400/30">
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

        <div style={{ flex: "1 1 550px" }} className="border-2 border-yellow-400/30 rounded-lg p-2 bg-white/40">
          <h3 className="font-bold text-sm text-[#004aad] mb-3 uppercase border-b border-yellow-400/30">
            Payment Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-9 gap-3">
            <DateInput
              label="Date of Receipt"
              name="Date_Received"
              value={formData.Date_Received}
              onChange={handleChange}
            />
            <Input label="Currency" name="Currency" value={formData.Currency} disabled={true} />
            <Input label="Amount Received" name="Amount_Received" value={formData.Amount_Received} onChange={handleChange} />
            <Input label=" %VAT" name="%VAT" value={formData["%VAT"]} onChange={handleChange} />
            <Input label="Total Gross" name="Total_Gross_Amount" value={formData.Total_Gross_Amount} disabled={true} />
            <Input label="Exchange Rate" name="Exchange_Rate" value={formData.Exchange_Rate} onChange={handleChange} />
            <Input label="PHP Amount" name="Peso_Value" value={formData.Peso_Value} disabled={true} />
            <Input label="CWT" name="CWT" value={formData.CWT} onChange={handleChange} />
            <Input label="Total Amount" name="Total_Amount" value={formData.Total_Amount} disabled={true} />
          </div>
        </div>

        <div style={{ flex: "1 1 100%" }} className="border-2 border-yellow-400/30 rounded-lg p-2 bg-white/40 flex flex-wrap items-center gap-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-grow">
            <DateInput
              label="Billing Date"
              name="Date_billed"
              value={formData.Date_billed}
              onChange={handleChange}
              disabled={true} 
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
            <Input label="Remarks" name="Licensing_Remarks" value={formData.Licensing_Remarks} onChange={handleChange} disabled={isLockedAfterSave} />
            <Input label="Variance" name="Variance" value={formData.Variance} disabled={true} />
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
            {editingId && canDelete && (
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
    </form>
  );
}