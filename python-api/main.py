"""
VİSİ AI - Ana FastAPI Uygulaması
Türkiye'nin en gelişmiş AI eğitim koçu
"""

import os
import base64
from datetime import datetime
from typing import Optional, List
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv

import google.generativeai as genai

from models import (
    ChatRequest, ChatResponse, HealthResponse,
    StudentContext, ChatMessage
)
from prompts import (
    get_system_prompt, get_mod_specific_prompt, perform_triage,
    check_safety, MOD_NAMES, MOD_ICONS, MOD_TRANSITION_MESSAGES
)
from student_data import generate_student_data_prompt
from psychological import analyze_emotional_state, get_motivation_message
from exam_strategies import generate_exam_strategy_prompt

# .env dosyasını yükle (Robust Yöntem)
env_path = Path(__file__).parent / '.env'
try:
    load_dotenv(dotenv_path=env_path)
except Exception as e:
    print(f".env yükleme hatası (yoksayılıyor): {e}")

# Fallback: Eğer key yoksa root'taki .env.local'e bak
if not os.getenv("GEMINI_API_KEY"):
    root_env = Path(__file__).parent.parent / '.env.local'
    if root_env.exists():
        print(f"Root .env.local bulundu: {root_env}")
        try:
            load_dotenv(dotenv_path=root_env)
        except Exception as e:
            print(f".env.local yükleme hatası (yoksayılıyor): {e}")

# Eğer load_dotenv çalışmazsa manuel oku (Limitli destek)
if not os.getenv("GEMINI_API_KEY") and env_path.exists():
    try:
        with open(env_path, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    key = line.strip().split('=', 1)[1]
                    os.environ["GEMINI_API_KEY"] = key.strip()
                    break
    except Exception as e:
        print(f"Manuel .env okuma hatası: {e}")

# Gemini API yapılandırma
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print(f"API Key durumu: {'YÜKLENDİ ✅' if GEMINI_API_KEY else 'EKSİK ❌'}")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# FastAPI uygulaması
app = FastAPI(
    title="VİSİ AI",
    description="Türkiye'nin en gelişmiş AI eğitim koçu",
    version="2.1.0"
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/", response_class=HTMLResponse)
async def root():
    """Ana sayfa"""
    return """
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VİSİ AI - Eğitim Koçu</title>
        <style>
            body { background: #0f0f23; color: #fff; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; }
            h1 { color: #8b5cf6; margin-bottom: 20px; }
            .status { padding: 10px 20px; background: rgba(255,255,255,0.1); border-radius: 8px; margin-top: 20px; }
            .success { color: #4ade80; }
        </style>
    </head>
    <body>
        <div>
            <h1>🎓 VİSİ AI Backend</h1>
            <p>Python/FastAPI Sunucusu Aktif</p>
            <div class="status">
                Durum: <span class="success">Çalışıyor</span><br>
                Versiyon: 2.1.0
            </div>
            <p style="margin-top:20px"><a href="/docs" style="color:#8b5cf6">API Dokümantasyonu (Swagger)</a></p>
        </div>
    </body>
    </html>
    """


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Sağlık kontrolü"""
    return HealthResponse(
        status="healthy",
        version="2.1.0",
        timestamp=datetime.now().isoformat()
    )


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Ana chat endpoint - AI ile sohbet"""
    
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key yapılandırılmamış (Sunucu tarafı)")
    
    try:
        # Model oluştur
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        # 1. Güvenlik kontrolü
        safety = check_safety(request.message)
        
        # 2. Duygu Analizi
        emotional_state = analyze_emotional_state(request.message, request.student_context)
        
        # 3. Triyaj - Mod Seçimi
        history_dicts = [{"content": m.content, "role": m.role} for m in request.history] if request.history else []
        triage = perform_triage(request.message, request.student_context, history_dicts)
        
        # Eğer zorlanmış mod varsa, triyajı ez
        if request.forced_mod:
            active_mod = request.forced_mod
            triage.reason = f"Kullanıcı tarafından zorlandı: {active_mod}"
        else:
            # Duygusal duruma göre mod override edilebilir
            active_mod = triage.selected_mod
            if emotional_state['needs_support'] and active_mod == 'academic':
                # Eğer öğrenci çok stresliyse akademik yerine odak moduna geç
                if emotional_state['dominant_emotion'] in ['stress', 'exhaustion']:
                    active_mod = 'focus-anxiety'
                    triage.reason = "Yüksek duygusal yük tespit edildi."
                elif emotional_state['dominant_emotion'] in ['sadness', 'anger']:
                    active_mod = 'safe-support'
                    triage.reason = "Duygusal destek ihtiyacı tespit edildi."

        # 4. Prompt Hazırlığı
        system_prompt = get_system_prompt(request.student_context)
        mod_prompt = get_mod_specific_prompt(active_mod, request.student_context)
        
        # Sınav Stratejisi Ekle (Eğer mesajda sınav adı geçiyorsa)
        exam_strategy_prompt = ""
        for exam in ['TYT', 'AYT', 'LGS', 'KPSS']:
            if exam in request.message.upper():
                exam_strategy_prompt = generate_exam_strategy_prompt(exam)
                break
        
        # Öğrenci Verisi Ekle
        student_data_prompt = ""
        if request.student_data:
            student_data_prompt = generate_student_data_prompt(request.student_data)
        
        # 5. Chat History Oluştur
        chat_history = []
        
        # Tüm sistem talimatlarını birleştir
        full_system = f"{system_prompt}\n\n{mod_prompt}"
        if exam_strategy_prompt:
            full_system += f"\n\n{exam_strategy_prompt}"
        if student_data_prompt:
            full_system += f"\n\n{student_data_prompt}"
            
        # Duygusal durum bilgisini sisteme ekle
        full_system += f"\n\n[SİSTEM NOTU: Öğrenci Duygu Durumu: {emotional_state['dominant_emotion'].upper()}, Yük: {emotional_state['emotional_load']}]"
        
        # Motivasyon mesajı ekle (Eğer mod motivasyon ise)
        if active_mod == 'motivation-discipline':
            motiv_msg = get_motivation_message('effort_acknowledgment')
            full_system += f"\n[İPUCU: Şu motivasyon cümlesini kullanabilirsin: '{motiv_msg}']"

        chat_history.append({
            "role": "user",
            "parts": [full_system]
        })
        chat_history.append({
            "role": "model",
            "parts": ["Anlaşıldı. Visi AI göreve hazır."]
        })
        
        # Geçmiş mesajları ekle
        for msg in request.history:
            chat_history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [msg.content]
            })
        
        # Mevcut mesajı hazırla
        current_message = f"""[AKTİF MOD: {active_mod.upper()}]
[DUYGU: {emotional_state['dominant_emotion'].upper()}]
[AKADEMİK HAZIRLIK: {'EVET' if triage.academic_ready else 'HAYIR'}]

ÖĞRENCİ: {request.message}"""
        
        # 6. Görsel İşleme
        message_parts = [current_message]
        if request.image:
            try:
                if "," in request.image:
                    image_data = request.image.split(",")[1]
                else:
                    image_data = request.image
                
                image_prompt = """
📸 GÖRSEL SORU ÇÖZÜM MODU
1. Soru tipi ve konuyu belirle
2. Çözüm stratejisini açıkla
3. Adım adım çözümü göster
4. Doğru cevabı net bir şekilde belirt
"""
                message_parts = [image_prompt + "\n\n" + current_message]
                
                import io
                image_bytes = base64.b64decode(image_data)
                message_parts.append({
                    "mime_type": "image/jpeg",
                    "data": image_bytes
                })
            except Exception as e:
                print(f"Görsel hatası: {e}")
        
        # 7. Yanıt Üret
        ai_chat = model.start_chat(history=chat_history)
        response = ai_chat.send_message(message_parts)
        
        return ChatResponse(
            text=response.text,
            mod=active_mod,
            mod_reason=triage.reason,
            emotional_load=emotional_state['emotional_load'],
            academic_ready=triage.academic_ready,
            safety_status=safety.get('risk_level', 'safe')
        )
        
    except Exception as e:
        error_msg = str(e)
        print(f"Chat hatası: {error_msg}")
        
        # Kota aşımı kontrolü (429 Resource Exhausted)
        if "429" in error_msg or "Resource has been exhausted" in error_msg or "Quota" in error_msg:
             print("⚠️ KOTA AŞIMI AKTİF - MOCK YANIT DÖNÜLÜYOR")
             return ChatResponse(
                text="⚠️ **Sistem Notu:** Gemini API kotası doldu. Testlere devam edebilmeniz için bu **OTOMATİK MOCK YANITTIR**.\n\n"
                     "Harika bir soru! Normalde buna VİSİ AI zekasıyla cevap verirdim ama şu an Google amca bana 'biraz dinlen' dedi. "
                     "Lütfen API kotası yenilenene kadar arayüzü ve diğer özellikleri test etmeye devam et. "
                     "Şu an 'Focus' modunda ilerlemeni öneririm!",
                mod=active_mod if 'active_mod' in locals() else 'academic',
                mod_reason="API Kotası Doldu (Fallback Modu)",
                emotional_load=5,
                academic_ready=True,
                safety_status='safe'
            )

        # Hata detayını döndür ki debug edebilelim
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/mods")
async def get_mods():
    """Modları listele"""
    return {
        "mods": [
            {
                "id": mid,
                "name": MOD_NAMES[mid],
                "icon": MOD_ICONS[mid],
                "transition_message": MOD_TRANSITION_MESSAGES[mid]
            } for mid in MOD_NAMES
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
