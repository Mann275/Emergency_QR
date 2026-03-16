import React, { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    // Header
    createProfile: "Create Profile",
    home: "Home",

    // Home
    heroTitle: "Critical details. Before you can explain them.",
    heroCta: "Create your profile",
    heroBadge: "Emergency access card",
    heroSubDesc:
      "Emergency QR stores the details that matter in a calm, readable profile. One scan reveals blood group, emergency contact, medical notes, and responder instructions instantly.",
    howItWorks: "How it works",
    seePreview: "See preview",
    readyTitle: "Ready in under two minutes.",
    getStarted: "Get started",

    stat1Val: "10 sec",
    stat1Lbl: "scan to action",
    stat2Val: "1 page",
    stat2Lbl: "clear emergency view",
    stat3Val: "0 app",
    stat3Lbl: "camera only access",

    previewBadge1: "Live emergency card",
    previewTitle1: "Lock-screen ready",
    mockupProfile: "Emergency profile",
    mockupPrimaryContact: "Primary contact",
    mockupAllergy: "Allergy",
    mockupNone: "None",
    mockupMedication: "Medication",
    readableBadge: "Readable in one glance",
    responderFirst: "Responder-first",

    feature1Title: "Scan once",
    feature1Copy:
      "Responders land directly on the emergency profile without any app install or login.",
    feature2Title: "Call fast",
    feature2Copy:
      "Primary contact and backup number are visible above the fold for immediate action.",
    feature3Title: "Medical first",
    feature3Copy:
      "Blood group, allergies, medications, and notes are prioritized for real emergency use.",

    fastSetupBadge: "Fast setup",
    buildPassTitle: "Build the pass in under two minutes.",
    buildPassDesc:
      "Create the profile once, download the QR, and keep it on your phone, wallet card, or lock screen. The public page only shows emergency-safe details.",

    step1Title: "Fill your profile",
    step1Desc:
      "Blood group, allergies, medications, and emergency contacts. Nothing else.",
    step2Title: "Get your QR",
    step2Desc: "Download a clear QR card for quick access.",
    step3Title: "Anyone can scan",
    step3Desc:
      "No app needed. Any phone camera opens your critical data in one glance.",

    // Create Profile
    createTitle: "Create your profile",
    createDesc:
      "Fill in your medical details. This data will be instantly accessible via QR in case of an emergency.",
    personalInfo: "Personal Info",
    fullName: "Full name",
    bloodGroup: "Blood group",
    selectBloodGroup: "Select blood group",
    dob: "Date of birth",
    gender: "Gender",
    selectGender: "Select gender",

    createHint1: "Only emergency-safe data is shown publicly.",
    createHint2: "Primary contact and blood group stay visible first.",
    createHint3: "Profile is optimized for mobile lock-screen access.",

    emergencyContacts: "Emergency Contacts",
    yourPhone: "Your phone",
    contactName: "Contact name",
    emergencyPhone: "Emergency phone",
    medicalHistory: "Medical History",
    chronicConditions: "Chronic conditions",
    knownAllergies: "Known allergies",
    medications: "Medications",
    responderNotes: "Responders notes",
    generateQr: "Generate QR",
    disclaimer:
      "By generating this QR, you authorize the public display of this data for emergency retrieval.",
    working: "Working...",

    // Success
    profileActive: "Profile Active.",
    profileLiveBadge: "Profile live",
    passLive:
      "Your emergency pass is live. This QR code leads directly to your medical data.",
    saveCard: "Save the card",
    saveDesc:
      "Click the download button or long-press the QR to save it to your device.",
    lockScreen: "Lock screen",
    lockDesc:
      "Set this as your lock screen wallpaper for instant reachability by responders.",
    downloadQr: "Download QR",
    viewProfile: "View Profile",
    emergencyPass: "Emergency pass",
    readyToShare: "Ready to share",
    bestUse: "Best use",
    bestUseDesc:
      "Keep this on your lock screen, wallet card, or medical ID so a scanner can reach the emergency page immediately.",
    backToDashboard: "Back to dashboard",

    // Emergency Profile
    emergencyProfile: "Emergency Profile",
    active: "ACTIVE",
    identity: "Identity",
    medicalStatus: "Medical Status",
    verified: "Verified",
    medicalDetails: "Medical Details",
    condition: "Condition / Diagnoses",
    allergies: "Known Allergies",
    instructions: "Instructions for responders",
    primaryKin: "Primary Kin",
    callContact: "Call contact",
    backupConnection: "Backup connection",
    patient: "Patient",
    verifiedLog: "Verified Log",
    clinicalDisclaimer:
      "This profile is verified by the patient. In a medical emergency, follow professional protocols.",
    returnHome: "Return home",
    accessError: "Access Error",
    notFound: "Profile not found.",
    failedLoad: "Failed to load profile.",
    retrieving: "Retrieving profile...",
    notSpecified: "Not specified",
    noneDisclosed: "None disclosed",

    yourNumber: "Your Number",
    callEmergencyContact: "Call Emergency Contact",
    callYourNumber: "Call Your Number",
    age: "Age",
    bloodGroupLabel: "Blood group",
    scannerFirstView: "Scanner-first view",
    emergencyDetailsArranged:
      "Emergency details are arranged for immediate action: call contact first, then verify blood group and medical alerts.",
    emergencyContactLabel: "Emergency Contact",
    profileRef: "Profile ref",
    quickIdentity: "Quick identity",
    patientFacts: "User details",
    recordId: "Record ID",
    status: "Status",
    activeAndVerified: "Active and verified",

    // Edit Profile
    editTitle: "Edit your profile",
    editDesc:
      "Update your medical details. Changes will reflect on your emergency QR immediately.",
    updateProfile: "Update profile",
    updating: "Updating...",
    profileUpdated: "Profile updated successfully!",
    cancelEdit: "Cancel",
    editProfile: "Edit profile",
  },
  hi: {
    // Header
    createProfile: "प्रोफ़ाइल बनाएं",
    home: "होम",

    // Home
    heroTitle: "महत्वपूर्ण विवरण। इससे पहले कि आप उन्हें समझा सकें।",
    heroCta: "अपनी प्रोफ़ाइल बनाएं",
    heroBadge: "आपातकालीन एक्सेस कार्ड",
    heroSubDesc:
      "आपातकालीन QR उन विवरणों को एक शांत, पढ़ने योग्य प्रोफ़ाइल में संग्रहीत करता है जो मायने रखते हैं। एक स्कैन से रक्त समूह, आपातकालीन संपर्क, चिकित्सा नोट्स और प्रतिक्रिया निर्देश तुरंत सामने आ जाते हैं।",
    howItWorks: "यह कैसे काम करता है",
    seePreview: "पूर्वावलोकन देखें",
    readyTitle: "दो मिनट से भी कम समय में तैयार।",
    getStarted: "शुरू करें",

    stat1Val: "10 सेकंड",
    stat1Lbl: "कार्रवाई के लिए स्कैन करें",
    stat2Val: "1 पृष्ठ",
    stat2Lbl: "स्पष्ट आपातकालीन दृश्य",
    stat3Val: "0 ऐप",
    stat3Lbl: "केवल कैमरा एक्सेस",

    previewBadge1: "लाइव आपातकालीन कार्ड",
    previewTitle1: "लॉक-स्क्रीन तैयार",
    mockupProfile: "आपातकालीन प्रोफ़ाइल",
    mockupPrimaryContact: "प्राथमिक संपर्क",
    mockupAllergy: "एलर्जी",
    mockupNone: "कोई नहीं",
    mockupMedication: "दवा",
    readableBadge: "एक नज़र में पढ़ने योग्य",
    responderFirst: "प्रतिक्रियाकर्ता सबसे पहले",

    feature1Title: "एक बार स्कैन करें",
    feature1Copy:
      "प्रतिसादकर्ता बिना किसी ऐप इंस्टॉल या लॉगिन के सीधे आपातकालीन प्रोफ़ाइल पर आते हैं।",
    feature2Title: "जल्दी कॉल करें",
    feature2Copy:
      "प्राथमिक संपर्क और बैकअप नंबर तत्काल कार्रवाई के लिए शीर्ष पर दिखाई देते हैं।",
    feature3Title: "चिकित्सा पहले",
    feature3Copy:
      "रक्त समूह, एलर्जी, दवाएं और नोट वास्तविक आपातकालीन उपयोग के लिए प्राथमिकता दी जाती हैं।",

    fastSetupBadge: "त्वरित सेटअप",
    buildPassTitle: "दो मिनट से भी कम समय में पास बनाएं।",
    buildPassDesc:
      "एक बार प्रोफ़ाइल बनाएं, QR डाउनलोड करें और इसे अपने फोन, वॉलेट कार्ड या लॉक स्क्रीन पर रखें। सार्वजनिक पृष्ठ केवल आपातकालीन-सुरक्षित विवरण दिखाता है।",

    step1Title: "अपनी प्रोफ़ाइल भरें",
    step1Desc: "रक्त समूह, एलर्जी, दवाएं और आपातकालीन संपर्क। और कुछ नहीं।",
    step2Title: "अपना QR प्राप्त करें",
    step2Desc:
      "एक साफ, उच्च-कंट्रास्ट QR कोड। इसे अपनी लॉक स्क्रीन या अपने आईडी कार्ड पर रखें।",
    step3Title: "कोई भी स्कैन कर सकता है",
    step3Desc:
      "किसी ऐप की आवश्यकता नहीं है। किसी भी फोन का कैमरा एक नज़र में आपके महत्वपूर्ण डेटा को खोल देता है।",

    // Create Profile
    createTitle: "अपनी प्रोफ़ाइल बनाएं",
    createDesc:
      "अपने चिकित्सा विवरण भरें। आपातकालीन स्थिति में यह डेटा QR के माध्यम से तुरंत सुलभ होगा।",
    personalInfo: "व्यक्तिगत जानकारी",
    fullName: "पूरा नाम",
    bloodGroup: "रक्त समूह",
    selectBloodGroup: "रक्त समूह चुनें",
    dob: "जन्म तिथि",
    gender: "लिंग",
    selectGender: "लिंग चुनें",

    createHint1:
      "केवल आपातकालीन-सुरक्षित डेटा सार्वजनिक रूप से दिखाया जाता है।",
    createHint2: "प्राथमिक संपर्क और रक्त समूह पहले दृश्यमान रहते हैं।",
    createHint3: "प्रोफ़ाइल मोबाइल लॉक-स्क्रीन एक्सेस के लिए अनुकूलित है।",

    emergencyContacts: "आपातकालीन संपर्क",
    yourPhone: "आपका फोन",
    contactName: "संपर्क का नाम",
    emergencyPhone: "आपातकालीन फोन",
    medicalHistory: "चिकित्सा इतिहास",
    chronicConditions: "पुरानी बीमारियां",
    knownAllergies: "ज्ञात एलर्जी",
    medications: "दवाएं",
    responderNotes: "प्रतिसाद देने वालों के लिए नोट",
    generateQr: "QR जेनरेट करें",
    disclaimer:
      "इस QR को जेनरेट करके, आप आपातकालीन पुनर्प्राप्ति के लिए इस डेटा के सार्वजनिक प्रदर्शन को अधिकृत करते हैं।",
    working: "काम कर रहा है...",

    // Success
    profileActive: "प्रोफ़ाइल सक्रिय।",
    profileLiveBadge: "प्रोफ़ाइल लाइव",
    passLive:
      "आपका आपातकालीन पास लाइव है। यह QR कोड सीधे आपके चिकित्सा डेटा तक ले जाता है।",
    saveCard: "कार्ड सहेजें",
    saveDesc:
      "डाउनलोड बटन पर क्लिक करें या इसे अपने डिवाइस में सहेजने के लिए QR को देर तक दबाएं।",
    lockScreen: "लॉक स्क्रीन",
    lockDesc:
      "प्रतिसाद देने वालों द्वारा त्वरित पहुंच के लिए इसे अपने लॉक स्क्रीन वॉलपेपर के रूप में सेट करें।",
    downloadQr: "QR डाउनलोड करें",
    viewProfile: "प्रोफ़ाइल देखें",
    emergencyPass: "आपातकालीन पास",
    readyToShare: "साझा करने के लिए तैयार",
    bestUse: "सर्वोत्तम उपयोग",
    bestUseDesc:
      "इसे अपनी लॉक स्क्रीन, वॉलेट कार्ड या मेडिकल आईडी पर रखें ताकि स्कैनर तुरंत आपातकालीन पृष्ठ तक पहुंच सके।",
    backToDashboard: "डैशबोर्ड पर वापस जाएं",

    // Emergency Profile
    emergencyProfile: "आपातकालीन प्रोफ़ाइल",
    active: "सक्रिय",
    identity: "पहचान",
    medicalStatus: "चिकित्सा स्थिति",
    verified: "सत्यापित",
    medicalDetails: "चिकित्सा विवरण",
    condition: "स्थिति / निदान",
    allergies: "ज्ञात एलर्जी",
    instructions: "प्रतिसाद देने वालों के लिए निर्देश",
    primaryKin: "प्राथमिक परिजन",
    callContact: "कॉल करें",
    backupConnection: "बैकअप कनेक्शन",
    patient: "रोगी",
    verifiedLog: "सत्यापित लॉग",
    clinicalDisclaimer:
      "यह प्रोफ़ाइल रोगी द्वारा सत्यापित है। चिकित्सा आपात स्थिति में, पेशेवर प्रोटोकॉल का पालन करें।",
    returnHome: "घर लौटें",
    accessError: "एक्सेस त्रुटि",
    notFound: "प्रोफ़ाइल नहीं मिली।",
    failedLoad: "प्रोफ़ाइल लोड करने में विफल।",
    retrieving: "प्रोफ़ाइल प्राप्त की जा रही है...",
    notSpecified: "निर्दिष्ट नहीं",
    noneDisclosed: "कोई खुलासा नहीं",

    yourNumber: "आपका नंबर",
    callEmergencyContact: "आपातकालीन संपर्क को कॉल करें",
    callYourNumber: "अपने नंबर पर कॉल करें",
    age: "आयु",
    bloodGroupLabel: "रक्त समूह",
    scannerFirstView: "स्केनर-प्रथम दृश्य",
    emergencyDetailsArranged:
      "आपातकालीन विवरण तत्काल कार्रवाई के लिए व्यवस्थित हैं: पहले संपर्क को कॉल करें, फिर रक्त समूह और चिकित्सा अलर्ट सत्यापित करें।",
    emergencyContactLabel: "आपातकालीन संपर्क",
    profileRef: "प्रोफ़ाइल संदर्भ",
    quickIdentity: "त्वरित पहचान",
    patientFacts: "यूज़र विवरण",
    recordId: "रिकॉर्ड आईडी",
    status: "स्थिति",
    activeAndVerified: "सक्रिय और सत्यापित",

    // Edit Profile
    editTitle: "अपनी प्रोफ़ाइल संपादित करें",
    editDesc:
      "अपने चिकित्सा विवरण अपडेट करें। परिवर्तन आपके आपातकालीन QR पर तुरंत दिखाई देंगे।",
    updateProfile: "प्रोफ़ाइल अपडेट करें",
    updating: "अपडेट हो रहा है...",
    profileUpdated: "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!",
    cancelEdit: "रद्द करें",
    editProfile: "प्रोफ़ाइल संपादित करें",
  },
  gu: {
    // Header
    createProfile: "પ્રોફાઇલ બનાવો",
    home: "હોમ",

    // Home
    heroTitle: "નિર્ણાયક વિગતો. તમે તેને સમજાવી શકો તે પહેલાં.",
    heroCta: "તમારી પ્રોફાઇલ બનાવો",
    heroBadge: "ઇમરજન્સી એક્સેસ કાર્ડ",
    heroSubDesc:
      "ઇમરજન્સી QR એ વિગતોને શાંત, વાંચી શકાય તેવી પ્રોફાઇલમાં સંગ્રહિત કરે છે જે મહત્વપૂર્ણ છે. એક સ્કેન બ્લડ ગ્રુપ, કટોકટી સંપર્ક, તબીબી નોંધો અને પ્રતિભાવ સૂચનાઓ તરત જ છતી કરે છે.",
    howItWorks: "તે કેવી રીતે કામ કરે છે",
    seePreview: "પૂર્વાવલોકન જુઓ",
    readyTitle: "બે મિનિટથી ઓછા સમયમાં તૈયાર.",
    getStarted: "શરૂ કરો",

    stat1Val: "10 સેકન્ડ",
    stat1Lbl: "ક્રિયા માટે સ્કેન કરો",
    stat2Val: "1 પૃષ્ઠ",
    stat2Lbl: "સ્પષ્ટ કટોકટી દૃશ્ય",
    stat3Val: "0 ઍપ",
    stat3Lbl: "માત્ર કેમેરા ઍક્સેસ",

    previewBadge1: "લાઇવ ઇમરજન્સી કાર્ડ",
    previewTitle1: "લોક-સ્ક્રીન તૈયાર",
    mockupProfile: "કટોકટી પ્રોફાઇલ",
    mockupPrimaryContact: "પ્રાથમિક સંપર્ક",
    mockupAllergy: "એલર્જી",
    mockupNone: "કોઈ નહિ",
    mockupMedication: "દવા",
    readableBadge: "એક નજરમાં વાંચી શકાય તેવું",
    responderFirst: "પ્રતિભાવ આપનાર પ્રથમ",

    feature1Title: "એકવાર સ્કેન કરો",
    feature1Copy:
      "રિસ્પોન્ડર્સ કોઈપણ એપ્લિકેશન ઇન્સ્ટોલ અથવા લોગિન વિના સીધા જ કટોકટી પ્રોફાઇલ પર પહોંચે છે.",
    feature2Title: "ઝડપથી કૉલ કરો",
    feature2Copy:
      "પ્રાથમિક સંપર્ક અને બેકઅપ નંબર તાત્કાલિક પગલાં માટે ટોચ પર દૃશ્યમાન છે.",
    feature3Title: "મેડિકલ પ્રથમ",
    feature3Copy:
      "બ્લડ ગ્રુપ, એલર્જી, દવાઓ અને નોંધોને વાસ્તવિક કટોકટીના ઉપયોગ માટે પ્રાથમિકતા આપવામાં આવે છે.",

    fastSetupBadge: "ઝડપી સેટઅપ",
    buildPassTitle: "બે મિનિટથી ઓછા સમયમાં પાસ બનાવો.",
    buildPassDesc:
      "એકવાર પ્રોફાઇલ બનાવો, QR ડાઉનલોડ કરો અને તેને તમારા ફોન, વૉલેટ કાર્ડ અથવા લૉક સ્ક્રીન પર રાખો. સાર્વજનિક પૃષ્ઠ ફક્ત કટોકટી-સુરક્ષિત વિગતો બતાવે છે.",

    step1Title: "તમારી પ્રોફાઇલ ભરો",
    step1Desc: "બ્લડ ગ્રુપ, એલર્જી, દવાઓ અને કટોકટી સંપર્કો. બીજું કંઈ નહીં.",
    step2Title: "તમારો QR મેળવો",
    step2Desc:
      "એક સ્વચ્છ, ઉચ્ચ-કોન્ટ્રાસ્ટ QR કોડ. તેને તમારી લોક સ્ક્રીન અથવા તમારા આઈડી કાર્ડ પર મૂકો.",
    step3Title: "કોઈપણ સ્કેન કરી શકે છે",
    step3Desc:
      "કોઈ એપ્લિકેશનની જરૂર નથી. કોઈપણ ફોન કેમેરા એક નજરમાં તમારો નિર્ણાયક ડેટા ખોલે છે.",

    // Create Profile
    createTitle: "તમારી પ્રોફાઇલ બનાવો",
    createDesc:
      "તમારી તબીબી વિગતો ભરો. કટોકટીના કિસ્સામાં આ ડેટા QR દ્વારા તરત જ સુલભ થશે.",
    personalInfo: "વ્યક્તિગત માહિતી",
    fullName: "પૂરું નામ",
    bloodGroup: "બ્લડ ગ્રુપ",
    selectBloodGroup: "બ્લડ ગ્રુપ પસંદ કરો",
    dob: "જન્મ તારીખ",
    gender: "જાતિ",
    selectGender: "જાતિ પસંદ કરો",

    createHint1: "ફક્ત કટોકટી-સુરક્ષિત ડેટા જાહેરમાં દર્શાવવામાં આવે છે.",
    createHint2: "પ્રાથમિક સંપર્ક અને બ્લડ ગ્રુપ પ્રથમ દૃશ્યમાન રહે છે.",
    createHint3: "પ્રોફાઇલ મોબાઇલ લોક-સ્ક્રીન ઍક્સેસ માટે ઑપ્ટિમાઇઝ કરેલ છે.",

    emergencyContacts: "કટોકટી સંપર્કો",
    yourPhone: "તમારો ફોન",
    contactName: "સંપર્ક નામ",
    emergencyPhone: "કટોકટી ફોન",
    medicalHistory: "તબીબી ઇતિહાસ",
    chronicConditions: "ક્રોનિક પરિસ્થિતિઓ",
    knownAllergies: "જાણીતી એલર્જી",
    medications: "દવાઓ",
    responderNotes: "પ્રતિસાદ આપનારાઓ માટે નોંધો",
    generateQr: "QR બનાવો",
    disclaimer:
      "આ QR જનરેટ કરીને, તમે કટોકટી પુનઃપ્રાપ્તિ માટે આ ડેટાના સાર્વજનિક પ્રદર્શનને અધિકૃત કરો છો.",
    working: "કામ કરી રહ્યા છીએ...",

    // Success
    profileActive: "પ્રોફાઇલ સક્રિય.",
    profileLiveBadge: "પ્રોફાઇલ લાઇવ",
    passLive:
      "તમારો ઇમરજન્સી પાસ લાઇવ છે. આ QR કોડ સીધો તમારા તબીબી ડેટા તરફ દોરી જાય છે.",
    saveCard: "કાર્ડ સાચવો",
    saveDesc:
      "તમારા ઉપકરણમાં સાચવવા માટે ડાઉનલોડ બટન પર ક્લિક કરો અથવા QR ને લાંબા સમય સુધી દબાવો.",
    lockScreen: "લોક સ્ક્રીન",
    lockDesc:
      "પ્રતિસાદ આપનારાઓ દ્વારા ઝડપથી પહોંચી શકાય તે માટે આને તમારા લોક સ્ક્રીન વૉલપેપર તરીકે સેટ કરો.",
    downloadQr: "QR ડાઉનલોડ કરો",
    viewProfile: "પ્રોફાઇલ જુઓ",
    emergencyPass: "ઇમરજન્સી પાસ",
    readyToShare: "શેર કરવા માટે તૈયાર",
    bestUse: "શ્રેષ્ઠ ઉપયોગ",
    bestUseDesc:
      "આને તમારી લોક સ્ક્રીન, વૉલેટ કાર્ડ અથવા મેડિકલ આઈડી પર રાખો જેથી સ્કેનર તરત જ કટોકટી પૃષ્ઠ પર પહોંચી શકે.",
    backToDashboard: "ડેશબોર્ડ પર પાછા જાઓ",

    // Emergency Profile
    emergencyProfile: "કટોકટી પ્રોફાઇલ",
    active: "સક્રિય",
    identity: "ઓળખ",
    medicalStatus: "તબીબી સ્થિતિ",
    verified: "ચકાસાયેલ",
    medicalDetails: "તબીબી વિગતો",
    condition: "સ્થિતિ / નિદાન",
    allergies: "જાણીતી એલર્જી",
    instructions: "પ્રતિસાદ આપનારાઓ માટે સૂચનાઓ",
    primaryKin: "પ્રાથમિક સબંધી",
    callContact: "સંપર્ક કરો",
    backupConnection: "બેકઅપ કનેક્શન",
    patient: "દર્દી",
    verifiedLog: "ચકાસાયેલ લોગ",
    clinicalDisclaimer:
      "આ પ્રોફાઇલ દર્દી દ્વારા ચકાસવામાં આવી છે. તબીબી કટોકટીમાં, વ્યાવસાયિક પ્રોટોકોલનું પાલન કરો.",
    returnHome: "ઘરે પાછા ફરો",
    accessError: "એક્સેસ ભૂલ",
    notFound: "પ્રોફાઇલ મળી નથી.",
    failedLoad: "પ્રોફાઇલ લોડ કરવામાં નિષ્ફળ.",
    retrieving: "પ્રોફાઇલ મેળવી રહ્યાં છીએ...",
    notSpecified: "ઉલ્લેખ નથી",
    noneDisclosed: "કઈ જણાવેલ નથી",

    yourNumber: "તમારો નંબર",
    callEmergencyContact: "કટોકટી સંપર્કને કૉલ કરો",
    callYourNumber: "તમારા નંબર પર કૉલ કરો",
    age: "ઉંમર",
    bloodGroupLabel: "બ્લડ ગ્રુપ",
    scannerFirstView: "સ્કેનર-પ્રથમ દૃશ્ય",
    emergencyDetailsArranged:
      "કટોકટીની વિગતો તાત્કાલિક પગલાં માટે ગોઠવવામાં આવી છે: પહેલા સંપર્કને કૉલ કરો, પછી બ્લડ ગ્રુપ અને તબીબી ચેતવણીઓ ચકાસો.",
    emergencyContactLabel: "કટોકટી સંપર્ક",
    profileRef: "પ્રોફાઇલ સંદર્ભ",
    quickIdentity: "ઝડપી ઓળખ",
    patientFacts: "યુઝર વિગતો",
    recordId: "રેકોર્ડ આઈડી",
    status: "સ્થિતિ",
    activeAndVerified: "સક્રિય અને ચકાસાયેલ",

    // Edit Profile
    editTitle: "તમારી પ્રોફાઇલ સંપાદિત કરો",
    editDesc:
      "તમારી તબીબી વિગતો અપડેટ કરો. ફેરફારો તમારા ઇમરજન્સી QR પર તરત જ દેખાશે.",
    updateProfile: "પ્રોફાઇલ અપડેટ કરો",
    updating: "અપડેટ થઈ રહ્યું છે...",
    profileUpdated: "પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થઈ!",
    cancelEdit: "રદ કરો",
    editProfile: "પ્રોફાઇલ સંપાદિત કરો",
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
