import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    en: {
        // Header
        createProfile: 'Create Profile',
        home: 'Home',
        // Home
        heroTitle: 'Critical details. Before you can explain them.',
        heroCta: 'Create your profile',
        howItWorks: 'How it works',
        readyTitle: 'Ready in under two minutes.',
        getStarted: 'Get started',
        step1Title: 'Fill your profile',
        step1Desc: 'Blood group, allergies, medications, and emergency contacts. Nothing else.',
        step2Title: 'Get your QR',
        step2Desc: 'A clean, high-contrast QR code. Put it on your lock screen or your ID card.',
        step3Title: 'Anyone can scan',
        step3Desc: 'No app needed. Any phone camera opens your critical data in one glance.',
        // Create Profile
        createTitle: 'Create your profile',
        createDesc: 'Fill in your medical details. This data will be instantly accessible via QR in case of an emergency.',
        personalInfo: 'Personal Info',
        fullName: 'Full name',
        bloodGroup: 'Blood group',
        dob: 'Date of birth',
        gender: 'Gender',
        emergencyContacts: 'Emergency Contacts',
        yourPhone: 'Your phone',
        contactName: 'Contact name',
        emergencyPhone: 'Emergency phone',
        medicalHistory: 'Medical History',
        chronicConditions: 'Chronic conditions',
        knownAllergies: 'Known allergies',
        medications: 'Medications',
        responderNotes: 'Responders notes',
        generateQr: 'Generate QR',
        disclaimer: 'By generating this QR, you authorize the public display of this data for emergency retrieval.',
        working: 'Working...',
        // Success
        profileActive: 'Profile Active.',
        passLive: 'Your emergency pass is live. This QR code leads directly to your medical data.',
        saveCard: 'Save the card',
        saveDesc: 'Click the download button or long-press the QR to save it to your device.',
        lockScreen: 'Lock screen',
        lockDesc: 'Set this as your lock screen wallpaper for instant reachability by responders.',
        downloadQr: 'Download QR',
        viewProfile: 'View Profile',
        backToDashboard: 'Back to dashboard',
        // Emergency Profile
        emergencyProfile: 'Emergency Profile',
        active: 'ACTIVE',
        identity: 'Identity',
        medicalStatus: 'Medical Status',
        verified: 'Verified',
        medicalDetails: 'Medical Details',
        condition: 'Condition / Diagnoses',
        allergies: 'Known Allergies',
        instructions: 'Instructions for responders',
        primaryKin: 'Primary Kin',
        callContact: 'Call contact',
        backupConnection: 'Backup connection',
        patient: 'Patient',
        verifiedLog: 'Verified Log',
        clinicalDisclaimer: 'This profile is verified by the patient. In a medical emergency, follow professional protocols.',
        returnHome: 'Return home',
        accessError: 'Access Error',
        notFound: 'Profile not found.',
        failedLoad: 'Failed to load profile.',
        retrieving: 'Retrieving secure profile...',
        notSpecified: 'Not specified',
        noneDisclosed: 'None disclosed'
    },
    hi: {
        // Header
        createProfile: 'प्रोफ़ाइल बनाएं',
        home: 'होम',
        // Home
        heroTitle: 'महत्वपूर्ण विवरण। इससे पहले कि आप उन्हें समझा सकें।',
        heroCta: 'अपनी प्रोफ़ाइल बनाएं',
        howItWorks: 'यह कैसे काम करता है',
        readyTitle: 'दो मिनट से भी कम समय में तैयार।',
        getStarted: 'शुरू करें',
        step1Title: 'अपनी प्रोफ़ाइल भरें',
        step1Desc: 'रक्त समूह, एलर्जी, दवाएं और आपातकालीन संपर्क। और कुछ नहीं।',
        step2Title: 'अपना QR प्राप्त करें',
        step2Desc: 'एक साफ, उच्च-कंट्रास्ट QR कोड। इसे अपनी लॉक स्क्रीन या अपने आईडी कार्ड पर रखें।',
        step3Title: 'कोई भी स्कैन कर सकता है',
        step3Desc: 'किसी ऐप की आवश्यकता नहीं है। किसी भी फोन का कैमरा एक नज़र में आपके महत्वपूर्ण डेटा को खोल देता है।',
        // Create Profile
        createTitle: 'अपनी प्रोफ़ाइल बनाएं',
        createDesc: 'अपने चिकित्सा विवरण भरें। आपातकालीन स्थिति में यह डेटा QR के माध्यम से तुरंत सुलभ होगा।',
        personalInfo: 'व्यक्तिगत जानकारी',
        fullName: 'पूरा नाम',
        bloodGroup: 'रक्त समूह',
        dob: 'जन्म तिथि',
        gender: 'लिंग',
        emergencyContacts: 'आपातकालीन संपर्क',
        yourPhone: 'आपका फोन',
        contactName: 'संपर्क का नाम',
        emergencyPhone: 'आपातकालीन फोन',
        medicalHistory: 'चिकित्सा इतिहास',
        chronicConditions: 'पुरानी बीमारियां',
        knownAllergies: 'ज्ञात एलर्जी',
        medications: 'दवाएं',
        responderNotes: 'प्रतिसाद देने वालों के लिए नोट',
        generateQr: 'QR जेनरेट करें',
        disclaimer: 'इस QR को जेनरेट करके, आप आपातकालीन पुनर्प्राप्ति के लिए इस डेटा के सार्वजनिक प्रदर्शन को अधिकृत करते हैं।',
        working: 'काम कर रहा है...',
        // Success
        profileActive: 'प्रोफ़ाइल सक्रिय।',
        passLive: 'आपका आपातकालीन पास लाइव है। यह QR कोड सीधे आपके चिकित्सा डेटा तक ले जाता है।',
        saveCard: 'कार्ड सहेजें',
        saveDesc: 'डाउनलोड बटन पर क्लिक करें या इसे अपने डिवाइस में सहेजने के लिए QR को देर तक दबाएं।',
        lockScreen: 'लॉक स्क्रीन',
        lockDesc: 'प्रतिसाद देने वालों द्वारा त्वरित पहुंच के लिए इसे अपने लॉक स्क्रीन वॉलपेपर के रूप में सेट करें।',
        downloadQr: 'QR डाउनलोड करें',
        viewProfile: 'प्रोफ़ाइल देखें',
        backToDashboard: 'डैशबोर्ड पर वापस जाएं',
        // Emergency Profile
        emergencyProfile: 'आपातकालीन प्रोफ़ाइल',
        active: 'सक्रिय',
        identity: 'पहचान',
        medicalStatus: 'चिकित्सा स्थिति',
        verified: 'सत्यापित',
        medicalDetails: 'चिकित्सा विवरण',
        condition: 'स्थिति / निदान',
        allergies: 'ज्ञात एलर्जी',
        instructions: 'प्रतिसाद देने वालों के लिए निर्देश',
        primaryKin: 'प्राथमिक परिजन',
        callContact: 'कॉल करें',
        backupConnection: 'बैकअप कनेक्शन',
        patient: 'रोगी',
        verifiedLog: 'सत्यापित लॉग',
        clinicalDisclaimer: 'यह प्रोफ़ाइल रोगी द्वारा सत्यापित है। चिकित्सा आपात स्थिति में, पेशेवर प्रोटोकॉल का पालन करें।',
        returnHome: 'घर लौटें',
        accessError: 'एक्सेस त्रुटि',
        notFound: 'प्रोफ़ाइल नहीं मिली।',
        failedLoad: 'प्रोफ़ाइल लोड करने में विफल।',
        retrieving: 'सुरक्षित प्रोफ़ाइल प्राप्त की जा रही है...',
        notSpecified: 'निर्दिष्ट नहीं',
        noneDisclosed: 'कोई खुलासा नहीं'
    },
    gu: {
        // Header
        createProfile: 'પ્રોફાઇલ બનાવો',
        home: 'હોમ',
        // Home
        heroTitle: 'નિર્ણાયક વિગતો. તમે તેને સમજાવી શકો તે પહેલાં.',
        heroCta: 'તમારી પ્રોફાઇલ બનાવો',
        howItWorks: 'તે કેવી રીતે કામ કરે છે',
        readyTitle: 'બે મિનિટથી ઓછા સમયમાં તૈયાર.',
        getStarted: 'શરૂ કરો',
        step1Title: 'તમારી પ્રોફાઇલ ભરો',
        step1Desc: 'બ્લડ ગ્રુપ, એલર્જી, દવાઓ અને કટોકટી સંપર્કો. બીજું કંઈ નહીં.',
        step2Title: 'તમારો QR મેળવો',
        step2Desc: 'એક સ્વચ્છ, ઉચ્ચ-કોન્ટ્રાસ્ટ QR કોડ. તેને તમારી લોક સ્ક્રીન અથવા તમારા આઈડી કાર્ડ પર મૂકો.',
        step3Title: 'કોઈપણ સ્કેન કરી શકે છે',
        step3Desc: 'કોઈ એપ્લિકેશનની જરૂર નથી. કોઈપણ ફોન કેમેરા એક નજરમાં તમારો નિર્ણાયક ડેટા ખોલે છે.',
        // Create Profile
        createTitle: 'તમારી પ્રોફાઇલ બનાવો',
        createDesc: 'તમારી તબીબી વિગતો ભરો. કટોકટીના કિસ્સામાં આ ડેટા QR દ્વારા તરત જ સુલભ થશે.',
        personalInfo: 'વ્યક્તિગત માહિતી',
        fullName: 'પૂરું નામ',
        bloodGroup: 'બ્લડ ગ્રુપ',
        dob: 'જન્મ તારીખ',
        gender: 'જાતિ',
        emergencyContacts: 'કટોકટી સંપર્કો',
        yourPhone: 'તમારો ફોન',
        contactName: 'સંપર્ક નામ',
        emergencyPhone: 'કટોકટી ફોન',
        medicalHistory: 'તબીબી ઇતિહાસ',
        chronicConditions: 'ક્રોનિક પરિસ્થિતિઓ',
        knownAllergies: 'જાણીતી એલર્જી',
        medications: 'દવાઓ',
        responderNotes: 'પ્રતિસાદ આપનારાઓ માટે નોંધો',
        generateQr: 'QR બનાવો',
        disclaimer: 'આ QR જનરેટ કરીને, તમે કટોકટી પુનઃપ્રાપ્તિ માટે આ ડેટાના સાર્વજનિક પ્રદર્શનને અધિકૃત કરો છો.',
        working: 'કામ કરી રહ્યા છીએ...',
        // Success
        profileActive: 'પ્રોફાઇલ સક્રિય.',
        passLive: 'તમારો ઇમરજન્સી પાસ લાઇવ છે. આ QR કોડ સીધો તમારા તબીબી ડેટા તરફ દોરી જાય છે.',
        saveCard: 'કાર્ડ સાચવો',
        saveDesc: 'તમારા ઉપકરણમાં સાચવવા માટે ડાઉનલોડ બટન પર ક્લિક કરો અથવા QR ને લાંબા સમય સુધી દબાવો.',
        lockScreen: 'લોક સ્ક્રીન',
        lockDesc: 'પ્રતિસાદ આપનારાઓ દ્વારા ઝડપથી પહોંચી શકાય તે માટે આને તમારા લોક સ્ક્રીન વૉલપેપર તરીકે સેટ કરો.',
        downloadQr: 'QR ડાઉનલોડ કરો',
        viewProfile: 'પ્રોફાઇલ જુઓ',
        backToDashboard: 'ડેશબોર્ડ પર પાછા જાઓ',
        // Emergency Profile
        emergencyProfile: 'કટોકટી પ્રોફાઇલ',
        active: 'સક્રિય',
        identity: 'ઓળખ',
        medicalStatus: 'તબીબી સ્થિતિ',
        verified: 'ચકાસાયેલ',
        medicalDetails: 'તબીબી વિગતો',
        condition: 'સ્થિતિ / નિદાન',
        allergies: 'જાણીતી એલર્જી',
        instructions: 'પ્રતિસાદ આપનારાઓ માટે સૂચનાઓ',
        primaryKin: 'પ્રાથમિક સબંધી',
        callContact: 'સંપર્ક કરો',
        backupConnection: 'બેકઅપ કનેક્શન',
        patient: 'દર્દી',
        verifiedLog: 'ચકાસાયેલ લોગ',
        clinicalDisclaimer: 'આ પ્રોફાઇલ દર્દી દ્વારા ચકાસવામાં આવી છે. તબીબી કટોકટીમાં, વ્યાવસાયિક પ્રોટોકોલનું પાલન કરો.',
        returnHome: 'ઘરે પાછા ફરો',
        accessError: 'એક્સેસ ભૂલ',
        notFound: 'પ્રોફાઇલ મળી નથી.',
        failedLoad: 'પ્રોફાઇલ લોડ કરવામાં નિષ્ફળ.',
        retrieving: 'સુરક્ષિત પ્રોફાઇલ મેળવી રહ્યાં છીએ...',
        notSpecified: 'ઉલ્લેખ નથી',
        noneDisclosed: 'કઈ જણાવેલ નથી'
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

    useEffect(() => {
        localStorage.setItem('lang', lang);
    }, [lang]);

    const t = translations[lang];

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
