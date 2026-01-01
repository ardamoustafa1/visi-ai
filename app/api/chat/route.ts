import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import {
    getSystemPrompt,
    performTriage,
    getModSpecificPrompt,
    checkSafetyBoundaries,
    StudentContext,
    ModContext,
    ModType
} from '@/lib/prompts';
import {
    StudentProfile,
    generateStudentDataPrompt,
    analyzeStudentPerformance
} from '@/lib/studentData';

export async function POST(req: Request) {
    try {
        const { message, history, image, studentContext, studentData } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini API Key yapılandırılmamış.' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Güvenlik kontrolü
        const safetyCheck = checkSafetyBoundaries(message);

        // Triyaj mekanizması ile mod seçimi
        const triageResult = performTriage(message, studentContext, history);
        const activeMod: ModType = triageResult.selectedMod;
        const context: StudentContext = studentContext || {};

        // Sistem prompt'unu oluştur
        const baseSystemPrompt = getSystemPrompt(context);
        const modSpecificPrompt = getModSpecificPrompt(activeMod, context);

        // History hazırla
        let chatHistory = [];

        const isFirstMessage = !history || history.length === 0;

        // History'yi temizle
        let cleanedHistory: any[] = [];
        if (history && Array.isArray(history) && history.length > 0) {
            let startIndex = 0;
            if (history[0].role === 'model') {
                startIndex = 1;
            }

            for (let i = startIndex; i < history.length; i++) {
                const msg = history[i];
                if (msg.content && msg.content.trim()) {
                    cleanedHistory.push({
                        role: msg.role === 'user' ? 'user' : 'model',
                        content: msg.content
                    });
                }
            }
        }

        // İlk mesaj için sistem prompt'u ekle
        if (cleanedHistory.length === 0) {
            const fullSystemPrompt = baseSystemPrompt + modSpecificPrompt;
            chatHistory.push({
                role: 'user',
                parts: [{ text: fullSystemPrompt }]
            });

            // Durum bazlı karşılama yanıtı
            let welcomeResponse = "Anlaşıldı. Ben Visi AI olarak görevime başlıyorum.";
            if (context.currentAnxiety === 'high' || context.currentAnxiety === 'critical') {
                welcomeResponse += " Öğrencinin duygusal durumunu öncelikli olarak ele alacağım.";
            }

            chatHistory.push({
                role: 'model',
                parts: [{ text: welcomeResponse }]
            });
        } else {
            // Mod değişikliği kontrolü
            const lastMod = history?.[history.length - 1]?.mod;

            if (lastMod && lastMod !== activeMod) {
                chatHistory.push({
                    role: 'user',
                    parts: [{ text: `[MOD DEĞİŞİKLİĞİ: ${triageResult.reason}]\n${modSpecificPrompt}` }]
                });
                chatHistory.push({
                    role: 'model',
                    parts: [{ text: `Anlaşıldı. ${activeMod === 'focus-anxiety' ? 'Önce duygusal durumunu ele alacağım.' : activeMod === 'motivation-discipline' ? 'Motivasyon ve harekete geçirme odaklı devam ediyorum.' : activeMod === 'career-direction' ? 'Gelişim yönü üzerine konuşalım.' : 'Akademik planlama moduna geçiyorum.'}` }]
                });
            }

            // Temizlenmiş history'yi ekle
            let historyToAdd = cleanedHistory;
            if (historyToAdd.length > 0 && historyToAdd[0].role === 'model') {
                historyToAdd = historyToAdd.slice(1);
            }

            if (historyToAdd.length > 0) {
                historyToAdd.forEach((msg: any) => {
                    chatHistory.push({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.content }]
                    });
                });
            }
        }

        // Mevcut mesajı hazırla - Mod bilgisi ve bağlam ekle
        let currentMessage = message;

        // Öğrenci verisi varsa prompt'a ekle
        let studentDataPrompt = '';
        if (studentData && typeof studentData === 'object') {
            try {
                studentDataPrompt = generateStudentDataPrompt(studentData as StudentProfile);
            } catch (e) {
                console.log('Student data prompt generation skipped:', e);
            }
        }

        // Her mesaja mod hatırlatması ekle
        const modReminder = `[AKTİF MOD: ${activeMod.toUpperCase()}]
[DUYGUSAL YÜK: ${triageResult.emotionalLoad.toUpperCase()}]
[AKADEMİK HAZIRLIK: ${triageResult.academicReady ? 'EVET' : 'HAYIR'}]

${modSpecificPrompt}
${studentDataPrompt ? `\n${studentDataPrompt}` : ''}
ÖĞRENCİ MESAJI:
${message}`;


        currentMessage = modReminder;

        // Güvenlik uyarısı ekle
        if (safetyCheck.riskLevel === 'critical') {
            currentMessage = `⚠️ KRİTİK GÜVENLİK UYARISI: Bu mesajda yoğun duygusal içerik tespit edildi.
            
${modSpecificPrompt}

ZORUNLU DAVRANIŞLAR:
1. Akademik içerik verme
2. Destekleyici, güvenli dil kullan
3. Profesyonel yardım yönlendirmesi öner
4. Güvenilir yetişkin hatırlat

ÖĞRENCİ MESAJI:
${message}`;
        }

        const chat = model.startChat({
            history: chatHistory,
        });

        // Mesaj parçalarını hazırla
        let messageParts: any[] = [];

        if (currentMessage) {
            messageParts.push({ text: currentMessage });
        }

        // Görsel varsa ekle - SORU ÇÖZÜM MODU
        if (image) {
            const base64Data = image.split(',')[1];
            const mimeType = image.split(';')[0].split(':')[1];

            // Soru çözüm prompt'u ekle
            const questionSolverPrompt = `
📸 GÖRSEL SORU ÇÖZÜM MODU AKTİF

Bu görselde bir soru/problem var. Lütfen şu formatta ADIM ADIM çöz:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 SORU ANALİZİ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Soru tipi: [Matematik/Fizik/Kimya/Türkçe/...]
• Konu: [Hangi konu]
• Zorluk: [Kolay/Orta/Zor]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ÇÖZÜM STRATEJİSİ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bu soruyu çözmek için: [Strateji]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 ADIM ADIM ÇÖZÜM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Adım 1:** [Açıklama]
[İşlem]

**Adım 2:** [Açıklama]
[İşlem]

**Adım 3:** [Açıklama]
[İşlem]
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CEVAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Doğru Cevap:** [Şık veya değer]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 İPUCU & BENZER SORU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Bu tür sorularda dikkat et: [İpucu]
• Benzer soru tipi: [Örnek]

NOT: Her adımı açıkça numaralandır. Formül kullanıyorsan yaz.
`;

            messageParts.push({ text: questionSolverPrompt + "\n\n" + currentMessage });

            messageParts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            });
        }

        const result = await chat.sendMessage(messageParts);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            text,
            mod: activeMod,
            modReason: triageResult.reason,
            emotionalLoad: triageResult.emotionalLoad,
            academicReady: triageResult.academicReady,
            safetyStatus: safetyCheck.riskLevel
        });
    } catch (error: any) {
        console.error('Gemini API hatası:', error);
        return NextResponse.json(
            { error: error.message || 'Yanıt oluşturulamadı.' },
            { status: 500 }
        );
    }
}
