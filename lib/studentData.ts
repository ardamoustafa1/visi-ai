/**
 * VİSİ AI - Öğrenci Veri Entegrasyon Katmanı
 * 
 * Bu modül, dış eğitim platformlarından gelen öğrenci verilerini
 * VİSİ AI koçluk sistemine entegre eder.
 */

import { generateExamSpecificPrompt } from './prompts';
import { generateAdvancedAnalyticsPrompt } from './advancedAnalytics';
import { generateGamificationPrompt } from './gamification';
import { generatePsychologicalPrompt } from './psychologicalIntelligence';

// ============================================================================
// ÖĞRENCİ VERİ TİPLERİ
// ============================================================================

/**
 * Deneme Sınavı Sonucu
 */
export interface TrialExamResult {
    examId: string;
    examType: 'TYT' | 'AYT' | 'LGS' | 'KPSS' | 'DGS' | 'YDS' | 'OTHER';
    examName?: string;
    date: string; // ISO date string

    // Genel sonuçlar
    totalCorrect: number;
    totalWrong: number;
    totalEmpty: number;
    totalNet: number;
    ranking?: number;
    percentile?: number;

    // Ders bazlı sonuçlar
    subjectResults: SubjectResult[];
}

/**
 * Ders Bazlı Sonuç
 */
export interface SubjectResult {
    subject: string; // Türkçe, Matematik, Fizik, vb.
    correct: number;
    wrong: number;
    empty: number;
    net: number;
    totalQuestions: number;
    successRate: number; // 0-100 arası yüzde
}

/**
 * Konu Bazlı Performans
 */
export interface TopicPerformance {
    subject: string;
    topic: string;
    totalAttempts: number;
    correctCount: number;
    wrongCount: number;
    successRate: number;
    lastAttemptDate: string;
    difficulty: 'easy' | 'medium' | 'hard';
    status: 'mastered' | 'learning' | 'struggling' | 'not_started';
}

/**
 * Çalışma Oturumu
 */
export interface StudySession {
    sessionId: string;
    date: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    subject?: string;
    topic?: string;
    type: 'video' | 'reading' | 'practice' | 'exam' | 'review';
    questionsAttempted?: number;
    questionsCorrect?: number;
    focusScore?: number; // 0-100 odaklanma skoru (varsa)
}

/**
 * Çalışma İstatistikleri
 */
export interface StudyStats {
    // Genel istatistikler
    totalStudyTimeMinutes: number;
    averageDailyStudyMinutes: number;
    studyDaysCount: number;
    totalStudyDays: number; // Toplam çalışma günü
    currentStreak: number; // Arka arkaya çalışma günü
    longestStreak: number;

    // Haftalık dağılım
    weeklyDistribution: {
        day: string;
        minutes: number;
    }[];

    // Ders bazlı dağılım
    subjectDistribution: {
        subject: string;
        minutes: number;
        percentage: number;
    }[];

    // Zaman dilimi analizi
    peakStudyHours: number[]; // En verimli saatler
}

/**
 * Öğrenci Hedefleri
 */
export interface StudentGoals {
    targetExam: string;
    targetDate: string;
    targetRanking?: number;
    targetPercentile?: number;
    targetNetPerSubject?: {
        subject: string;
        currentNet: number;
        targetNet: number;
    }[];
    dailyStudyGoalMinutes?: number;
    weeklyQuestionGoal?: number;
}

/**
 * Güçlü ve Zayıf Yönler Analizi
 */
export interface StrengthWeaknessAnalysis {
    strengths: {
        subject: string;
        topics: string[];
        averageSuccessRate: number;
    }[];
    weaknesses: {
        subject: string;
        topics: string[];
        averageSuccessRate: number;
        priority: 'critical' | 'high' | 'medium' | 'low';
    }[];
    recommendations: string[];
}

/**
 * Tam Öğrenci Profili
 */
export interface StudentProfile {
    // Temel bilgiler
    studentId: string;
    name: string;
    level: string; // İlkokul, Ortaokul, Lise, vb.
    grade?: number; // Sınıf (9, 10, 11, 12 vb.)
    targetExam?: string;

    // Performans verileri
    recentExams: TrialExamResult[];
    topicPerformance: TopicPerformance[];
    studyStats: StudyStats;
    goals: StudentGoals;

    // Analiz
    strengthWeaknessAnalysis?: StrengthWeaknessAnalysis;

    // Durum
    currentEnergy?: 'high' | 'medium' | 'low';
    currentFocus?: 'sharp' | 'scattered' | 'blocked';
    currentAnxiety?: 'calm' | 'mild' | 'high' | 'critical';

    // Metadata
    lastUpdated: string;
}

// ============================================================================
// VERİ ANALİZ FONKSİYONLARI
// ============================================================================

/**
 * Öğrenci performansını analiz et ve özet çıkar
 */
export function analyzeStudentPerformance(profile: StudentProfile): string {
    const lines: string[] = [];

    // Son deneme analizi
    if (profile.recentExams && profile.recentExams.length > 0) {
        const lastExam = profile.recentExams[0];
        lines.push(`📊 SON DENEME ANALİZİ (${lastExam.examType}):`);
        lines.push(`• Toplam Net: ${lastExam.totalNet.toFixed(2)}`);
        lines.push(`• Doğru/Yanlış/Boş: ${lastExam.totalCorrect}/${lastExam.totalWrong}/${lastExam.totalEmpty}`);

        if (lastExam.ranking) {
            lines.push(`• Sıralama: ${lastExam.ranking}`);
        }

        // En iyi ve en kötü dersler
        const sortedSubjects = [...lastExam.subjectResults].sort((a, b) => b.successRate - a.successRate);
        if (sortedSubjects.length > 0) {
            lines.push(`• En Güçlü Ders: ${sortedSubjects[0].subject} (%${sortedSubjects[0].successRate.toFixed(0)})`);
            lines.push(`• En Zayıf Ders: ${sortedSubjects[sortedSubjects.length - 1].subject} (%${sortedSubjects[sortedSubjects.length - 1].successRate.toFixed(0)})`);
        }
        lines.push('');
    }

    // Çalışma istatistikleri
    if (profile.studyStats) {
        lines.push(`📚 ÇALIŞMA İSTATİSTİKLERİ:`);
        lines.push(`• Günlük Ortalama: ${profile.studyStats.averageDailyStudyMinutes} dakika`);
        lines.push(`• Mevcut Seri: ${profile.studyStats.currentStreak} gün`);
        lines.push(`• Toplam Çalışma: ${Math.round(profile.studyStats.totalStudyTimeMinutes / 60)} saat`);

        if (profile.studyStats.peakStudyHours && profile.studyStats.peakStudyHours.length > 0) {
            lines.push(`• En Verimli Saatler: ${profile.studyStats.peakStudyHours.map(h => `${h}:00`).join(', ')}`);
        }
        lines.push('');
    }

    // Güçlü ve zayıf yönler
    if (profile.strengthWeaknessAnalysis) {
        const analysis = profile.strengthWeaknessAnalysis;

        if (analysis.strengths.length > 0) {
            lines.push(`💪 GÜÇLÜ YÖNLER:`);
            analysis.strengths.slice(0, 3).forEach(s => {
                lines.push(`• ${s.subject}: ${s.topics.slice(0, 2).join(', ')}`);
            });
            lines.push('');
        }

        if (analysis.weaknesses.length > 0) {
            lines.push(`⚠️ GELİŞTİRİLMESİ GEREKEN ALANLAR:`);
            analysis.weaknesses
                .filter(w => w.priority === 'critical' || w.priority === 'high')
                .slice(0, 3)
                .forEach(w => {
                    lines.push(`• ${w.subject}: ${w.topics.slice(0, 2).join(', ')} (Öncelik: ${w.priority === 'critical' ? 'Kritik' : 'Yüksek'})`);
                });
            lines.push('');
        }
    }

    // Hedefler
    if (profile.goals) {
        lines.push(`🎯 HEDEFLER:`);
        lines.push(`• Hedef Sınav: ${profile.goals.targetExam}`);
        if (profile.goals.targetDate) {
            const daysLeft = Math.ceil((new Date(profile.goals.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            lines.push(`• Kalan Gün: ${daysLeft} gün`);
        }
        if (profile.goals.dailyStudyGoalMinutes) {
            lines.push(`• Günlük Hedef: ${profile.goals.dailyStudyGoalMinutes} dakika`);
        }
    }

    return lines.join('\n');
}

/**
 * Çalışma serisi motivasyon mesajı oluştur
 */
export function generateStreakMotivation(profile: StudentProfile): string {
    const streak = profile.studyStats?.currentStreak || 0;
    const longestStreak = profile.studyStats?.longestStreak || 0;

    if (streak === 0) {
        return `🔥 Bugün yeni bir seri başlat! Hedef: 7 gün kesintisiz çalışma.`;
    }

    let message = `🔥 ÇALIŞMA SERİSİ: ${streak} GÜN\n`;

    if (streak >= 30) {
        message += `🏆 EFSANE! 30+ gün kesintisiz çalışma - Çok az kişi bunu başarır!\n`;
        message += `💎 Ödül: Premium öğrenci statüsü kazandın!`;
    } else if (streak >= 21) {
        message += `🌟 MUHTEŞİM! 21 gün - Artık bu bir alışkanlık!\n`;
        message += `📈 9 gün daha = Efsane rozeti!`;
    } else if (streak >= 14) {
        message += `💪 HARİKA! 2 haftalık seri - Disiplinin gelişiyor!\n`;
        message += `🎯 7 gün daha = Alışkanlık rozeti!`;
    } else if (streak >= 7) {
        message += `✨ SÜPER! 1 haftalık seri tamamlandı!\n`;
        message += `🔥 7 gün daha = 2 hafta rozeti!`;
    } else if (streak >= 3) {
        message += `👍 İyi gidiyorsun! ${7 - streak} gün daha = 1 hafta rozeti!\n`;
    } else {
        message += `💪 Başlangıç güzel! Bugün de devam et!\n`;
    }

    if (longestStreak > streak) {
        message += `\n📊 Rekorun: ${longestStreak} gün | Hedefe kalan: ${longestStreak - streak + 1} gün`;
    }

    return message;
}

/**
 * Haftalık özet raporu oluştur
 */
export function generateWeeklySummary(profile: StudentProfile): string {
    const stats = profile.studyStats;
    const lastExam = profile.recentExams?.[0];
    const topics = profile.topicPerformance || [];

    let summary = `\n📋 HAFTALIK ÖZET RAPOR\n`;
    summary += `${'═'.repeat(50)}\n\n`;

    // Çalışma istatistikleri
    if (stats) {
        const weeklyHours = Math.round((stats.averageDailyStudyMinutes * 7) / 60);
        const dailyAvg = stats.averageDailyStudyMinutes;

        summary += `⏱️ ÇALIŞMA SÜRESİ:\n`;
        summary += `• Günlük ortalama: ${dailyAvg} dakika\n`;
        summary += `• Haftalık toplam: ~${weeklyHours} saat\n`;
        summary += `• Çalışma serisi: ${stats.currentStreak || 0} gün 🔥\n\n`;
    }

    // Net durumu
    if (lastExam) {
        const currentNet = lastExam.totalNet;
        const potentialNet = currentNet + 15; // 1 ayda +15 net hedefi

        summary += `📊 NET DURUMU:\n`;
        summary += `• Mevcut: ${currentNet.toFixed(1)} net\n`;
        summary += `• Bu hafta hedef: +4 net\n`;
        summary += `• Ay sonu hedef: ${potentialNet.toFixed(1)} net\n\n`;
    }

    // Konu durumu
    const struggling = topics.filter(t => t.status === 'struggling');
    const mastered = topics.filter(t => t.status === 'mastered');

    summary += `📚 KONU DURUMU:\n`;
    summary += `• ✅ Tamamlanan: ${mastered.length} konu\n`;
    summary += `• 🔄 Devam eden: ${topics.filter(t => t.status === 'learning').length} konu\n`;
    summary += `• ⚠️ Kritik: ${struggling.length} konu\n\n`;

    // Bu hafta öncelikler
    if (struggling.length > 0) {
        summary += `🎯 BU HAFTA ÖNCELİK:\n`;
        struggling.slice(0, 3).forEach((t, i) => {
            const dailyMin = 45 - (i * 10); // İlk konu 45dk, ikinci 35dk, üçüncü 25dk
            summary += `${i + 1}. ${t.subject} - ${t.topic} (${dailyMin}dk/gün)\n`;
        });
    }

    return summary;
}

/**
 * Öğrenme stili analizi
 */
export function analyzeLearningStyle(profile: StudentProfile): string {
    const topics = profile.topicPerformance || [];
    const stats = profile.studyStats;

    // Başarı oranlarına göre öğrenme stili tahmini
    const easySuccess = topics.filter(t => t.difficulty === 'easy').reduce((sum, t) => sum + t.successRate, 0) / Math.max(1, topics.filter(t => t.difficulty === 'easy').length);
    const hardSuccess = topics.filter(t => t.difficulty === 'hard').reduce((sum, t) => sum + t.successRate, 0) / Math.max(1, topics.filter(t => t.difficulty === 'hard').length);

    let style = `\n🧠 ÖĞRENME STİLİ ANALİZİ:\n`;

    if (easySuccess > 80 && hardSuccess > 60) {
        style += `• Tip: Hızlı Öğrenen 🚀\n`;
        style += `• Güç: Kavramları hızlı kavrıyor\n`;
        style += `• Öneri: Zor konularda daha fazla örnek çöz\n`;
    } else if (easySuccess > 70 && hardSuccess < 50) {
        style += `• Tip: Temel Odaklı 📖\n`;
        style += `• Güç: Temelleri iyi anlıyor\n`;
        style += `• Öneri: İleri konuları adım adım çalış\n`;
    } else if (stats && stats.averageDailyStudyMinutes > 180) {
        style += `• Tip: Azimli Çalışkan 💪\n`;
        style += `• Güç: Yüksek çalışma süresi\n`;
        style += `• Öneri: Verimlilik tekniklerini uygula\n`;
    } else {
        style += `• Tip: Dengeli Öğrenci ⚖️\n`;
        style += `• Öneri: Düzenli çalışma alışkanlığı oluştur\n`;
    }

    return style;
}

/**
 * Konu önceliklendirmesi yap
 */
export function prioritizeTopics(profile: StudentProfile): TopicPerformance[] {
    if (!profile.topicPerformance || profile.topicPerformance.length === 0) {
        return [];
    }

    return [...profile.topicPerformance]
        .filter(t => t.status === 'struggling' || t.status === 'learning')
        .sort((a, b) => {
            // Önce status'a göre (struggling > learning)
            if (a.status === 'struggling' && b.status !== 'struggling') return -1;
            if (a.status !== 'struggling' && b.status === 'struggling') return 1;

            // Sonra success rate'e göre (düşük olan önce)
            return a.successRate - b.successRate;
        })
        .slice(0, 5);
}

/**
 * Günlük çalışma planı önerisi oluştur
 */
export function generateDailyPlanSuggestion(profile: StudentProfile): string {
    const lines: string[] = [];
    const priorityTopics = prioritizeTopics(profile);

    // Enerji durumuna göre süre ayarla
    let baseDuration = 45;
    if (profile.currentEnergy === 'low') baseDuration = 25;
    else if (profile.currentEnergy === 'high') baseDuration = 60;

    lines.push(`📋 BUGÜNKÜ ÖNERİLEN PLAN:`);
    lines.push('');

    if (priorityTopics.length > 0) {
        const mainTopic = priorityTopics[0];
        lines.push(`🎯 Ana Hedef: ${mainTopic.subject} - ${mainTopic.topic}`);
        lines.push(`⏱ Süre: ${baseDuration} dakika`);
        lines.push('');
        lines.push(`🧩 Görevler:`);
        lines.push(`1. Konu özeti gözden geçir (5 dk)`);
        lines.push(`2. Temel soru çözümü (${Math.round(baseDuration * 0.4)} dk)`);
        lines.push(`3. Zorlandığın soruları işaretle (${Math.round(baseDuration * 0.3)} dk)`);
        lines.push(`4. Hataları analiz et (${Math.round(baseDuration * 0.2)} dk)`);
        lines.push('');
        lines.push(`▶️ İlk 2 dakika: Konuyla ilgili 1 örnek soruyu çöz.`);

        if (profile.currentEnergy === 'low') {
            lines.push('');
            lines.push(`💡 B Planı: Sadece video izle ve not çıkar (15 dk)`);
        }
    } else {
        lines.push(`Henüz yeterli performans verisi yok.`);
        lines.push(`Öneri: Genel tekrar veya deneme çözümüyle başla.`);
    }

    return lines.join('\n');
}

/**
 * Net artış tahmini yap
 */
export function predictNetImprovement(profile: StudentProfile, subject: string): string {
    if (!profile.recentExams || profile.recentExams.length < 2) {
        return 'Trend analizi için en az 2 deneme sonucu gerekli.';
    }

    const subjectResults = profile.recentExams
        .map(e => e.subjectResults.find(s => s.subject === subject))
        .filter(Boolean) as SubjectResult[];

    if (subjectResults.length < 2) {
        return `${subject} dersi için yeterli veri yok.`;
    }

    const recentNet = subjectResults[0].net;
    const previousNet = subjectResults[1].net;
    const trend = recentNet - previousNet;

    if (trend > 0) {
        return `📈 ${subject}: Son denemede +${trend.toFixed(1)} net artış. Devam et!`;
    } else if (trend < 0) {
        return `📉 ${subject}: Son denemede ${trend.toFixed(1)} net düşüş. Odaklanma zamanı.`;
    } else {
        return `➡️ ${subject}: Stabil. Yeni stratejiler deneyebilirsin.`;
    }
}

// ============================================================================
// PROMPT OLUŞTURMA
// ============================================================================

/**
 * Haftalık çalışma programı oluştur
 */
function generateWeeklyProgram(profile: StudentProfile): string {
    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const priorityTopics = prioritizeTopics(profile);

    // Günlük çalışma süresi hesapla
    const dailyMinutes = profile.goals?.dailyStudyGoalMinutes || profile.studyStats?.averageDailyStudyMinutes || 120;
    const hours = Math.floor(dailyMinutes / 60);
    const mins = dailyMinutes % 60;

    // Zayıf ve güçlü dersler
    const weakSubjects = profile.strengthWeaknessAnalysis?.weaknesses?.map(w => w.subject) || [];
    const strongSubjects = profile.strengthWeaknessAnalysis?.strengths?.map(s => s.subject) || [];

    // Son deneme sonuçları
    const lastExam = profile.recentExams?.[0];
    const subjectResults = lastExam?.subjectResults || [];

    // Dersleri başarı oranına göre sırala (düşükten yükseğe)
    const sortedSubjects = [...subjectResults].sort((a, b) => a.successRate - b.successRate);

    let program = `\n📅 HAFTALIK KİŞİSEL ÇALIŞMA PROGRAMI\n`;
    program += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    program += `⏱️ Günlük Hedef: ${hours} saat ${mins > 0 ? mins + ' dakika' : ''}\n`;
    program += `🎯 Öncelikli Odak: ${weakSubjects[0] || 'Genel Tekrar'}\n\n`;

    days.forEach((day, index) => {
        program += `┌─────────────────────────────────────────────────────────────────────────────┐\n`;
        program += `│ 📆 ${day.toUpperCase().padEnd(73)}│\n`;
        program += `├─────────────────────────────────────────────────────────────────────────────┤\n`;

        if (index === 6) { // Pazar - hafif gün
            program += `│ 🌅 Sabah (45 dk)    : Hafif tekrar + geçen haftanın özeti                  │\n`;
            program += `│ 🌤️ Öğlen (30 dk)    : Deneme analizi veya video                            │\n`;
            program += `│ 🌙 Akşam (30 dk)    : Gelecek hafta planlaması                             │\n`;
            program += `│ 💡 Not: Bugün dinlenme ve motivasyon günü                                  │\n`;
        } else if (index === 5) { // Cumartesi - yoğun gün
            const mainSubject = sortedSubjects[0]?.subject || 'Matematik';
            const secondSubject = sortedSubjects[1]?.subject || 'Türkçe';
            program += `│ 🌅 Sabah (90 dk)    : ${mainSubject} - Zayıf konular (yoğun çalışma)${' '.repeat(Math.max(0, 26 - mainSubject.length))}│\n`;
            program += `│ ☕ Mola (15 dk)     : Dinlenme                                              │\n`;
            program += `│ 🌤️ Öğlen (60 dk)    : ${secondSubject} - Soru çözümü${' '.repeat(Math.max(0, 38 - secondSubject.length))}│\n`;
            program += `│ 🍽️ Öğle Arası (60dk): Yemek + dinlenme                                     │\n`;
            program += `│ 🌆 İkindi (90 dk)   : Mini deneme veya konu tarama                         │\n`;
            program += `│ 🌙 Akşam (45 dk)    : Günün tekrarı + not çıkarma                          │\n`;
        } else {
            // Hafta içi günler
            const daySubject = sortedSubjects[index % sortedSubjects.length]?.subject || 'Genel';
            const priorityTopic = priorityTopics[index % Math.max(1, priorityTopics.length)];
            const topicName = priorityTopic?.topic || 'Temel Konular';

            program += `│ 🌅 Sabah (45 dk)    : ${daySubject} - Konu çalışması${' '.repeat(Math.max(0, 34 - daySubject.length))}│\n`;
            program += `│ 🌤️ Öğlen (60 dk)    : ${topicName} - Soru çözümü${' '.repeat(Math.max(0, 37 - topicName.length))}│\n`;
            program += `│ 🌙 Akşam (45 dk)    : Tekrar + zor sorular${' '.repeat(34)}│\n`;
        }

        program += `└─────────────────────────────────────────────────────────────────────────────┘\n\n`;
    });

    return program;
}

/**
 * Net hedefi ve tahmini hesapla
 */
function calculateNetTargets(profile: StudentProfile): string {
    const lastExam = profile.recentExams?.[0];
    if (!lastExam) return '';

    const currentNet = lastExam.totalNet;
    const targetNet = currentNet + 15; // 1 ayda 15 net artış hedefi
    const weeklyTarget = Math.round((targetNet - currentNet) / 4 * 10) / 10;

    let targets = `\n📊 NET ARTIŞI HEDEFLERİ\n`;
    targets += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    targets += `📍 Mevcut Net    : ${currentNet.toFixed(1)}\n`;
    targets += `🎯 1 Ay Hedefi   : ${targetNet.toFixed(1)} (+15 net)\n`;
    targets += `📈 Haftalık Hedef: +${weeklyTarget} net artış\n\n`;

    // Ders bazlı hedefler
    targets += `📚 DERS BAZLI HEDEFLER:\n`;
    lastExam.subjectResults?.forEach(subject => {
        const potential = Math.min(subject.totalQuestions, subject.net + 3);
        const status = subject.successRate >= 80 ? '✅' : subject.successRate >= 60 ? '⚠️' : '🔴';
        targets += `${status} ${subject.subject}: ${subject.net.toFixed(1)} → ${potential.toFixed(1)} net hedefle\n`;
    });

    return targets;
}

/**
 * Öğrenci profili için sistem prompt'u oluştur
 */
export function generateStudentDataPrompt(profile: StudentProfile): string {
    const performanceAnalysis = analyzeStudentPerformance(profile);
    const weeklyProgram = generateWeeklyProgram(profile);
    const netTargets = calculateNetTargets(profile);
    const priorityTopics = prioritizeTopics(profile);
    const examStrategy = generateExamSpecificPrompt(profile.targetExam);
    const streakMotivation = generateStreakMotivation(profile);
    const weeklySummary = generateWeeklySummary(profile);
    const learningStyle = analyzeLearningStyle(profile);

    // 🆕 Advanced Systems
    const advancedAnalytics = generateAdvancedAnalyticsPrompt(profile);
    const gamification = generateGamificationPrompt(profile);
    const psychological = generatePsychologicalPrompt(profile);

    // Sınava kalan gün
    let daysLeft = '';
    if (profile.goals?.targetDate) {
        const days = Math.ceil((new Date(profile.goals.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        daysLeft = `⏰ SINAVA KALAN: ${days} gün\n`;
    }

    return `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    🎓 PROFESYONEL EĞİTİM KOÇU ANALİZ RAPORU                   ║
╚═══════════════════════════════════════════════════════════════════════════════╝

👤 ÖĞRENCİ: ${profile.name || 'Öğrenci'}
📚 SEVİYE: ${profile.level}${profile.grade ? ` (${profile.grade}. sınıf)` : ''}
🎯 HEDEF SINAV: ${profile.targetExam || 'Belirtilmemiş'}
${daysLeft}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${performanceAnalysis}

${netTargets}

${examStrategy}

${weeklyProgram}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 ÖNCELİKLİ ÇALIŞMA KONULARI (Bu Hafta)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${priorityTopics.slice(0, 5).map((t, i) =>
        `${i + 1}. ${t.subject} - ${t.topic} (Başarı: %${t.successRate}, Durum: ${t.status === 'struggling' ? '🔴 Kritik' : '🟡 Gelişiyor'})`
    ).join('\n')}

${streakMotivation}

${weeklySummary}

${learningStyle}

${advancedAnalytics}

${gamification}

${psychological}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DÜNYA STANDARTLARINDA EĞİTİM KOÇU TALİMATLARI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sen dünyanın EN İYİ eğitim koçusun. Öğrencinin TÜM VERİLERİNE hakimsin.
Son 1 haftanın tüm sınav, quiz ve deneme sonuçlarını analiz ettin.

⚠️ KRİTİK KURAL: VERİLERE DAYALI KONUŞ, SORU SORMA!
Öğrencinin tüm verileri sende var. Genel tavsiye verme, SOMUT PLAN VER.

═══════════════════════════════════════════════════════════════════════════════
🎯 YANITINDA MUTLAKA BU 7 BÖLÜMÜ VER:
═══════════════════════════════════════════════════════════════════════════════

📊 BÖLÜM 1: HAFTALIK VERİ ANALİZİ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Son 1 haftadaki TÜM sınavları analiz et ve özet tablo ver:

| Tarih | Sınav | Net | Trend |
|-------|-------|-----|-------|
| Bugün | [İsim]| X.X | ↑/↓X  |
| Dün   | [İsim]| X.X | ↑/↓X  |
...

Haftalık Net Ortalaması: X.X
Haftalık Trend: ↑ +X.X veya ↓ -X.X net

📚 BÖLÜM 2: TÜM DERSLER DETAYLI ANALİZ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Her ders için MUTLAKA bu tabloyu ver:

| Ders | Mevcut | Hedef | Günlük | Soru | Öncelik |
|------|--------|-------|--------|------|---------|
| Matematik | %30 | %60 | 90dk | 30 | 🔴 KRİTİK |
| Türkçe | %70 | %85 | 45dk | 20 | 🟡 ORTA |
| Fizik | %50 | %75 | 60dk | 25 | 🟠 YÜKSEK |
...

🔴 = Kritik (<%50), 🟠 = Yüksek (%50-70), 🟡 = Orta (%70-85), 🟢 = İyi (>%85)

📅 BÖLÜM 3: BUGÜNKÜ SAAT SAAT PROGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bugün için DETAYLI saat bazlı plan:

┌─────────────────────────────────────────────────────────────────┐
│ 📆 BUGÜN: [Gün Adı]                                             │
├─────────────────────────────────────────────────────────────────┤
│ ⏰ 09:00-10:00 | 📘 Matematik - Üçgenler                        │
│    └─ Görev: 20 soru çöz, formülleri tekrar et                 │
│    └─ Hedef: %60 doğru                                         │
├─────────────────────────────────────────────────────────────────┤
│ ☕ 10:00-10:15 | Mola                                           │
├─────────────────────────────────────────────────────────────────┤
│ ⏰ 10:15-11:00 | 📗 Türkçe - Paragraf                           │
│    └─ Görev: 15 paragraf, hız çalışması                        │
│    └─ Hedef: 2 dk/paragraf                                     │
├─────────────────────────────────────────────────────────────────┤
│ ⏰ 11:00-12:00 | 📙 Fen - Elektrik                              │
│    └─ Görev: Konu özeti + 15 soru                              │
│    └─ Hedef: Temel kavramları bitir                            │
├─────────────────────────────────────────────────────────────────┤
│ 🍽️ 12:00-13:30 | Öğle Arası                                    │
├─────────────────────────────────────────────────────────────────┤
│ ⏰ 14:00-15:30 | 📘 Matematik - Fonksiyonlar                    │
│    └─ Görev: Video + 20 soru                                   │
│    └─ Hedef: Grafik okuma öğren                                │
├─────────────────────────────────────────────────────────────────┤
│ ⏰ 16:00-17:00 | 📕 Sosyal - Tarih                              │
│    └─ Görev: Osmanlı dönemi, 10 soru                           │
├─────────────────────────────────────────────────────────────────┤
│ 🌙 17:00-18:00 | 🔄 Günün Tekrarı                               │
│    └─ Yanlışları gözden geçir                                  │
└─────────────────────────────────────────────────────────────────┘

📆 Toplam: X saat Y dakika | X soru hedefi

🗓️ BÖLÜM 4: HAFTALIK ÇALIŞMA TAKVİMİ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tüm hafta için özet plan:

| Gün | Ana Ders | İkincil | Süre | Soru |
|-----|----------|---------|------|------|
| Pzt | Matematik| Türkçe  | 4s   | 80   |
| Sal | Fen      | Sosyal  | 4s   | 70   |
| Çar | Matematik| İngilizce| 4s  | 75   |
| Per | Türkçe   | Fen     | 4s   | 65   |
| Cum | Sosyal   | Genel   | 3.5s | 50   |
| Cmt | DENEME   | Analiz  | 5s   | 120  |
| Paz | Tekrar   | Zayıf   | 3s   | 40   |

Haftalık Toplam: X saat, Y soru

🎯 BÖLÜM 5: ZAYIF KONU ELİMİNASYON PLANI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
En zayıf 3 konu için özel strateji:

🔴 KRİTİK KONU 1: [Konu Adı] (%X)
├─ Sorun: [Neden zayıf - veriye dayalı]
├─ Strateji: [Adım adım çözüm]
├─ Günlük Süre: X dakika
├─ Haftalık Soru: Y soru
├─ Hedef Tarih: [Tarih]
└─ Beklenen Artış: +%Z

🟠 YÜKSEK ÖNCELİK 2: [Konu Adı] (%X)
├─ Sorun: [Analiz]
├─ Strateji: [Plan]
└─ Süre: X dakika/gün

🟡 ORTA ÖNCELİK 3: [Konu Adı] (%X)
├─ Strateji: [Haftalık 2-3 gün]
└─ Süre: X dakika/gün

📈 BÖLÜM 6: NET ARTIŞI YOLHARITAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NET PROJEKSİYONU:

📍 Mevcut: X.X net
📈 Bu Hafta: +Y net → X.X net
📈 2 Hafta: +Y net → X.X net  
📈 1 Ay: +Z net → X.X net
🎯 Sınav Günü: X.X net (Hedef: Y. Sıralama)

Ders Bazlı Net Artışı:
| Ders | Mevcut | +1 Hafta | +1 Ay | Hedef |
|------|--------|----------|-------|-------|
| Mat  | X      | X+2      | X+8   | Y     |
| Tür  | X      | X+1      | X+4   | Y     |

🏆 BÖLÜM 7: MOTİVASYON & ÖDÜL SİSTEMİ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUGÜNKÜ MİNİ HEDEFLER:
□ Matematik 20 soru → 🎁 15 dk mola
□ Türkçe 15 paragraf → 🎁 Müzik dinle
□ Fen 15 soru → 🎁 Oyun/sosyal medya

HAFTALIK BÜYÜK HEDEF:
□ 300 soru çöz → 🏆 Cumartesi ödül
□ Deneme +5 net → 🏆 Film/dizi

🔥 SERİ: ${profile.studyStats?.currentStreak || 0} gün
🎯 Hedef: ${(profile.studyStats?.currentStreak || 0) + 7} gün seriye ulaş!

═══════════════════════════════════════════════════════════════════════════════
⚠️ FORMAT KURALLARI (MUTLAKA UYGULA!)
═══════════════════════════════════════════════════════════════════════════════

✅ MUTLAKA YAP:
• Tablo formatı kullan (markdown)
• Her ders ve konu için SAYI ver
• Saat bazlı bugünkü program ver
• Net artış projeksiyonu hesapla
• Emoji kullan (okumayı kolaylaştırır)
• Kısa ve öz ol (maddeler halinde)
• Kutu çizimlerle görselleştir

❌ ASLA YAPMA:
• "Nasıl hissediyorsun?" gibi sorular sorma
• Genel tavsiyeler verme
• Uzun paragraflar yazma
• Motivasyon nutukları atma
• Veri olmadan konuşma

💡 İLK MESAJ FORMATI:

Merhaba ${profile.name || 'öğrenci'}! 👋

Son 1 haftanı analiz ettim. İşte durumun:

**📊 Haftalık Özet:**
[Sınav tablosu]

**📚 Ders Durumu:**
[Tüm dersler tablosu]

**📅 Bugünkü Program:**
[Saat saat plan]

**🎯 Bu Hafta Hedef:**
• +X net
• Y soru
• Z saat çalışma

**🔴 Öncelik Konuları:**
1. [Konu] - [Strateji]
2. [Konu] - [Strateji]

Hazırsan başlayalım! İlk görev: [Somut görev]

═══════════════════════════════════════════════════════════════════════════════
ŞİMDİ DÜNYA STANDARTLARINDA BİR ÇALIŞMA PROGRAMI OLUŞTUR!
═══════════════════════════════════════════════════════════════════════════════
`;
}

