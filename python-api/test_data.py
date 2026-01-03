"""
VİSİ AI - Test Verileri
Demo ve test için örnek öğrenci verileri
"""

from models import (
    StudentProfile, StudentContext, ExamResult, SubjectResult,
    TopicPerformance, StudyStats, StudentGoals, StrengthWeaknessAnalysis, SubjectAnalysis
)

# ============================================================================
# TEST ÖĞRENCİLERİ
# ============================================================================

TEST_STUDENTS = [
    StudentProfile(
        student_id="ogrenci_001",
        name="Ahmet Yılmaz",
        level="Lise",
        grade=11,
        target_exam="YKS",
        current_energy="high",
        current_focus="sharp",
        current_anxiety="mild",
        recent_exams=[
            ExamResult(
                exam_id="deneme_001",
                exam_type="TYT",
                exam_name="Ocak TYT Denemesi",
                date="2026-01-01",
                total_correct=95,
                total_wrong=20,
                total_empty=5,
                total_net=90.0,
                ranking=15000,
                percentile=85,
                subject_results=[
                    SubjectResult(subject="Türkçe", correct=32, wrong=5, empty=3, net=30.75, success_rate=80),
                    SubjectResult(subject="Matematik", correct=28, wrong=8, empty=4, net=26.0, success_rate=70),
                    SubjectResult(subject="Fizik", correct=10, wrong=3, empty=1, net=9.25, success_rate=71),
                    SubjectResult(subject="Kimya", correct=8, wrong=2, empty=3, net=7.5, success_rate=62),
                    SubjectResult(subject="Biyoloji", correct=10, wrong=1, empty=2, net=9.75, success_rate=77),
                    SubjectResult(subject="Tarih", correct=4, wrong=1, empty=0, net=3.75, success_rate=80),
                    SubjectResult(subject="Coğrafya", correct=3, wrong=0, empty=2, net=3.0, success_rate=60),
                ]
            ),
            ExamResult(
                exam_id="deneme_002",
                exam_type="TYT",
                exam_name="Aralık TYT Denemesi",
                date="2025-12-25",
                total_correct=88,
                total_wrong=25,
                total_empty=7,
                total_net=81.75,
                ranking=22000,
                percentile=78,
                subject_results=[
                    SubjectResult(subject="Türkçe", correct=30, wrong=7, empty=3, net=28.25, success_rate=75),
                    SubjectResult(subject="Matematik", correct=25, wrong=10, empty=5, net=22.5, success_rate=63),
                ]
            ),
        ],
        topic_performance=[
            TopicPerformance(subject="Matematik", topic="Türev", success_rate=85, status="mastered"),
            TopicPerformance(subject="Matematik", topic="İntegral", success_rate=45, status="struggling"),
            TopicPerformance(subject="Fizik", topic="Elektrik", success_rate=60, status="learning"),
            TopicPerformance(subject="Kimya", topic="Organik Kimya", success_rate=35, status="struggling"),
        ],
        study_stats=StudyStats(
            total_study_minutes=12000,
            average_daily_study_minutes=180,
            current_streak=15,
            longest_streak=30,
            total_questions_solved=5000,
        ),
        goals=StudentGoals(
            target_net=100,
            target_ranking=10000,
            weekly_study_hours=30,
            daily_question_goal=100,
        ),
        strength_weakness_analysis=StrengthWeaknessAnalysis(
            strengths=[
                SubjectAnalysis(subject="Türkçe", success_rate=80, trend="improving"),
                SubjectAnalysis(subject="Biyoloji", success_rate=77, trend="stable"),
            ],
            weaknesses=[
                SubjectAnalysis(subject="Kimya", success_rate=45, trend="stable"),
                SubjectAnalysis(subject="Matematik", success_rate=65, trend="improving"),
            ]
        )
    ),
    
    StudentProfile(
        student_id="ogrenci_002",
        name="Zeynep Kaya",
        level="Ortaokul",
        grade=8,
        target_exam="LGS",
        current_energy="medium",
        current_focus="scattered",
        current_anxiety="high",
        recent_exams=[
            ExamResult(
                exam_id="lgs_001",
                exam_type="LGS",
                exam_name="LGS Deneme 1",
                date="2026-01-01",
                total_correct=70,
                total_wrong=15,
                total_empty=5,
                total_net=66.25,
                subject_results=[
                    SubjectResult(subject="Türkçe", correct=18, wrong=2, empty=0, net=17.5, success_rate=90),
                    SubjectResult(subject="Matematik", correct=15, wrong=5, empty=0, net=13.75, success_rate=75),
                    SubjectResult(subject="Fen", correct=14, wrong=4, empty=2, net=13.0, success_rate=70),
                    SubjectResult(subject="İnkılap", correct=8, wrong=1, empty=1, net=7.75, success_rate=80),
                    SubjectResult(subject="Din", correct=8, wrong=1, empty=1, net=7.75, success_rate=80),
                    SubjectResult(subject="İngilizce", correct=7, wrong=2, empty=1, net=6.5, success_rate=70),
                ]
            ),
        ],
        study_stats=StudyStats(
            total_study_minutes=6000,
            average_daily_study_minutes=120,
            current_streak=7,
        ),
    ),
]


def get_test_student(student_id: str) -> StudentProfile:
    """Test öğrencisi getir"""
    for student in TEST_STUDENTS:
        if student.student_id == student_id:
            return student
    return TEST_STUDENTS[0]


def get_test_context(student: StudentProfile) -> StudentContext:
    """Öğrenci profilinden context oluştur"""
    return StudentContext(
        name=student.name,
        level=student.level,
        target_exam=student.target_exam,
        grade=student.grade,
        current_energy=student.current_energy,
        current_focus=student.current_focus,
        current_anxiety=student.current_anxiety,
    )
