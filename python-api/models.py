"""
VİSİ AI - Veri Modelleri
Tüm Pydantic modelleri
"""

from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime


# ============================================================================
# TEMEL TİPLER
# ============================================================================

ModType = Literal['academic', 'focus-anxiety', 'motivation-discipline', 'career-direction', 'safe-support']
EnergyLevel = Literal['high', 'medium', 'low']
FocusLevel = Literal['sharp', 'scattered', 'blocked']
AnxietyLevel = Literal['calm', 'mild', 'high', 'critical']
TopicStatus = Literal['mastered', 'learning', 'struggling', 'not-started']


# ============================================================================
# ÖĞRENCİ CONTEXT
# ============================================================================

class StudentContext(BaseModel):
    name: Optional[str] = None
    level: Optional[str] = None  # İlkokul, Ortaokul, Lise, Üniversite
    target_exam: Optional[str] = None  # LGS, YKS, KPSS
    age: Optional[int] = None
    grade: Optional[int] = None
    current_energy: Optional[EnergyLevel] = None
    current_focus: Optional[FocusLevel] = None
    current_anxiety: Optional[AnxietyLevel] = None
    academic_bottleneck: Optional[str] = None
    goals: Optional[List[str]] = None
    time_horizon: Optional[str] = None


# ============================================================================
# SINAV SONUÇLARI
# ============================================================================

class SubjectResult(BaseModel):
    subject: str
    correct: int = 0
    wrong: int = 0
    empty: int = 0
    net: float = 0
    success_rate: float = 0


class ExamResult(BaseModel):
    exam_id: str
    exam_type: str  # TYT, AYT, LGS, KPSS
    exam_name: Optional[str] = None
    date: str
    total_correct: int = 0
    total_wrong: int = 0
    total_empty: int = 0
    total_net: float = 0
    ranking: Optional[int] = None
    percentile: Optional[float] = None
    subject_results: List[SubjectResult] = []


# ============================================================================
# KONU PERFORMANSI
# ============================================================================

class TopicPerformance(BaseModel):
    subject: str
    topic: str
    success_rate: float
    total_questions: int = 0
    correct_count: int = 0
    wrong_count: int = 0
    last_attempt_date: Optional[str] = None
    difficulty: Optional[str] = None
    status: TopicStatus = 'not-started'


# ============================================================================
# ÇALIŞMA İSTATİSTİKLERİ
# ============================================================================

class StudyStats(BaseModel):
    total_study_minutes: int = 0
    average_daily_study_minutes: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    total_questions_solved: int = 0
    study_days_count: int = 0
    total_study_days: int = 0
    weekly_distribution: Optional[List[dict]] = None
    subject_distribution: Optional[dict] = None
    peak_study_hours: Optional[List[int]] = None


# ============================================================================
# HEDEFLER
# ============================================================================

class StudentGoals(BaseModel):
    target_net: Optional[float] = None
    target_ranking: Optional[int] = None
    weekly_study_hours: Optional[int] = None
    daily_question_goal: Optional[int] = None
    target_exam_date: Optional[str] = None
    weekly_question_goal: Optional[int] = None
    target_net_per_subject: Optional[dict] = None


# ============================================================================
# GÜÇ/ZAYIFLIK ANALİZİ
# ============================================================================

class SubjectAnalysis(BaseModel):
    subject: str
    success_rate: float
    trend: Optional[str] = None  # improving, stable, declining
    net_average: Optional[float] = None


class StrengthWeaknessAnalysis(BaseModel):
    strengths: List[SubjectAnalysis] = []
    weaknesses: List[SubjectAnalysis] = []
    recommendations: Optional[List[str]] = None


# ============================================================================
# TAM ÖĞRENCİ PROFİLİ
# ============================================================================

class StudentProfile(BaseModel):
    student_id: str
    name: str
    level: str
    grade: Optional[int] = None
    target_exam: Optional[str] = None
    recent_exams: List[ExamResult] = []
    topic_performance: List[TopicPerformance] = []
    study_stats: Optional[StudyStats] = None
    goals: Optional[StudentGoals] = None
    strength_weakness_analysis: Optional[StrengthWeaknessAnalysis] = None
    current_energy: Optional[EnergyLevel] = None
    current_focus: Optional[FocusLevel] = None
    current_anxiety: Optional[AnxietyLevel] = None
    last_updated: Optional[str] = None


# ============================================================================
# API REQUEST/RESPONSE MODELLERİ
# ============================================================================

class ChatMessage(BaseModel):
    role: str  # 'user' veya 'model'
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    image: Optional[str] = None  # Base64 encoded image
    student_context: Optional[StudentContext] = None
    student_data: Optional[StudentProfile] = None
    forced_mod: Optional[ModType] = None


class ChatResponse(BaseModel):
    text: str
    mod: ModType
    mod_reason: str
    emotional_load: str
    academic_ready: bool
    safety_status: str = 'safe'


class TriageResult(BaseModel):
    selected_mod: ModType
    reason: str
    academic_ready: bool
    emotional_load: str
    action_capacity: bool


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str
