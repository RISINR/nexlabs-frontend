import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'professional';

export interface DeviceStatus {
  microphone: 'not-tested' | 'testing' | 'working' | 'failed';
  camera: 'not-tested' | 'testing' | 'working' | 'failed';
}

export interface InterviewQuestion {
  id: string;
  question: string;
  guidelines: string[];
  answered: boolean;
}

export interface InterviewData {
  resumeFile?: File;
  position: string;
  difficulty: DifficultyLevel;
  deviceStatus: DeviceStatus;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  isInterviewActive: boolean;
}

interface InterviewContextType {
  interviewData: InterviewData;
  uploadResume: (file: File) => void;
  setPosition: (position: string) => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  testMicrophone: () => Promise<void>;
  testCamera: () => Promise<void>;
  startInterview: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  answerQuestion: (answer: string) => void;
  endInterview: () => void;
  resetInterview: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};

const defaultQuestions: InterviewQuestion[] = [
  {
    id: '1',
    question: 'เล่าประสบการณ์การทำงานเป็นทีมของคุณ ระบุบทบาทของคุณให้ชัดเจน อธิบายสถานการณ์และปัญหาที่เกิดขึ้น แสดงวิธีการสื่อสารหรือการแก้ไขความขัดแย้ง สรุปผลลัพธ์ของทีมอย่างเป็นรูปธรรม',
    guidelines: [
      'ระบุบทบาทของคุณให้ชัดเจน',
      'อธิบายสถานการณ์และปัญหาที่เกิดขึ้น',
      'แสดงวิธีการสื่อสารหรือการแก้ไขความขัดแย้ง',
      'สรุปผลลัพธ์ของทีมอย่างเป็นรูปธรรม'
    ],
    answered: false
  },
  {
    id: '2',
    question: 'คุณจัดการกับบั๊กที่แก้ยากอย่างไร? อธิบายขั้นตอนการวิเคราะห์ปัญหา กล่าวถึงเครื่องมือที่ใช้ในการ Debug แสดงกระบวนการคิดอย่างเป็นลำดับ สรุปสิ่งที่ได้เรียนรู้จากเหตุการณ์นั้น',
    guidelines: [
      'อธิบายขั้นตอนการวิเคราะห์ปัญหา',
      'กล่าวถึงเครื่องมือที่ใช้ในการ Debug',
      'แสดงกระบวนการคิดอย่างเป็นลำดับ',
      'สรุปสิ่งที่ได้เรียนรู้จากเหตุการณ์นั้น'
    ],
    answered: false
  },
  {
    id: '3',
    question: 'อธิบายวิธี Optimize Performance ใน React ควรอธิบายทั้งแนวคิดและเครื่องมือที่ใช้ ไม่ใช่ตอบแค่ชื่อ Hook เปรียบเทียบวิธีที่แตกต่างกัน เช่น memoization vs code splitting ยกตัวอย่างสถานการณ์จริงที่เคยปรับปรุง performance',
    guidelines: [
      'ควรอธิบายทั้งแนวคิดและเครื่องมือที่ใช้ ไม่ใช่ตอบแค่ชื่อ Hook',
      'เปรียบเทียบวิธีที่แตกต่างกัน เช่น memoization vs code splitting',
      'ยกตัวอย่างสถานการณ์จริงที่เคยปรับปรุง performance'
    ],
    answered: false
  }
];

export const InterviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [interviewData, setInterviewData] = useState<InterviewData>({
    position: '',
    difficulty: 'beginner',
    deviceStatus: {
      microphone: 'not-tested',
      camera: 'not-tested',
    },
    questions: defaultQuestions,
    currentQuestionIndex: 0,
    isInterviewActive: false,
  });

  const uploadResume = (file: File) => {
    setInterviewData(prev => ({ ...prev, resumeFile: file }));
  };

  const setPosition = (position: string) => {
    setInterviewData(prev => ({ ...prev, position }));
  };

  const setDifficulty = (difficulty: DifficultyLevel) => {
    setInterviewData(prev => ({ ...prev, difficulty }));
  };

  const testMicrophone = async () => {
    setInterviewData(prev => ({
      ...prev,
      deviceStatus: { ...prev.deviceStatus, microphone: 'testing' }
    }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      setTimeout(() => {
        setInterviewData(prev => ({
          ...prev,
          deviceStatus: { ...prev.deviceStatus, microphone: 'working' }
        }));
      }, 1000);
    } catch (error) {
      setInterviewData(prev => ({
        ...prev,
        deviceStatus: { ...prev.deviceStatus, microphone: 'failed' }
      }));
    }
  };

  const testCamera = async () => {
    setInterviewData(prev => ({
      ...prev,
      deviceStatus: { ...prev.deviceStatus, camera: 'testing' }
    }));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      
      setTimeout(() => {
        setInterviewData(prev => ({
          ...prev,
          deviceStatus: { ...prev.deviceStatus, camera: 'working' }
        }));
      }, 1000);
    } catch (error) {
      setInterviewData(prev => ({
        ...prev,
        deviceStatus: { ...prev.deviceStatus, camera: 'failed' }
      }));
    }
  };

  const startInterview = () => {
    setInterviewData(prev => ({ ...prev, isInterviewActive: true }));
  };

  const nextQuestion = () => {
    setInterviewData(prev => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1)
    }));
  };

  const previousQuestion = () => {
    setInterviewData(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0)
    }));
  };

  const answerQuestion = (answer: string) => {
    setInterviewData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[prev.currentQuestionIndex] = {
        ...updatedQuestions[prev.currentQuestionIndex],
        answered: true
      };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const endInterview = () => {
    setInterviewData(prev => ({ ...prev, isInterviewActive: false }));
  };

  const resetInterview = () => {
    setInterviewData({
      position: '',
      difficulty: 'beginner',
      deviceStatus: {
        microphone: 'not-tested',
        camera: 'not-tested',
      },
      questions: defaultQuestions.map(q => ({ ...q, answered: false })),
      currentQuestionIndex: 0,
      isInterviewActive: false,
    });
  };

  return (
    <InterviewContext.Provider
      value={{
        interviewData,
        uploadResume,
        setPosition,
        setDifficulty,
        testMicrophone,
        testCamera,
        startInterview,
        nextQuestion,
        previousQuestion,
        answerQuestion,
        endInterview,
        resetInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
