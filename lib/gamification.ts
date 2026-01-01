/**
 * VİSİ AI - Gamification System
 * 
 * XP, seviye, başarı rozetleri ve günlük görev sistemi.
 * Öğrenciyi motive eden oyunlaştırma mekanikleri.
 */

import { StudentProfile, TopicPerformance } from './studentData';

// ============================================================================
// GAMİFİCATİON VERİ TİPLERİ
// ============================================================================

export interface PlayerStats {
    level: number;
    currentXP: number;
    totalXP: number;
    xpToNextLevel: number;
    title: string;
    rank: string;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'streak' | 'study' | 'performance' | 'social' | 'special';
    requirement: number;
    current: number;
    unlocked: boolean;
    unlockedDate?: string;
    xpReward: number;
}

export interface DailyQuest {
    id: string;
    title: string;
    description: string;
    icon: string;
    target: number;
    current: number;
    xpReward: number;
    completed: boolean;
    type: 'study' | 'questions' | 'streak' | 'review';
}

// ============================================================================
// SEVİYE SİSTEMİ
// ============================================================================

const LEVEL_THRESHOLDS = [
    { level: 1, xp: 0, title: 'Çaylak', rank: '🌱' },
    { level: 2, xp: 100, title: 'Öğrenci', rank: '📗' },
    { level: 3, xp: 250, title: 'Gayretli', rank: '📘' },
    { level: 4, xp: 500, title: 'Çalışkan', rank: '📙' },
    { level: 5, xp: 850, title: 'Azimli', rank: '⭐' },
    { level: 6, xp: 1300, title: 'Kararlı', rank: '🌟' },
    { level: 7, xp: 1850, title: 'Ustalaşan', rank: '💫' },
    { level: 8, xp: 2500, title: 'Uzman', rank: '🔥' },
    { level: 9, xp: 3300, title: 'Elit', rank: '💎' },
    { level: 10, xp: 4200, title: 'Efsane', rank: '👑' },
    { level: 11, xp: 5500, title: 'Şampiyon', rank: '🏆' },
    { level: 12, xp: 7000, title: 'Grandmaster', rank: '🎖️' }
];

/**
 * XP hesapla ve oyuncu istatistiklerini döndür
 */
export function calculatePlayerStats(profile: StudentProfile): PlayerStats {
    // XP kaynakları
    const streak = profile.studyStats?.currentStreak || 0;
    const dailyStudy = profile.studyStats?.averageDailyStudyMinutes || 0;
    const totalStudyDays = profile.studyStats?.totalStudyDays || 0;
    const lastExamNet = profile.recentExams?.[0]?.totalNet || 0;
    const topicsLearned = profile.topicPerformance?.filter(t => t.status === 'mastered').length || 0;

    // XP hesaplama
    let totalXP = 0;

    // Çalışma günleri XP (her gün 10 XP)
    totalXP += totalStudyDays * 10;

    // Streak bonus (streak^1.5)
    totalXP += Math.round(Math.pow(streak, 1.5) * 5);

    // Net başarı XP (net * 5)
    totalXP += Math.round(lastExamNet * 5);

    // Konu ustalık XP (her konu 50 XP)
    totalXP += topicsLearned * 50;

    // Günlük çalışma bonus (180dk+ = bonus)
    if (dailyStudy >= 180) totalXP += 200;
    else if (dailyStudy >= 120) totalXP += 100;

    // Seviye hesapla
    let currentLevel = LEVEL_THRESHOLDS[0];
    let nextLevel = LEVEL_THRESHOLDS[1];

    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (totalXP >= LEVEL_THRESHOLDS[i].xp) {
            currentLevel = LEVEL_THRESHOLDS[i];
            nextLevel = LEVEL_THRESHOLDS[Math.min(i + 1, LEVEL_THRESHOLDS.length - 1)];
            break;
        }
    }

    const currentXP = totalXP - currentLevel.xp;
    const xpToNextLevel = nextLevel.xp - currentLevel.xp;

    return {
        level: currentLevel.level,
        currentXP,
        totalXP,
        xpToNextLevel,
        title: currentLevel.title,
        rank: currentLevel.rank
    };
}

// ============================================================================
// BAŞARI SİSTEMİ
// ============================================================================

const ACHIEVEMENT_TEMPLATES: Omit<Achievement, 'current' | 'unlocked' | 'unlockedDate'>[] = [
    // Streak başarıları
    { id: 'streak_3', name: 'İlk Adım', description: '3 gün art arda çalış', icon: '🔥', category: 'streak', requirement: 3, xpReward: 25 },
    { id: 'streak_7', name: 'Haftalık Savaşçı', description: '7 gün art arda çalış', icon: '⭐', category: 'streak', requirement: 7, xpReward: 75 },
    { id: 'streak_14', name: 'Disiplin Ustası', description: '14 gün art arda çalış', icon: '💪', category: 'streak', requirement: 14, xpReward: 150 },
    { id: 'streak_21', name: 'Alışkanlık Kahramanı', description: '21 gün art arda çalış', icon: '🌟', category: 'streak', requirement: 21, xpReward: 250 },
    { id: 'streak_30', name: 'Efsane', description: '30 gün art arda çalış', icon: '👑', category: 'streak', requirement: 30, xpReward: 500 },
    { id: 'streak_60', name: 'Durdurulamaz', description: '60 gün art arda çalış', icon: '💎', category: 'streak', requirement: 60, xpReward: 1000 },

    // Çalışma başarıları
    { id: 'study_1000', name: 'Bin Dakika', description: '1000 dakika çalış', icon: '⏱️', category: 'study', requirement: 1000, xpReward: 100 },
    { id: 'study_5000', name: 'Maraton Koşucusu', description: '5000 dakika çalış', icon: '🏃', category: 'study', requirement: 5000, xpReward: 300 },
    { id: 'study_10000', name: 'Çalışma Makinesi', description: '10000 dakika çalış', icon: '🤖', category: 'study', requirement: 10000, xpReward: 600 },

    // Performans başarıları
    { id: 'net_50', name: 'Yarı Yolda', description: '50 net ulaş', icon: '📊', category: 'performance', requirement: 50, xpReward: 200 },
    { id: 'net_75', name: 'Üst Düzey', description: '75 net ulaş', icon: '📈', category: 'performance', requirement: 75, xpReward: 400 },
    { id: 'net_100', name: 'Yüzlük', description: '100 net ulaş', icon: '💯', category: 'performance', requirement: 100, xpReward: 800 },
    { id: 'net_110', name: 'Elit Performans', description: '110 net ulaş', icon: '🏆', category: 'performance', requirement: 110, xpReward: 1200 },

    // Konu başarıları
    { id: 'topic_5', name: 'Konu Avcısı', description: '5 konuda ustalaş', icon: '📚', category: 'study', requirement: 5, xpReward: 100 },
    { id: 'topic_15', name: 'Bilgi Deposu', description: '15 konuda ustalaş', icon: '🎓', category: 'study', requirement: 15, xpReward: 300 },
    { id: 'topic_30', name: 'Ansiklopedi', description: '30 konuda ustalaş', icon: '📖', category: 'study', requirement: 30, xpReward: 600 },

    // Özel başarılar
    { id: 'comeback', name: 'Geri Dönüş', description: 'Düşüşten sonra 10+ net artışı', icon: '🦅', category: 'special', requirement: 10, xpReward: 250 },
    { id: 'perfectday', name: 'Mükemmel Gün', description: 'Tüm günlük görevleri tamamla', icon: '✨', category: 'special', requirement: 1, xpReward: 50 },
    { id: 'earlybird', name: 'Erken Kuş', description: 'Sabah 6da çalış', icon: '🌅', category: 'special', requirement: 1, xpReward: 30 },
    { id: 'nightowl', name: 'Gece Kuşu', description: 'Gece 11de çalış', icon: '🦉', category: 'special', requirement: 1, xpReward: 30 }
];

/**
 * Başarı durumlarını kontrol et
 */
export function checkAchievements(profile: StudentProfile): Achievement[] {
    const streak = profile.studyStats?.currentStreak || 0;
    const totalMinutes = (profile.studyStats?.averageDailyStudyMinutes || 0) * (profile.studyStats?.totalStudyDays || 0);
    const currentNet = profile.recentExams?.[0]?.totalNet || 0;
    const masteredTopics = profile.topicPerformance?.filter(t => t.status === 'mastered').length || 0;

    return ACHIEVEMENT_TEMPLATES.map(template => {
        let current = 0;

        switch (template.category) {
            case 'streak':
                current = streak;
                break;
            case 'study':
                if (template.id.startsWith('study_')) current = totalMinutes;
                else if (template.id.startsWith('topic_')) current = masteredTopics;
                break;
            case 'performance':
                current = currentNet;
                break;
            default:
                current = 0;
        }

        return {
            ...template,
            current,
            unlocked: current >= template.requirement
        };
    });
}

// ============================================================================
// GÜNLÜK GÖREVLER
// ============================================================================

/**
 * Günlük görevler oluştur
 */
export function generateDailyQuests(profile: StudentProfile): DailyQuest[] {
    const dailyStudy = profile.studyStats?.averageDailyStudyMinutes || 0;
    const weakTopics = profile.topicPerformance?.filter(t => t.status === 'struggling') || [];
    const streak = profile.studyStats?.currentStreak || 0;

    const quests: DailyQuest[] = [
        {
            id: 'daily_study',
            title: 'Günlük Çalışma',
            description: 'Bugün en az 120 dakika çalış',
            icon: '⏱️',
            target: 120,
            current: 0, // Gerçek veriden gelecek
            xpReward: 30,
            completed: false,
            type: 'study'
        },
        {
            id: 'daily_questions',
            title: 'Soru Maratonu',
            description: 'Bugün 50 soru çöz',
            icon: '📝',
            target: 50,
            current: 0,
            xpReward: 25,
            completed: false,
            type: 'questions'
        },
        {
            id: 'daily_weak',
            title: 'Zayıf Konu',
            description: weakTopics[0] ? `${weakTopics[0].topic} konusundan 10 soru çöz` : '10 zor soru çöz',
            icon: '🎯',
            target: 10,
            current: 0,
            xpReward: 35,
            completed: false,
            type: 'review'
        },
        {
            id: 'daily_streak',
            title: 'Seriyi Koru',
            description: `${streak + 1}. güne ulaş`,
            icon: '🔥',
            target: 1,
            current: 0,
            xpReward: 20 + streak,
            completed: false,
            type: 'streak'
        }
    ];

    // Bonus görev (haftada 1)
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 6) { // Cumartesi
        quests.push({
            id: 'weekly_exam',
            title: 'Haftalık Deneme',
            description: 'Bir deneme sınavı çöz ve analiz et',
            icon: '📊',
            target: 1,
            current: 0,
            xpReward: 100,
            completed: false,
            type: 'review'
        });
    }

    return quests;
}

/**
 * Gamification prompt parçası oluştur
 */
export function generateGamificationPrompt(profile: StudentProfile): string {
    const stats = calculatePlayerStats(profile);
    const achievements = checkAchievements(profile);
    const quests = generateDailyQuests(profile);

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalAchievements = achievements.length;
    const pendingQuests = quests.filter(q => !q.completed);

    // Yaklaşan başarılar
    const nearbyAchievements = achievements
        .filter(a => !a.unlocked && a.current >= a.requirement * 0.7)
        .slice(0, 3);

    let prompt = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 OYUNLAŞTIRMA & İLERLEME SİSTEMİ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${stats.rank} SEVİYE ${stats.level} - ${stats.title}
📊 XP: ${stats.currentXP}/${stats.xpToNextLevel} (Toplam: ${stats.totalXP})
🏆 Başarılar: ${unlockedCount}/${totalAchievements}

📋 GÜNLÜK GÖREVLER:
${quests.map(q => `${q.completed ? '✅' : '⬜'} ${q.icon} ${q.title} (+${q.xpReward} XP)`).join('\n')}

`;

    if (nearbyAchievements.length > 0) {
        prompt += `🎯 YAKLAŞAN BAŞARILAR:\n`;
        nearbyAchievements.forEach(a => {
            const progress = Math.round((a.current / a.requirement) * 100);
            prompt += `${a.icon} ${a.name} - %${progress} (${a.current}/${a.requirement})\n`;
        });
    }

    return prompt;
}
