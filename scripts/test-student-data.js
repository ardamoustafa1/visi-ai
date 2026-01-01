/**
 * VİSİ AI - 10 Öğrencilik Test Verisi
 * Her öğrenci için detaylı deneme sonuçları, matematik sonuçları,
 * çalışma istatistikleri ve performans verileri içerir.
 */

const testStudents = [
    // ÖĞRENCİ 1 - Başarılı, YKS Hazırlık
    {
        studentId: "ogrenci_001",
        name: "Ahmet Yılmaz",
        level: "Lise",
        grade: 12,
        targetExam: "YKS",
        recentExams: [
            {
                examId: "deneme_001",
                examType: "TYT",
                examName: "Aralık TYT Genel Deneme",
                date: "2025-12-20",
                totalCorrect: 105,
                totalWrong: 12,
                totalEmpty: 3,
                totalNet: 102,
                ranking: 1250,
                percentile: 98.5,
                subjectResults: [
                    { subject: "Türkçe", correct: 38, wrong: 2, empty: 0, net: 37.5, totalQuestions: 40, successRate: 95 },
                    { subject: "Matematik", correct: 35, wrong: 3, empty: 2, net: 34.25, totalQuestions: 40, successRate: 87.5 },
                    { subject: "Fen Bilimleri", correct: 18, wrong: 2, empty: 0, net: 17.5, totalQuestions: 20, successRate: 90 },
                    { subject: "Sosyal Bilimler", correct: 14, wrong: 5, empty: 1, net: 12.75, totalQuestions: 20, successRate: 70 }
                ]
            },
            {
                examId: "deneme_002",
                examType: "AYT",
                examName: "Aralık AYT Sayısal Deneme",
                date: "2025-12-22",
                totalCorrect: 62,
                totalWrong: 10,
                totalEmpty: 8,
                totalNet: 59.5,
                ranking: 2100,
                percentile: 96,
                subjectResults: [
                    { subject: "Matematik", correct: 28, wrong: 5, empty: 7, net: 26.75, totalQuestions: 40, successRate: 70 },
                    { subject: "Fizik", correct: 12, wrong: 2, empty: 0, net: 11.5, totalQuestions: 14, successRate: 85.7 },
                    { subject: "Kimya", correct: 10, wrong: 2, empty: 1, net: 9.5, totalQuestions: 13, successRate: 76.9 },
                    { subject: "Biyoloji", correct: 12, wrong: 1, empty: 0, net: 11.75, totalQuestions: 13, successRate: 92.3 }
                ]
            }
        ],
        topicPerformance: [
            { subject: "Matematik", topic: "Türev", totalAttempts: 120, correctCount: 96, wrongCount: 24, successRate: 80, lastAttemptDate: "2025-12-28", difficulty: "hard", status: "mastered" },
            { subject: "Matematik", topic: "İntegral", totalAttempts: 80, correctCount: 56, wrongCount: 24, successRate: 70, lastAttemptDate: "2025-12-27", difficulty: "hard", status: "learning" },
            { subject: "Matematik", topic: "Limit", totalAttempts: 100, correctCount: 85, wrongCount: 15, successRate: 85, lastAttemptDate: "2025-12-26", difficulty: "medium", status: "mastered" },
            { subject: "Fizik", topic: "Elektrik", totalAttempts: 60, correctCount: 48, wrongCount: 12, successRate: 80, lastAttemptDate: "2025-12-25", difficulty: "hard", status: "mastered" },
            { subject: "Kimya", topic: "Organik Kimya", totalAttempts: 50, correctCount: 35, wrongCount: 15, successRate: 70, lastAttemptDate: "2025-12-24", difficulty: "hard", status: "learning" }
        ],
        studyStats: {
            totalStudyTimeMinutes: 36000,
            averageDailyStudyMinutes: 300,
            studyDaysCount: 120,
            currentStreak: 45,
            longestStreak: 60,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 320 },
                { day: "Salı", minutes: 280 },
                { day: "Çarşamba", minutes: 300 },
                { day: "Perşembe", minutes: 340 },
                { day: "Cuma", minutes: 260 },
                { day: "Cumartesi", minutes: 400 },
                { day: "Pazar", minutes: 380 }
            ],
            subjectDistribution: [
                { subject: "Matematik", minutes: 12000, percentage: 33 },
                { subject: "Fizik", minutes: 8000, percentage: 22 },
                { subject: "Kimya", minutes: 6000, percentage: 17 },
                { subject: "Biyoloji", minutes: 5000, percentage: 14 },
                { subject: "Türkçe", minutes: 5000, percentage: 14 }
            ],
            peakStudyHours: [9, 10, 14, 15, 21, 22]
        },
        goals: {
            targetExam: "YKS",
            targetDate: "2026-06-15",
            targetRanking: 1000,
            targetPercentile: 99,
            dailyStudyGoalMinutes: 360,
            weeklyQuestionGoal: 700,
            targetNetPerSubject: [
                { subject: "Matematik", currentNet: 34, targetNet: 38 },
                { subject: "Fizik", currentNet: 11.5, targetNet: 13 },
                { subject: "Kimya", currentNet: 9.5, targetNet: 12 }
            ]
        },
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Türkçe", topics: ["Paragraf", "Dil Bilgisi", "Anlam Bilgisi"], averageSuccessRate: 95 },
                { subject: "Biyoloji", topics: ["Hücre", "Genetik", "Ekosistem"], averageSuccessRate: 92 }
            ],
            weaknesses: [
                { subject: "Sosyal Bilimler", topics: ["Tarih", "Coğrafya"], averageSuccessRate: 70, priority: "medium" },
                { subject: "Kimya", topics: ["Organik Kimya", "Asit-Baz"], averageSuccessRate: 70, priority: "high" }
            ],
            recommendations: [
                "Organik Kimya'ya günde 45 dakika ayırın",
                "Sosyal Bilimler için haftalık tekrar yapın"
            ]
        },
        currentEnergy: "high",
        currentFocus: "sharp",
        currentAnxiety: "mild",
        lastUpdated: "2025-12-31T10:00:00Z"
    },

    // ÖĞRENCİ 2 - Orta Düzey, LGS Hazırlık
    {
        studentId: "ogrenci_002",
        name: "Zeynep Kaya",
        level: "Ortaokul",
        grade: 8,
        targetExam: "LGS",
        recentExams: [
            {
                examId: "deneme_003",
                examType: "LGS",
                examName: "Aralık LGS Denemesi",
                date: "2025-12-18",
                totalCorrect: 65,
                totalWrong: 18,
                totalEmpty: 7,
                totalNet: 60.5,
                ranking: 8500,
                percentile: 85,
                subjectResults: [
                    { subject: "Türkçe", correct: 16, wrong: 3, empty: 1, net: 15.25, totalQuestions: 20, successRate: 80 },
                    { subject: "Matematik", correct: 12, wrong: 6, empty: 2, net: 10.5, totalQuestions: 20, successRate: 60 },
                    { subject: "Fen Bilimleri", correct: 15, wrong: 4, empty: 1, net: 14, totalQuestions: 20, successRate: 75 },
                    { subject: "İnkılap Tarihi", correct: 8, wrong: 2, empty: 0, net: 7.5, totalQuestions: 10, successRate: 80 },
                    { subject: "Din Kültürü", correct: 7, wrong: 2, empty: 1, net: 6.5, totalQuestions: 10, successRate: 70 },
                    { subject: "İngilizce", correct: 7, wrong: 1, empty: 2, net: 6.75, totalQuestions: 10, successRate: 70 }
                ]
            }
        ],
        topicPerformance: [
            { subject: "Matematik", topic: "Denklemler", totalAttempts: 80, correctCount: 48, wrongCount: 32, successRate: 60, lastAttemptDate: "2025-12-28", difficulty: "medium", status: "learning" },
            { subject: "Matematik", topic: "Üçgenler", totalAttempts: 60, correctCount: 30, wrongCount: 30, successRate: 50, lastAttemptDate: "2025-12-27", difficulty: "hard", status: "struggling" },
            { subject: "Matematik", topic: "Olasılık", totalAttempts: 40, correctCount: 28, wrongCount: 12, successRate: 70, lastAttemptDate: "2025-12-26", difficulty: "medium", status: "learning" },
            { subject: "Fen Bilimleri", topic: "Basit Makineler", totalAttempts: 50, correctCount: 40, wrongCount: 10, successRate: 80, lastAttemptDate: "2025-12-25", difficulty: "medium", status: "mastered" },
            { subject: "Türkçe", topic: "Paragraf", totalAttempts: 100, correctCount: 85, wrongCount: 15, successRate: 85, lastAttemptDate: "2025-12-28", difficulty: "medium", status: "mastered" }
        ],
        studyStats: {
            totalStudyTimeMinutes: 18000,
            averageDailyStudyMinutes: 180,
            studyDaysCount: 100,
            currentStreak: 12,
            longestStreak: 21,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 180 },
                { day: "Salı", minutes: 200 },
                { day: "Çarşamba", minutes: 160 },
                { day: "Perşembe", minutes: 180 },
                { day: "Cuma", minutes: 120 },
                { day: "Cumartesi", minutes: 240 },
                { day: "Pazar", minutes: 220 }
            ],
            subjectDistribution: [
                { subject: "Matematik", minutes: 6000, percentage: 33 },
                { subject: "Fen Bilimleri", minutes: 4500, percentage: 25 },
                { subject: "Türkçe", minutes: 4000, percentage: 22 },
                { subject: "Sosyal", minutes: 3500, percentage: 20 }
            ],
            peakStudyHours: [15, 16, 17, 20, 21]
        },
        goals: {
            targetExam: "LGS",
            targetDate: "2026-06-08",
            targetRanking: 5000,
            dailyStudyGoalMinutes: 240,
            weeklyQuestionGoal: 400
        },
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Türkçe", topics: ["Paragraf", "Sözcük Türleri"], averageSuccessRate: 85 },
                { subject: "Fen Bilimleri", topics: ["Basit Makineler", "Elektrik"], averageSuccessRate: 80 }
            ],
            weaknesses: [
                { subject: "Matematik", topics: ["Üçgenler", "Geometri"], averageSuccessRate: 50, priority: "critical" },
                { subject: "Matematik", topics: ["Denklemler"], averageSuccessRate: 60, priority: "high" }
            ],
            recommendations: [
                "Üçgenler konusuna her gün 30 dakika ayırın",
                "Geometri temel kavramlarını video ile tekrar edin"
            ]
        },
        currentEnergy: "medium",
        currentFocus: "sharp",
        currentAnxiety: "mild",
        lastUpdated: "2025-12-31T11:00:00Z"
    },

    // ÖĞRENCİ 3 - Düşük Performans, TYT Hazırlık
    {
        studentId: "ogrenci_003",
        name: "Mehmet Demir",
        level: "Lise",
        grade: 11,
        targetExam: "YKS",
        recentExams: [
            {
                examId: "deneme_004",
                examType: "TYT",
                examName: "Aralık TYT Denemesi",
                date: "2025-12-15",
                totalCorrect: 55,
                totalWrong: 35,
                totalEmpty: 30,
                totalNet: 46.25,
                ranking: 85000,
                percentile: 45,
                subjectResults: [
                    { subject: "Türkçe", correct: 22, wrong: 10, empty: 8, net: 19.5, totalQuestions: 40, successRate: 55 },
                    { subject: "Matematik", correct: 10, wrong: 15, empty: 15, net: 6.25, totalQuestions: 40, successRate: 25 },
                    { subject: "Fen Bilimleri", correct: 12, wrong: 5, empty: 3, net: 10.75, totalQuestions: 20, successRate: 60 },
                    { subject: "Sosyal Bilimler", correct: 11, wrong: 5, empty: 4, net: 9.75, totalQuestions: 20, successRate: 55 }
                ]
            }
        ],
        topicPerformance: [
            { subject: "Matematik", topic: "Temel Kavramlar", totalAttempts: 100, correctCount: 35, wrongCount: 65, successRate: 35, lastAttemptDate: "2025-12-28", difficulty: "easy", status: "struggling" },
            { subject: "Matematik", topic: "Fonksiyonlar", totalAttempts: 40, correctCount: 8, wrongCount: 32, successRate: 20, lastAttemptDate: "2025-12-27", difficulty: "medium", status: "struggling" },
            { subject: "Matematik", topic: "Polinomlar", totalAttempts: 30, correctCount: 6, wrongCount: 24, successRate: 20, lastAttemptDate: "2025-12-20", difficulty: "medium", status: "struggling" },
            { subject: "Fizik", topic: "Hareket", totalAttempts: 50, correctCount: 30, wrongCount: 20, successRate: 60, lastAttemptDate: "2025-12-26", difficulty: "medium", status: "learning" }
        ],
        studyStats: {
            totalStudyTimeMinutes: 6000,
            averageDailyStudyMinutes: 60,
            studyDaysCount: 100,
            currentStreak: 3,
            longestStreak: 7,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 60 },
                { day: "Salı", minutes: 45 },
                { day: "Çarşamba", minutes: 30 },
                { day: "Perşembe", minutes: 75 },
                { day: "Cuma", minutes: 30 },
                { day: "Cumartesi", minutes: 120 },
                { day: "Pazar", minutes: 90 }
            ],
            subjectDistribution: [
                { subject: "Matematik", minutes: 2000, percentage: 33 },
                { subject: "Türkçe", minutes: 1500, percentage: 25 },
                { subject: "Fen", minutes: 1500, percentage: 25 },
                { subject: "Sosyal", minutes: 1000, percentage: 17 }
            ],
            peakStudyHours: [21, 22, 23]
        },
        goals: {
            targetExam: "YKS",
            targetDate: "2027-06-15",
            targetRanking: 50000,
            dailyStudyGoalMinutes: 180,
            weeklyQuestionGoal: 200
        },
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Fen Bilimleri", topics: ["Hareket", "Kuvvet"], averageSuccessRate: 60 }
            ],
            weaknesses: [
                { subject: "Matematik", topics: ["Temel Kavramlar", "Fonksiyonlar", "Polinomlar"], averageSuccessRate: 25, priority: "critical" },
                { subject: "Türkçe", topics: ["Paragraf Yorumlama"], averageSuccessRate: 55, priority: "high" }
            ],
            recommendations: [
                "Matematik temelden başlayın - sayı sistemleri",
                "Günlük çalışma süresini 180 dakikaya çıkarın",
                "Her gün en az 20 paragraf sorusu çözün"
            ]
        },
        currentEnergy: "low",
        currentFocus: "scattered",
        currentAnxiety: "high",
        lastUpdated: "2025-12-31T12:00:00Z"
    },

    // ÖĞRENCİ 4 - Eşit Ağırlık, 10. Sınıf
    {
        studentId: "ogrenci_004",
        name: "Elif Şahin",
        level: "Lise",
        grade: 10,
        targetExam: "YKS",
        recentExams: [
            {
                examId: "deneme_005",
                examType: "TYT",
                examName: "10. Sınıf TYT Denemesi",
                date: "2025-12-19",
                totalCorrect: 78,
                totalWrong: 22,
                totalEmpty: 20,
                totalNet: 72.5,
                ranking: 25000,
                percentile: 75,
                subjectResults: [
                    { subject: "Türkçe", correct: 32, wrong: 5, empty: 3, net: 30.75, totalQuestions: 40, successRate: 80 },
                    { subject: "Matematik", correct: 20, wrong: 10, empty: 10, net: 17.5, totalQuestions: 40, successRate: 50 },
                    { subject: "Fen Bilimleri", correct: 13, wrong: 4, empty: 3, net: 12, totalQuestions: 20, successRate: 65 },
                    { subject: "Sosyal Bilimler", correct: 13, wrong: 3, empty: 4, net: 12.25, totalQuestions: 20, successRate: 65 }
                ]
            }
        ],
        topicPerformance: [
            { subject: "Türkçe", topic: "Paragraf", totalAttempts: 150, correctCount: 127, wrongCount: 23, successRate: 85, lastAttemptDate: "2025-12-28", difficulty: "medium", status: "mastered" },
            { subject: "Matematik", topic: "Fonksiyonlar", totalAttempts: 60, correctCount: 30, wrongCount: 30, successRate: 50, lastAttemptDate: "2025-12-27", difficulty: "medium", status: "learning" },
            { subject: "Edebiyat", topic: "Roman", totalAttempts: 40, correctCount: 32, wrongCount: 8, successRate: 80, lastAttemptDate: "2025-12-26", difficulty: "medium", status: "mastered" },
            { subject: "Tarih", topic: "Osmanlı Tarihi", totalAttempts: 50, correctCount: 35, wrongCount: 15, successRate: 70, lastAttemptDate: "2025-12-25", difficulty: "medium", status: "learning" }
        ],
        studyStats: {
            totalStudyTimeMinutes: 14400,
            averageDailyStudyMinutes: 150,
            studyDaysCount: 96,
            currentStreak: 18,
            longestStreak: 25,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 140 },
                { day: "Salı", minutes: 160 },
                { day: "Çarşamba", minutes: 130 },
                { day: "Perşembe", minutes: 150 },
                { day: "Cuma", minutes: 120 },
                { day: "Cumartesi", minutes: 200 },
                { day: "Pazar", minutes: 180 }
            ],
            subjectDistribution: [
                { subject: "Türkçe", minutes: 4500, percentage: 31 },
                { subject: "Matematik", minutes: 4000, percentage: 28 },
                { subject: "Sosyal", minutes: 3500, percentage: 24 },
                { subject: "Fen", minutes: 2400, percentage: 17 }
            ],
            peakStudyHours: [16, 17, 18, 21]
        },
        goals: {
            targetExam: "YKS",
            targetDate: "2028-06-15",
            targetRanking: 15000,
            dailyStudyGoalMinutes: 180,
            weeklyQuestionGoal: 350
        },
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Türkçe", topics: ["Paragraf", "Dil Bilgisi"], averageSuccessRate: 85 },
                { subject: "Edebiyat", topics: ["Roman", "Şiir Bilgisi"], averageSuccessRate: 80 }
            ],
            weaknesses: [
                { subject: "Matematik", topics: ["Fonksiyonlar", "Karmaşık Sayılar"], averageSuccessRate: 50, priority: "high" }
            ],
            recommendations: [
                "Matematik fonksiyonlara daha fazla zaman ayırın",
                "Türkçe güçlü yönünüzü koruyun"
            ]
        },
        currentEnergy: "medium",
        currentFocus: "sharp",
        currentAnxiety: "calm",
        lastUpdated: "2025-12-31T13:00:00Z"
    },

    // ÖĞRENCİ 5 - Sayısal, Çok Başarılı
    {
        studentId: "ogrenci_005",
        name: "Can Yıldırım",
        level: "Lise",
        grade: 12,
        targetExam: "YKS",
        recentExams: [
            {
                examId: "deneme_006",
                examType: "TYT",
                examName: "Aralık TYT Denemesi",
                date: "2025-12-21",
                totalCorrect: 112,
                totalWrong: 5,
                totalEmpty: 3,
                totalNet: 110.75,
                ranking: 250,
                percentile: 99.8,
                subjectResults: [
                    { subject: "Türkçe", correct: 39, wrong: 1, empty: 0, net: 38.75, totalQuestions: 40, successRate: 97.5 },
                    { subject: "Matematik", correct: 38, wrong: 1, empty: 1, net: 37.75, totalQuestions: 40, successRate: 95 },
                    { subject: "Fen Bilimleri", correct: 19, wrong: 1, empty: 0, net: 18.75, totalQuestions: 20, successRate: 95 },
                    { subject: "Sosyal Bilimler", correct: 16, wrong: 2, empty: 2, net: 15.5, totalQuestions: 20, successRate: 80 }
                ]
            },
            {
                examId: "deneme_007",
                examType: "AYT",
                examName: "Aralık AYT Denemesi",
                date: "2025-12-23",
                totalCorrect: 72,
                totalWrong: 5,
                totalEmpty: 3,
                totalNet: 70.75,
                ranking: 180,
                percentile: 99.9,
                subjectResults: [
                    { subject: "Matematik", correct: 36, wrong: 2, empty: 2, net: 35.5, totalQuestions: 40, successRate: 90 },
                    { subject: "Fizik", correct: 13, wrong: 1, empty: 0, net: 12.75, totalQuestions: 14, successRate: 92.8 },
                    { subject: "Kimya", correct: 12, wrong: 1, empty: 0, net: 11.75, totalQuestions: 13, successRate: 92.3 },
                    { subject: "Biyoloji", correct: 11, wrong: 1, empty: 1, net: 10.75, totalQuestions: 13, successRate: 84.6 }
                ]
            }
        ],
        topicPerformance: [
            { subject: "Matematik", topic: "Türev", totalAttempts: 200, correctCount: 190, wrongCount: 10, successRate: 95, lastAttemptDate: "2025-12-29", difficulty: "hard", status: "mastered" },
            { subject: "Matematik", topic: "İntegral", totalAttempts: 180, correctCount: 168, wrongCount: 12, successRate: 93, lastAttemptDate: "2025-12-28", difficulty: "hard", status: "mastered" },
            { subject: "Fizik", topic: "Modern Fizik", totalAttempts: 100, correctCount: 92, wrongCount: 8, successRate: 92, lastAttemptDate: "2025-12-27", difficulty: "hard", status: "mastered" },
            { subject: "Kimya", topic: "Organik Kimya", totalAttempts: 90, correctCount: 81, wrongCount: 9, successRate: 90, lastAttemptDate: "2025-12-26", difficulty: "hard", status: "mastered" }
        ],
        studyStats: {
            totalStudyTimeMinutes: 48000,
            averageDailyStudyMinutes: 400,
            studyDaysCount: 120,
            currentStreak: 90,
            longestStreak: 90,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 420 },
                { day: "Salı", minutes: 400 },
                { day: "Çarşamba", minutes: 380 },
                { day: "Perşembe", minutes: 420 },
                { day: "Cuma", minutes: 360 },
                { day: "Cumartesi", minutes: 480 },
                { day: "Pazar", minutes: 450 }
            ],
            subjectDistribution: [
                { subject: "Matematik", minutes: 16000, percentage: 33 },
                { subject: "Fizik", minutes: 12000, percentage: 25 },
                { subject: "Kimya", minutes: 10000, percentage: 21 },
                { subject: "Biyoloji", minutes: 6000, percentage: 13 },
                { subject: "Türkçe", minutes: 4000, percentage: 8 }
            ],
            peakStudyHours: [6, 7, 8, 14, 15, 16, 21, 22]
        },
        goals: {
            targetExam: "YKS",
            targetDate: "2026-06-15",
            targetRanking: 100,
            dailyStudyGoalMinutes: 420,
            weeklyQuestionGoal: 1000
        },
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Matematik", topics: ["Türev", "İntegral", "Limit", "Fonksiyonlar"], averageSuccessRate: 95 },
                { subject: "Fizik", topics: ["Modern Fizik", "Elektrik"], averageSuccessRate: 92 },
                { subject: "Kimya", topics: ["Organik Kimya", "Termokimya"], averageSuccessRate: 90 }
            ],
            weaknesses: [
                { subject: "Sosyal Bilimler", topics: ["Tarih", "Coğrafya"], averageSuccessRate: 80, priority: "low" }
            ],
            recommendations: [
                "TYT Sosyal için haftada 2 saat ayırın",
                "Mevcut performansı koruyun"
            ]
        },
        currentEnergy: "high",
        currentFocus: "sharp",
        currentAnxiety: "calm",
        lastUpdated: "2025-12-31T14:00:00Z"
    },

    // ÖĞRENCİ 6 - 9. Sınıf, Yeni Başlayan
    {
        studentId: "ogrenci_006",
        name: "Selin Arslan",
        level: "Lise",
        grade: 9,
        targetExam: "YKS",
        recentExams: [
            {
                examId: "deneme_008",
                examType: "TYT",
                examName: "9. Sınıf TYT Denemesi",
                date: "2025-12-17",
                totalCorrect: 45,
                totalWrong: 25,
                totalEmpty: 50,
                totalNet: 38.75,
                ranking: 120000,
                percentile: 30,
                subjectResults: [
                    { subject: "Türkçe", correct: 18, wrong: 8, empty: 14, net: 16, totalQuestions: 40, successRate: 45 },
                    { subject: "Matematik", correct: 8, wrong: 12, empty: 20, net: 5, totalQuestions: 40, successRate: 20 },
                    { subject: "Fen Bilimleri", correct: 10, wrong: 3, empty: 7, net: 9.25, totalQuestions: 20, successRate: 50 },
                    { subject: "Sosyal Bilimler", correct: 9, wrong: 2, empty: 9, net: 8.5, totalQuestions: 20, successRate: 45 }
                ]
            }
        ],
        topicPerformance: [
            { subject: "Matematik", topic: "Sayılar", totalAttempts: 50, correctCount: 20, wrongCount: 30, successRate: 40, lastAttemptDate: "2025-12-28", difficulty: "easy", status: "struggling" },
            { subject: "Matematik", topic: "Kümeler", totalAttempts: 30, correctCount: 15, wrongCount: 15, successRate: 50, lastAttemptDate: "2025-12-27", difficulty: "easy", status: "learning" },
            { subject: "Fizik", topic: "Vektörler", totalAttempts: 25, correctCount: 12, wrongCount: 13, successRate: 48, lastAttemptDate: "2025-12-26", difficulty: "easy", status: "learning" }
        ],
        studyStats: {
            totalStudyTimeMinutes: 3600,
            averageDailyStudyMinutes: 45,
            studyDaysCount: 80,
            currentStreak: 5,
            longestStreak: 10,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 45 },
                { day: "Salı", minutes: 50 },
                { day: "Çarşamba", minutes: 40 },
                { day: "Perşembe", minutes: 45 },
                { day: "Cuma", minutes: 30 },
                { day: "Cumartesi", minutes: 60 },
                { day: "Pazar", minutes: 50 }
            ],
            subjectDistribution: [
                { subject: "Matematik", minutes: 1200, percentage: 33 },
                { subject: "Türkçe", minutes: 1000, percentage: 28 },
                { subject: "Fen", minutes: 800, percentage: 22 },
                { subject: "Sosyal", minutes: 600, percentage: 17 }
            ],
            peakStudyHours: [17, 18, 19]
        },
        goals: {
            targetExam: "YKS",
            targetDate: "2029-06-15",
            targetRanking: 30000,
            dailyStudyGoalMinutes: 120,
            weeklyQuestionGoal: 150
        },
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Fen Bilimleri", topics: ["Madde ve Özellikleri"], averageSuccessRate: 50 }
            ],
            weaknesses: [
                { subject: "Matematik", topics: ["Sayılar", "Temel İşlemler"], averageSuccessRate: 40, priority: "critical" },
                { subject: "Türkçe", topics: ["Paragraf"], averageSuccessRate: 45, priority: "high" }
            ],
            recommendations: [
                "Matematik temellerini güçlendirin",
                "Her gün 30 dakika kitap okuyun",
                "Düzenli çalışma alışkanlığı edinin"
            ]
        },
        currentEnergy: "medium",
        currentFocus: "scattered",
        currentAnxiety: "mild",
        lastUpdated: "2025-12-31T15:00:00Z"
    },

    // ÖĞRENCİ 7 - KPSS Hazırlık
    {
        studentId: "ogrenci_007",
        name: "Burak Çelik",
        level: "Üniversite Mezunu",
        targetExam: "KPSS",
        recentExams: [
            {
                examId: "deneme_009",
                examType: "KPSS",
                examName: "KPSS Genel Yetenek Denemesi",
                date: "2025-12-20",
                totalCorrect: 48,
                totalWrong: 10,
                totalEmpty: 2,
                totalNet: 45.5,
                ranking: 15000,
                percentile: 80,
                subjectResults: [
                    { subject: "Türkçe", correct: 26, wrong: 3, empty: 1, net: 25.25, totalQuestions: 30, successRate: 86.6 },
                    { subject: "Matematik", correct: 22, wrong: 7, empty: 1, net: 20.25, totalQuestions: 30, successRate: 73.3 }
                ]
            }
        ],
        topicPerformance: [
            { subject: "Türkçe", topic: "Paragraf", totalAttempts: 200, correctCount: 170, wrongCount: 30, successRate: 85, lastAttemptDate: "2025-12-28", difficulty: "medium", status: "mastered" },
            { subject: "Matematik", topic: "Problem Çözme", totalAttempts: 150, correctCount: 105, wrongCount: 45, successRate: 70, lastAttemptDate: "2025-12-27", difficulty: "medium", status: "learning" },
            { subject: "Genel Kültür", topic: "Güncel Olaylar", totalAttempts: 100, correctCount: 75, wrongCount: 25, successRate: 75, lastAttemptDate: "2025-12-26", difficulty: "medium", status: "learning" }
        ],
        studyStats: {
            totalStudyTimeMinutes: 24000,
            averageDailyStudyMinutes: 240,
            studyDaysCount: 100,
            currentStreak: 30,
            longestStreak: 45,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 240 },
                { day: "Salı", minutes: 260 },
                { day: "Çarşamba", minutes: 220 },
                { day: "Perşembe", minutes: 250 },
                { day: "Cuma", minutes: 200 },
                { day: "Cumartesi", minutes: 300 },
                { day: "Pazar", minutes: 280 }
            ],
            subjectDistribution: [
                { subject: "Türkçe", minutes: 8000, percentage: 33 },
                { subject: "Matematik", minutes: 8000, percentage: 33 },
                { subject: "Genel Kültür", minutes: 8000, percentage: 34 }
            ],
            peakStudyHours: [9, 10, 11, 14, 15, 20, 21]
        },
        goals: {
            targetExam: "KPSS",
            targetDate: "2026-07-20",
            targetRanking: 5000,
            dailyStudyGoalMinutes: 300,
            weeklyQuestionGoal: 500
        },
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Türkçe", topics: ["Paragraf", "Dil Bilgisi"], averageSuccessRate: 85 }
            ],
            weaknesses: [
                { subject: "Matematik", topics: ["Problem Çözme", "Geometri"], averageSuccessRate: 70, priority: "high" }
            ],
            recommendations: [
                "Matematik problem çözme tekniklerini geliştirin",
                "Günlük 50 paragraf sorusu çözün"
            ]
        },
        currentEnergy: "high",
        currentFocus: "sharp",
        currentAnxiety: "mild",
        lastUpdated: "2025-12-31T16:00:00Z"
    },

    // ÖĞRENCİ 8 - DGS Hazırlık
    {
        studentId: "ogrenci_008",
        name: "Ayşe Koç",
        level: "Önlisans",
        targetExam: "DGS",
        recentExams: [
            {
                examId: "deneme_010",
                examType: "DGS",
                examName: "DGS Genel Deneme",
                date: "2025-12-22",
                totalCorrect: 70,
                totalWrong: 25,
                totalEmpty: 25,
                totalNet: 63.75,
                ranking: 8000,
                percentile: 75,
                subjectResults: [
                    { subject: "Türkçe", correct: 35, wrong: 10, empty: 15, net: 32.5, totalQuestions: 60, successRate: 58.3 },
                    { subject: "Matematik", correct: 35, wrong: 15, empty: 10, net: 31.25, totalQuestions: 60, successRate: 58.3 }
                ]
            }
        ],
        topicPerformance: [
            { subject: "Matematik", topic: "Sayısal Mantık", totalAttempts: 80, correctCount: 56, wrongCount: 24, successRate: 70, lastAttemptDate: "2025-12-28", difficulty: "medium", status: "learning" },
            { subject: "Matematik", topic: "Problemler", totalAttempts: 100, correctCount: 60, wrongCount: 40, successRate: 60, lastAttemptDate: "2025-12-27", difficulty: "medium", status: "learning" },
            { subject: "Türkçe", topic: "Anlam Bilgisi", totalAttempts: 90, correctCount: 72, wrongCount: 18, successRate: 80, lastAttemptDate: "2025-12-26", difficulty: "medium", status: "mastered" }
        ],
        studyStats: {
            totalStudyTimeMinutes: 18000,
            averageDailyStudyMinutes: 200,
            studyDaysCount: 90,
            currentStreak: 20,
            longestStreak: 30,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 200 },
                { day: "Salı", minutes: 220 },
                { day: "Çarşamba", minutes: 180 },
                { day: "Perşembe", minutes: 210 },
                { day: "Cuma", minutes: 160 },
                { day: "Cumartesi", minutes: 260 },
                { day: "Pazar", minutes: 240 }
            ],
            subjectDistribution: [
                { subject: "Matematik", minutes: 10000, percentage: 56 },
                { subject: "Türkçe", minutes: 8000, percentage: 44 }
            ],
            peakStudyHours: [10, 11, 15, 16, 20, 21]
        },
        goals: {
            targetExam: "DGS",
            targetDate: "2026-07-10",
            targetRanking: 3000,
            dailyStudyGoalMinutes: 240,
            weeklyQuestionGoal: 400
        },
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Türkçe", topics: ["Anlam Bilgisi", "Paragraf"], averageSuccessRate: 80 }
            ],
            weaknesses: [
                { subject: "Matematik", topics: ["Problemler", "Fonksiyonlar"], averageSuccessRate: 60, priority: "high" }
            ],
            recommendations: [
                "Problem çözme stratejilerini geliştirin",
                "Her gün 30 problem çözün"
            ]
        },
        currentEnergy: "medium",
        currentFocus: "sharp",
        currentAnxiety: "calm",
        lastUpdated: "2025-12-31T17:00:00Z"
    },

    // ÖĞRENCİ 9 - YDS Hazırlık
    {
        studentId: "ogrenci_009",
        name: "Emre Öztürk",
        level: "Üniversite",
        grade: 4,
        targetExam: "YDS",
        recentExams: [
            {
                examId: "deneme_011",
                examType: "YDS",
                examName: "YDS İngilizce Denemesi",
                date: "2025-12-23",
                totalCorrect: 60,
                totalWrong: 15,
                totalEmpty: 5,
                totalNet: 56.25,
                ranking: 5000,
                percentile: 85,
                subjectResults: [
                    { subject: "Vocabulary", correct: 18, wrong: 5, empty: 2, net: 16.75, totalQuestions: 25, successRate: 72 },
                    { subject: "Grammar", correct: 20, wrong: 4, empty: 1, net: 19, totalQuestions: 25, successRate: 80 },
                    { subject: "Reading", correct: 22, wrong: 6, empty: 2, net: 20.5, totalQuestions: 30, successRate: 73.3 }
                ]
            }
        ],
        topicPerformance: [
            { subject: "İngilizce", topic: "Grammar", totalAttempts: 300, correctCount: 240, wrongCount: 60, successRate: 80, lastAttemptDate: "2025-12-28", difficulty: "medium", status: "mastered" },
            { subject: "İngilizce", topic: "Vocabulary", totalAttempts: 500, correctCount: 350, wrongCount: 150, successRate: 70, lastAttemptDate: "2025-12-27", difficulty: "medium", status: "learning" },
            { subject: "İngilizce", topic: "Reading Comprehension", totalAttempts: 200, correctCount: 150, wrongCount: 50, successRate: 75, lastAttemptDate: "2025-12-26", difficulty: "hard", status: "learning" }
        ],
        studyStats: {
            totalStudyTimeMinutes: 12000,
            averageDailyStudyMinutes: 120,
            studyDaysCount: 100,
            currentStreak: 25,
            longestStreak: 35,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 120 },
                { day: "Salı", minutes: 130 },
                { day: "Çarşamba", minutes: 110 },
                { day: "Perşembe", minutes: 125 },
                { day: "Cuma", minutes: 100 },
                { day: "Cumartesi", minutes: 150 },
                { day: "Pazar", minutes: 140 }
            ],
            subjectDistribution: [
                { subject: "Vocabulary", minutes: 4000, percentage: 33 },
                { subject: "Grammar", minutes: 4000, percentage: 33 },
                { subject: "Reading", minutes: 4000, percentage: 34 }
            ],
            peakStudyHours: [8, 9, 19, 20, 21]
        },
        goals: {
            targetExam: "YDS",
            targetDate: "2026-03-15",
            targetRanking: 2000,
            dailyStudyGoalMinutes: 150,
            weeklyQuestionGoal: 300
        },
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "İngilizce", topics: ["Grammar", "Sentence Structure"], averageSuccessRate: 80 }
            ],
            weaknesses: [
                { subject: "İngilizce", topics: ["Vocabulary", "Idioms"], averageSuccessRate: 70, priority: "high" }
            ],
            recommendations: [
                "Her gün 50 yeni kelime ezberleyin",
                "Günde 2 okuma parçası çözün"
            ]
        },
        currentEnergy: "medium",
        currentFocus: "sharp",
        currentAnxiety: "calm",
        lastUpdated: "2025-12-31T18:00:00Z"
    },

    // ÖĞRENCİ 10 - Motivasyon Sorunu Olan
    {
        studentId: "ogrenci_010",
        name: "Deniz Aydın",
        level: "Lise",
        grade: 12,
        targetExam: "YKS",
        recentExams: [
            {
                examId: "deneme_012",
                examType: "TYT",
                examName: "Aralık TYT Denemesi",
                date: "2025-12-24",
                totalCorrect: 70,
                totalWrong: 30,
                totalEmpty: 20,
                totalNet: 62.5,
                ranking: 45000,
                percentile: 60,
                subjectResults: [
                    { subject: "Türkçe", correct: 28, wrong: 8, empty: 4, net: 26, totalQuestions: 40, successRate: 70 },
                    { subject: "Matematik", correct: 18, wrong: 12, empty: 10, net: 15, totalQuestions: 40, successRate: 45 },
                    { subject: "Fen Bilimleri", correct: 12, wrong: 5, empty: 3, net: 10.75, totalQuestions: 20, successRate: 60 },
                    { subject: "Sosyal Bilimler", correct: 12, wrong: 5, empty: 3, net: 10.75, totalQuestions: 20, successRate: 60 }
                ]
            },
            {
                examId: "deneme_013",
                examType: "TYT",
                examName: "Kasım TYT Denemesi",
                date: "2025-11-20",
                totalCorrect: 75,
                totalWrong: 25,
                totalEmpty: 20,
                totalNet: 68.75,
                ranking: 35000,
                percentile: 65,
                subjectResults: [
                    { subject: "Türkçe", correct: 30, wrong: 6, empty: 4, net: 28.5, totalQuestions: 40, successRate: 75 },
                    { subject: "Matematik", correct: 20, wrong: 10, empty: 10, net: 17.5, totalQuestions: 40, successRate: 50 },
                    { subject: "Fen Bilimleri", correct: 13, wrong: 4, empty: 3, net: 12, totalQuestions: 20, successRate: 65 },
                    { subject: "Sosyal Bilimler", correct: 12, wrong: 5, empty: 3, net: 10.75, totalQuestions: 20, successRate: 60 }
                ]
            }
        ],
        topicPerformance: [
            { subject: "Matematik", topic: "Problemler", totalAttempts: 100, correctCount: 45, wrongCount: 55, successRate: 45, lastAttemptDate: "2025-12-20", difficulty: "medium", status: "struggling" },
            { subject: "Matematik", topic: "Fonksiyonlar", totalAttempts: 60, correctCount: 24, wrongCount: 36, successRate: 40, lastAttemptDate: "2025-12-15", difficulty: "medium", status: "struggling" },
            { subject: "Türkçe", topic: "Paragraf", totalAttempts: 120, correctCount: 84, wrongCount: 36, successRate: 70, lastAttemptDate: "2025-12-25", difficulty: "medium", status: "learning" }
        ],
        studyStats: {
            totalStudyTimeMinutes: 9000,
            averageDailyStudyMinutes: 90,
            studyDaysCount: 100,
            currentStreak: 2,
            longestStreak: 14,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 90 },
                { day: "Salı", minutes: 100 },
                { day: "Çarşamba", minutes: 60 },
                { day: "Perşembe", minutes: 80 },
                { day: "Cuma", minutes: 40 },
                { day: "Cumartesi", minutes: 150 },
                { day: "Pazar", minutes: 120 }
            ],
            subjectDistribution: [
                { subject: "Matematik", minutes: 3000, percentage: 33 },
                { subject: "Türkçe", minutes: 2500, percentage: 28 },
                { subject: "Fen", minutes: 2000, percentage: 22 },
                { subject: "Sosyal", minutes: 1500, percentage: 17 }
            ],
            peakStudyHours: [21, 22, 23]
        },
        goals: {
            targetExam: "YKS",
            targetDate: "2026-06-15",
            targetRanking: 20000,
            dailyStudyGoalMinutes: 240,
            weeklyQuestionGoal: 350
        },
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Türkçe", topics: ["Paragraf", "Dil Bilgisi"], averageSuccessRate: 70 }
            ],
            weaknesses: [
                { subject: "Matematik", topics: ["Problemler", "Fonksiyonlar", "Türev"], averageSuccessRate: 42, priority: "critical" }
            ],
            recommendations: [
                "Düzenli çalışma alışkanlığı edinin",
                "Günlük hedeflerinizi küçük tutun",
                "Matematik temellerini güçlendirin",
                "Motivasyon için küçük ödüller koyun"
            ]
        },
        currentEnergy: "low",
        currentFocus: "scattered",
        currentAnxiety: "high",
        lastUpdated: "2025-12-31T19:00:00Z"
    }
];

// Test fonksiyonu - Tüm öğrenci verilerini API'ye gönder
async function testAllStudents() {
    const baseUrl = 'http://localhost:3000/api/student-data';

    console.log('='.repeat(80));
    console.log('VİSİ AI - 10 ÖĞRENCİ TEST VERİSİ');
    console.log('='.repeat(80));
    console.log('');

    for (const student of testStudents) {
        console.log(`\n${'─'.repeat(80)}`);
        console.log(`📚 ÖĞRENCİ: ${student.name} (${student.studentId})`);
        console.log(`📊 Seviye: ${student.level}${student.grade ? ` - ${student.grade}. Sınıf` : ''}`);
        console.log(`🎯 Hedef: ${student.targetExam}`);
        console.log(`${'─'.repeat(80)}`);

        try {
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });

            const result = await response.json();

            if (result.success) {
                console.log('\n✅ API Yanıtı Başarılı!\n');
                console.log('📈 PERFORMANS ANALİZİ:');
                console.log(result.performanceAnalysis);
                console.log('\n🎯 ÖNCELİKLİ KONULAR:');
                result.priorityTopics.forEach((t, i) => {
                    console.log(`   ${i + 1}. ${t.subject} - ${t.topic} (Başarı: %${t.successRate})`);
                });
                console.log('\n📋 AI PROMPT ÖZETİ:');
                console.log(result.aiPrompt.substring(0, 500) + '...');
            } else {
                console.log('\n❌ Hata:', result.error);
            }
        } catch (error) {
            console.log('\n⚠️ API bağlantı hatası (sunucu çalışmıyor olabilir)');
            console.log('📝 Öğrenci verisi hazır, sunucu başlatıldığında test edilebilir.');
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log('TEST TAMAMLANDI');
    console.log('='.repeat(80));
}

// Tek öğrenci test fonksiyonu
async function testSingleStudent(studentId) {
    const student = testStudents.find(s => s.studentId === studentId);
    if (!student) {
        console.log('Öğrenci bulunamadı:', studentId);
        return;
    }

    console.log(`Testing student: ${student.name}`);
    // API çağrısı yapılabilir
}

// Öğrenci listesini göster
function listStudents() {
    console.log('\n📋 TEST ÖĞRENCİ LİSTESİ:\n');
    testStudents.forEach((s, i) => {
        const lastExam = s.recentExams?.[0];
        console.log(`${i + 1}. ${s.name} (${s.studentId})`);
        console.log(`   📚 ${s.level}${s.grade ? ` - ${s.grade}. Sınıf` : ''}`);
        console.log(`   🎯 Hedef: ${s.targetExam}`);
        if (lastExam) {
            console.log(`   📊 Son Deneme: ${lastExam.totalNet} net (Sıra: ${lastExam.ranking})`);
        }
        console.log(`   ⏱ Günlük Çalışma: ${s.studyStats.averageDailyStudyMinutes} dk`);
        console.log(`   🔥 Seri: ${s.studyStats.currentStreak} gün`);
        console.log('');
    });
}

// Export
module.exports = { testStudents, testAllStudents, testSingleStudent, listStudents };

// Eğer doğrudan çalıştırılıyorsa
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args[0] === '--list') {
        listStudents();
    } else if (args[0] === '--test') {
        testAllStudents();
    } else {
        console.log('\n🎓 VİSİ AI Test Öğrenci Verileri');
        console.log('================================\n');
        console.log('Kullanım:');
        console.log('  node test-student-data.js --list    : Öğrenci listesini göster');
        console.log('  node test-student-data.js --test    : Tüm öğrencileri API ile test et\n');
        listStudents();
    }
}
