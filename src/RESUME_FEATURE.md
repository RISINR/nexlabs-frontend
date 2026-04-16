# Resume Feature - NexLabs

## Overview
ระบบสร้าง Resume แบบ AI-driven ที่ช่วยให้ผู้ใช้สามารถสร้างและจัดการ Resume ได้อย่างมืออาชีพ

## Features

### 1. **Resume Landing Page** (`/resume`)
- หน้าแรกของระบบ Resume
- มีตัวเลือก "Create my resume" และ "Upload & Refine"
- แสดง Template Preview

### 2. **Template Selection** (`/resume/templates`)
- เลือก Template Resume ที่ต้องการ
- Filter ตาม Category (All Templates, Minimal / ATS, Creative, Professional)
- Preview Template แบบ Hover

### 3. **Template Detail** (`/resume/template/:templateId`)
- ดูรายละเอียดของ Template
- เลือกสีและ Customize
- ดู Features และ Benefits
- เริ่มใช้ Template

### 4. **Basic Info Form** (`/resume/basic-info`)
- กรอกข้อมูลพื้นฐานก่อนเริ่ม
- รูปโปรไฟล์, ชื่อเต็ม, ตำแหน่งอาชีพ, อีเมล, เบอร์โทร, ที่อยู่, ลิงก์มืออาชีพ

### 5. **Education Form** (`/resume/education`)
- กรอกข้อมูลการศึกษา
- University, Degree, Major, Graduation Year, GPAX
- Relevant Coursework (Tag Input)

### 5. **Experience Stack** (`/resume/experience-stack`)
- จัดการ Experience ทั้งหมด
- เพิ่ม/แก้ไข/ลบ Experience
- เลือกประเภท: Project, Work, Camp, Competition

### 6. **Experience Form** (`/resume/experience/:type` และ `/resume/experience/:type/:id`)
- กรอกข้อมูล Experience แต่ละรายการ
- ใช้ STAR Method (Situation, Task, Action, Result)
- รองรับทุกประเภท Experience

### 7. **Professional Summary** (`/resume/professional-summary`)
- สร้าง Professional Summary
- เลือก Role, Experience, Skills, Goal
- AI-assisted summary generation

### 8. **Resume Preview** (`/resume/preview`)
- ดูตัวอย่าง Resume ที่สร้าง
- Download เป็น PDF
- ไปยัง AI Recommendations
- เริ่ม Interview Prep

### 9. **Resume Analysis** (`/resume/analysis`)
- วิเคราะห์ Resume Score (Education, Activity, Skills, Format)
- Skill Gap Analysis
- Completeness Checklist
- Personalized Recommendations (Bootcamp, Hackathon, Programs)

## State Management

ใช้ React Context API (`ResumeContext`) เพื่อจัดการ State ของ Resume:

```typescript
interface ResumeData {
  selectedTemplate?: string;
  education?: Education;
  experiences: Experience[];
  professionalSummary?: ProfessionalSummary;
}
```

## Navigation Flow

```
Resume Landing
    ↓
Template Selection
    ↓
Template Detail
    ↓
Education Form
    ↓
Experience Stack ← → Experience Form (multiple)
    ↓
Professional Summary
    ↓
Resume Preview → Resume Analysis
```

## Key Components

### ResumeProvider
- Wrap ทั้ง App เพื่อให้ทุก Component เข้าถึง Resume State ได้
- ใน `/App.tsx`

### Navbar
- Updated to include link to Resume AI
- Active state highlighting
- Sticky navigation

## Routes

```typescript
/resume                              // Landing Page
/resume/templates                    // Template Selection
/resume/template/:templateId         // Template Detail
/resume/education                    // Education Form
/resume/experience-stack             // Experience Management
/resume/experience/:type             // Add New Experience
/resume/experience/:type/:id         // Edit Experience
/resume/professional-summary         // Professional Summary
/resume/preview                      // Resume Preview
/resume/analysis                     // Resume Analysis & Growth Plan
```

## Usage

1. **เริ่มต้นใช้งาน**
   - ไปที่ `/resume` หรือคลิก "Resume AI" ใน Navbar
   - เลือก "Create my resume"

2. **เลือก Template**
   - เลือก Template ที่ต้องการ
   - ดูรายละเอียดและ Customize
   - คลิก "Use this template"

3. **กรอกข้อมูล**
   - Education: กรอกข้อมูลการศึกษา
   - Experience Stack: เพิ่ม/แก้ไข Experience ต่างๆ
   - Professional Summary: สร้าง Summary

4. **Preview และ Export**
   - ดูตัวอย่าง Resume
   - Download เป็น PDF
   - ดู AI Recommendations

5. **Analyze**
   - ดู Resume Score
   - ดู Skill Gap
   - รับ Personalized Recommendations

## Styling

- ใช้ Tailwind CSS
- Responsive Design
- Noto Sans Thai สำหรับภาษาไทย
- Poppins สำหรับภาษาอังกฤษ
- League Spartan สำหรับ Logo

## Future Enhancements

- [ ] PDF Export Functionality
- [ ] AI Content Suggestions
- [ ] More Templates
- [ ] Interview AI Integration
- [ ] Template Customization (Colors, Fonts)
- [ ] Supabase Integration for Save/Load
- [ ] Share Resume Feature
- [ ] ATS Score Checker

## คำแนะนำในการพัฒนาต่อ

1. **PDF Export**: ใช้ library เช่น `jspdf` หรือ `react-pdf` สำหรับ Export PDF
2. **AI Integration**: เชื่อมต่อกับ OpenAI API สำหรับ content suggestions
3. **Backend Integration**: ใช้ Supabase สำหรับ save/load Resume data
4. **Template System**: สร้าง Template Engine ที่ flexible มากขึ้น
5. **Analytics**: เพิ่ม tracking และ analytics สำหรับ user behavior

## Technical Stack

- React 18
- TypeScript
- React Router v7
- Tailwind CSS
- Context API
- Lucide React Icons
