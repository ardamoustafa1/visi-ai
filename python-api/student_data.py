"""
VİSİ AI - Öğrenci Veri Analizi
Performans analizi ve çalışma planı oluşturma
"""

from typing import Optional, List, Dict
from datetime import datetime, timedelta
from models import StudentProfile, ExamResult, TopicPerformance, StudyStats


def analyze_student_performance(profile: StudentProfile) -> Dict:
    """Öğrenci performansını analiz et"""
    
    analysis = {
        'exam_summary': {},
        'subject_analysis': [],
        'weak_topics': [],
        'strong_topics': [],
        'study_recommendations': [],
        'net_projection': {}
    }
    
    if not profile.recent_exams:
        return analysis
    
    # Sınav özeti
    exams = profile.recent_exams
    total_nets = [e.total_net for e in exams if e.total_net]
    
    if total_nets:
        analysis['exam_summary'] = {
            'exam_count': len(exams),
            'average_net': round(sum(total_nets) / len(total_nets), 1),
            'max_net': max(total_nets),
            'min_net': min(total_nets),
            'trend': calculate_trend(total_nets)
        }
    
    # Ders bazlı analiz
    subject_stats = {}
    for exam in exams:
        for subject in exam.subject_results:
            if subject.subject not in subject_stats:
                subject_stats[subject.subject] = {
                    'nets': [],
                    'success_rates': [],
                    'correct': 0,
                    'wrong': 0,
                    'empty': 0
                }
            subject_stats[subject.subject]['nets'].append(subject.net)
            subject_stats[subject.subject]['success_rates'].append(subject.success_rate)
            subject_stats[subject.subject]['correct'] += subject.correct
            subject_stats[subject.subject]['wrong'] += subject.wrong
            subject_stats[subject.subject]['empty'] += subject.empty
    
    for subject, stats in subject_stats.items():
        avg_net = round(sum(stats['nets']) / len(stats['nets']), 1) if stats['nets'] else 0
        avg_success = round(sum(stats['success_rates']) / len(stats['success_rates']), 1) if stats['success_rates'] else 0
        
        subject_analysis = {
            'subject': subject,
            'average_net': avg_net,
            'average_success_rate': avg_success,
            'total_correct': stats['correct'],
            'total_wrong': stats['wrong'],
            'total_empty': stats['empty'],
            'trend': calculate_trend(stats['nets']),
            'priority': get_priority(avg_success)
        }
        analysis['subject_analysis'].append(subject_analysis)
        
        # Güçlü/zayıf sınıflandırma
        if avg_success >= 70:
            analysis['strong_topics'].append(subject)
        elif avg_success < 50:
            analysis['weak_topics'].append(subject)
    
    # Öncelik sıralaması
    analysis['subject_analysis'].sort(key=lambda x: x['average_success_rate'])
    
    # Net projeksiyonu
    if total_nets and len(total_nets) >= 2:
        weekly_increase = (total_nets[0] - total_nets[-1]) / len(total_nets)
        current_net = total_nets[0]
        analysis['net_projection'] = {
            'current': current_net,
            'next_week': round(current_net + weekly_increase, 1),
            'next_month': round(current_net + (weekly_increase * 4), 1),
            'weekly_increase': round(weekly_increase, 1)
        }
    
    return analysis


def calculate_trend(values: List[float]) -> str:
    """Trend hesapla"""
    if len(values) < 2:
        return 'stable'
    
    recent = sum(values[:len(values)//2]) / (len(values)//2) if len(values) >= 2 else values[0]
    older = sum(values[len(values)//2:]) / (len(values) - len(values)//2) if len(values) >= 2 else values[-1]
    
    diff = recent - older
    if diff > 2:
        return 'improving'
    elif diff < -2:
        return 'declining'
    return 'stable'


def get_priority(success_rate: float) -> str:
    """Öncelik seviyesi belirle"""
    if success_rate < 40:
        return 'critical'
    elif success_rate < 60:
        return 'high'
    elif success_rate < 80:
        return 'medium'
    return 'low'


def generate_weekly_program(profile: StudentProfile) -> Dict:
    """Haftalık çalışma programı oluştur"""
    
    # Enerji durumuna göre çalışma süresi
    base_duration = 45  # dakika
    if profile.current_energy == 'low':
        base_duration = 25
    elif profile.current_energy == 'high':
        base_duration = 60
    
    analysis = analyze_student_performance(profile)
    weak_subjects = analysis.get('weak_topics', [])
    
    days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
    
    program = []
    for i, day in enumerate(days):
        if day == 'Pazar':
            # Pazar tekrar günü
            program.append({
                'day': day,
                'sessions': [
                    {'time': '10:00-11:30', 'subject': 'Haftalık Tekrar', 'duration': 90, 'questions': 30}
                ],
                'total_hours': 1.5,
                'total_questions': 30
            })
        elif day == 'Cumartesi':
            # Cumartesi deneme günü
            program.append({
                'day': day,
                'sessions': [
                    {'time': '09:00-12:00', 'subject': 'DENEME SINAVI', 'duration': 180, 'questions': 120},
                    {'time': '14:00-16:00', 'subject': 'Deneme Analizi', 'duration': 120, 'questions': 0}
                ],
                'total_hours': 5,
                'total_questions': 120
            })
        else:
            # Hafta içi
            sessions = []
            
            # Sabah oturumu - zayıf konu
            if weak_subjects:
                weak = weak_subjects[i % len(weak_subjects)]
                sessions.append({
                    'time': '09:00-10:00',
                    'subject': weak,
                    'duration': base_duration,
                    'questions': 25
                })
            
            # Öğle oturumu - Türkçe/Matematik
            main_subject = 'Matematik' if i % 2 == 0 else 'Türkçe'
            sessions.append({
                'time': '14:00-15:30',
                'subject': main_subject,
                'duration': base_duration + 30,
                'questions': 30
            })
            
            # Akşam oturumu - Fen/Sosyal
            secondary = 'Fen' if i % 2 == 0 else 'Sosyal'
            sessions.append({
                'time': '16:00-17:00',
                'subject': secondary,
                'duration': base_duration,
                'questions': 20
            })
            
            total_mins = sum(s['duration'] for s in sessions)
            program.append({
                'day': day,
                'sessions': sessions,
                'total_hours': round(total_mins / 60, 1),
                'total_questions': sum(s['questions'] for s in sessions)
            })
    
    return {
        'program': program,
        'weekly_total_hours': sum(d['total_hours'] for d in program),
        'weekly_total_questions': sum(d['total_questions'] for d in program)
    }


def generate_student_data_prompt(profile: StudentProfile) -> str:
    """Öğrenci verilerinden detaylı prompt oluştur"""
    
    analysis = analyze_student_performance(profile)
    program = generate_weekly_program(profile)
    
    # Sınav özeti tablosu
    exam_table = "| Tarih | Sınav | Net | Trend |\n|-------|-------|-----|-------|\n"
    if profile.recent_exams:
        for exam in profile.recent_exams[:5]:
            exam_table += f"| {exam.date} | {exam.exam_name or exam.exam_type} | {exam.total_net} | - |\n"
    
    # Ders analizi tablosu
    subject_table = "| Ders | Ort. Net | Başarı % | Öncelik |\n|------|----------|----------|----------|\n"
    for subj in analysis.get('subject_analysis', [])[:8]:
        priority_emoji = {'critical': '🔴', 'high': '🟠', 'medium': '🟡', 'low': '🟢'}
        emoji = priority_emoji.get(subj['priority'], '⚪')
        subject_table += f"| {subj['subject']} | {subj['average_net']} | %{subj['average_success_rate']} | {emoji} {subj['priority'].upper()} |\n"
    
    # Haftalık program özeti
    program_table = "| Gün | Ana Ders | Süre | Soru |\n|-----|----------|------|------|\n"
    for day in program['program']:
        main = day['sessions'][0]['subject'] if day['sessions'] else '-'
        program_table += f"| {day['day'][:3]} | {main} | {day['total_hours']}s | {day['total_questions']} |\n"
    
    prompt = f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 ÖĞRENCİ VERİ ANALİZİ: {profile.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 TEMEL BİLGİLER:
• Seviye: {profile.level}
• Sınıf: {profile.grade}. Sınıf
• Hedef Sınav: {profile.target_exam}
• Enerji: {profile.current_energy or 'Belirtilmemiş'}
• Odak: {profile.current_focus or 'Belirtilmemiş'}
• Kaygı: {profile.current_anxiety or 'Belirtilmemiş'}

📝 SINAV GEÇMİŞİ:
{exam_table}

📊 DERS ANALİZİ:
• Ortalama Net: {analysis['exam_summary'].get('average_net', 'N/A')}
• En Yüksek: {analysis['exam_summary'].get('max_net', 'N/A')}
• Trend: {analysis['exam_summary'].get('trend', 'N/A')}

{subject_table}

🔴 ZAYIF KONULAR: {', '.join(analysis.get('weak_topics', ['Yok'])[:3])}
💪 GÜÇLÜ KONULAR: {', '.join(analysis.get('strong_topics', ['Yok'])[:3])}

📈 NET PROJEKSİYONU:
• Mevcut: {analysis['net_projection'].get('current', 'N/A')}
• 1 Hafta: {analysis['net_projection'].get('next_week', 'N/A')} (+{analysis['net_projection'].get('weekly_increase', 0)})
• 1 Ay: {analysis['net_projection'].get('next_month', 'N/A')}

📅 HAFTALIK PROGRAM ÖNERİSİ:
{program_table}

Haftalık Toplam: {program['weekly_total_hours']} saat, {program['weekly_total_questions']} soru

🔥 SERİ: {profile.study_stats.current_streak if profile.study_stats else 0} gün

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERİLERE DAYALI SOMUT ÖNERİLER VER. SORU SORMA, VERİLER SENDE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
    
    return prompt
