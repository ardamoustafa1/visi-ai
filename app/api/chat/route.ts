import { NextResponse } from 'next/server';

// Python Backend URL
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Python backend'e istek gönder
        const response = await fetch(`${PYTHON_API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: body.message,
                history: body.history?.map((m: any) => ({
                    role: m.role,
                    content: m.content
                })) || [],
                image: body.image || null,
                student_context: body.studentContext ? {
                    name: body.studentContext.name,
                    level: body.studentContext.level,
                    target_exam: body.studentContext.targetExam,
                    grade: body.studentContext.grade,
                    current_energy: body.studentContext.currentEnergy,
                    current_focus: body.studentContext.currentFocus,
                    current_anxiety: body.studentContext.currentAnxiety,
                    academic_bottleneck: body.studentContext.academicBottleneck,
                } : null,
                student_data: body.studentData ? {
                    student_id: body.studentData.studentId,
                    name: body.studentData.name,
                    level: body.studentData.level,
                    grade: body.studentData.grade,
                    target_exam: body.studentData.targetExam,
                    recent_exams: body.studentData.recentExams?.map((e: any) => ({
                        exam_id: e.examId,
                        exam_type: e.examType,
                        exam_name: e.examName,
                        date: e.date,
                        total_correct: e.totalCorrect,
                        total_wrong: e.totalWrong,
                        total_empty: e.totalEmpty,
                        total_net: e.totalNet,
                        ranking: e.ranking,
                        percentile: e.percentile,
                        subject_results: e.subjectResults?.map((s: any) => ({
                            subject: s.subject,
                            correct: s.correct,
                            wrong: s.wrong,
                            empty: s.empty,
                            net: s.net,
                            success_rate: s.successRate
                        })) || []
                    })) || [],
                    topic_performance: body.studentData.topicPerformance?.map((t: any) => ({
                        subject: t.subject,
                        topic: t.topic,
                        success_rate: t.successRate,
                        status: t.status
                    })) || [],
                    study_stats: body.studentData.studyStats ? {
                        total_study_minutes: body.studentData.studyStats.totalStudyMinutes,
                        average_daily_study_minutes: body.studentData.studyStats.averageDailyStudyMinutes,
                        current_streak: body.studentData.studyStats.currentStreak,
                        longest_streak: body.studentData.studyStats.longestStreak,
                        total_questions_solved: body.studentData.studyStats.totalQuestionsSolved,
                    } : null,
                    current_energy: body.studentData.currentEnergy,
                    current_focus: body.studentData.currentFocus,
                    current_anxiety: body.studentData.currentAnxiety,
                } : null
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Python API hatası: ${response.status}`);
        }

        const data = await response.json();

        // Python'dan gelen yanıtı Next.js formatına dönüştür
        return NextResponse.json({
            text: data.text,
            mod: data.mod,
            modReason: data.mod_reason,
            emotionalLoad: data.emotional_load,
            academicReady: data.academic_ready,
            safetyStatus: data.safety_status
        });

    } catch (error: any) {
        console.error('Python API hatası:', error);

        // Bağlantı hatası durumunda kullanıcıya bilgi ver
        if (error.cause?.code === 'ECONNREFUSED') {
            return NextResponse.json(
                { error: 'Python backend çalışmıyor. Lütfen "uvicorn main:app --port 8000" komutunu çalıştırın.' },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Yanıt oluşturulamadı.' },
            { status: 500 }
        );
    }
}
