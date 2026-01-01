'use client';

import { useState } from 'react';

export interface StudentInfo {
    name?: string;
    level: string;
    targetExam?: string;
    age?: number;
    currentEnergy?: 'high' | 'medium' | 'low';
    currentFocus?: 'sharp' | 'scattered' | 'blocked';
    currentAnxiety?: 'calm' | 'mild' | 'high' | 'critical';
    academicBottleneck?: string;
}

interface StudentInfoFormProps {
    onSubmit: (info: StudentInfo) => void;
}

export default function StudentInfoForm({ onSubmit }: StudentInfoFormProps) {
    const [formData, setFormData] = useState<StudentInfo>({
        level: '',
        targetExam: '',
        currentEnergy: 'medium',
        currentFocus: 'sharp',
        currentAnxiety: 'calm',
    });
    const [step, setStep] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.level) {
            onSubmit(formData);
        }
    };

    const levels = [
        { value: 'İlkokul', label: '🎒 İlkokul', description: '1-4. sınıf' },
        { value: 'Ortaokul', label: '📚 Ortaokul', description: '5-8. sınıf' },
        { value: 'Lise', label: '🎓 Lise', description: '9-12. sınıf' },
        { value: 'YKS Hazırlık', label: '🎯 YKS Hazırlık', description: 'Üniversite sınavı' },
        { value: 'Üniversite', label: '🏛️ Üniversite', description: 'Lisans/Yüksek Lisans' },
        { value: 'KPSS Hazırlık', label: '📋 KPSS Hazırlık', description: 'Kamu sınavı' },
    ];

    const exams = [
        { value: 'LGS', label: 'LGS', icon: '📝' },
        { value: 'YKS', label: 'YKS', icon: '🎯' },
        { value: 'KPSS', label: 'KPSS', icon: '📋' },
        { value: 'ALES', label: 'ALES', icon: '📊' },
        { value: 'DGS', label: 'DGS', icon: '🔄' },
        { value: 'YDS', label: 'YDS', icon: '🌍' },
    ];

    const energyOptions = [
        { value: 'high', label: 'Yüksek', icon: '⚡', color: '#22c55e' },
        { value: 'medium', label: 'Orta', icon: '🔋', color: '#eab308' },
        { value: 'low', label: 'Düşük', icon: '🪫', color: '#ef4444' },
    ];

    const focusOptions = [
        { value: 'sharp', label: 'Keskin', icon: '🎯', color: '#22c55e' },
        { value: 'scattered', label: 'Dağınık', icon: '💭', color: '#eab308' },
        { value: 'blocked', label: 'Blokeli', icon: '🧱', color: '#ef4444' },
    ];

    const anxietyOptions = [
        { value: 'calm', label: 'Sakin', icon: '😌', color: '#22c55e' },
        { value: 'mild', label: 'Hafif', icon: '😐', color: '#eab308' },
        { value: 'high', label: 'Yüksek', icon: '😰', color: '#f97316' },
        { value: 'critical', label: 'Kritik', icon: '😫', color: '#ef4444' },
    ];

    const renderStep1 = () => (
        <>
            <h2 className="form-title">Merhaba! 👋</h2>
            <p className="form-subtitle">
                Sana en iyi desteği verebilmem için birkaç bilgiye ihtiyacım var.
            </p>

            <div className="form-group">
                <label htmlFor="name" className="form-label">
                    İsmin (İsteğe bağlı)
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="İsmini yazabilirsin"
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label className="form-label">
                    Seviyen <span className="required">*</span>
                </label>
                <div className="level-grid">
                    {levels.map((level) => (
                        <button
                            key={level.value}
                            type="button"
                            className={`level-card ${formData.level === level.value ? 'selected' : ''}`}
                            onClick={() => setFormData({ ...formData, level: level.value })}
                        >
                            <span className="level-label">{level.label}</span>
                            <span className="level-desc">{level.description}</span>
                        </button>
                    ))}
                </div>
            </div>

            {(formData.level === 'Ortaokul' || formData.level === 'Lise' || formData.level === 'YKS Hazırlık') && (
                <div className="form-group">
                    <label className="form-label">
                        Hedef Sınav
                    </label>
                    <div className="exam-grid">
                        {exams.filter(e => {
                            if (formData.level === 'Ortaokul') return e.value === 'LGS';
                            if (formData.level === 'YKS Hazırlık') return e.value === 'YKS';
                            return ['YKS', 'LGS'].includes(e.value);
                        }).map((exam) => (
                            <button
                                key={exam.value}
                                type="button"
                                className={`exam-card ${formData.targetExam === exam.value ? 'selected' : ''}`}
                                onClick={() => setFormData({ ...formData, targetExam: exam.value })}
                            >
                                <span className="exam-icon">{exam.icon}</span>
                                <span>{exam.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                type="button"
                disabled={!formData.level}
                className="form-submit-btn"
                onClick={() => setStep(2)}
            >
                Devam Et →
            </button>
        </>
    );

    const renderStep2 = () => (
        <>
            <h2 className="form-title">Bugün Nasılsın? 🌟</h2>
            <p className="form-subtitle">
                Sana daha iyi yardımcı olabilmem için bugünkü durumunu anlat.
            </p>

            <div className="form-group">
                <label className="form-label">
                    ⚡ Enerji Seviyem
                </label>
                <div className="status-grid">
                    {energyOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`status-card ${formData.currentEnergy === option.value ? 'selected' : ''}`}
                            style={{
                                borderColor: formData.currentEnergy === option.value ? option.color : undefined,
                                boxShadow: formData.currentEnergy === option.value ? `0 0 12px ${option.color}40` : undefined
                            }}
                            onClick={() => setFormData({ ...formData, currentEnergy: option.value as any })}
                        >
                            <span className="status-icon">{option.icon}</span>
                            <span className="status-label">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">
                    🎯 Odak Durumum
                </label>
                <div className="status-grid">
                    {focusOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`status-card ${formData.currentFocus === option.value ? 'selected' : ''}`}
                            style={{
                                borderColor: formData.currentFocus === option.value ? option.color : undefined,
                                boxShadow: formData.currentFocus === option.value ? `0 0 12px ${option.color}40` : undefined
                            }}
                            onClick={() => setFormData({ ...formData, currentFocus: option.value as any })}
                        >
                            <span className="status-icon">{option.icon}</span>
                            <span className="status-label">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">
                    😌 Kaygı Seviyem
                </label>
                <div className="status-grid four-col">
                    {anxietyOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`status-card ${formData.currentAnxiety === option.value ? 'selected' : ''}`}
                            style={{
                                borderColor: formData.currentAnxiety === option.value ? option.color : undefined,
                                boxShadow: formData.currentAnxiety === option.value ? `0 0 12px ${option.color}40` : undefined
                            }}
                            onClick={() => setFormData({ ...formData, currentAnxiety: option.value as any })}
                        >
                            <span className="status-icon">{option.icon}</span>
                            <span className="status-label">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="bottleneck" className="form-label">
                    🔒 En kritik ders/konu darboğazın (isteğe bağlı)
                </label>
                <input
                    type="text"
                    id="bottleneck"
                    value={formData.academicBottleneck || ''}
                    onChange={(e) => setFormData({ ...formData, academicBottleneck: e.target.value })}
                    placeholder="Örn: Matematik - Türev, Fizik - Dinamik..."
                    className="form-input"
                />
            </div>

            <div className="button-row">
                <button
                    type="button"
                    className="form-back-btn"
                    onClick={() => setStep(1)}
                >
                    ← Geri
                </button>
                <button
                    type="submit"
                    className="form-submit-btn"
                >
                    Başlayalım! 🚀
                </button>
            </div>
        </>
    );

    return (
        <div className="student-info-form">
            <div className="form-container">
                <div className="step-indicator">
                    <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className="step-line"></div>
                    <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                </div>

                <form onSubmit={handleSubmit} className="info-form">
                    {step === 1 ? renderStep1() : renderStep2()}
                </form>
            </div>
        </div>
    );
}
