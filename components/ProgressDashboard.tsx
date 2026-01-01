'use client';

import { useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import './ProgressDashboard.css';

interface ExamData {
    date: string;
    examName: string;
    totalNet: number;
    examType: string;
    subjectResults?: {
        subject: string;
        net: number;
        successRate: number;
    }[];
}

interface ProgressDashboardProps {
    exams: ExamData[];
    studyStats?: {
        averageDailyStudyMinutes: number;
        currentStreak: number;
        weeklyDistribution?: { day: string; minutes: number }[];
    };
    onClose: () => void;
}

export default function ProgressDashboard({ exams, studyStats, onClose }: ProgressDashboardProps) {
    const [activeTab, setActiveTab] = useState<'net' | 'subjects' | 'study'>('net');

    // Net trend verisi hazırla (son 7 sınav)
    const netTrendData = exams.slice(0, 7).reverse().map((exam, idx) => ({
        name: `S${idx + 1}`,
        net: exam.totalNet,
        examName: exam.examName.substring(0, 15) + '...',
        fullName: exam.examName
    }));

    // Ders bazlı başarı (son sınav)
    const lastExam = exams[0];
    const subjectData = lastExam?.subjectResults?.map(s => ({
        name: s.subject.substring(0, 6),
        fullName: s.subject,
        başarı: s.successRate,
        net: s.net
    })) || [];

    // Çalışma dağılımı
    const studyData = studyStats?.weeklyDistribution?.map(d => ({
        name: d.day.substring(0, 3),
        dakika: d.minutes
    })) || [];

    // İstatistikler
    const avgNet = exams.length > 0
        ? (exams.reduce((sum, e) => sum + e.totalNet, 0) / exams.length).toFixed(1)
        : 0;
    const maxNet = exams.length > 0
        ? Math.max(...exams.map(e => e.totalNet)).toFixed(1)
        : 0;
    const trend = exams.length >= 2
        ? (exams[0].totalNet - exams[exams.length - 1].totalNet).toFixed(1)
        : 0;

    return (
        <div className="progress-modal-overlay" onClick={onClose}>
            <div className="progress-modal" onClick={e => e.stopPropagation()}>
                <div className="progress-header">
                    <h2>📊 İlerleme Analizi</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {/* Özet Kartları */}
                <div className="stats-cards">
                    <div className="stat-card">
                        <span className="stat-icon">📈</span>
                        <span className="stat-value">{avgNet}</span>
                        <span className="stat-label">Ort. Net</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">🏆</span>
                        <span className="stat-value">{maxNet}</span>
                        <span className="stat-label">En Yüksek</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">{Number(trend) >= 0 ? '↑' : '↓'}</span>
                        <span className={`stat-value ${Number(trend) >= 0 ? 'positive' : 'negative'}`}>
                            {Number(trend) >= 0 ? '+' : ''}{trend}
                        </span>
                        <span className="stat-label">Değişim</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">🔥</span>
                        <span className="stat-value">{studyStats?.currentStreak || 0}</span>
                        <span className="stat-label">Seri</span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="chart-tabs">
                    <button
                        className={`chart-tab ${activeTab === 'net' ? 'active' : ''}`}
                        onClick={() => setActiveTab('net')}
                    >
                        📈 Net Trend
                    </button>
                    <button
                        className={`chart-tab ${activeTab === 'subjects' ? 'active' : ''}`}
                        onClick={() => setActiveTab('subjects')}
                    >
                        📚 Dersler
                    </button>
                    <button
                        className={`chart-tab ${activeTab === 'study' ? 'active' : ''}`}
                        onClick={() => setActiveTab('study')}
                    >
                        ⏱️ Çalışma
                    </button>
                </div>

                {/* Grafikler */}
                <div className="chart-container">
                    {activeTab === 'net' && (
                        <div className="chart-section">
                            <h3>Son 7 Sınav Net Trendi</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={netTrendData}>
                                    <defs>
                                        <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#667eea" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="name" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip
                                        contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }}
                                        formatter={(value: any) => [`${value} Net`, 'Net']}
                                        labelFormatter={(label: any, payload: any) =>
                                            payload?.[0]?.payload?.fullName || label
                                        }
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="net"
                                        stroke="#667eea"
                                        fill="url(#netGradient)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {activeTab === 'subjects' && (
                        <div className="chart-section">
                            <h3>Ders Bazlı Başarı (%)</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={subjectData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis type="number" domain={[0, 100]} stroke="#888" />
                                    <YAxis type="category" dataKey="name" stroke="#888" width={50} />
                                    <Tooltip
                                        contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }}
                                        formatter={(value: any, name: any, props: any) => [
                                            `%${value}`,
                                            props.payload.fullName
                                        ]}
                                    />
                                    <Bar
                                        dataKey="başarı"
                                        fill="#10b981"
                                        radius={[0, 4, 4, 0]}
                                        label={{ position: 'right', fill: '#888', fontSize: 12 }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {activeTab === 'study' && (
                        <div className="chart-section">
                            <h3>Haftalık Çalışma Dağılımı</h3>
                            {studyData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={studyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="name" stroke="#888" />
                                        <YAxis stroke="#888" />
                                        <Tooltip
                                            contentStyle={{ background: '#1a1a2e', border: '1px solid #333' }}
                                            formatter={(value: any) => [`${value} dk`, 'Çalışma']}
                                        />
                                        <Bar dataKey="dakika" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="no-data">Çalışma verisi bulunamadı</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Günlük Ortalama */}
                {studyStats && (
                    <div className="study-average">
                        <span>📚 Günlük Ortalama:</span>
                        <strong>{studyStats.averageDailyStudyMinutes} dakika</strong>
                    </div>
                )}
            </div>
        </div>
    );
}
