"""
VİSİ AI - Sınav Stratejileri
TYT, AYT, LGS, KPSS için detaylı koçluk stratejileri
"""

from typing import Dict, List

# ============================================================================
# SINAV STRATEJİLERİ
# ============================================================================

EXAM_STRATEGIES: Dict[str, dict] = {
    'TYT': {
        'exam_type': 'TYT',
        'full_name': 'Temel Yeterlilik Testi',
        'total_duration': '135 dakika',
        'subjects': [
            {'name': 'Türkçe', 'question_count': 40, 'time_per_question': 60, 'priority': 'critical', 'tip_percentage': 33},
            {'name': 'Matematik', 'question_count': 40, 'time_per_question': 90, 'priority': 'critical', 'tip_percentage': 33},
            {'name': 'Fen Bilimleri', 'question_count': 20, 'time_per_question': 75, 'priority': 'high', 'tip_percentage': 17},
            {'name': 'Sosyal Bilimler', 'question_count': 20, 'time_per_question': 60, 'priority': 'medium', 'tip_percentage': 17},
        ],
        'critical_success_factors': [
            'Türkçe ve Matematik eşit öncelik - ikisi de 40 soru',
            'Paragraf sorularını hızlı okuma tekniği ile çöz',
            'Matematik temel konulara hakim ol: Sayılar, Geometri, Problem',
            'Fen Bilimleri formül ezberleme değil, kavram anlama',
            'Sosyal Bilimlerde güncel olayları takip et',
        ],
        'weekly_focus_distribution': {
            'Pazartesi': ['Matematik - Temel', 'Problem çözme'],
            'Salı': ['Türkçe - Paragraf', 'Dil bilgisi'],
            'Çarşamba': ['Fizik - Temel', 'Kimya - Temel'],
            'Perşembe': ['Matematik - Geometri', 'Problem'],
            'Cuma': ['Biyoloji', 'Tarih'],
            'Cumartesi': ['DENEME', 'Analiz'],
            'Pazar': ['Zayıf konular', 'Tekrar'],
        },
        'net_target_strategy': 'Haftalık +3-4 net artış hedefle. İlk 80 nete kadar hızlı artış, sonra yavaşlar.',
        'motivation_tips': [
            '120 net altındaysan matematiğe odaklan - en hızlı net artışı oradan gelir',
            'Türkçe zaten güçlüyse Fen/Sosyal\'e ağırlık ver',
            'Her gün en az 40 soru çöz (20 Mat + 20 Türkçe)',
        ]
    },
    
    'AYT': {
        'exam_type': 'AYT',
        'full_name': 'Alan Yeterlilik Testi',
        'total_duration': '180 dakika',
        'subjects': [
            {'name': 'Matematik', 'question_count': 40, 'time_per_question': 150, 'priority': 'critical', 'tip_percentage': 37},
            {'name': 'Fizik', 'question_count': 14, 'time_per_question': 180, 'priority': 'high', 'tip_percentage': 13},
            {'name': 'Kimya', 'question_count': 13, 'time_per_question': 150, 'priority': 'high', 'tip_percentage': 12},
            {'name': 'Biyoloji', 'question_count': 13, 'time_per_question': 120, 'priority': 'medium', 'tip_percentage': 12},
        ],
        'critical_success_factors': [
            'AYT Matematik çok zor - TYT Matematik güçlü olmalı önce',
            'Fizik\'te Elektrik ve Modern Fizik kritik',
            'Kimya\'da Organik Kimya çok soru geliyor',
            'Biyoloji ezber ağırlıklı - düzenli tekrar şart',
        ],
        'net_target_strategy': 'Haftalık +2-3 net artış. 60 net üstü çok iyi.',
        'motivation_tips': [
            'AYT\'ye TYT\'den sonra odaklan',
            'İlk 3 ay TYT, son 6 ay AYT stratejisi',
        ]
    },
    
    'LGS': {
        'exam_type': 'LGS',
        'full_name': 'Liselere Geçiş Sınavı',
        'total_duration': '150 dakika',
        'subjects': [
            {'name': 'Türkçe', 'question_count': 20, 'time_per_question': 90, 'priority': 'critical', 'tip_percentage': 22},
            {'name': 'Matematik', 'question_count': 20, 'time_per_question': 120, 'priority': 'critical', 'tip_percentage': 22},
            {'name': 'Fen Bilimleri', 'question_count': 20, 'time_per_question': 90, 'priority': 'high', 'tip_percentage': 22},
            {'name': 'İnkılap Tarihi', 'question_count': 10, 'time_per_question': 60, 'priority': 'medium', 'tip_percentage': 11},
            {'name': 'Din Kültürü', 'question_count': 10, 'time_per_question': 60, 'priority': 'medium', 'tip_percentage': 11},
            {'name': 'İngilizce', 'question_count': 10, 'time_per_question': 60, 'priority': 'medium', 'tip_percentage': 11},
        ],
        'critical_success_factors': [
            'Türkçe ve Matematik eşit ağırlık',
            'Fen Bilimleri konuları 8. sınıf ağırlıklı',
            'İnkılap\'ta kronoloji çok önemli',
            'İngilizce\'de reading comprehension',
        ],
        'weekly_focus_distribution': {
            'Pazartesi': ['Matematik - Sayılar'],
            'Salı': ['Türkçe - Paragraf'],
            'Çarşamba': ['Fen - Madde ve Doğası'],
            'Perşembe': ['Matematik - Geometri'],
            'Cuma': ['İnkılap', 'İngilizce'],
            'Cumartesi': ['DENEME'],
            'Pazar': ['Tekrar', 'Zayıf konular'],
        },
        'net_target_strategy': 'LGS\'de her yanlış kritik. Net 400+ için 85+ net lazım.',
        'motivation_tips': [
            'Her gün düzenli çalış, maraton koşuyorsun',
            'Yanlış defteri tut, aynı hatayı tekrarlama',
            'Deneme analizini mutlaka yap',
        ]
    },
    
    'KPSS': {
        'exam_type': 'KPSS',
        'full_name': 'Kamu Personeli Seçme Sınavı',
        'total_duration': '130 dakika',
        'subjects': [
            {'name': 'Türkçe', 'question_count': 40, 'time_per_question': 60, 'priority': 'critical', 'tip_percentage': 33},
            {'name': 'Matematik', 'question_count': 40, 'time_per_question': 90, 'priority': 'critical', 'tip_percentage': 33},
            {'name': 'Tarih', 'question_count': 15, 'time_per_question': 45, 'priority': 'high', 'tip_percentage': 12},
            {'name': 'Coğrafya', 'question_count': 15, 'time_per_question': 45, 'priority': 'medium', 'tip_percentage': 12},
            {'name': 'Vatandaşlık', 'question_count': 10, 'time_per_question': 45, 'priority': 'medium', 'tip_percentage': 8},
        ],
        'critical_success_factors': [
            'KPSS TYT\'ye benzer ama daha kolay',
            'Güncel bilgiler önemli',
            'Vatandaşlık anayasa bilgisi',
        ],
        'net_target_strategy': 'KPSS\'de 80+ net iyi puan.',
        'motivation_tips': [
            'Düzenli çalış, sprint değil maraton',
            'Güncel haberleri takip et',
        ]
    },
}


def get_exam_strategy(exam_type: str) -> dict:
    """Sınav tipine göre strateji döndür"""
    return EXAM_STRATEGIES.get(exam_type.upper(), EXAM_STRATEGIES.get('TYT'))


def generate_exam_strategy_prompt(exam_type: str) -> str:
    """Sınav stratejisi prompt'u oluştur"""
    strategy = get_exam_strategy(exam_type)
    if not strategy:
        return ""
    
    subjects_table = "| Ders | Soru | Süre/Soru | Öncelik |\n|------|------|-----------|----------|\n"
    for subj in strategy['subjects']:
        priority_emoji = {'critical': '🔴', 'high': '🟠', 'medium': '🟡', 'low': '🟢'}
        emoji = priority_emoji.get(subj['priority'], '⚪')
        subjects_table += f"| {subj['name']} | {subj['question_count']} | {subj['time_per_question']}sn | {emoji} |\n"
    
    return f"""
🎯 SINAV STRATEJİSİ: {strategy['full_name']} ({strategy['exam_type']})

⏱️ Toplam Süre: {strategy['total_duration']}

{subjects_table}

📌 KRİTİK BAŞARI FAKTÖRLERİ:
{chr(10).join('• ' + f for f in strategy['critical_success_factors'])}

📈 NET HEDEFİ: {strategy['net_target_strategy']}

💡 MOTİVASYON:
{chr(10).join('• ' + t for t in strategy['motivation_tips'])}
"""
