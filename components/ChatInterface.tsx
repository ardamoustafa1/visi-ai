'use client';

import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import StudentInfoForm, { StudentInfo } from './StudentInfoForm';
import ProgressDashboard from './ProgressDashboard';
import StudyReminder, { useStudyReminder } from './StudyReminder';
import { MOD_NAMES, MOD_ICONS, ModType } from '@/lib/prompts';
import './StudentDataPanel.css';

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    image?: string;
    mod?: string;
}

type PanelType = 'all' | 'academic' | 'emotional' | 'growth' | 'parent';

const PANELS: { id: PanelType; label: string; icon: string; description: string }[] = [
    { id: 'all', label: 'Tümü', icon: '💬', description: 'Tüm konuşmalar' },
    { id: 'academic', label: 'Akademik', icon: '📚', description: 'Ders ve çalışma planı' },
    { id: 'emotional', label: 'Duygusal', icon: '🧘', description: 'Stres ve odak' },
    { id: 'growth', label: 'Gelişim', icon: '🧭', description: 'Kendini tanıma' },
];

// Dış sistemden gelen öğrenci verisi tipi
interface StudentData {
    studentId: string;
    name: string;
    level: string;
    grade?: number;
    targetExam?: string;
    recentExams?: any[];
    topicPerformance?: any[];
    studyStats?: any;
    goals?: any;
    strengthWeaknessAnalysis?: any;
    currentEnergy?: 'high' | 'medium' | 'low';
    currentFocus?: 'sharp' | 'scattered' | 'blocked';
    currentAnxiety?: 'calm' | 'mild' | 'high' | 'critical';
}

interface ChatInterfaceProps {
    studentData?: StudentData; // Dış sistemden gelen öğrenci verisi
}

export default function ChatInterface({ studentData }: ChatInterfaceProps) {
    const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [currentMod, setCurrentMod] = useState<ModType | null>(null);
    const [activePanel, setActivePanel] = useState<PanelType>('all');
    const [showDataPanel, setShowDataPanel] = useState(!!studentData);
    const [autoAnalyzed, setAutoAnalyzed] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Yeni özellikler için state
    const [showProgressChart, setShowProgressChart] = useState(false);
    const [showReminder, setShowReminder] = useState(false);

    // Hatırlatıcı hook'unu aktif et
    useStudyReminder();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Öğrenci verisi geldiğinde otomatik analiz yap
    useEffect(() => {
        if (studentData && studentInfo && !autoAnalyzed) {
            performAutoAnalysis();
        }
    }, [studentData, studentInfo, autoAnalyzed]);

    const performAutoAnalysis = async () => {
        if (!studentData || autoAnalyzed) return;

        setAutoAnalyzed(true);
        setIsLoading(true);

        try {
            const autoMessage = `Öğrenci verilerini analiz et ve kişiye özel durum değerlendirmesi yap. Soru sorma, direkt verilere göre özet ve öneriler sun.`;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: autoMessage,
                    history: messages.map(m => ({ role: m.role, content: m.content, mod: m.mod })),
                    studentContext: studentInfo,
                    studentData: studentData
                }),
            });

            const data = await response.json();

            if (!data.error) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'model',
                    content: data.text,
                    mod: data.mod
                }]);
                setCurrentMod(data.mod as ModType);
            }
        } catch (error) {
            console.error('Auto analysis error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStudentInfoSubmit = (info: StudentInfo) => {
        setStudentInfo(info);

        // Duruma göre kişiselleştirilmiş karşılama
        let greeting = info.name
            ? `Merhaba ${info.name}! 👋`
            : 'Merhaba! 👋';

        greeting += ' Ben Visi AI, senin yol arkadaşın.';

        // Öğrenci verisi varsa farklı karşılama
        if (studentData) {
            greeting += '\n\n📊 Senin tüm verilerine hakimim. Deneme sonuçların, çalışma istatistiklerin ve konu performansını görüyorum.';
            greeting += '\n\nŞu an verilerini analiz ediyorum...';
        } else {
            // Durum bazlı ekleme
            if (info.currentAnxiety === 'high' || info.currentAnxiety === 'critical') {
                greeting += '\n\nBugün biraz zor görünüyor, ama birlikte aşacağız. Önce seninle ilgilenelim.';
            } else if (info.currentEnergy === 'low') {
                greeting += '\n\nEnerjinin düşük olduğunu görüyorum. Bugün sana uygun hafif bir plan yapabiliriz.';
            } else if (info.currentFocus === 'blocked') {
                greeting += '\n\nOdaklanmakta zorlandığını anlıyorum. Önce zihni temizleyelim.';
            } else {
                greeting += '\n\nBugün sana nasıl yardımcı olabilirim?';
            }

            if (info.academicBottleneck) {
                greeting += `\n\n💡 ${info.academicBottleneck} konusunda zorlandığını not ettim. İstersen oradan başlayabiliriz.`;
            }
        }

        setMessages([{
            id: '1',
            role: 'model',
            content: greeting,
            mod: info.currentAnxiety === 'high' || info.currentAnxiety === 'critical'
                ? 'focus-anxiety'
                : 'academic'
        }]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            image: selectedImage || undefined
        };

        setMessages((prev) => [...prev, userMessage]);

        const imageToSend = selectedImage;
        setInput('');
        setSelectedImage(null);
        setIsLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role,
                content: m.content,
                mod: m.mod
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    history,
                    image: imageToSend,
                    studentContext: studentInfo,
                    studentData: studentData, // Öğrenci verisini her mesajda gönder
                    forced_mod: currentMod // Seçili modu zorla
                }),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            // Mod değişikliği bildirimi
            const previousMod = currentMod;
            const newMod = data.mod as ModType;

            if (previousMod && newMod && previousMod !== newMod) {
                const modTransitionMessages: Record<ModType, string> = {
                    'academic': '📚 Akademik Koç moduna geçtim. Çalışma planı ve hedeflerine odaklanıyorum.',
                    'focus-anxiety': '🧘 Odak & Kaygı moduna geçtim. Önce seni rahatlatalım, sonra devam ederiz.',
                    'motivation-discipline': '⭐ Motivasyon moduna geçtim. Birlikte küçük adımlarla ilerleyeceğiz.',
                    'career-direction': '🧭 Gelişim Yönü moduna geçtim. Güçlü yanlarını keşfedelim.',
                    'safe-support': '💙 Güvenli Destek moduna geçtim. Yanındayım.'
                };

                const transitionMessage: Message = {
                    id: (Date.now() + 0.5).toString(),
                    role: 'model',
                    content: `**[Mod Değişikliği]**\n\n${modTransitionMessages[newMod]}`,
                    mod: newMod
                };
                setMessages((prev) => [...prev, transitionMessage]);
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: data.text,
                mod: data.mod
            };

            setMessages((prev) => [...prev, botMessage]);
            setCurrentMod(data.mod as ModType);
        } catch (error: any) {
            console.error('Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: error.message || 'Üzgünüm, bir hata oluştu. Lütfen tekrar dene.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const getModColor = (mod: ModType): string => {
        const colors: Record<ModType, string> = {
            'academic': 'var(--mod-academic)',
            'focus-anxiety': 'var(--mod-anxiety)',
            'motivation-discipline': 'var(--mod-motivation)',
            'career-direction': 'var(--mod-career)',
            'safe-support': 'var(--mod-safe)'
        };
        return colors[mod] || 'var(--primary)';
    };

    const handleQuickPrompt = (prompt: string) => {
        setInput(prompt);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'mastered': return '#10b981';
            case 'learning': return '#f59e0b';
            case 'struggling': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'mastered': return 'Hakim';
            case 'learning': return 'Öğreniyor';
            case 'struggling': return 'Zorlanıyor';
            default: return '-';
        }
    };

    if (!studentInfo) {
        return <StudentInfoForm onSubmit={handleStudentInfoSubmit} />;
    }

    const quickPrompts = studentData ? [
        { text: 'Bugün için plan oluştur', icon: '📋' },
        { text: 'Zayıf konularıma odaklan', icon: '🎯' },
        { text: 'Net artışı için strateji ver', icon: '📈' },
        { text: 'Haftalık program çıkar', icon: '📅' },
    ] : [
        { text: 'Bugün ne çalışayım?', icon: '📚' },
        { text: 'Çok stresliyim', icon: '🧘' },
        { text: 'Motivasyonum yok', icon: '⭐' },
        { text: 'Kendimi tanımak istiyorum', icon: '🧭' },
    ];

    return (
        <div className={`chat-wrapper ${studentData ? 'with-data-panel' : ''}`}>
            {/* Öğrenci Veri Paneli - GELİŞMİŞ */}
            {studentData && (
                <div className={`student-data-panel ${showDataPanel ? 'open' : 'closed'}`}>
                    <button
                        className="panel-toggle"
                        onClick={() => setShowDataPanel(!showDataPanel)}
                    >
                        {showDataPanel ? '◀' : '▶'}
                    </button>

                    {showDataPanel && (
                        <div className="panel-content">
                            {/* Header */}
                            <div className="panel-header">
                                <h3>📊 Veri Özeti</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="student-name" style={{ fontSize: '1.2rem', margin: 0 }}>{studentData.name}</span>
                                    <div className="student-meta" style={{ marginBottom: 0 }}>
                                        <span className="exam-badge">{studentData.targetExam}</span>
                                        <span className="grade-badge">{studentData.grade}. Sınıf</span>
                                    </div>
                                </div>

                                {/* Yeni Özellik Butonları */}
                                <div className="panel-actions" style={{ marginTop: '1rem' }}>
                                    <button
                                        className="action-btn chart-btn"
                                        onClick={() => setShowProgressChart(true)}
                                        title="İlerleme Grafikleri"
                                    >
                                        📈 Grafik
                                    </button>
                                    <button
                                        className="action-btn reminder-btn"
                                        onClick={() => setShowReminder(true)}
                                        title="Hatırlatıcı Ayarla"
                                    >
                                        🔔 Hatırlat
                                    </button>
                                </div>
                            </div>

                            {/* Haftalık Özet İstatistikler */}
                            <div className="data-section weekly-summary">
                                <h4>📅 Son Durum</h4>
                                <div className="summary-stats">
                                    <div className="summary-item">
                                        <span className="summary-value">{studentData.recentExams?.length || 0}</span>
                                        <span className="summary-label">Sınav</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-value">
                                            {studentData.recentExams?.[0]?.totalNet?.toFixed(1) || '-'}
                                        </span>
                                        <span className="summary-label">Son Net</span>
                                    </div>
                                    <div className="summary-item trend-item">
                                        {(() => {
                                            const exams = studentData.recentExams || [];
                                            if (exams.length >= 2) {
                                                const diff = (exams[0].totalNet || 0) - (exams[exams.length - 1].totalNet || 0);
                                                const isUp = diff >= 0;
                                                return (
                                                    <>
                                                        <span className={`summary-value trend ${isUp ? 'up' : 'down'}`}>
                                                            {isUp ? '↑' : '↓'} {Math.abs(diff).toFixed(1)}
                                                        </span>
                                                        <span className="summary-label">Trend</span>
                                                    </>
                                                );
                                            }
                                            return <span className="summary-value">-</span>;
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Son Deneme - Ana Kart */}
                            {studentData.recentExams?.[0] && (
                                <div className="data-section exam-main">
                                    <h4>📝 {studentData.recentExams[0].examName}</h4>
                                    <div className="exam-summary">
                                        <div className="net-big">
                                            {studentData.recentExams[0].totalNet?.toFixed(1)}
                                            <span>Net</span>
                                        </div>
                                        <div className="exam-meta">
                                            {studentData.recentExams[0].ranking && (
                                                <p>Sıra: {studentData.recentExams[0].ranking?.toLocaleString()}</p>
                                            )}
                                            {studentData.recentExams[0].percentile && (
                                                <p>Yüzdelik: %{studentData.recentExams[0].percentile}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TÜM DERSLER - Genişletilmiş */}
                            {studentData.recentExams?.[0]?.subjectResults && (
                                <div className="data-section all-subjects">
                                    <h4>📚 Ders Başarısı</h4>
                                    <div className="subjects-list">
                                        {studentData.recentExams[0].subjectResults.map((s: any, idx: number) => (
                                            <div key={idx} className="subject-row">
                                                <div className="subject-info">
                                                    <span className="subject-name">{s.subject}</span>
                                                    <span className="subject-stats">
                                                        <span className="correct">D:{s.correct}</span>
                                                        <span className="wrong">Y:{s.wrong}</span>
                                                        <span className="empty">B:{s.empty}</span>
                                                    </span>
                                                </div>
                                                <div className="subject-bar-container">
                                                    <div className="subject-bar">
                                                        <div
                                                            className="subject-bar-fill"
                                                            style={{
                                                                width: `${s.successRate}%`,
                                                                background: s.successRate >= 80
                                                                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                                                                    : s.successRate >= 50
                                                                        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                                                        : 'linear-gradient(90deg, #ef4444, #f87171)'
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="subject-percent">%{s.successRate}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Çalışma İstatistikleri */}
                            {studentData.studyStats && (
                                <div className="data-section">
                                    <h4>⏱️ Çalışma Alışkanlıkları</h4>
                                    <div className="stats-grid">
                                        <div className="stat-item">
                                            <span className="stat-val">{studentData.studyStats.averageDailyStudyMinutes}</span>
                                            <span className="stat-lbl">dk/gün</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-val">🔥{studentData.studyStats.currentStreak}</span>
                                            <span className="stat-lbl">Gün Seri</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-val">{studentData.studyStats.totalStudyTimeMinutes ? (studentData.studyStats.totalStudyTimeMinutes / 60).toFixed(0) : 0}</span>
                                            <span className="stat-lbl">Toplam Saat</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-val">%{(studentData.studyStats.subjectDistribution?.[0]?.percentage || 0)}</span>
                                            <span className="stat-lbl">Favori Ders</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Güçlü/Zayıf */}
                            {studentData.strengthWeaknessAnalysis && (
                                <div className="data-section sw-section">
                                    <h4>⚡ Analiz</h4>
                                    {studentData.strengthWeaknessAnalysis.strengths?.slice(0, 2).map((s: any, i: number) => (
                                        <div key={`str-${i}`} className="sw-box strength">
                                            <span className="sw-icon">💪</span>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600 }}>{s.subject}</span>
                                                <span style={{ fontSize: '0.75rem' }}>Güçlü Yön</span>
                                            </div>
                                        </div>
                                    ))}
                                    {studentData.strengthWeaknessAnalysis.weaknesses?.slice(0, 2).map((w: any, i: number) => (
                                        <div key={`weak-${i}`} className="sw-box weakness">
                                            <span className="sw-icon">⚠️</span>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600 }}>{w.subject}</span>
                                                <span style={{ fontSize: '0.75rem' }}>Gelişim Alanı ({w.priority === 'critical' ? 'Kritik' : 'Önemli'})</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Ana Chat Alanı */}
            <div className="chat-container">
                {/* Panel Navigation */}
                <div className="panel-nav">
                    <div className="panel-tabs">
                        {PANELS.map((panel) => (
                            <button
                                key={panel.id}
                                className={`panel-tab ${activePanel === panel.id ? 'active' : ''}`}
                                onClick={() => {
                                    setActivePanel(panel.id);
                                    // Panel değişiminde modu zorla
                                    if (panel.id === 'academic') setCurrentMod('academic');
                                    else if (panel.id === 'emotional') setCurrentMod('safe-support');
                                    else if (panel.id === 'growth') setCurrentMod('career-direction');
                                    else if (panel.id === 'all') setCurrentMod(null); // Otomatik mod
                                }}
                                title={panel.description}
                            >
                                <span className="panel-icon">{panel.icon}</span>
                                <span className="panel-label">{panel.label}</span>
                            </button>
                        ))}
                    </div>

                    {currentMod && (
                        <div
                            className="current-mod-indicator"
                            style={{ borderColor: getModColor(currentMod) }}
                        >
                            <span className="mod-icon">{MOD_ICONS[currentMod]}</span>
                            <span className="mod-name">{MOD_NAMES[currentMod]}</span>
                        </div>
                    )}
                </div>

                {/* Messages Area */}
                <div className="messages-area">
                    {messages.length === 1 && (
                        <div className="quick-prompts">
                            <p className="quick-prompts-label">Hızlı başla:</p>
                            <div className="quick-prompts-grid">
                                {quickPrompts.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        className="quick-prompt-btn"
                                        onClick={() => handleQuickPrompt(prompt.text)}
                                    >
                                        <span>{prompt.icon}</span>
                                        <span>{prompt.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            role={msg.role}
                            content={msg.content}
                            image={msg.image}
                            mod={msg.mod}
                        />
                    ))}

                    {isLoading && (
                        <div className="thinking">
                            <div className="thinking-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span className="thinking-text">
                                {autoAnalyzed ? 'Düşünüyor...' : 'Verileri analiz ediyor...'}
                            </span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="input-area">
                    {selectedImage && (
                        <div className="image-preview">
                            <img src={selectedImage} alt="Preview" />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="image-remove-btn"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="chat-form">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="attach-btn"
                            title="Görsel ekle"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={studentData ? "Verilerine göre soru sor..." : "Bir soru sor veya durumunu paylaş..."}
                            className="chat-input"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || (!input.trim() && !selectedImage)}
                            className="send-btn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            {/* İlerleme Grafikleri Modal */}
            {showProgressChart && studentData?.recentExams && (
                <ProgressDashboard
                    exams={studentData.recentExams}
                    studyStats={studentData.studyStats}
                    onClose={() => setShowProgressChart(false)}
                    studentGrade={studentData.grade || 12}
                    targetExam={studentData.targetExam || 'YKS'}
                />
            )}

            {/* Hatırlatıcı Modal */}
            {showReminder && (
                <StudyReminder onClose={() => setShowReminder(false)} />
            )}
        </div>
    );
}
