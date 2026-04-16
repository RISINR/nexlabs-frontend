import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { useInterview } from '../../contexts/InterviewContext';
import { CheckCircle, Star, TrendingUp, Download, RotateCcw } from 'lucide-react';

export default function InterviewSummaryPage() {
  const navigate = useNavigate();
  const { interviewData, resetInterview } = useInterview();

  const answeredCount = interviewData.questions.filter(q => q.answered).length;
  const totalQuestions = interviewData.questions.length;
  const completionRate = Math.round((answeredCount / totalQuestions) * 100);

  // Mock scores
  const scores = {
    communication: 85,
    technicalKnowledge: 78,
    problemSolving: 92,
    teamwork: 88,
  };

  const overallScore = Math.round(
    (scores.communication + scores.technicalKnowledge + scores.problemSolving + scores.teamwork) / 4
  );

  const handleTryAgain = () => {
    resetInterview();
    navigate('/interview/setup');
  };

  const handleDownloadReport = () => {
    alert('Downloading interview report...');
    // Implement PDF download
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="relative w-full pb-24">
        {/* Background Gradient */}
        <div className="absolute h-[947px] left-[calc(8.33%+94px)] top-[140px] w-[1206px] pointer-events-none">
          <div className="absolute inset-[-34.51%_-13.55%_-17.25%_-13.55%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1532.8 1437.2">
              <g>
                <g filter="url(#filter0_f)">
                  <ellipse cx="499.076" cy="938.091" fill="#DEEFF5" rx="335.676" ry="335.709" />
                </g>
                <g filter="url(#filter1_f)">
                  <ellipse cx="781.788" cy="662.509" fill="#235CC7" fillOpacity="0.2" rx="335.676" ry="335.709" />
                </g>
                <g filter="url(#filter2_f)">
                  <ellipse cx="989.349" cy="835.016" fill="#6DA0FF" fillOpacity="0.3" rx="380.051" ry="380.088" />
                </g>
              </g>
              <defs>
                <filter id="filter0_f" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="998.218" width="998.152" x="0" y="438.982">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="81.7" />
                </filter>
                <filter id="filter1_f" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1325.02" width="1324.95" x="119.312" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="163.4" />
                </filter>
                <filter id="filter2_f" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1086.98" width="1086.9" x="445.898" y="291.528">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="81.7" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <h1 className="text-[42px] font-['Poppins'] font-semibold text-black text-center mb-4">
            Interview Complete!
          </h1>
          <p className="text-[20px] font-['Poppins','Noto_Sans_Thai'] text-[rgba(0,0,0,0.8)] text-center mb-12">
            ขอบคุณที่ทำการสัมภาษณ์จบสิ้น นี่คือผลลัพธ์ของคุณ
          </p>

          <div className="grid grid-cols-2 gap-8">
            {/* Left: Overall Score */}
            <div className="bg-white rounded-[20px] border border-white shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <svg className="transform -rotate-90" width="200" height="200">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                      fill="none"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      stroke="#3b82f6"
                      strokeWidth="20"
                      fill="none"
                      strokeDasharray={`${(overallScore / 100) * 502.4} 502.4`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-bold text-blue-600">{overallScore}</span>
                    <span className="text-sm text-gray-600">Overall Score</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-['Poppins'] text-[16px]">Communication</span>
                    <span className="font-['Poppins'] text-[16px] font-semibold">{scores.communication}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${scores.communication}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-['Poppins'] text-[16px]">Technical Knowledge</span>
                    <span className="font-['Poppins'] text-[16px] font-semibold">{scores.technicalKnowledge}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${scores.technicalKnowledge}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-['Poppins'] text-[16px]">Problem Solving</span>
                    <span className="font-['Poppins'] text-[16px] font-semibold">{scores.problemSolving}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${scores.problemSolving}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-['Poppins'] text-[16px]">Teamwork</span>
                    <span className="font-['Poppins'] text-[16px] font-semibold">{scores.teamwork}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${scores.teamwork}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="text-green-600" size={24} />
                  <span className="font-['Poppins'] font-semibold text-[18px]">
                    {answeredCount}/{totalQuestions} Questions Answered
                  </span>
                </div>
                <p className="font-['Poppins','Noto_Sans_Thai'] text-[14px] text-gray-600">
                  Completion Rate: {completionRate}%
                </p>
              </div>
            </div>

            {/* Right: Feedback & Recommendations */}
            <div className="space-y-6">
              {/* Strengths */}
              <div className="bg-white rounded-[20px] border border-white shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="text-yellow-500" size={24} fill="currentColor" />
                  <h3 className="font-['Poppins'] font-semibold text-[20px]">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  <li className="font-['Poppins','Noto_Sans_Thai'] text-[16px] flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Strong problem-solving approach</span>
                  </li>
                  <li className="font-['Poppins','Noto_Sans_Thai'] text-[16px] flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Clear communication skills</span>
                  </li>
                  <li className="font-['Poppins','Noto_Sans_Thai'] text-[16px] flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Good technical knowledge foundation</span>
                  </li>
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-white rounded-[20px] border border-white shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="text-orange-500" size={24} />
                  <h3 className="font-['Poppins'] font-semibold text-[20px]">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2">
                  <li className="font-['Poppins','Noto_Sans_Thai'] text-[16px] flex items-start gap-2">
                    <span className="text-orange-500 mt-1">→</span>
                    <span>Provide more specific examples from past experiences</span>
                  </li>
                  <li className="font-['Poppins','Noto_Sans_Thai'] text-[16px] flex items-start gap-2">
                    <span className="text-orange-500 mt-1">→</span>
                    <span>Structure answers using the STAR method</span>
                  </li>
                  <li className="font-['Poppins','Noto_Sans_Thai'] text-[16px] flex items-start gap-2">
                    <span className="text-orange-500 mt-1">→</span>
                    <span>Elaborate on technical concepts with more depth</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleDownloadReport}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-[15px] py-3 text-[18px] font-['Poppins'] hover:bg-blue-700 transition-colors"
                >
                  <Download size={20} />
                  Download Report
                </button>
                
                <button
                  onClick={handleTryAgain}
                  className="flex items-center justify-center gap-2 bg-black text-white rounded-[15px] py-3 text-[18px] font-['Poppins'] hover:bg-gray-900 transition-colors"
                >
                  <RotateCcw size={20} />
                  Try Again
                </button>
              </div>

              <button
                onClick={() => navigate('/')}
                className="w-full border border-gray-300 text-black rounded-[15px] py-3 text-[18px] font-['Poppins'] hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
