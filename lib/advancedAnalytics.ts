/**
 * VİSİ AI - Advanced Analytics System
 * 
 * Dünyada eşi görülmemiş performans tahmin ve analiz sistemi.
 * Net tahmini, trend analizi, risk faktörleri ve karşılaştırmalı analiz.
 */

import { StudentProfile, TrialExamResult, TopicPerformance } from './studentData';

// ============================================================================
// PERFORMANS TAHMİN SİSTEMİ
// ============================================================================

interface PredictionResult {
    predictedNet: number;
    confidence: 'high' | 'medium' | 'low';
    predictedRanking: number;
    daysUntilTarget: number;
    weeklyGrowthRate: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface TrendAnalysis {
    direction: 'up' | 'stable' | 'down';
    weeklyChange: number;
    monthlyChange: number;
    strongestSubject: string;
    weakestSubject: string;
    consistencyScore: number; // 0-100
    projectedExamScore: number;
}

interface RiskFactor {
    type: 'performance' | 'consistency' | 'burnout' | 'topic_gap' | 'time_management';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
}

/**
 * Sınav günü net tahmini yap
 */
export function predictExamScore(profile: StudentProfile): PredictionResult {
    const exams = profile.recentExams || [];
    const currentNet = exams[0]?.totalNet || 0;
    const streak = profile.studyStats?.currentStreak || 0;
    const dailyStudy = profile.studyStats?.averageDailyStudyMinutes || 0;

    // Haftalık büyüme oranı hesapla
    let weeklyGrowthRate = 3.5; // Varsayılan
    if (exams.length >= 2) {
        const netDiff = exams[0].totalNet - exams[1].totalNet;
        const daysDiff = Math.ceil((new Date(exams[0].date).getTime() - new Date(exams[1].date).getTime()) / (1000 * 60 * 60 * 24));
        weeklyGrowthRate = (netDiff / Math.max(1, daysDiff)) * 7;
    }

    // Çalışma faktörü (günde 180dk+ = 1.2x bonus)
    const studyFactor = dailyStudy >= 240 ? 1.3 : dailyStudy >= 180 ? 1.2 : dailyStudy >= 120 ? 1.0 : 0.8;

    // Streak faktörü (30+ gün = 1.15x bonus)
    const streakFactor = streak >= 30 ? 1.15 : streak >= 14 ? 1.1 : streak >= 7 ? 1.05 : 1.0;

    // Sınava kalan gün
    const daysUntilExam = profile.goals?.targetDate
        ? Math.ceil((new Date(profile.goals.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 180;

    // Tahmin hesapla
    const weeksLeft = daysUntilExam / 7;
    const adjustedGrowthRate = weeklyGrowthRate * studyFactor * streakFactor;
    const predictedNet = Math.min(120, currentNet + (adjustedGrowthRate * weeksLeft * 0.7)); // %70 gerçekleşme oranı

    // Güven seviyesi
    const confidence = exams.length >= 4 ? 'high' : exams.length >= 2 ? 'medium' : 'low';

    // Sıralama tahmini (basit formül)
    const predictedRanking = Math.max(1, Math.round(2500000 * Math.pow(0.95, predictedNet - 50)));

    // Risk seviyesi
    const riskLevel = weeklyGrowthRate < 0 ? 'critical'
        : weeklyGrowthRate < 2 ? 'high'
            : weeklyGrowthRate < 3 ? 'medium'
                : 'low';

    return {
        predictedNet: Math.round(predictedNet * 10) / 10,
        confidence,
        predictedRanking,
        daysUntilTarget: daysUntilExam,
        weeklyGrowthRate: Math.round(adjustedGrowthRate * 10) / 10,
        riskLevel
    };
}

/**
 * Trend analizi yap
 */
export function generateTrendAnalysis(profile: StudentProfile): TrendAnalysis {
    const exams = profile.recentExams || [];
    const subjects = exams[0]?.subjectResults || [];

    // Son 4 denemeyi analiz et
    let direction: 'up' | 'stable' | 'down' = 'stable';
    let weeklyChange = 0;
    let monthlyChange = 0;

    if (exams.length >= 2) {
        const diff = exams[0].totalNet - exams[1].totalNet;
        weeklyChange = diff;
        direction = diff > 1 ? 'up' : diff < -1 ? 'down' : 'stable';
    }

    if (exams.length >= 4) {
        monthlyChange = exams[0].totalNet - exams[3].totalNet;
    }

    // En güçlü ve en zayıf ders
    const sortedSubjects = [...subjects].sort((a, b) => b.successRate - a.successRate);
    const strongestSubject = sortedSubjects[0]?.subject || 'Belirtilmemiş';
    const weakestSubject = sortedSubjects[sortedSubjects.length - 1]?.subject || 'Belirtilmemiş';

    // Tutarlılık skoru (deneme sonuçlarının varyansına göre)
    let consistencyScore = 75; // Varsayılan
    if (exams.length >= 3) {
        const nets = exams.slice(0, 5).map(e => e.totalNet);
        const avg = nets.reduce((a, b) => a + b, 0) / nets.length;
        const variance = nets.reduce((sum, n) => sum + Math.pow(n - avg, 2), 0) / nets.length;
        consistencyScore = Math.max(0, Math.min(100, 100 - variance));
    }

    // Sınav tahmini
    const prediction = predictExamScore(profile);

    return {
        direction,
        weeklyChange: Math.round(weeklyChange * 10) / 10,
        monthlyChange: Math.round(monthlyChange * 10) / 10,
        strongestSubject,
        weakestSubject,
        consistencyScore: Math.round(consistencyScore),
        projectedExamScore: prediction.predictedNet
    };
}

/**
 * Risk faktörlerini hesapla
 */
export function calculateRiskFactors(profile: StudentProfile): RiskFactor[] {
    const risks: RiskFactor[] = [];
    const exams = profile.recentExams || [];
    const topics = profile.topicPerformance || [];
    const stats = profile.studyStats;

    // Performans riski
    if (exams.length >= 2 && exams[0].totalNet < exams[1].totalNet) {
        const drop = exams[1].totalNet - exams[0].totalNet;
        risks.push({
            type: 'performance',
            severity: drop > 5 ? 'critical' : drop > 3 ? 'high' : 'medium',
            description: `Son denemede ${drop.toFixed(1)} net düşüş var`,
            recommendation: 'Zayıf konulara odaklan, deneme analizi yap'
        });
    }

    // Tutarlılık riski
    if (stats && stats.currentStreak === 0) {
        risks.push({
            type: 'consistency',
            severity: 'high',
            description: 'Çalışma serisi kırıldı',
            recommendation: 'Bugün en az 30 dakika çalışarak yeni seri başlat'
        });
    }

    // Tükenmişlik riski
    if (stats && stats.averageDailyStudyMinutes > 360) {
        risks.push({
            type: 'burnout',
            severity: 'medium',
            description: 'Günde 6+ saat çalışma - tükenmişlik riski',
            recommendation: 'Mola kalitesini artır, hafif günler ekle'
        });
    }

    // Konu boşluğu riski
    const criticalTopics = topics.filter(t => t.status === 'struggling' && t.successRate < 30);
    if (criticalTopics.length >= 3) {
        risks.push({
            type: 'topic_gap',
            severity: 'critical',
            description: `${criticalTopics.length} kritik konu var`,
            recommendation: `${criticalTopics[0].topic} ile başla, her gün 1 konu`
        });
    }

    // Zaman yönetimi riski
    const daysLeft = profile.goals?.targetDate
        ? Math.ceil((new Date(profile.goals.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 180;

    if (daysLeft < 60 && exams[0]?.totalNet < 80) {
        risks.push({
            type: 'time_management',
            severity: 'high',
            description: `${daysLeft} gün kaldı, ${80 - exams[0].totalNet} net gerekli`,
            recommendation: 'Yoğunlaştırılmış program başlat'
        });
    }

    return risks;
}

/**
 * Üst performans gösterenlerle karşılaştırma
 */
export function compareWithTopPerformers(profile: StudentProfile): string {
    const currentNet = profile.recentExams?.[0]?.totalNet || 0;
    const dailyStudy = profile.studyStats?.averageDailyStudyMinutes || 0;
    const streak = profile.studyStats?.currentStreak || 0;

    // Üst %10 benchmark verileri (simüle)
    const top10Benchmark = {
        net: 95,
        dailyStudy: 240,
        streak: 45,
        weeklyTests: 2
    };

    let comparison = `\n📊 ÜST PERFORMANSLA KARŞILAŞTIRMA (İlk %10)\n`;
    comparison += `${'─'.repeat(50)}\n\n`;

    // Net karşılaştırma
    const netGap = top10Benchmark.net - currentNet;
    const netEmoji = netGap <= 0 ? '🏆' : netGap <= 10 ? '🎯' : netGap <= 20 ? '📈' : '⚠️';
    comparison += `${netEmoji} Net: Senin ${currentNet.toFixed(1)} | Top %10: ${top10Benchmark.net}\n`;

    // Çalışma süresi
    const studyGap = top10Benchmark.dailyStudy - dailyStudy;
    const studyEmoji = studyGap <= 0 ? '🏆' : studyGap <= 30 ? '🎯' : '📈';
    comparison += `${studyEmoji} Günlük: Senin ${dailyStudy}dk | Top %10: ${top10Benchmark.dailyStudy}dk\n`;

    // Streak
    const streakEmoji = streak >= top10Benchmark.streak ? '🏆' : streak >= 21 ? '🎯' : '📈';
    comparison += `${streakEmoji} Seri: Senin ${streak} gün | Top %10: ${top10Benchmark.streak} gün\n`;

    // İyileştirme önerisi
    comparison += `\n💡 Top %10'a ulaşmak için:\n`;
    if (netGap > 0) comparison += `• Haftalık +${Math.ceil(netGap / 12)} net artışı\n`;
    if (studyGap > 0) comparison += `• Günlük +${studyGap} dakika ekleme\n`;
    if (streak < top10Benchmark.streak) comparison += `• Çalışma serisini ${top10Benchmark.streak} güne çıkar\n`;

    return comparison;
}

/**
 * Gelişmiş analiz prompt'u oluştur
 */
export function generateAdvancedAnalyticsPrompt(profile: StudentProfile): string {
    const prediction = predictExamScore(profile);
    const trend = generateTrendAnalysis(profile);
    const risks = calculateRiskFactors(profile);
    const comparison = compareWithTopPerformers(profile);

    let prompt = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔮 PERFORMANS TAHMİN VE ANALİZ SİSTEMİ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 SINAV GÜNÜ TAHMİNİ:
• Tahmini Net: ${prediction.predictedNet} (Güven: ${prediction.confidence === 'high' ? 'Yüksek' : prediction.confidence === 'medium' ? 'Orta' : 'Düşük'})
• Tahmini Sıralama: ~${prediction.predictedRanking.toLocaleString()}
• Haftalık Büyüme: +${prediction.weeklyGrowthRate} net/hafta
• Risk Seviyesi: ${prediction.riskLevel === 'low' ? '🟢 Düşük' : prediction.riskLevel === 'medium' ? '🟡 Orta' : prediction.riskLevel === 'high' ? '🟠 Yüksek' : '🔴 Kritik'}

📊 TREND ANALİZİ:
• Yön: ${trend.direction === 'up' ? '📈 YÜKSELİŞ' : trend.direction === 'down' ? '📉 DÜŞÜŞ' : '➡️ STABIL'}
• Haftalık Değişim: ${trend.weeklyChange > 0 ? '+' : ''}${trend.weeklyChange} net
• Aylık Değişim: ${trend.monthlyChange > 0 ? '+' : ''}${trend.monthlyChange} net
• Tutarlılık Skoru: %${trend.consistencyScore}
• En Güçlü: ${trend.strongestSubject} | En Zayıf: ${trend.weakestSubject}

`;

    // Risk faktörleri
    if (risks.length > 0) {
        prompt += `⚠️ RİSK FAKTÖRLERİ:\n`;
        risks.forEach((risk, i) => {
            const icon = risk.severity === 'critical' ? '🔴' : risk.severity === 'high' ? '🟠' : risk.severity === 'medium' ? '🟡' : '🟢';
            prompt += `${i + 1}. ${icon} ${risk.description}\n   → ${risk.recommendation}\n`;
        });
        prompt += '\n';
    }

    prompt += comparison;

    return prompt;
}
