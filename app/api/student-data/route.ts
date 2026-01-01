import { NextResponse } from 'next/server';
import {
    StudentProfile,
    analyzeStudentPerformance,
    generateStudentDataPrompt,
    prioritizeTopics
} from '@/lib/studentData';

/**
 * POST /api/student-data
 * 
 * Dış eğitim platformundan öğrenci verisi alır ve VİSİ AI için
 * hazırlanmış analiz ve önerileri döndürür.
 * 
 * Bu endpoint, platformunuz tarafından çağrılacak ve öğrenci
 * verilerini VİSİ AI'ya iletecektir.
 */
export async function POST(req: Request) {
    try {
        const studentProfile: StudentProfile = await req.json();

        // Veri doğrulama
        if (!studentProfile.studentId) {
            return NextResponse.json(
                { error: 'studentId zorunludur.' },
                { status: 400 }
            );
        }

        if (!studentProfile.level) {
            return NextResponse.json(
                { error: 'level (seviye) zorunludur.' },
                { status: 400 }
            );
        }

        // Analiz ve öneriler oluştur
        const performanceAnalysis = analyzeStudentPerformance(studentProfile);
        const priorityTopics = prioritizeTopics(studentProfile);
        const aiPrompt = generateStudentDataPrompt(studentProfile);

        // Özet istatistikler
        const summary = {
            studentId: studentProfile.studentId,
            name: studentProfile.name,
            level: studentProfile.level,
            targetExam: studentProfile.targetExam,

            // Son deneme özeti
            lastExam: studentProfile.recentExams?.[0] ? {
                type: studentProfile.recentExams[0].examType,
                totalNet: studentProfile.recentExams[0].totalNet,
                date: studentProfile.recentExams[0].date,
            } : null,

            // Çalışma özeti
            studyStats: studentProfile.studyStats ? {
                averageDailyMinutes: studentProfile.studyStats.averageDailyStudyMinutes,
                currentStreak: studentProfile.studyStats.currentStreak,
                totalHours: Math.round(studentProfile.studyStats.totalStudyTimeMinutes / 60),
            } : null,

            // Öncelikli konular
            priorityTopics: priorityTopics.map(t => ({
                subject: t.subject,
                topic: t.topic,
                successRate: t.successRate,
                status: t.status,
            })),

            // Durum
            currentState: {
                energy: studentProfile.currentEnergy || 'medium',
                focus: studentProfile.currentFocus || 'sharp',
                anxiety: studentProfile.currentAnxiety || 'calm',
            },
        };

        return NextResponse.json({
            success: true,
            summary,
            performanceAnalysis,
            priorityTopics,
            aiPrompt, // Bu prompt VİSİ AI'ya gönderilecek
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Student data API error:', error);
        return NextResponse.json(
            { error: error.message || 'Veri işlenemedi.' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/student-data
 * 
 * API dokümantasyonu ve örnek veri yapısı döndürür.
 */
export async function GET() {
    const exampleProfile = {
        studentId: "student_123",
        name: "Örnek Öğrenci",
        level: "Lise",
        grade: 11,
        targetExam: "YKS",

        recentExams: [
            {
                examId: "exam_001",
                examType: "TYT",
                examName: "Ocak Ayı TYT Denemesi",
                date: "2024-01-15",
                totalCorrect: 85,
                totalWrong: 20,
                totalEmpty: 15,
                totalNet: 80,
                ranking: 5420,
                subjectResults: [
                    { subject: "Türkçe", correct: 32, wrong: 5, empty: 3, net: 30.75, totalQuestions: 40, successRate: 80 },
                    { subject: "Matematik", correct: 25, wrong: 8, empty: 7, net: 23, totalQuestions: 40, successRate: 62.5 },
                    { subject: "Fen Bilimleri", correct: 15, wrong: 4, empty: 1, net: 14, totalQuestions: 20, successRate: 75 },
                    { subject: "Sosyal Bilimler", correct: 13, wrong: 3, empty: 4, net: 12.25, totalQuestions: 20, successRate: 65 }
                ]
            }
        ],

        topicPerformance: [
            { subject: "Matematik", topic: "Türev", totalAttempts: 50, correctCount: 20, wrongCount: 30, successRate: 40, lastAttemptDate: "2024-01-20", difficulty: "hard", status: "struggling" },
            { subject: "Matematik", topic: "Limit", totalAttempts: 40, correctCount: 28, wrongCount: 12, successRate: 70, lastAttemptDate: "2024-01-18", difficulty: "medium", status: "learning" },
            { subject: "Fizik", topic: "Dinamik", totalAttempts: 30, correctCount: 12, wrongCount: 18, successRate: 40, lastAttemptDate: "2024-01-19", difficulty: "hard", status: "struggling" }
        ],

        studyStats: {
            totalStudyTimeMinutes: 12000,
            averageDailyStudyMinutes: 180,
            studyDaysCount: 67,
            currentStreak: 5,
            longestStreak: 14,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 200 },
                { day: "Salı", minutes: 180 },
                { day: "Çarşamba", minutes: 150 },
                { day: "Perşembe", minutes: 220 },
                { day: "Cuma", minutes: 140 },
                { day: "Cumartesi", minutes: 300 },
                { day: "Pazar", minutes: 280 }
            ],
            subjectDistribution: [
                { subject: "Matematik", minutes: 4000, percentage: 33 },
                { subject: "Fizik", minutes: 2500, percentage: 21 },
                { subject: "Türkçe", minutes: 2000, percentage: 17 }
            ],
            peakStudyHours: [14, 15, 16, 21, 22]
        },

        goals: {
            targetExam: "YKS",
            targetDate: "2024-06-15",
            targetRanking: 10000,
            dailyStudyGoalMinutes: 240,
            weeklyQuestionGoal: 500
        },

        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Türkçe", topics: ["Paragraf", "Dil Bilgisi"], averageSuccessRate: 80 }
            ],
            weaknesses: [
                { subject: "Matematik", topics: ["Türev", "İntegral"], averageSuccessRate: 40, priority: "critical" },
                { subject: "Fizik", topics: ["Dinamik"], averageSuccessRate: 40, priority: "high" }
            ],
            recommendations: [
                "Matematik Türev konusuna günde en az 30 dakika ayırın",
                "Fizik Dinamik için video derslerle başlayın"
            ]
        },

        currentEnergy: "medium",
        currentFocus: "sharp",
        currentAnxiety: "mild",
        lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
        message: "VİSİ AI Student Data API",
        version: "1.0",
        endpoints: {
            "POST /api/student-data": "Öğrenci verisi gönder ve analiz al",
            "GET /api/student-data": "API dokümantasyonu"
        },
        exampleRequest: exampleProfile,
        requiredFields: ["studentId", "level"],
        optionalFields: [
            "name", "grade", "targetExam", "recentExams", "topicPerformance",
            "studyStats", "goals", "strengthWeaknessAnalysis",
            "currentEnergy", "currentFocus", "currentAnxiety"
        ]
    });
}
