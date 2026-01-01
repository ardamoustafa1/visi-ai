/**
 * VİSİ AI - Eğitim Platformu Entegrasyon Kılavuzu
 * 
 * Bu dosya, VİSİ AI'yi mevcut eğitim platformunuza nasıl
 * entegre edeceğinizi gösterir.
 */

import { StudentProfile } from './studentData';

// ============================================================================
// ENTEGRASYON ADIMLARI
// ============================================================================

/**
 * 1. ÖĞRENCİ VERİSİ GÖNDERME
 * 
 * Platformunuzdan VİSİ AI'ye öğrenci verisi göndermek için
 * aşağıdaki yapıyı kullanın:
 */
export async function sendStudentDataToVisiAI(studentData: StudentProfile) {
    const response = await fetch('/api/student-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
    });

    return await response.json();
}

/**
 * 2. CHAT BAŞLATMA (ÖĞRENCİ VERİSİYLE)
 * 
 * Chat başlatırken öğrenci verisini dahil edin:
 */
export async function startChatWithStudentData(
    message: string,
    studentContext: any,
    studentData: StudentProfile
) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            history: [],
            studentContext,
            studentData // Platform verisi burada
        })
    });

    return await response.json();
}

/**
 * 3. ÖRNEK: PLATFORMUNUZDAN VERİ ÇEKME VE GÖNDERME
 */
export function exampleIntegration() {
    // Platformunuzun veritabanından öğrenci verisi çekin
    const studentData: StudentProfile = {
        studentId: "platform_student_123",
        name: "Ahmet Yılmaz",
        level: "Lise",
        grade: 11,
        targetExam: "YKS",

        // Son denemeler
        recentExams: [
            {
                examId: "deneme_001",
                examType: "TYT",
                examName: "Aralık TYT Denemesi",
                date: "2024-12-15",
                totalCorrect: 90,
                totalWrong: 18,
                totalEmpty: 12,
                totalNet: 85.5,
                ranking: 4200,
                subjectResults: [
                    { subject: "Türkçe", correct: 35, wrong: 3, empty: 2, net: 34.25, totalQuestions: 40, successRate: 87.5 },
                    { subject: "Matematik", correct: 28, wrong: 8, empty: 4, net: 26, totalQuestions: 40, successRate: 70 },
                    { subject: "Fen Bilimleri", correct: 14, wrong: 4, empty: 2, net: 13, totalQuestions: 20, successRate: 70 },
                    { subject: "Sosyal Bilimler", correct: 13, wrong: 3, empty: 4, net: 12.25, totalQuestions: 20, successRate: 65 }
                ]
            }
        ],

        // Konu performansları
        topicPerformance: [
            {
                subject: "Matematik",
                topic: "Türev",
                totalAttempts: 80,
                correctCount: 32,
                wrongCount: 48,
                successRate: 40,
                lastAttemptDate: "2024-12-20",
                difficulty: "hard",
                status: "struggling"
            },
            {
                subject: "Fizik",
                topic: "Dinamik",
                totalAttempts: 50,
                correctCount: 22,
                wrongCount: 28,
                successRate: 44,
                lastAttemptDate: "2024-12-18",
                difficulty: "hard",
                status: "struggling"
            },
            {
                subject: "Türkçe",
                topic: "Paragraf",
                totalAttempts: 100,
                correctCount: 85,
                wrongCount: 15,
                successRate: 85,
                lastAttemptDate: "2024-12-21",
                difficulty: "medium",
                status: "mastered"
            }
        ],

        // Çalışma istatistikleri
        studyStats: {
            totalStudyTimeMinutes: 15000,
            averageDailyStudyMinutes: 200,
            studyDaysCount: 75,
            currentStreak: 12,
            longestStreak: 21,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 210 },
                { day: "Salı", minutes: 180 },
                { day: "Çarşamba", minutes: 195 },
                { day: "Perşembe", minutes: 220 },
                { day: "Cuma", minutes: 150 },
                { day: "Cumartesi", minutes: 320 },
                { day: "Pazar", minutes: 290 }
            ],
            subjectDistribution: [
                { subject: "Matematik", minutes: 5000, percentage: 33 },
                { subject: "Fizik", minutes: 3000, percentage: 20 },
                { subject: "Türkçe", minutes: 2500, percentage: 17 },
                { subject: "Kimya", minutes: 2000, percentage: 13 },
                { subject: "Diğer", minutes: 2500, percentage: 17 }
            ],
            peakStudyHours: [15, 16, 21, 22, 23]
        },

        // Hedefler
        goals: {
            targetExam: "YKS",
            targetDate: "2025-06-15",
            targetRanking: 8000,
            dailyStudyGoalMinutes: 300,
            weeklyQuestionGoal: 700,
            targetNetPerSubject: [
                { subject: "Türkçe", currentNet: 34, targetNet: 38 },
                { subject: "Matematik", currentNet: 26, targetNet: 35 },
                { subject: "Fen Bilimleri", currentNet: 13, targetNet: 17 },
                { subject: "Sosyal Bilimler", currentNet: 12, targetNet: 16 }
            ]
        },

        // Güçlü/Zayıf yön analizi
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Türkçe", topics: ["Paragraf", "Dil Bilgisi"], averageSuccessRate: 85 },
                { subject: "Tarih", topics: ["Çağdaş Dünya Tarihi"], averageSuccessRate: 78 }
            ],
            weaknesses: [
                { subject: "Matematik", topics: ["Türev", "İntegral", "Limit"], averageSuccessRate: 40, priority: "critical" },
                { subject: "Fizik", topics: ["Dinamik", "Enerji"], averageSuccessRate: 44, priority: "high" },
                { subject: "Kimya", topics: ["Organik Kimya"], averageSuccessRate: 50, priority: "medium" }
            ],
            recommendations: [
                "Matematik'te günlük en az 40 dakika türev-integral çalışması",
                "Fizik Dinamik için video ders + soru çözümü kombinasyonu",
                "Hafta sonu toplam 4 saat sadece zayıf konulara odaklanma"
            ]
        },

        // Anlık durum
        currentEnergy: "medium",
        currentFocus: "sharp",
        currentAnxiety: "mild",

        lastUpdated: new Date().toISOString()
    };

    return studentData;
}

// ============================================================================
// IFRAME / WIDGET ENTEGRASYONU
// ============================================================================

/**
 * VİSİ AI'yi iframe olarak platformunuza ekleyin:
 * 
 * <iframe 
 *   src="https://visi-ai.yourplatform.com/chat?studentId=123&token=xxx"
 *   width="400"
 *   height="600"
 *   style="border: none; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);"
 * />
 * 
 * Query parametreleri:
 * - studentId: Öğrenci ID'si
 * - token: Güvenlik tokeni (JWT önerilir)
 * - theme: dark | light
 * - lang: tr | en
 */

// ============================================================================
// WEBHOOK ENTEGRASYONU
// ============================================================================

/**
 * VİSİ AI'den platformunuza webhook göndermek için:
 * 
 * Webhook eventleri:
 * - session.started: Öğrenci chat başlattığında
 * - session.ended: Öğrenci chat'i kapattığında
 * - plan.created: AI bir çalışma planı oluşturduğunda
 * - goal.achieved: Öğrenci bir hedef tamamladığında
 * - alert.anxiety: Yüksek kaygı tespit edildiğinde
 */
export interface WebhookPayload {
    event: 'session.started' | 'session.ended' | 'plan.created' | 'goal.achieved' | 'alert.anxiety';
    studentId: string;
    timestamp: string;
    data: any;
}

/**
 * Webhook alıcı örneği (platformunuzda):
 */
export async function handleVisiAIWebhook(payload: WebhookPayload) {
    switch (payload.event) {
        case 'session.started':
            console.log(`Öğrenci ${payload.studentId} VİSİ AI'yi kullanmaya başladı`);
            break;

        case 'plan.created':
            console.log(`Öğrenci ${payload.studentId} için yeni plan oluşturuldu:`, payload.data);
            // Planı platformunuza kaydedin
            break;

        case 'alert.anxiety':
            console.log(`⚠️ Öğrenci ${payload.studentId} yüksek kaygı gösteriyor`);
            // Rehberlik servisine bildirim gönderin
            break;
    }
}
