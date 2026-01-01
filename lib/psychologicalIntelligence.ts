/**
 * VİSİ AI - Psychological Intelligence System
 * 
 * Kaygı yönetimi, tükenmişlik önleme, motivasyon takibi ve
 * duygusal zeka tabanlı koçluk sistemi.
 */

import { StudentProfile } from './studentData';

// ============================================================================
// PSİKOLOJİK ZEKA TİPLERİ
// ============================================================================

interface AnxietyAssessment {
    level: 'calm' | 'mild' | 'moderate' | 'high' | 'critical';
    score: number; // 0-100
    triggers: string[];
    recommendations: string[];
}

interface BurnoutRisk {
    level: 'low' | 'medium' | 'high' | 'critical';
    score: number;
    indicators: string[];
    preventionSteps: string[];
}

interface MotivationProfile {
    level: 'high' | 'medium' | 'low' | 'critical';
    type: 'intrinsic' | 'extrinsic' | 'mixed';
    boosters: string[];
    warnings: string[];
}

interface EmotionalSupport {
    message: string;
    technique: string;
    duration: string;
    followUp: string;
}

// ============================================================================
// KAYGI YÖNETİMİ
// ============================================================================

/**
 * Kaygı seviyesini tespit et
 */
export function detectAnxietyLevel(profile: StudentProfile): AnxietyAssessment {
    const anxiety = profile.currentAnxiety;
    const daysLeft = profile.goals?.targetDate
        ? Math.ceil((new Date(profile.goals.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 180;
    const currentNet = profile.recentExams?.[0]?.totalNet || 0;
    const targetNet = 100; // Hedef varsayımı
    const netGap = targetNet - currentNet;

    let score = 0;
    const triggers: string[] = [];
    const recommendations: string[] = [];

    // Profil kaygısı
    if (anxiety === 'critical') score += 40;
    else if (anxiety === 'high') score += 25;
    else if (anxiety === 'mild') score += 10;

    // Zaman baskısı
    if (daysLeft < 30 && netGap > 20) {
        score += 25;
        triggers.push('Sınava az zaman kaldı, hedeften uzak');
        recommendations.push('Günlük mikro hedefler koy, büyük resme takılma');
    } else if (daysLeft < 60 && netGap > 30) {
        score += 15;
        triggers.push('Zaman kısıtlı, net açığı var');
    }

    // Performans baskısı
    const exams = profile.recentExams || [];
    if (exams.length >= 2 && exams[0].totalNet < exams[1].totalNet) {
        score += 15;
        triggers.push('Son denemede düşüş yaşandı');
        recommendations.push('Düşüş normal, analiz yap ve devam et');
    }

    // Streak kırılması
    if (profile.studyStats?.currentStreak === 0 && (profile.studyStats?.longestStreak || 0) > 7) {
        score += 10;
        triggers.push('Uzun seri kırıldı');
        recommendations.push('Küçük bir adımla yeni başlangıç yap');
    }

    // Aşırı çalışma stresi
    if ((profile.studyStats?.averageDailyStudyMinutes || 0) > 360) {
        score += 10;
        triggers.push('Aşırı çalışma süresi');
        recommendations.push('Kaliteli mola ve uyku öncelik');
    }

    // Varsayılan öneriler
    if (recommendations.length === 0) {
        recommendations.push('Derin nefes: 4-7-8 tekniği dene');
        recommendations.push('Küçük başarıları kutla');
    }

    // Seviye belirleme
    let level: AnxietyAssessment['level'];
    if (score >= 70) level = 'critical';
    else if (score >= 50) level = 'high';
    else if (score >= 30) level = 'moderate';
    else if (score >= 15) level = 'mild';
    else level = 'calm';

    return { level, score, triggers, recommendations };
}

// ============================================================================
// TÜKENMİŞLİK ÖNLEME
// ============================================================================

/**
 * Tükenmişlik riskini kontrol et
 */
export function checkBurnoutRisk(profile: StudentProfile): BurnoutRisk {
    const stats = profile.studyStats;
    const dailyStudy = stats?.averageDailyStudyMinutes || 0;
    const streak = stats?.currentStreak || 0;

    let score = 0;
    const indicators: string[] = [];
    const preventionSteps: string[] = [];

    // Aşırı çalışma
    if (dailyStudy > 420) { // 7+ saat
        score += 35;
        indicators.push('Günde 7+ saat çalışma');
        preventionSteps.push('Hafif gün ekle: haftada 1-2 gün max 2 saat');
    } else if (dailyStudy > 300) { // 5+ saat
        score += 15;
        indicators.push('Yoğun çalışma temposu');
        preventionSteps.push('Molalara dikkat et');
    }

    // Uzun streak (paradoks: çok uzun = risk)
    if (streak > 45) {
        score += 20;
        indicators.push('45+ gün kesintisiz çalışma');
        preventionSteps.push('Bir "aktif dinlenme" günü planla');
    }

    // Düşük verimlilik (çok çalışıp az net)
    const currentNet = profile.recentExams?.[0]?.totalNet || 0;
    const expectedNet = (dailyStudy / 60) * 2.5; // Saat başına 2.5 net beklentisi
    if (dailyStudy > 180 && currentNet < expectedNet * 0.6) {
        score += 25;
        indicators.push('Çalışma-performans oranı düşük');
        preventionSteps.push('Çalışma yöntemini gözden geçir');
    }

    // Odak sorunları
    if (profile.currentFocus === 'blocked') {
        score += 15;
        indicators.push('Odaklanma sorunu');
        preventionSteps.push('Pomodoro tekniği: 25dk çalış, 5dk mola');
    }

    // Varsayılan önleme adımları
    if (preventionSteps.length === 0) {
        preventionSteps.push('Düzenli uyku (7-8 saat)');
        preventionSteps.push('Haftalık bir hobi aktivitesi');
    }

    // Seviye belirleme
    let level: BurnoutRisk['level'];
    if (score >= 60) level = 'critical';
    else if (score >= 40) level = 'high';
    else if (score >= 20) level = 'medium';
    else level = 'low';

    return { level, score, indicators, preventionSteps };
}

// ============================================================================
// MOTİVASYON TAKİBİ
// ============================================================================

/**
 * Motivasyon profilini analiz et
 */
export function analyzeMotivation(profile: StudentProfile): MotivationProfile {
    const streak = profile.studyStats?.currentStreak || 0;
    const energy = profile.currentEnergy;
    const focus = profile.currentFocus;
    const exams = profile.recentExams || [];

    const boosters: string[] = [];
    const warnings: string[] = [];

    // Motivasyon tipi
    let type: MotivationProfile['type'] = 'mixed';

    // Streak bazlı motivasyon
    if (streak >= 21) {
        boosters.push(`🔥 ${streak} günlük seri - muhteşem disiplin!`);
        type = 'intrinsic';
    } else if (streak >= 7) {
        boosters.push(`⭐ ${streak} günlük seri devam ediyor`);
    }

    // Performans bazlı motivasyon
    if (exams.length >= 2 && exams[0].totalNet > exams[1].totalNet) {
        const gain = exams[0].totalNet - exams[1].totalNet;
        boosters.push(`📈 Son denemede +${gain.toFixed(1)} net artışı!`);
        type = 'extrinsic';
    }

    // Enerji durumu
    if (energy === 'high') {
        boosters.push('⚡ Enerjin yüksek - fırsatı kullan!');
    } else if (energy === 'low') {
        warnings.push('🔋 Enerji düşük - hafif çalışma önerilir');
    }

    // Odak durumu
    if (focus === 'sharp') {
        boosters.push('🎯 Odağın keskin - zor konulara dal!');
    } else if (focus === 'blocked') {
        warnings.push('😵 Odak sorunu - kısa mola ver');
    }

    // Motivasyon seviyesi hesapla
    let level: MotivationProfile['level'];
    if (boosters.length >= 3 && warnings.length === 0) level = 'high';
    else if (boosters.length >= 2) level = 'medium';
    else if (warnings.length >= 2) level = 'low';
    else level = 'medium';

    // Uyarı yoksa varsayılan ekle
    if (warnings.length === 0) {
        warnings.push('💡 Küçük hedefler belirle, motivasyon artar');
    }

    return { level, type, boosters, warnings };
}

// ============================================================================
// DUYGUSAL DESTEK
// ============================================================================

/**
 * Duruma uygun duygusal destek mesajı oluştur
 */
export function generateEmotionalSupport(profile: StudentProfile): EmotionalSupport {
    const anxiety = detectAnxietyLevel(profile);
    const burnout = checkBurnoutRisk(profile);
    const motivation = analyzeMotivation(profile);

    // Kritik durumlar
    if (anxiety.level === 'critical' || burnout.level === 'critical') {
        return {
            message: 'Durmak ilerlemektir. Kendine biraz zaman ver, bu da stratejinin bir parçası.',
            technique: 'Şu an için kitapları kapat. 10 dakika pencereden dışarı bak veya kısa bir yürüyüş yap.',
            duration: '15-30 dakika mola',
            followUp: 'Molanın ardından sadece 1 kolay soru ile başla.'
        };
    }

    // Yüksek stres
    if (anxiety.level === 'high' || burnout.level === 'high') {
        return {
            message: 'Zorlu bir dönemden geçiyorsun, bu normal. Ama unutma: marathon koşusu yapıyorsun, sprint değil.',
            technique: '4-7-8 Nefes: 4sn nefes al, 7sn tut, 8sn yavaşça ver. 3 kez tekrarla.',
            duration: '5 dakika nefes egzersizi',
            followUp: 'En kolay konudan başla, kendine güven inşa et.'
        };
    }

    // Düşük motivasyon
    if (motivation.level === 'low') {
        return {
            message: 'Motivasyon dalgalanır, bu normal. Önemli olan devam etmek.',
            technique: '2 Dakika Kuralı: Sadece 2 dakikalık bir iş yap. Kitabı aç, 1 soru oku. Genellikle devam edersin.',
            duration: '2 dakika başlangıç',
            followUp: 'Küçük bir başarıyı kutla: "Bunu yaptım!" de.'
        };
    }

    // Normal durum - pozitif destek
    return {
        message: 'Harika gidiyorsun! Her gün attığın adımlar seni hedefe yaklaştırıyor.',
        technique: 'Bugünkü hedefini belirle ve yaz. Görselleştirme motivasyonu artırır.',
        duration: 'Günlük hedef belirleme: 2 dakika',
        followUp: 'Günün sonunda neyi başardığını not et.'
    };
}

/**
 * Psikolojik zeka prompt parçası oluştur
 */
export function generatePsychologicalPrompt(profile: StudentProfile): string {
    const anxiety = detectAnxietyLevel(profile);
    const burnout = checkBurnoutRisk(profile);
    const motivation = analyzeMotivation(profile);
    const support = generateEmotionalSupport(profile);

    let prompt = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 PSİKOLOJİK ZEKA ANALİZİ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

😌 KAYGI SEVİYESİ: ${anxiety.level === 'calm' ? '🟢 Sakin' : anxiety.level === 'mild' ? '🟡 Hafif' : anxiety.level === 'moderate' ? '🟠 Orta' : anxiety.level === 'high' ? '🔴 Yüksek' : '⛔ Kritik'}
${anxiety.triggers.length > 0 ? `• Tetikleyiciler: ${anxiety.triggers.join(', ')}` : ''}

🔥 TÜKENMİŞLİK RİSKİ: ${burnout.level === 'low' ? '🟢 Düşük' : burnout.level === 'medium' ? '🟡 Orta' : burnout.level === 'high' ? '🟠 Yüksek' : '🔴 Kritik'}
${burnout.indicators.length > 0 ? `• Göstergeler: ${burnout.indicators.join(', ')}` : ''}

💪 MOTİVASYON: ${motivation.level === 'high' ? '🟢 Yüksek' : motivation.level === 'medium' ? '🟡 Orta' : motivation.level === 'low' ? '🟠 Düşük' : '🔴 Kritik'}
${motivation.boosters.map(b => `• ${b}`).join('\n')}

💬 DUYGUSAL DESTEK MESAJI:
"${support.message}"

🧘 ÖNERİLEN TEKNİK:
${support.technique}

⚠️ KOÇLUK TALİMATI:
• Kaygı ${anxiety.level === 'high' || anxiety.level === 'critical' ? 'YÜKSEK - önce rahatlat, sonra plan ver' : 'kontrol altında'}
• Tükenmişlik riski ${burnout.level === 'high' || burnout.level === 'critical' ? 'VAR - mola önerilerini dahil et' : 'düşük'}
• Motivasyon ${motivation.level === 'low' ? 'DÜŞÜK - küçük adımlarla başla' : 'yeterli'}

`;

    return prompt;
}
