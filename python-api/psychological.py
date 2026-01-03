"""
VİSİ AI - Psikolojik Zeka Modülü
Duygu analizi ve psikolojik destek sistemi
"""

from typing import Optional, Dict, List
from models import StudentContext

# ============================================================================
# DUYGU DURUMU ANALİZİ
# ============================================================================

def analyze_emotional_state(
    message: str,
    context: Optional[StudentContext] = None
) -> Dict:
    """Öğrencinin duygusal durumunu analiz et"""
    
    lower_msg = message.lower()
    
    # Duygu göstergeleri
    stress_indicators = [
        'stres', 'kaygı', 'gergin', 'bunaldım', 'sıkıldım',
        'nefes alamıyorum', 'boğuluyorum', 'daralıyorum'
    ]
    
    sadness_indicators = [
        'üzgün', 'mutsuz', 'ağlıyorum', 'kötü hissediyorum',
        'moralim bozuk', 'keyifsiz', 'depresif'
    ]
    
    anger_indicators = [
        'sinirli', 'kızgın', 'öfkeli', 'çıldırıyorum',
        'bıktım', 'yeter artık', 'patladım'
    ]
    
    exhaustion_indicators = [
        'yoruldum', 'tükendim', 'bitkin', 'enerjim yok',
        'uyuyamıyorum', 'uykum yok', 'dermansız'
    ]
    
    hope_indicators = [
        'umutlu', 'iyimser', 'heyecanlı', 'motiveyim',
        'yapabilirim', 'başaracağım', 'güçlüyüm'
    ]
    
    # Skorları hesapla
    stress_score = sum(1 for i in stress_indicators if i in lower_msg)
    sadness_score = sum(1 for i in sadness_indicators if i in lower_msg)
    anger_score = sum(1 for i in anger_indicators if i in lower_msg)
    exhaustion_score = sum(1 for i in exhaustion_indicators if i in lower_msg)
    hope_score = sum(1 for i in hope_indicators if i in lower_msg)
    
    # Baskın duygu belirle
    emotions = {
        'stress': stress_score,
        'sadness': sadness_score,
        'anger': anger_score,
        'exhaustion': exhaustion_score,
        'hope': hope_score
    }
    
    dominant = max(emotions, key=emotions.get)
    total_negative = stress_score + sadness_score + anger_score + exhaustion_score
    
    # Duygusal yük seviyesi
    if total_negative >= 3:
        emotional_load = 'critical'
    elif total_negative >= 2:
        emotional_load = 'high'
    elif total_negative >= 1:
        emotional_load = 'medium'
    else:
        emotional_load = 'low'
    
    # Context'ten ek bilgi
    if context:
        if context.current_anxiety in ['high', 'critical']:
            emotional_load = 'high' if emotional_load == 'low' else emotional_load
    
    return {
        'dominant_emotion': dominant if emotions[dominant] > 0 else 'neutral',
        'emotional_load': emotional_load,
        'scores': emotions,
        'total_negative': total_negative,
        'needs_support': total_negative >= 2,
        'academic_ready': total_negative < 2
    }


# ============================================================================
# REGÜLASYoN PROTOKOLLERİ
# ============================================================================

REGULATION_PROTOCOLS = {
    'stress': {
        'name': 'Stres Regülasyonu',
        'duration': '3-5 dakika',
        'steps': [
            '1. Dur. Olduğun yerde dur.',
            '2. 4 saniye nefes al... tut... 4 saniye ver.',
            '3. Omuzlarını birkaç kez döndür.',
            '4. "Bu an geçici" de kendine.',
            '5. Şimdi küçük bir adım: Sadece 1 soru çöz.',
        ],
        'message': 'Stres hissetmen normal. Sistemin şu an zorlanıyor, ama bu geçici. Birlikte çözeceğiz.'
    },
    
    'exhaustion': {
        'name': 'Yorgunluk Protokolü',
        'duration': '5 dakika',
        'steps': [
            '1. Ekrandan uzaklaş, pencereye bak.',
            '2. Bir bardak su iç.',
            '3. 2 dakika yürü veya geriniş yap.',
            '4. Bugünkü hedefini yarıya indir.',
            '5. Küçük bir şey yap, ama yap.',
        ],
        'message': 'Yorgunluk beynin "dur" sinyali. Ama durma, yavaşla. Bugün %50 de olur.'
    },
    
    'anger': {
        'name': 'Öfke Regülasyonu',
        'duration': '3 dakika',
        'steps': [
            '1. Derin nefes: 4-7-8 tekniği.',
            '2. Kağıda yaz ne hissediyorsun.',
            '3. 10\'dan geriye say.',
            '4. Bir şey kır (kağıt, kalem değil!).',
            '5. Soğuk su iç.',
        ],
        'message': 'Öfke enerjini gösteriyor. Onu yıkıcı değil, yapıcı kullanabiliriz.'
    },
    
    'sadness': {
        'name': 'Üzüntü Desteği',
        'duration': '5 dakika',
        'steps': [
            '1. Hissetmene izin ver.',
            '2. Güvendiğin birine yaz/ara.',
            '3. Küçük bir şey yap kendin için.',
            '4. Bugünü hafif geçir.',
            '5. Yarın yeni bir gün.',
        ],
        'message': 'Üzülmek insanca. Bugün kendine nazik ol. Yarın daha güçlü dönersin.'
    },
}


def get_regulation_protocol(emotion: str) -> Dict:
    """Duyguya uygun regülasyon protokolü döndür"""
    return REGULATION_PROTOCOLS.get(emotion, REGULATION_PROTOCOLS['stress'])


# ============================================================================
# MOTİVASYON SİSTEMİ
# ============================================================================

MOTIVATION_MESSAGES = {
    'streak_celebration': [
        "🔥 {streak} gün üst üste çalıştın! Bu azim!",
        "💪 {streak} günlük seri! Sen durdurulamazsın!",
        "⭐ {streak} gün! Her gün biraz daha güçleniyorsun.",
    ],
    
    'progress_recognition': [
        "📈 Net artışın görünüyor. Emekler karşılık buluyor.",
        "🎯 İlerleme var. Yavaş ama emin adımlarla.",
        "✨ Geçen haftaya göre daha iyisin!",
    ],
    
    'effort_acknowledgment': [
        "👏 Bugün çalıştın. Bu bile bir başarı.",
        "🌟 Denemeye devam ediyorsun. Bu önemli.",
        "💎 Kolay değil, ama yapıyorsun.",
    ],
    
    'recovery_support': [
        "🌱 Herkes düşer, önemli olan kalkmak.",
        "🔄 Bugün zor geçti ama yarın yeni sayfa.",
        "🌈 Kötü günler geçici, sen kalıcısın.",
    ],
}


def get_motivation_message(category: str, **kwargs) -> str:
    """Kategoriye uygun motivasyon mesajı döndür"""
    import random
    messages = MOTIVATION_MESSAGES.get(category, MOTIVATION_MESSAGES['effort_acknowledgment'])
    message = random.choice(messages)
    return message.format(**kwargs) if kwargs else message


# ============================================================================
# GAMIFICATION - VisiCoin Sistemi
# ============================================================================

VISICOIN_REWARDS = {
    'daily_study': 10,         # Günlük çalışma
    'streak_bonus': 5,          # Her gün için bonus
    'exam_complete': 25,        # Deneme bitirme
    'improvement': 50,          # Net artışı
    'weekly_goal': 100,         # Haftalık hedef
    'challenge_complete': 75,   # Özel görev
}


def calculate_visicoin_reward(action: str, streak: int = 0) -> Dict:
    """VisiCoin ödülü hesapla"""
    base_reward = VISICOIN_REWARDS.get(action, 10)
    streak_multiplier = 1 + (streak * 0.1) if streak > 0 else 1
    final_reward = int(base_reward * streak_multiplier)
    
    return {
        'action': action,
        'base_reward': base_reward,
        'streak_bonus': final_reward - base_reward,
        'total': final_reward,
        'message': f"🪙 +{final_reward} VisiCoin kazandın!"
    }
