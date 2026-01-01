'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ChatInterface from '@/components/ChatInterface';

// Test öğrenci verileri (gerçek senaryoda API'den gelecek)
const testStudents: Record<string, any> = {
    "ogrenci_001": {
        studentId: "ogrenci_001",
        name: "Ahmet Yılmaz",
        level: "Lise",
        grade: 12,
        targetExam: "YKS",
        recentExams: [{
            examId: "deneme_001", examType: "TYT", examName: "Aralık TYT Denemesi", date: "2025-12-20",
            totalCorrect: 105, totalWrong: 12, totalEmpty: 3, totalNet: 102, ranking: 1250, percentile: 98.5,
            subjectResults: [
                { subject: "Türkçe", correct: 38, wrong: 2, empty: 0, net: 37.5, totalQuestions: 40, successRate: 95 },
                { subject: "Matematik", correct: 35, wrong: 3, empty: 2, net: 34.25, totalQuestions: 40, successRate: 87.5 },
                { subject: "Fen Bilimleri", correct: 18, wrong: 2, empty: 0, net: 17.5, totalQuestions: 20, successRate: 90 },
                { subject: "Sosyal Bilimler", correct: 14, wrong: 5, empty: 1, net: 12.75, totalQuestions: 20, successRate: 70 }
            ]
        }],
        topicPerformance: [
            { subject: "Matematik", topic: "Türev", totalAttempts: 120, correctCount: 96, wrongCount: 24, successRate: 80, difficulty: "hard", status: "mastered" },
            { subject: "Matematik", topic: "İntegral", totalAttempts: 80, correctCount: 56, wrongCount: 24, successRate: 70, difficulty: "hard", status: "learning" },
            { subject: "Kimya", topic: "Organik Kimya", totalAttempts: 50, correctCount: 35, wrongCount: 15, successRate: 70, difficulty: "hard", status: "learning" }
        ],
        studyStats: { totalStudyTimeMinutes: 36000, averageDailyStudyMinutes: 300, currentStreak: 45, longestStreak: 60 },
        goals: { targetExam: "YKS", targetDate: "2026-06-15", targetRanking: 1000, dailyStudyGoalMinutes: 360 },
        strengthWeaknessAnalysis: {
            strengths: [{ subject: "Türkçe", topics: ["Paragraf", "Dil Bilgisi"], averageSuccessRate: 95 }],
            weaknesses: [{ subject: "Sosyal Bilimler", topics: ["Tarih", "Coğrafya"], averageSuccessRate: 70, priority: "medium" }]
        },
        currentEnergy: "high", currentFocus: "sharp", currentAnxiety: "mild"
    },
    "ogrenci_002": {
        studentId: "ogrenci_002",
        name: "Zeynep Kaya",
        level: "Ortaokul",
        grade: 8,
        targetExam: "LGS",
        recentExams: [{
            examId: "deneme_003", examType: "LGS", examName: "Aralık LGS Denemesi", date: "2025-12-18",
            totalCorrect: 65, totalWrong: 18, totalEmpty: 7, totalNet: 60.5, ranking: 8500, percentile: 85,
            subjectResults: [
                { subject: "Türkçe", correct: 16, wrong: 3, empty: 1, net: 15.25, totalQuestions: 20, successRate: 80 },
                { subject: "Matematik", correct: 12, wrong: 6, empty: 2, net: 10.5, totalQuestions: 20, successRate: 60 },
                { subject: "Fen Bilimleri", correct: 15, wrong: 4, empty: 1, net: 14, totalQuestions: 20, successRate: 75 },
                { subject: "İnkılap Tarihi", correct: 8, wrong: 2, empty: 0, net: 7.5, totalQuestions: 10, successRate: 80 }
            ]
        }],
        topicPerformance: [
            { subject: "Matematik", topic: "Üçgenler", totalAttempts: 60, correctCount: 30, wrongCount: 30, successRate: 50, difficulty: "hard", status: "struggling" },
            { subject: "Türkçe", topic: "Paragraf", totalAttempts: 100, correctCount: 85, wrongCount: 15, successRate: 85, difficulty: "medium", status: "mastered" }
        ],
        studyStats: { totalStudyTimeMinutes: 18000, averageDailyStudyMinutes: 180, currentStreak: 12, longestStreak: 21 },
        goals: { targetExam: "LGS", targetDate: "2026-06-08", targetRanking: 5000, dailyStudyGoalMinutes: 240 },
        strengthWeaknessAnalysis: {
            strengths: [{ subject: "Türkçe", topics: ["Paragraf"], averageSuccessRate: 85 }],
            weaknesses: [{ subject: "Matematik", topics: ["Üçgenler", "Geometri"], averageSuccessRate: 50, priority: "critical" }]
        },
        currentEnergy: "medium", currentFocus: "sharp", currentAnxiety: "mild"
    },
    "ogrenci_003": {
        studentId: "ogrenci_003",
        name: "Mehmet Demir",
        level: "Lise",
        grade: 11,
        targetExam: "YKS",
        recentExams: [{
            examId: "deneme_004", examType: "TYT", examName: "Aralık TYT Denemesi", date: "2025-12-15",
            totalCorrect: 55, totalWrong: 35, totalEmpty: 30, totalNet: 46.25, ranking: 85000, percentile: 45,
            subjectResults: [
                { subject: "Türkçe", correct: 22, wrong: 10, empty: 8, net: 19.5, totalQuestions: 40, successRate: 55 },
                { subject: "Matematik", correct: 10, wrong: 15, empty: 15, net: 6.25, totalQuestions: 40, successRate: 25 },
                { subject: "Fen Bilimleri", correct: 12, wrong: 5, empty: 3, net: 10.75, totalQuestions: 20, successRate: 60 },
                { subject: "Sosyal Bilimler", correct: 11, wrong: 5, empty: 4, net: 9.75, totalQuestions: 20, successRate: 55 }
            ]
        }],
        topicPerformance: [
            { subject: "Matematik", topic: "Temel Kavramlar", totalAttempts: 100, correctCount: 35, wrongCount: 65, successRate: 35, difficulty: "easy", status: "struggling" },
            { subject: "Matematik", topic: "Fonksiyonlar", totalAttempts: 40, correctCount: 8, wrongCount: 32, successRate: 20, difficulty: "medium", status: "struggling" }
        ],
        studyStats: { totalStudyTimeMinutes: 6000, averageDailyStudyMinutes: 60, currentStreak: 3, longestStreak: 7 },
        goals: { targetExam: "YKS", targetDate: "2027-06-15", targetRanking: 50000, dailyStudyGoalMinutes: 180 },
        strengthWeaknessAnalysis: {
            strengths: [{ subject: "Fen Bilimleri", topics: ["Hareket", "Kuvvet"], averageSuccessRate: 60 }],
            weaknesses: [{ subject: "Matematik", topics: ["Temel Kavramlar", "Fonksiyonlar"], averageSuccessRate: 25, priority: "critical" }]
        },
        currentEnergy: "low", currentFocus: "scattered", currentAnxiety: "high"
    }
};

function ChatContent() {
    const searchParams = useSearchParams();
    const studentId = searchParams.get('studentId');

    // Öğrenci ID varsa verilerini yükle
    const studentData = studentId ? testStudents[studentId] : undefined;

    return (
        <div className="chat-layout">
            {/* Header */}
            <header className="chat-header">
                <h1 className="chat-title gradient-text">Visi AI</h1>
                {studentData && (
                    <span className="student-badge">
                        👤 {studentData.name}
                    </span>
                )}
            </header>

            {/* Main Chat Area */}
            <main className="chat-main">
                <ChatInterface studentData={studentData} />
            </main>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="loading-page">Yükleniyor...</div>}>
            <ChatContent />
        </Suspense>
    );
}
