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
        // Default values since we skip the input step
        name: 'Öğrenci',
        level: 'Lise',
        targetExam: 'YKS',
        currentEnergy: 'medium',
        currentFocus: 'sharp',
        currentAnxiety: 'calm',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

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

    return (
        <div className="student-info-form">
            <div className="form-container">
                {/* Tek adım olduğu için indicator kaldırıldı */}

                <form onSubmit={handleSubmit} className="info-form">
                    <h2 className="form-title">Bugün Nasılsın? 🌟</h2>
                    <p className="form-subtitle">
                        Sana daha iyi yardımcı olabilmem için bugünkü durumunu seç.
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

                    <div className="button-row" style={{ justifyContent: 'center' }}>
                        <button
                            type="submit"
                            className="form-submit-btn"
                            style={{ width: '100%', maxWidth: '300px' }}
                        >
                            Başlayalım! 🚀
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
