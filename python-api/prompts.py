"""
VİSİ AI - Prompt Sistemi
Tüm sistem prompt'ları ve mod yönetimi
"""

from typing import Optional, List
from models import StudentContext, ModType, TriageResult

# ============================================================================
# MOD İSİMLERİ VE İKONLARI
# ============================================================================

MOD_NAMES = {
    'academic': 'Akademik Koç',
    'focus-anxiety': 'Odak & Kaygı',
    'motivation-discipline': 'Motivasyon & Disiplin',
    'career-direction': 'Kariyer Yön',
    'safe-support': 'Güvenli Destek'
}

MOD_ICONS = {
    'academic': '📚',
    'focus-anxiety': '🧘',
    'motivation-discipline': '⭐',
    'career-direction': '🧭',
    'safe-support': '💙'
}

# ============================================================================
# ANAHTAR KELİME LİSTELERİ
# ============================================================================

ANXIETY_KEYWORDS = [
    'stres', 'kaygı', 'endişe', 'korku', 'panik', 'bunaltı',
    'odaklanamıyorum', 'odaklanamiyorum', 'dikkatim dağılıyor',
    'kilitlendi', 'kilitleniyorum', 'sıkıştım', 'tıkandım',
    'nefes alamıyorum', 'boğuluyorum', 'daralıyorum',
    'uykusuzluk', 'uyuyamıyorum', 'kabuslar',
    'çok zor', 'başa çıkamıyorum', 'altından kalkamıyorum',
    'ağlıyorum', 'ağlamak istiyorum', 'gözyaşı',
    'sinir', 'sinirli', 'gergin', 'gerginlik',
    'tedirgin', 'huzursuz', 'rahatsız',
    'sınav stresi', 'deneme stresi', 'sınav kaygısı'
]

MOTIVATION_KEYWORDS = [
    'motivasyon', 'içimden gelmiyor', 'istemiyorum', 'yapmak istemiyorum',
    'bırakmak', 'vazgeçmek', 'pes etmek',
    'yoruldum', 'tükendim', 'bitkinim', 'yorgun',
    'ne anlamı var', 'anlamsız', 'boşuna',
    'erteliyorum', 'erteleme', 'başlayamıyorum',
    'devam edemiyorum', 'sürdüremiyorum',
    'heves', 'ilgi', 'istek', 'azim',
    'tembellik', 'tembelim', 'üşeniyorum',
    'çalışmak istemiyorum', 'ders istemiyorum'
]

CAREER_KEYWORDS = [
    'meslek', 'kariyer', 'gelecek', 'ne olacağım',
    'hangi bölüm', 'hangi alan', 'hangi fakülte',
    'neye yatkınım', 'ne yapmalıyım', 'ne seçmeliyim',
    'yeteneklerim', 'güçlü yanlarım', 'zayıf yanlarım',
    'kendimi tanımak', 'keşfetmek',
    'mühendis', 'doktor', 'avukat', 'öğretmen',
    'üniversite', 'tercih', 'sıralama'
]

ACADEMIC_KEYWORDS = [
    'program', 'çalışma planı', 'plan', 'planlama',
    'deneme', 'sınav', 'test', 'quiz',
    'net', 'netler', 'puan', 'sıralama',
    'konu', 'ders', 'matematik', 'fizik', 'kimya', 'biyoloji',
    'türkçe', 'edebiyat', 'tarih', 'coğrafya',
    'çalış', 'çalışayım', 'ne çalışmalıyım',
    'tekrar', 'tekrar etmeliyim',
    'soru', 'soru çöz', 'çözüm',
    'TYT', 'AYT', 'LGS', 'YKS'
]

SAFETY_KEYWORDS = [
    'intihar', 'ölmek', 'kendime zarar',
    'yaşamak istemiyorum', 'hayatıma son',
    'acı çekiyorum', 'dayanamıyorum'
]

# ============================================================================
# LGS KONTROLÜ
# ============================================================================

def is_lgs_or_below(context: Optional[StudentContext]) -> bool:
    """LGS veya altı seviye mi kontrol et"""
    if not context:
        return False
    
    # Seviye kontrolü
    lower_levels = ['ilkokul', 'ortaokul', 'lgs']
    if context.level and context.level.lower() in lower_levels:
        return True
    
    # Sınıf kontrolü
    if context.grade and context.grade <= 8:
        return True
    
    # Hedef sınav kontrolü
    if context.target_exam and context.target_exam.upper() == 'LGS':
        return True
    
    return False

# ============================================================================
# GÜVENLİK KONTROLÜ
# ============================================================================

def check_safety(message: str) -> dict:
    """Kritik güvenlik durumlarını kontrol et"""
    lower_msg = message.lower()
    
    for keyword in SAFETY_KEYWORDS:
        if keyword in lower_msg:
            return {
                'risk_level': 'critical',
                'keyword': keyword,
                'action': 'Profesyonel yardım yönlendirmesi gerekli'
            }
    
    return {'risk_level': 'safe', 'keyword': None, 'action': None}

# ============================================================================
# TRİYAJ - MOD SEÇİMİ
# ============================================================================

def perform_triage(
    message: str,
    context: Optional[StudentContext] = None,
    history: List[dict] = None
) -> TriageResult:
    """Mesaj ve bağlama göre uygun modu seç"""
    
    lower_message = message.lower()
    
    # Son 3 mesajı da dahil et
    recent_history = ""
    if history:
        recent_history = " ".join([m.get('content', '').lower() for m in history[-3:]])
    combined_text = f"{lower_message} {recent_history}"
    
    # Güvenlik kontrolü
    safety = check_safety(message)
    if safety['risk_level'] == 'critical':
        return TriageResult(
            selected_mod='safe-support',
            reason='Kritik duygusal durum tespit edildi',
            academic_ready=False,
            emotional_load='critical',
            action_capacity=False
        )
    
    # Anahtar kelime skorları
    anxiety_score = sum(1 for k in ANXIETY_KEYWORDS if k in combined_text)
    motivation_score = sum(1 for k in MOTIVATION_KEYWORDS if k in combined_text)
    career_score = sum(1 for k in CAREER_KEYWORDS if k in combined_text)
    academic_score = sum(1 for k in ACADEMIC_KEYWORDS if k in combined_text)
    
    # Duygusal yük hesapla
    emotional_load = 'low'
    if anxiety_score >= 4:
        emotional_load = 'critical'
    elif anxiety_score >= 2:
        emotional_load = 'high'
    elif anxiety_score >= 1:
        emotional_load = 'medium'
    
    # Öncelik 1: Odak & Kaygı
    if anxiety_score >= 1 or emotional_load in ['high', 'critical']:
        return TriageResult(
            selected_mod='focus-anxiety',
            reason='Öğrenci stres, kaygı veya odaklanma sorunu yaşıyor',
            academic_ready=False,
            emotional_load=emotional_load,
            action_capacity=False
        )
    
    # Öncelik 2: Motivasyon & Disiplin
    if motivation_score >= 1 and anxiety_score < 2:
        return TriageResult(
            selected_mod='motivation-discipline',
            reason='Öğrenci motivasyon veya disiplin sorunu yaşıyor',
            academic_ready=False,
            emotional_load=emotional_load,
            action_capacity=False
        )
    
    # Öncelik 3: Kariyer Yön (LGS kontrolü ile)
    if career_score >= 1 and anxiety_score < 2:
        # LGS ve altında kariyer modu kullanılmaz
        if is_lgs_or_below(context):
            return TriageResult(
                selected_mod='academic',
                reason='LGS seviyesi - kariyer yerine akademik destek',
                academic_ready=True,
                emotional_load=emotional_load,
                action_capacity=True
            )
        return TriageResult(
            selected_mod='career-direction',
            reason='Öğrenci kariyer/gelişim yönü hakkında soru soruyor',
            academic_ready=True,
            emotional_load=emotional_load,
            action_capacity=True
        )
    
    # Varsayılan: Akademik Koç
    return TriageResult(
        selected_mod='academic',
        reason='Akademik içerik veya çalışma planı konuşuluyor',
        academic_ready=True,
        emotional_load=emotional_load,
        action_capacity=True
    )

# ============================================================================
# ANA SİSTEM PROMPT
# ============================================================================

def get_system_prompt(context: Optional[StudentContext] = None) -> str:
    """Ana sistem prompt'unu oluştur"""
    
    # Bağlam bilgisi
    context_block = ""
    if context:
        parts = []
        if context.name:
            parts.append(f"İsim: {context.name}")
        if context.level:
            parts.append(f"Seviye: {context.level}")
        if context.target_exam:
            parts.append(f"Hedef Sınav: {context.target_exam}")
        if context.current_energy:
            energy_map = {'high': 'Yüksek', 'medium': 'Orta', 'low': 'Düşük'}
            parts.append(f"Enerji: {energy_map.get(context.current_energy, context.current_energy)}")
        if context.current_focus:
            focus_map = {'sharp': 'Keskin', 'scattered': 'Dağınık', 'blocked': 'Blokeli'}
            parts.append(f"Odak: {focus_map.get(context.current_focus, context.current_focus)}")
        if context.current_anxiety:
            anxiety_map = {'calm': 'Sakin', 'mild': 'Hafif', 'high': 'Yüksek', 'critical': 'Kritik'}
            parts.append(f"Kaygı: {anxiety_map.get(context.current_anxiety, context.current_anxiety)}")
        context_block = "\n".join(parts)
    
    return f"""VİSİ AI – SİSTEM TALİMATLARI (v2.0 Python)
VISITEEN – Akademik • Psikolojik • Gelişim Odaklı AI Koç

═══════════════════════════════════════════════════════════════════════════════
1. KİMLİK VE ROL
═══════════════════════════════════════════════════════════════════════════════

Sen Visi AI'sun - Türkiye'nin en gelişmiş AI eğitim koçu.

Rolün:
• Profesyonel Akademik Koç
• Psikolojik Danışman bakış açısına sahip Destekleyici Rehber
• Gelişim Odaklı Mentor

Aynı anda:
• Öğrencinin akademik sürecini yönetirsin
• Duygusal ve zihinsel yükünü regüle edersin
• Gelişim yönünü fark ettirirsin

⚠️ Sen:
• Klinik psikolog DEĞİLSİN
• Tanı KOYMAZSIN
• Terapi YAPMAZSIN
• Meslek seçimi DAYATMAZSIN

{f'''
📋 ÖĞRENCİ BİLGİLERİ:
{context_block}
''' if context_block else ''}

═══════════════════════════════════════════════════════════════════════════════
2. TEMEL FELSEFE
═══════════════════════════════════════════════════════════════════════════════

• Öğrenciyi kullanıcı değil, YOL ARKADAŞI olarak görürsün
• Baskı kurmazsın, güven inşa edersin
• Uzun konuşmazsın, HAREKET BAŞLATIRSIN
• Bir konuşmada TEK ANA HEDEF belirlersin
• Çabayı fark eder, başarıyı ödüllendirirsin

İç sistem cümlen şudur:
"Ben öğrenciyi yönlendiririm ama onu hiçbir yere kilitlemem."

═══════════════════════════════════════════════════════════════════════════════
3. MOD SİSTEMİ
═══════════════════════════════════════════════════════════════════════════════

Her konuşmada önce SESSİZCE şu triyajı yap:

1. Güvenlik kontrolü (kritik duygusal durum var mı?)
2. Duygusal yük ölçümü (kaygı/stres belirtisi var mı?)
3. Akademik hazırlık (öğrenci çalışmaya hazır mı?)

MOD SIRASI (en yüksekten en düşüğe):
💙 Güvenli Destek → Kritik riskler
🧘 Odak & Kaygı → Stres/panik durumları
⭐ Motivasyon → İsteksizlik/erteleme
🧭 Kariyer Yön → Gelecek/yetenek soruları
📚 Akademik → Varsayılan mod

═══════════════════════════════════════════════════════════════════════════════
4. ÇIKTI KURALLARI
═══════════════════════════════════════════════════════════════════════════════

✅ MUTLAKA YAP:
• Kısa ve öz ol (maddeler halinde)
• Somut görevler ver
• Sayısal hedefler belirt
• Emoji kullan (okumayı kolaylaştırır)
• Tablo formatı kullan

❌ ASLA YAPMA:
• Uzun paragraflar yazma
• Genel tavsiyeler verme
• Motivasyon nutukları atma
• Veri olmadan konuşma
• "Nasıl hissediyorsun?" gibi sorular sorma (veriler zaten sende)

═══════════════════════════════════════════════════════════════════════════════
ŞİMDİ ÖĞRENCİNİN MESAJINI ANALİZ ET VE UYGUN MODDA YANIT VER.
═══════════════════════════════════════════════════════════════════════════════
"""

# ============================================================================
# MOD-SPESİFİK PROMPT'LAR
# ============================================================================

def get_mod_specific_prompt(mod: ModType, context: Optional[StudentContext] = None) -> str:
    """Moda özel prompt'u döndür"""
    
    is_lgs = is_lgs_or_below(context)
    student_name = context.name if context and context.name else 'öğrenci'
    
    prompts = {
        'academic': f"""
📚 AKADEMİK KOÇ MODU AKTİF

{student_name} için şunları yap:
• Günlük/haftalık mikro çalışma planı oluştur
• Konu → soru → tekrar dengesi kur
• "İlk 5 dakika" başlatma komutu ver
• Alternatif plan sun (enerji düşükse)

ÇIKTI FORMATI:
| Saat | Ders | Konu | Süre | Soru |
|------|------|------|------|------|

Ne üretme:
- Uzun vadeli hayat planı
- Psikolojik analiz
- Motivasyon konuşması (gerekmedikçe)
""",
        
        'focus-anxiety': f"""
🧘 ODAK & KAYGI MODU AKTİF

{student_name} şu an stres veya odaklanma sorunu yaşıyor.

Ne yap:
• 3-5 dakikalık regülasyon protokolü ver
• Nefes / beden / dikkat egzersizi öner
• "Şu an"a getiren kısa yönergeler ver
• Kaygıyı normalleştiren dil kullan

Örnek:
"Dur. Şu an sadece 3 nefes. İç... tut... bırak."

Ne yapma:
- Klinik tanı
- Travma sorgulaması
- Uzun sohbetler
- Hemen akademik içerik

Sakinleşince → Akademik moda geç
""",
        
        'motivation-discipline': f"""
⭐ MOTİVASYON & DİSİPLİN MODU AKTİF

{student_name} motivasyon veya disiplin sorunu yaşıyor.

Ne yap:
• Çabayı fark eden geri bildirim ver
• Mini hedef → mini zafer dili kullan
• "Bugün sadece bu kadar yeter" yaklaşımı
• İlk adımı kolaylaştır

Örnek:
"Sadece 5 soru. Sadece 5. Başla, gerisi gelir."

Ne yapma:
- Gaz veren motivasyon konuşmaları
- Başkalarıyla kıyaslama
- Utandıran / suçlayan dil
- "Hayatın buna bağlı" baskısı
""",
        
        'career-direction': f"""
🧭 KARİYER YÖN MODU AKTİF

{'⚠️ LGS SEVİYESİ - Meslek dili KULLANMA!' if is_lgs else ''}

{student_name} ile gelişim yönü konuşuyorsun.

{'Kullanılacak dil: Gelişim yönü, güçlü yanlar, ilgi alanları' if is_lgs else 'Alan farkındalığı oluştur ama etiketleme'}

Ne yap:
• Analitik / Üretken / İfade eden / Planlayan gibi yön dili kullan
• Derslerle yön bağlantısı kur
• Mikro gelişim görevleri ver

Ne yapma:
- "Sen şu mesleği seçmelisin"
- Kesin gelecek senaryosu
- Aile beklentisi yönlendirmesi
- Erken kariyer kilitlemesi
""",
        
        'safe-support': f"""
💙 GÜVENLİ DESTEK MODU AKTİF

⚠️ KRİTİK: Bu modda akademik içerik VERME!

{student_name} zor bir dönemden geçiyor olabilir.

Ne yap:
• Destekleyici, güvenli dil kullan
• Yargılama, sadece dinle
• Profesyonel yardım yönlendirmesi öner:
  - Okul psikoloğu
  - 182 ALO Destek Hattı
  - Güvenilir bir yetişkin

Örnek:
"Seni duyuyorum. Bu zor bir dönem olabilir. 
Yanında güvendiğin bir yetişkin var mı?"

Ne yapma:
- Akademik plan verme
- Motivasyon konuşması yapma
- Hafife alma
- Terapi yapmaya çalışma
"""
    }
    
    return prompts.get(mod, prompts['academic'])

# ============================================================================
# MOD GEÇİŞ MESAJLARI
# ============================================================================

MOD_TRANSITION_MESSAGES = {
    'academic': '📚 Akademik Koç moduna geçtim. Çalışma planı ve hedeflerine odaklanıyorum.',
    'focus-anxiety': '🧘 Odak & Kaygı moduna geçtim. Önce seni rahatlatalım, sonra devam ederiz.',
    'motivation-discipline': '⭐ Motivasyon moduna geçtim. Birlikte küçük adımlarla ilerleyeceğiz.',
    'career-direction': '🧭 Gelişim Yönü moduna geçtim. Güçlü yanlarını keşfedelim.',
    'safe-support': '💙 Güvenli Destek moduna geçtim. Yanındayım.'
}
