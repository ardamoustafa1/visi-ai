# VİSİ AI - Python FastAPI

Türkiye'nin en gelişmiş AI eğitim koçu.

## Özellikler

- 🎓 5 Farklı Koçluk Modu (Akademik, Odak, Motivasyon, Kariyer, Güvenli Destek)
- 📊 Öğrenci Veri Analizi
- 📸 Fotoğraftan Soru Çözümü
- 📈 İlerleme Takibi
- 🔔 Çalışma Hatırlatıcıları

## Kurulum

```bash
cd python-api
pip install -r requirements.txt
uvicorn main:app --reload
```

## API Endpoints

- `POST /api/chat` - AI sohbet
- `POST /api/analyze` - Öğrenci analizi
- `GET /api/health` - Sağlık kontrolü

## Teknolojiler

- Python 3.11+
- FastAPI
- Google Generative AI (Gemini)
- Pydantic
