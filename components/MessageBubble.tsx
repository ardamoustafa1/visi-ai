'use client';

import ReactMarkdown from 'react-markdown';
import { MOD_NAMES, MOD_ICONS, ModType } from '@/lib/prompts';

interface MessageBubbleProps {
    role: 'user' | 'model';
    content: string;
    image?: string;
    mod?: string;
}

// İçerikten plan kartları çıkar
function extractPlanCards(content: string): { hasMicroPlan: boolean; hasWeeklyPlan: boolean; hasNetTarget: boolean } {
    return {
        hasMicroPlan: content.includes('Mikro Plan') || content.includes('📋') || content.includes('⏱️'),
        hasWeeklyPlan: content.includes('HAFTALIK') || content.includes('Pazartesi') || content.includes('📅'),
        hasNetTarget: content.includes('Net Hedef') || content.includes('📈') || content.includes('net artış')
    };
}

// Başarı rozeti göster
function SuccessBadge({ type }: { type: 'streak' | 'improvement' | 'target' }) {
    const badges = {
        streak: { icon: '🔥', text: 'Seri Devam!', color: '#f59e0b' },
        improvement: { icon: '📈', text: 'Gelişim Var!', color: '#10b981' },
        target: { icon: '🎯', text: 'Hedefe Yakın!', color: '#667eea' }
    };
    const badge = badges[type];

    return (
        <div className="success-badge" style={{ borderColor: badge.color }}>
            <span>{badge.icon}</span>
            <span>{badge.text}</span>
        </div>
    );
}

// Format content with better styling
function formatContent(content: string): string {
    // Convert plan-like content to better format
    let formatted = content;

    // Highlight important numbers
    formatted = formatted.replace(/(\d+)\s*(net|Net|NET)/g, '<strong>$1 $2</strong>');
    formatted = formatted.replace(/%(\d+)/g, '<strong>%$1</strong>');

    return formatted;
}

export default function MessageBubble({ role, content, image, mod }: MessageBubbleProps) {
    const modType = mod as ModType;
    const modInfo = mod ? {
        name: MOD_NAMES[modType] || mod,
        icon: MOD_ICONS[modType] || '💬'
    } : null;

    const planCards = extractPlanCards(content);
    const showPlanIndicator = role === 'model' && (planCards.hasMicroPlan || planCards.hasWeeklyPlan);

    return (
        <div className={`message-row ${role}`}>
            <div className={`message-bubble ${role}`}>
                {image && (
                    <div className="message-image">
                        <img src={image} alt="Uploaded" />
                    </div>
                )}

                {role === 'model' && modInfo && (
                    <div className={`mod-badge ${mod}`}>
                        <span className="mod-icon">{modInfo.icon}</span>
                        <span className="mod-name">{modInfo.name}</span>
                    </div>
                )}

                {/* Plan Indicator */}
                {showPlanIndicator && (
                    <div className="plan-indicators">
                        {planCards.hasMicroPlan && (
                            <span className="plan-tag micro">📋 Mikro Plan</span>
                        )}
                        {planCards.hasWeeklyPlan && (
                            <span className="plan-tag weekly">📅 Haftalık</span>
                        )}
                        {planCards.hasNetTarget && (
                            <span className="plan-tag target">📈 Net Hedefi</span>
                        )}
                    </div>
                )}

                <div className="prose">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>

                {/* Micro Plan Card */}
                {role === 'model' && mod === 'academic' && planCards.hasMicroPlan && (
                    <div className="micro-plan-card">
                        <div className="micro-plan-header">
                            <span className="micro-plan-icon">📋</span>
                            <span>Günlük Görev Planı</span>
                        </div>
                        <div className="micro-plan-tip">
                            💡 İpucu: İlk 2 dakikaya odaklan, geri kalanı gelir!
                        </div>
                    </div>
                )}

                {/* Weekly Plan Card */}
                {role === 'model' && planCards.hasWeeklyPlan && !planCards.hasMicroPlan && (
                    <div className="weekly-plan-card">
                        <div className="weekly-plan-header">
                            <span>📅</span>
                            <span>Haftalık Program</span>
                        </div>
                        <div className="weekly-plan-tip">
                            Bu programa sadık kal, her hafta net artışı gör!
                        </div>
                    </div>
                )}

                {/* Action buttons removed - not functional yet */}
            </div>
        </div>
    );
}
