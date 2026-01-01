/**
 * VİSİ AI - FINAL TEST (Anxiety eşik = 1)
 */

const ANXIETY_KEYWORDS = [
    'stres', 'stresli', 'stresliyim', 'kaygi', 'kaygili', 'panik', 'korku', 'korkuyorum', 'endise', 'endiseli',
    'kilitlen', 'kilitlendim', 'kilitleniyorum', 'donakal', 'dondum', 'takildim',
    'odaklanamiyorum', 'odaklanamama', 'dikkat', 'konsantre', 'daginik', 'dagildim',
    'yapamiyorum', 'basaramiyorum', 'cok zor', 'imkansiz', 'cikmaz', 'umutsuz',
    'cozemiyorum', 'anlamiyorum', 'kafam karisik', 'beynim durdu', 'aklim almiyor',
    'kafam dolu', 'kafam cok dolu', 'dolu',
    'sinir', 'sinirli', 'gergin', 'huzursuz', 'rahatsiz', 'kotu hissediyorum',
    'kendimi kotu', 'cok kotu', 'berbat', 'rezalet',
    'yetersiz', 'yetersizim', 'basarisiz', 'beceriksiz', 'aptal',
    'hicbir sey', 'hicbir sey yapamiyorum', 'calisamiyorum', 'okuyamiyorum',
    'ders yapamiyorum', 'kitap acamiyorum'
];

const MOTIVATION_KEYWORDS = [
    'istemiyorum', 'yapmak istemiyorum', 'calismak istemiyorum', 'icimden gelmiyor',
    'icinden gelmiyor', 'hic icimden gelmiyor',
    'ertele', 'erteliyorum', 'yarin', 'sonra', 'daha sonra', 'biraz sonra',
    'birak', 'birakmak', 'birakacagim', 'vazgec', 'vazgectim', 'yapamayacagim',
    'bosver', 'bos ver', 'umursamiyorum', 'ne anlami var',
    'motivasyon', 'motivasyonum yok', 'isteksiz', 'tembel', 'tembellik',
    'baslamak', 'baslayamiyorum', 'nasil baslarim', 'nereden baslamaliyim', 'baslangic',
    'disiplin', 'duzen', 'duzensiz', 'daginik', 'plansiz',
    'devam edemiyorum', 'surduremiyorum', 'hep birakiyorum',
    'basliyorum ama', 'yarida', 'yarim birakiyorum',
    'yoruldum', 'cok yoruldum', 'bitkinim', 'tukendim',
    'calismiyorum', 'hic calismiyorum', 'tembellik yapiyorum'
];

const CAREER_KEYWORDS = [
    'ne olmak istiyorum', 'hangi meslek', 'kariyer', 'gelecek', 'ileride',
    'yetenek', 'yeteneklerim', 'yatkinlik', 'yatkin', 'ilgi', 'ilgilerim', 'guclu yon',
    'neye yatkinim', 'yatkinim',
    'kendimi tanimak', 'kim oldugum', 'ne istedigim', 'neye uygun',
    'gelisim yonu', 'hangi alan', 'ne yapmaliyim', 'yonlendir',
    'ne yapacagimi bilmiyorum', 'ne yapacagimi',
    'bolum', 'bolum secimi', 'universite secimi', 'alan secimi', 'sayisal mi sozel mi',
    'sayisalci miyim', 'sozelci mi', 'sayisalci', 'sozelci',
    'neyi severim', 'neye yatkinim', 'hangi alanlarda', 'iyi oldugum', 'guclu yanim',
    'daha iyiyim', 'daha iyi oldugum'
];

const ACADEMIC_KEYWORDS = [
    'soru', 'problem', 'coz', 'cozum', 'cozumle', 'nasil cozerim',
    'konu', 'ders', 'matematik', 'fizik', 'kimya', 'biyoloji', 'tarih', 'cografya',
    'edebiyat', 'turkce', 'ingilizce', 'geometri', 'paragraf', 'dil bilgisi',
    'program', 'plan', 'calisma plani', 'calisma programi', 'gunluk plan', 'haftalik plan',
    'deneme', 'net', 'hedef', 'sinav', 'test', 'puan', 'siralama',
    'soru coz', 'konu calis', 'tekrar', 'ozet', 'not', 'formul', 'kural',
    'nasil calismaliyim', 'ne calisayim', 'bugun ne yapayim', 'bu hafta'
];

const CRITICAL_RISK_KEYWORDS = [
    'hayatim bitti', 'hicbir anlami yok', 'anlam yok', 'neden yasiyorum',
    'olmek', 'olsem', 'intihar', 'kendime zarar', 'canima kiy',
    'hicbir cikis yok', 'kurtulus yok', 'dayanamiyorum', 'tahammul edemiyorum',
    'herkes bensiz daha iyi', 'yuk oluyorum', 'degersiz', 'ise yaramaz'
];

function normalizeText(text) {
    return text.toLowerCase().replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').replace(/İ/g, 'i');
}

function performTriage(message) {
    const lowerMessage = normalizeText(message);

    const hasCriticalRisk = CRITICAL_RISK_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
    if (hasCriticalRisk) {
        return { selectedMod: 'safe-support', reason: 'Critical', scores: { anxiety: 0, motivation: 0, career: 0, academic: 0 } };
    }

    const anxietyScore = ANXIETY_KEYWORDS.filter(k => lowerMessage.includes(k)).length;
    const motivationScore = MOTIVATION_KEYWORDS.filter(k => lowerMessage.includes(k)).length;
    const careerScore = CAREER_KEYWORDS.filter(k => lowerMessage.includes(k)).length;
    const academicScore = ACADEMIC_KEYWORDS.filter(k => lowerMessage.includes(k)).length;

    const scores = { anxiety: anxietyScore, motivation: motivationScore, career: careerScore, academic: academicScore };

    // Öncelik 1: Odak & Kaygı (anxietyScore >= 1 - TEK STRES İFADESİ BİLE YETERLİ)
    if (anxietyScore >= 1) {
        return { selectedMod: 'focus-anxiety', reason: 'Anxiety', scores };
    }

    // Öncelik 2: Motivasyon (eşik 1)
    if (motivationScore >= 1) {
        return { selectedMod: 'motivation-discipline', reason: 'Motivation', scores };
    }

    // Öncelik 3: Kariyer
    if (careerScore >= 1) {
        return { selectedMod: 'career-direction', reason: 'Career', scores };
    }

    return { selectedMod: 'academic', reason: 'Academic', scores };
}

const SCENARIOS = [
    { id: 1, cat: 'A.Akademik', msg: "Bugun ne calismaliyim?", exp: 'academic' },
    { id: 2, cat: 'A.Akademik', msg: "Matematikte bu konuyu bitiremiyorum", exp: 'academic' },
    { id: 3, cat: 'A.Akademik', msg: "Deneme netlerim dustu", exp: 'academic' },
    { id: 4, cat: 'A.Akademik', msg: "Bu hafta icin program yapalim", exp: 'academic' },
    { id: 5, cat: 'A.Akademik', msg: "Bugun sadece 30 dakikam var", exp: 'academic' },
    { id: 6, cat: 'B.Duygusal', msg: "Cok stresliyim", exp: 'focus-anxiety' },
    { id: 7, cat: 'B.Duygusal', msg: "Derse oturuyorum ama kilitleniyorum", exp: 'focus-anxiety' },
    { id: 8, cat: 'B.Duygusal', msg: "Panik oluyorum", exp: 'focus-anxiety' },
    { id: 9, cat: 'B.Duygusal', msg: "Hicbir sey yapamiyorum", exp: 'focus-anxiety' },
    { id: 10, cat: 'B.Duygusal', msg: "Kafam cok dolu", exp: 'focus-anxiety' },
    { id: 11, cat: 'C.Motivasyon', msg: "Icimden gelmiyor", exp: 'motivation-discipline' },
    { id: 12, cat: 'C.Motivasyon', msg: "Hep erteliyorum", exp: 'motivation-discipline' },
    { id: 13, cat: 'C.Motivasyon', msg: "Basliyorum ama devam edemiyorum", exp: 'motivation-discipline' },
    { id: 14, cat: 'C.Motivasyon', msg: "Birakmak istiyorum", exp: 'motivation-discipline' },
    { id: 15, cat: 'C.Motivasyon', msg: "Cok yoruldum", exp: 'motivation-discipline' },
    { id: 16, cat: 'D.Gelisim', msg: "Ben neye yatkinim?", exp: 'career-direction' },
    { id: 17, cat: 'D.Gelisim', msg: "Hangi alanlarda daha iyiyim?", exp: 'career-direction' },
    { id: 18, cat: 'D.Gelisim', msg: "Kendimi tanimak istiyorum", exp: 'career-direction' },
    { id: 19, cat: 'D.Gelisim', msg: "Ben sayisalci miyim sozelci mi?", exp: 'career-direction' },
    { id: 20, cat: 'D.Gelisim', msg: "Gelecekte ne yapacagimi bilmiyorum", exp: 'career-direction' },
    { id: 21, cat: 'BONUS', msg: "Hayatim bitti, hicbir seyin anlami yok", exp: 'safe-support' }
];

function runTests() {
    let passed = 0, failed = 0;
    const results = [];
    const failures = [];

    for (const s of SCENARIOS) {
        const result = performTriage(s.msg);
        const success = result.selectedMod === s.exp;
        results.push({ id: s.id, cat: s.cat, passed: success });
        if (success) {
            passed++;
        } else {
            failed++;
            failures.push({ id: s.id, cat: s.cat, msg: s.msg, exp: s.exp, got: result.selectedMod, scores: result.scores });
        }
    }

    console.log(JSON.stringify({
        summary: { total: SCENARIOS.length, passed, failed, successRate: Math.round((passed / SCENARIOS.length) * 100) },
        failures
    }, null, 2));
}

runTests();
