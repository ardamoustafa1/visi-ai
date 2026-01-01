'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import './demo.css';

// ============================================================================
// YKS/LGS KAPSAMLI TEST VERİ TABANI
// ============================================================================

// Tarih yardımcıları - son 7 gün için
const today = new Date();
const getDateStr = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
};

// ============================================================================
// TEST ÖĞRENCİLERİ
// ============================================================================

const testStudents = [
    // =========== ÖĞRENCİ 1: AHMET YILMAZ (YKS - Başarılı) ===========
    {
        studentId: "ogrenci_001",
        name: "Ahmet Yılmaz",
        level: "Lise",
        grade: 12,
        targetExam: "YKS",
        recentExams: [
            // Son 7 günde 5 sınav
            {
                examId: "deneme_001",
                examType: "TYT" as const,
                examName: "Haftalık TYT Deneme 2",
                date: getDateStr(0), // Bugün
                totalCorrect: 108,
                totalWrong: 10,
                totalEmpty: 2,
                totalNet: 105.5,
                ranking: 1100,
                percentile: 98.8,
                subjectResults: [
                    { subject: "Türkçe", correct: 38, wrong: 1, empty: 1, net: 37.75, totalQuestions: 40, successRate: 95 },
                    { subject: "Matematik", correct: 36, wrong: 3, empty: 1, net: 35.25, totalQuestions: 40, successRate: 90 },
                    { subject: "Fizik", correct: 6, wrong: 1, empty: 0, net: 5.75, totalQuestions: 7, successRate: 86 },
                    { subject: "Kimya", correct: 6, wrong: 1, empty: 0, net: 5.75, totalQuestions: 7, successRate: 86 },
                    { subject: "Biyoloji", correct: 5, wrong: 1, empty: 0, net: 4.75, totalQuestions: 6, successRate: 83 },
                    { subject: "Tarih", correct: 5, wrong: 0, empty: 0, net: 5, totalQuestions: 5, successRate: 100 },
                    { subject: "Coğrafya", correct: 4, wrong: 1, empty: 0, net: 3.75, totalQuestions: 5, successRate: 80 },
                    { subject: "Felsefe", correct: 4, wrong: 1, empty: 0, net: 3.75, totalQuestions: 5, successRate: 80 },
                    { subject: "Din Kültürü", correct: 4, wrong: 1, empty: 0, net: 3.75, totalQuestions: 5, successRate: 80 }
                ]
            },
            {
                examId: "deneme_002",
                examType: "TYT" as const,
                examName: "Konu Tarama - Matematik",
                date: getDateStr(1), // Dün
                totalCorrect: 32,
                totalWrong: 6,
                totalEmpty: 2,
                totalNet: 30.5,
                ranking: 1500,
                percentile: 97,
                subjectResults: [
                    { subject: "Matematik", correct: 32, wrong: 6, empty: 2, net: 30.5, totalQuestions: 40, successRate: 80 }
                ]
            },
            {
                examId: "deneme_003",
                examType: "TYT" as const,
                examName: "Haftalık TYT Deneme 1",
                date: getDateStr(3),
                totalCorrect: 102,
                totalWrong: 14,
                totalEmpty: 4,
                totalNet: 98.5,
                ranking: 1450,
                percentile: 97.5,
                subjectResults: [
                    { subject: "Türkçe", correct: 36, wrong: 3, empty: 1, net: 35.25, totalQuestions: 40, successRate: 90 },
                    { subject: "Matematik", correct: 33, wrong: 5, empty: 2, net: 31.75, totalQuestions: 40, successRate: 82.5 },
                    { subject: "Fizik", correct: 5, wrong: 1, empty: 1, net: 4.75, totalQuestions: 7, successRate: 71 },
                    { subject: "Kimya", correct: 6, wrong: 1, empty: 0, net: 5.75, totalQuestions: 7, successRate: 86 },
                    { subject: "Biyoloji", correct: 5, wrong: 1, empty: 0, net: 4.75, totalQuestions: 6, successRate: 83 },
                    { subject: "Tarih", correct: 5, wrong: 0, empty: 0, net: 5, totalQuestions: 5, successRate: 100 },
                    { subject: "Coğrafya", correct: 4, wrong: 1, empty: 0, net: 3.75, totalQuestions: 5, successRate: 80 },
                    { subject: "Felsefe", correct: 4, wrong: 1, empty: 0, net: 3.75, totalQuestions: 5, successRate: 80 },
                    { subject: "Din Kültürü", correct: 4, wrong: 1, empty: 0, net: 3.75, totalQuestions: 5, successRate: 80 }
                ]
            },
            {
                examId: "deneme_004",
                examType: "QUIZ" as const,
                examName: "Fizik Mini Quiz",
                date: getDateStr(4),
                totalCorrect: 18,
                totalWrong: 2,
                totalEmpty: 0,
                totalNet: 17.5,
                subjectResults: [
                    { subject: "Fizik", correct: 18, wrong: 2, empty: 0, net: 17.5, totalQuestions: 20, successRate: 90 }
                ]
            },
            {
                examId: "deneme_005",
                examType: "AYT" as const,
                examName: "AYT Sayısal Deneme",
                date: getDateStr(6),
                totalCorrect: 68,
                totalWrong: 10,
                totalEmpty: 2,
                totalNet: 65.5,
                ranking: 2000,
                percentile: 96,
                subjectResults: [
                    { subject: "Matematik (AYT)", correct: 32, wrong: 5, empty: 3, net: 30.75, totalQuestions: 40, successRate: 80 },
                    { subject: "Fizik (AYT)", correct: 12, wrong: 2, empty: 0, net: 11.5, totalQuestions: 14, successRate: 86 },
                    { subject: "Kimya (AYT)", correct: 11, wrong: 2, empty: 0, net: 10.5, totalQuestions: 13, successRate: 85 },
                    { subject: "Biyoloji (AYT)", correct: 13, wrong: 1, empty: 0, net: 12.75, totalQuestions: 13, successRate: 100 }
                ]
            }
        ],
        topicPerformance: [
            { subject: "Matematik", topic: "Türev", totalAttempts: 120, correctCount: 96, wrongCount: 24, successRate: 80, lastAttemptDate: getDateStr(0), difficulty: "hard" as const, status: "mastered" as const },
            { subject: "Matematik", topic: "İntegral", totalAttempts: 80, correctCount: 56, wrongCount: 24, successRate: 70, lastAttemptDate: getDateStr(1), difficulty: "hard" as const, status: "learning" as const },
            { subject: "Matematik", topic: "Limit", totalAttempts: 60, correctCount: 48, wrongCount: 12, successRate: 80, lastAttemptDate: getDateStr(2), difficulty: "hard" as const, status: "mastered" as const },
            { subject: "Fizik", topic: "Elektrik", totalAttempts: 50, correctCount: 40, wrongCount: 10, successRate: 80, lastAttemptDate: getDateStr(0), difficulty: "hard" as const, status: "mastered" as const },
            { subject: "Kimya", topic: "Organik Kimya", totalAttempts: 50, correctCount: 35, wrongCount: 15, successRate: 70, lastAttemptDate: getDateStr(3), difficulty: "hard" as const, status: "learning" as const },
            { subject: "Türkçe", topic: "Paragraf", totalAttempts: 100, correctCount: 92, wrongCount: 8, successRate: 92, lastAttemptDate: getDateStr(0), difficulty: "medium" as const, status: "mastered" as const }
        ],
        studyStats: {
            totalStudyTimeMinutes: 36000,
            averageDailyStudyMinutes: 300,
            studyDaysCount: 120,
            totalStudyDays: 180,
            currentStreak: 45,
            longestStreak: 60,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 320 },
                { day: "Salı", minutes: 280 },
                { day: "Çarşamba", minutes: 300 },
                { day: "Perşembe", minutes: 310 },
                { day: "Cuma", minutes: 270 },
                { day: "Cumartesi", minutes: 350 },
                { day: "Pazar", minutes: 280 }
            ],
            subjectDistribution: [
                { subject: "Matematik", minutes: 12000, percentage: 33 },
                { subject: "Türkçe", minutes: 7200, percentage: 20 },
                { subject: "Fizik", minutes: 5400, percentage: 15 },
                { subject: "Kimya", minutes: 4500, percentage: 12.5 },
                { subject: "Biyoloji", minutes: 3600, percentage: 10 },
                { subject: "Sosyal", minutes: 3300, percentage: 9.5 }
            ],
            peakStudyHours: [10, 14, 20]
        },
        goals: {
            targetExam: "YKS",
            targetDate: "2026-06-15",
            targetRanking: 1000,
            dailyStudyGoalMinutes: 360,
            weeklyQuestionGoal: 500,
            targetNetPerSubject: [
                { subject: "Türkçe", currentNet: 37.5, targetNet: 39 },
                { subject: "Matematik", currentNet: 35, targetNet: 38 },
                { subject: "Fen Bilimleri", currentNet: 16, targetNet: 18 },
                { subject: "Sosyal Bilimler", currentNet: 16, targetNet: 18 }
            ]
        },
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Türkçe", topics: ["Paragraf", "Dil Bilgisi", "Anlam Bilgisi"], averageSuccessRate: 95 },
                { subject: "Tarih", topics: ["İnkılap Tarihi", "Osmanlı"], averageSuccessRate: 92 }
            ],
            weaknesses: [
                { subject: "Coğrafya", topics: ["Beşeri Coğrafya", "Harita Bilgisi"], averageSuccessRate: 70, priority: "medium" as const },
                { subject: "Kimya", topics: ["Organik Kimya", "Asit-Baz"], averageSuccessRate: 72, priority: "high" as const }
            ],
            recommendations: [
                "Organik kimya konusuna günde 30 dk ayır",
                "Coğrafya harita soruları için özel çalışma yap"
            ]
        },
        currentEnergy: "high" as const,
        currentFocus: "sharp" as const,
        currentAnxiety: "mild" as const
    },

    // =========== ÖĞRENCİ 2: MEHMET DEMİR (YKS - Zorlanıyor) ===========
    {
        studentId: "ogrenci_002",
        name: "Mehmet Demir",
        level: "Lise",
        grade: 11,
        targetExam: "YKS",
        recentExams: [
            {
                examId: "deneme_006",
                examType: "TYT" as const,
                examName: "Haftalık TYT Deneme",
                date: getDateStr(0),
                totalCorrect: 58,
                totalWrong: 42,
                totalEmpty: 20,
                totalNet: 47.5,
                ranking: 82000,
                percentile: 48,
                subjectResults: [
                    { subject: "Türkçe", correct: 24, wrong: 10, empty: 6, net: 21.5, totalQuestions: 40, successRate: 60 },
                    { subject: "Matematik", correct: 12, wrong: 18, empty: 10, net: 7.5, totalQuestions: 40, successRate: 30 },
                    { subject: "Fizik", correct: 3, wrong: 3, empty: 1, net: 2.25, totalQuestions: 7, successRate: 43 },
                    { subject: "Kimya", correct: 4, wrong: 2, empty: 1, net: 3.5, totalQuestions: 7, successRate: 57 },
                    { subject: "Biyoloji", correct: 4, wrong: 2, empty: 0, net: 3.5, totalQuestions: 6, successRate: 67 },
                    { subject: "Tarih", correct: 3, wrong: 2, empty: 0, net: 2.5, totalQuestions: 5, successRate: 60 },
                    { subject: "Coğrafya", correct: 3, wrong: 2, empty: 0, net: 2.5, totalQuestions: 5, successRate: 60 },
                    { subject: "Felsefe", correct: 3, wrong: 1, empty: 1, net: 2.75, totalQuestions: 5, successRate: 60 },
                    { subject: "Din Kültürü", correct: 2, wrong: 2, empty: 1, net: 1.5, totalQuestions: 5, successRate: 40 }
                ]
            },
            {
                examId: "deneme_007",
                examType: "TYT" as const,
                examName: "Matematik Konu Tarama",
                date: getDateStr(2),
                totalCorrect: 10,
                totalWrong: 20,
                totalEmpty: 10,
                totalNet: 5,
                subjectResults: [
                    { subject: "Matematik", correct: 10, wrong: 20, empty: 10, net: 5, totalQuestions: 40, successRate: 25 }
                ]
            },
            {
                examId: "deneme_008",
                examType: "TYT" as const,
                examName: "TYT Genel Deneme",
                date: getDateStr(4),
                totalCorrect: 52,
                totalWrong: 38,
                totalEmpty: 30,
                totalNet: 42.5,
                ranking: 95000,
                percentile: 42,
                subjectResults: [
                    { subject: "Türkçe", correct: 22, wrong: 12, empty: 6, net: 19, totalQuestions: 40, successRate: 55 },
                    { subject: "Matematik", correct: 8, wrong: 20, empty: 12, net: 3, totalQuestions: 40, successRate: 20 },
                    { subject: "Fizik", correct: 3, wrong: 2, empty: 2, net: 2.5, totalQuestions: 7, successRate: 43 },
                    { subject: "Kimya", correct: 4, wrong: 2, empty: 1, net: 3.5, totalQuestions: 7, successRate: 57 },
                    { subject: "Biyoloji", correct: 4, wrong: 1, empty: 1, net: 3.75, totalQuestions: 6, successRate: 67 },
                    { subject: "Tarih", correct: 3, wrong: 0, empty: 2, net: 3, totalQuestions: 5, successRate: 60 },
                    { subject: "Coğrafya", correct: 3, wrong: 0, empty: 2, net: 3, totalQuestions: 5, successRate: 60 },
                    { subject: "Felsefe", correct: 3, wrong: 1, empty: 1, net: 2.75, totalQuestions: 5, successRate: 60 },
                    { subject: "Din Kültürü", correct: 2, wrong: 0, empty: 3, net: 2, totalQuestions: 5, successRate: 40 }
                ]
            },
            {
                examId: "deneme_009",
                examType: "QUIZ" as const,
                examName: "Temel Matematik Quiz",
                date: getDateStr(5),
                totalCorrect: 8,
                totalWrong: 10,
                totalEmpty: 2,
                totalNet: 5.5,
                subjectResults: [
                    { subject: "Matematik", correct: 8, wrong: 10, empty: 2, net: 5.5, totalQuestions: 20, successRate: 40 }
                ]
            },
            {
                examId: "deneme_010",
                examType: "QUIZ" as const,
                examName: "Türkçe Paragraf Quiz",
                date: getDateStr(6),
                totalCorrect: 14,
                totalWrong: 4,
                totalEmpty: 2,
                totalNet: 13,
                subjectResults: [
                    { subject: "Türkçe", correct: 14, wrong: 4, empty: 2, net: 13, totalQuestions: 20, successRate: 70 }
                ]
            }
        ],
        topicPerformance: [
            { subject: "Matematik", topic: "Temel Kavramlar", totalAttempts: 100, correctCount: 35, wrongCount: 65, successRate: 35, lastAttemptDate: getDateStr(0), difficulty: "easy" as const, status: "struggling" as const },
            { subject: "Matematik", topic: "Fonksiyonlar", totalAttempts: 40, correctCount: 8, wrongCount: 32, successRate: 20, lastAttemptDate: getDateStr(2), difficulty: "medium" as const, status: "struggling" as const },
            { subject: "Matematik", topic: "Sayı Problemleri", totalAttempts: 50, correctCount: 15, wrongCount: 35, successRate: 30, lastAttemptDate: getDateStr(3), difficulty: "easy" as const, status: "struggling" as const },
            { subject: "Türkçe", topic: "Paragraf", totalAttempts: 80, correctCount: 56, wrongCount: 24, successRate: 70, lastAttemptDate: getDateStr(1), difficulty: "medium" as const, status: "learning" as const },
            { subject: "Fizik", topic: "Kuvvet ve Hareket", totalAttempts: 30, correctCount: 18, wrongCount: 12, successRate: 60, lastAttemptDate: getDateStr(4), difficulty: "medium" as const, status: "learning" as const }
        ],
        studyStats: {
            totalStudyTimeMinutes: 6000,
            averageDailyStudyMinutes: 60,
            studyDaysCount: 30,
            totalStudyDays: 100,
            currentStreak: 3,
            longestStreak: 7,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 45 },
                { day: "Salı", minutes: 60 },
                { day: "Çarşamba", minutes: 30 },
                { day: "Perşembe", minutes: 75 },
                { day: "Cuma", minutes: 45 },
                { day: "Cumartesi", minutes: 90 },
                { day: "Pazar", minutes: 75 }
            ],
            subjectDistribution: [
                { subject: "Matematik", minutes: 1800, percentage: 30 },
                { subject: "Türkçe", minutes: 1500, percentage: 25 },
                { subject: "Fen", minutes: 1200, percentage: 20 },
                { subject: "Sosyal", minutes: 900, percentage: 15 },
                { subject: "Diğer", minutes: 600, percentage: 10 }
            ],
            peakStudyHours: [16, 20]
        },
        goals: {
            targetExam: "YKS",
            targetDate: "2027-06-15",
            targetRanking: 50000,
            dailyStudyGoalMinutes: 180,
            weeklyQuestionGoal: 200,
            targetNetPerSubject: [
                { subject: "Türkçe", currentNet: 21, targetNet: 30 },
                { subject: "Matematik", currentNet: 7, targetNet: 20 },
                { subject: "Fen", currentNet: 9, targetNet: 15 },
                { subject: "Sosyal", currentNet: 10, targetNet: 15 }
            ]
        },
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Biyoloji", topics: ["Hücre", "Sistemler"], averageSuccessRate: 67 },
                { subject: "Türkçe", topics: ["Paragraf"], averageSuccessRate: 65 }
            ],
            weaknesses: [
                { subject: "Matematik", topics: ["Temel Kavramlar", "Fonksiyonlar", "Sayı Problemleri"], averageSuccessRate: 28, priority: "critical" as const },
                { subject: "Din Kültürü", topics: ["Tüm Konular"], averageSuccessRate: 40, priority: "medium" as const }
            ],
            recommendations: [
                "Matematik temel konularından başla",
                "Günde en az 2 saat çalışma hedefle",
                "Düzenli çalışma rutini oluştur"
            ]
        },
        currentEnergy: "low" as const,
        currentFocus: "scattered" as const,
        currentAnxiety: "high" as const
    },

    // =========== ÖĞRENCİ 3: ZEYNEP KAYA (LGS) ===========
    {
        studentId: "ogrenci_003",
        name: "Zeynep Kaya",
        level: "Ortaokul",
        grade: 8,
        targetExam: "LGS",
        recentExams: [
            {
                examId: "deneme_011",
                examType: "LGS" as const,
                examName: "Haftalık LGS Deneme 2",
                date: getDateStr(0),
                totalCorrect: 68,
                totalWrong: 16,
                totalEmpty: 6,
                totalNet: 64,
                ranking: 7500,
                percentile: 87,
                subjectResults: [
                    { subject: "Türkçe", correct: 17, wrong: 2, empty: 1, net: 16.5, totalQuestions: 20, successRate: 85 },
                    { subject: "Matematik", correct: 14, wrong: 4, empty: 2, net: 13, totalQuestions: 20, successRate: 70 },
                    { subject: "Fen Bilimleri", correct: 16, wrong: 3, empty: 1, net: 15.25, totalQuestions: 20, successRate: 80 },
                    { subject: "İnkılap Tarihi", correct: 8, wrong: 2, empty: 0, net: 7.5, totalQuestions: 10, successRate: 80 },
                    { subject: "Din Kültürü", correct: 7, wrong: 2, empty: 1, net: 6.5, totalQuestions: 10, successRate: 70 },
                    { subject: "İngilizce", correct: 6, wrong: 3, empty: 1, net: 5.25, totalQuestions: 10, successRate: 60 }
                ]
            },
            {
                examId: "deneme_012",
                examType: "LGS" as const,
                examName: "Matematik Konu Tarama",
                date: getDateStr(1),
                totalCorrect: 14,
                totalWrong: 4,
                totalEmpty: 2,
                totalNet: 13,
                subjectResults: [
                    { subject: "Matematik", correct: 14, wrong: 4, empty: 2, net: 13, totalQuestions: 20, successRate: 70 }
                ]
            },
            {
                examId: "deneme_013",
                examType: "LGS" as const,
                examName: "Haftalık LGS Deneme 1",
                date: getDateStr(3),
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
            },
            {
                examId: "deneme_014",
                examType: "QUIZ" as const,
                examName: "Geometri Mini Quiz",
                date: getDateStr(4),
                totalCorrect: 6,
                totalWrong: 3,
                totalEmpty: 1,
                totalNet: 5.25,
                subjectResults: [
                    { subject: "Matematik", correct: 6, wrong: 3, empty: 1, net: 5.25, totalQuestions: 10, successRate: 60 }
                ]
            },
            {
                examId: "deneme_015",
                examType: "QUIZ" as const,
                examName: "Fen Bilimleri Quiz",
                date: getDateStr(5),
                totalCorrect: 16,
                totalWrong: 3,
                totalEmpty: 1,
                totalNet: 15.25,
                subjectResults: [
                    { subject: "Fen Bilimleri", correct: 16, wrong: 3, empty: 1, net: 15.25, totalQuestions: 20, successRate: 80 }
                ]
            },
            {
                examId: "deneme_016",
                examType: "LGS" as const,
                examName: "Genel Değerlendirme",
                date: getDateStr(6),
                totalCorrect: 62,
                totalWrong: 20,
                totalEmpty: 8,
                totalNet: 57,
                ranking: 10000,
                percentile: 82,
                subjectResults: [
                    { subject: "Türkçe", correct: 15, wrong: 4, empty: 1, net: 14, totalQuestions: 20, successRate: 75 },
                    { subject: "Matematik", correct: 11, wrong: 6, empty: 3, net: 9.5, totalQuestions: 20, successRate: 55 },
                    { subject: "Fen Bilimleri", correct: 14, wrong: 4, empty: 2, net: 13, totalQuestions: 20, successRate: 70 },
                    { subject: "İnkılap Tarihi", correct: 8, wrong: 2, empty: 0, net: 7.5, totalQuestions: 10, successRate: 80 },
                    { subject: "Din Kültürü", correct: 7, wrong: 2, empty: 1, net: 6.5, totalQuestions: 10, successRate: 70 },
                    { subject: "İngilizce", correct: 7, wrong: 2, empty: 1, net: 6.5, totalQuestions: 10, successRate: 70 }
                ]
            }
        ],
        topicPerformance: [
            { subject: "Matematik", topic: "Üçgenler", totalAttempts: 60, correctCount: 30, wrongCount: 30, successRate: 50, lastAttemptDate: getDateStr(0), difficulty: "hard" as const, status: "struggling" as const },
            { subject: "Matematik", topic: "Cebirsel İfadeler", totalAttempts: 50, correctCount: 35, wrongCount: 15, successRate: 70, lastAttemptDate: getDateStr(1), difficulty: "medium" as const, status: "learning" as const },
            { subject: "Matematik", topic: "Olasılık", totalAttempts: 40, correctCount: 28, wrongCount: 12, successRate: 70, lastAttemptDate: getDateStr(2), difficulty: "medium" as const, status: "learning" as const },
            { subject: "Türkçe", topic: "Paragraf", totalAttempts: 100, correctCount: 85, wrongCount: 15, successRate: 85, lastAttemptDate: getDateStr(0), difficulty: "medium" as const, status: "mastered" as const },
            { subject: "Türkçe", topic: "Sözcükte Anlam", totalAttempts: 60, correctCount: 51, wrongCount: 9, successRate: 85, lastAttemptDate: getDateStr(1), difficulty: "easy" as const, status: "mastered" as const },
            { subject: "Fen Bilimleri", topic: "Elektrik", totalAttempts: 45, correctCount: 36, wrongCount: 9, successRate: 80, lastAttemptDate: getDateStr(2), difficulty: "medium" as const, status: "mastered" as const },
            { subject: "Fen Bilimleri", topic: "DNA ve Genetik", totalAttempts: 40, correctCount: 30, wrongCount: 10, successRate: 75, lastAttemptDate: getDateStr(3), difficulty: "hard" as const, status: "learning" as const },
            { subject: "İngilizce", topic: "Reading", totalAttempts: 30, correctCount: 18, wrongCount: 12, successRate: 60, lastAttemptDate: getDateStr(4), difficulty: "medium" as const, status: "struggling" as const }
        ],
        studyStats: {
            totalStudyTimeMinutes: 18000,
            averageDailyStudyMinutes: 180,
            studyDaysCount: 100,
            totalStudyDays: 150,
            currentStreak: 12,
            longestStreak: 21,
            weeklyDistribution: [
                { day: "Pazartesi", minutes: 150 },
                { day: "Salı", minutes: 180 },
                { day: "Çarşamba", minutes: 200 },
                { day: "Perşembe", minutes: 160 },
                { day: "Cuma", minutes: 140 },
                { day: "Cumartesi", minutes: 240 },
                { day: "Pazar", minutes: 190 }
            ],
            subjectDistribution: [
                { subject: "Matematik", minutes: 5400, percentage: 30 },
                { subject: "Türkçe", minutes: 4500, percentage: 25 },
                { subject: "Fen Bilimleri", minutes: 3600, percentage: 20 },
                { subject: "İnkılap Tarihi", minutes: 1800, percentage: 10 },
                { subject: "Din Kültürü", minutes: 1350, percentage: 7.5 },
                { subject: "İngilizce", minutes: 1350, percentage: 7.5 }
            ],
            peakStudyHours: [15, 19, 21]
        },
        goals: {
            targetExam: "LGS",
            targetDate: "2026-06-08",
            targetRanking: 5000,
            dailyStudyGoalMinutes: 240,
            weeklyQuestionGoal: 350,
            targetNetPerSubject: [
                { subject: "Türkçe", currentNet: 16.5, targetNet: 18 },
                { subject: "Matematik", currentNet: 13, targetNet: 17 },
                { subject: "Fen Bilimleri", currentNet: 15, targetNet: 18 },
                { subject: "İnkılap Tarihi", currentNet: 7.5, targetNet: 9 },
                { subject: "Din Kültürü", currentNet: 6.5, targetNet: 8 },
                { subject: "İngilizce", currentNet: 5.25, targetNet: 8 }
            ]
        },
        strengthWeaknessAnalysis: {
            strengths: [
                { subject: "Türkçe", topics: ["Paragraf", "Sözcükte Anlam"], averageSuccessRate: 85 },
                { subject: "İnkılap Tarihi", topics: ["Kurtuluş Savaşı", "Atatürk İlkeleri"], averageSuccessRate: 80 }
            ],
            weaknesses: [
                { subject: "Matematik", topics: ["Üçgenler", "Geometri"], averageSuccessRate: 50, priority: "critical" as const },
                { subject: "İngilizce", topics: ["Reading", "Grammar"], averageSuccessRate: 60, priority: "high" as const }
            ],
            recommendations: [
                "Üçgenler konusunda temel özellikleri tekrar et",
                "İngilizce için günlük 15 dk okuma yap",
                "Geometri soru çözümünü artır"
            ]
        },
        currentEnergy: "medium" as const,
        currentFocus: "sharp" as const,
        currentAnxiety: "mild" as const
    }
];

// ============================================================================
// DEMO SAYFASI
// ============================================================================

export default function DemoPage() {
    const [selectedStudent, setSelectedStudent] = useState<typeof testStudents[0] | null>(null);

    if (selectedStudent) {
        return <ChatInterface studentData={selectedStudent} />;
    }

    return (
        <div className="demo-container">
            <header className="demo-header">
                <h1>🎓 VİSİ AI - Öğrenci Seçimi</h1>
                <p>Test öğrencisi seçin ve AI'ın kişiselleştirilmiş analizini görün</p>
            </header>

            <div className="student-grid">
                {testStudents.map((student) => (
                    <div
                        key={student.studentId}
                        className="student-card"
                        onClick={() => setSelectedStudent(student)}
                    >
                        <div className="student-avatar">
                            {student.name.charAt(0)}
                        </div>
                        <div className="student-info">
                            <h3>{student.name}</h3>
                            <p>{student.level} - {student.grade}. Sınıf</p>
                            <p className="target">🎯 {student.targetExam}</p>
                        </div>
                        <div className="student-stats">
                            <div className="stat">
                                <span className="stat-value">{student.recentExams[0]?.totalNet || '-'}</span>
                                <span className="stat-label">Net</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">{student.recentExams.length}</span>
                                <span className="stat-label">Sınav</span>
                            </div>
                            <div className="stat">
                                <span className="stat-value">🔥{student.studyStats.currentStreak}</span>
                                <span className="stat-label">Seri</span>
                            </div>
                        </div>
                        <div className="card-arrow">→</div>
                    </div>
                ))}
            </div>

            <div className="info-box">
                <h3>💡 Nasıl Çalışır?</h3>
                <ol>
                    <li>Bir öğrenci seçin</li>
                    <li>VİSİ AI otomatik olarak son 1 haftanın verilerini analiz eder</li>
                    <li>Tüm dersler için detaylı performans görüntülenir</li>
                    <li>Kişiye özel haftalık program ve öneriler sunar</li>
                </ol>
            </div>
        </div>
    );
}
