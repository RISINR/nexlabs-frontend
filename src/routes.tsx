import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import NexLabsHomepage_Dev from "./imports/NexLabsHomepage_Dev";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SsoLoginPage from "./pages/SsoLoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResumeLandingPage from "./pages/resume/ResumeLandingPage";
import UploadPage from "./pages/resume/UploadPage";
import ResumeAnalysisUploadPage from "./pages/resume/ResumeAnalysisUploadPage";
import TemplateSelectionPage from "./pages/resume/TemplateSelectionPage";
import TemplateDetailPage from "./pages/resume/TemplateDetailPage";
import BasicInfoPage from "./pages/resume/BasicInfoPage";
import EducationFormPage from "./pages/resume/EducationFormPage";
import ExperienceStackPage from "./pages/resume/ExperienceStackPage";
import ExperienceFormPage from "./pages/resume/ExperienceFormPage";
import ProfessionalSummaryPage from "./pages/resume/ProfessionalSummaryPage";
import AdditionalInfoPage from "./pages/resume/AdditionalInfoPage";
import ResumePreviewPage from "./pages/resume/ResumePreviewPage";
import ResumeAnalysisPage from "./pages/resume/ResumeAnalysisPage";
import SettingsPage from "./pages/SettingsPage";
import InterviewLandingPage from "./pages/interview/InterviewLandingPage";
import InterviewSetupPage from "./pages/interview/InterviewSetupPage";
import InterviewSessionPage from "./pages/interview/InterviewSessionPage";
import InterviewSummaryPage from "./pages/interview/InterviewSummaryPage";
import UniversityDashboardWrapper from "./pages/university/UniversityDashboardWrapper";
import DashboardStudentPage from "./pages/student/DashboardStudentPage";
import CommunityPage from "./pages/community/CommunityPage";
import ChatPage from "./pages/chat/ChatPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/homepage-dev",
    Component: NexLabsHomepage_Dev,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/sso-login",
    Component: SsoLoginPage,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
  {
    path: "/dashboard/student",
    Component: DashboardStudentPage,
  },
  {
    path: "/resume",
    Component: ResumeLandingPage,
  },
  {
    path: "/resume/upload",
    Component: UploadPage,
  },
  {
    path: "/resume/analysis-results",
    Component: ResumeAnalysisUploadPage,
  },
  {
    path: "/resume/templates",
    Component: TemplateSelectionPage,
  },
  {
    path: "/resume/template/:templateId",
    Component: TemplateDetailPage,
  },
  {
    path: "/resume/basic-info",
    Component: BasicInfoPage,
  },
  {
    path: "/resume/education",
    Component: EducationFormPage,
  },
  {
    path: "/resume/experience-stack",
    Component: ExperienceStackPage,
  },
  {
    path: "/resume/experience/:type",
    Component: ExperienceFormPage,
  },
  {
    path: "/resume/experience/:type/:id",
    Component: ExperienceFormPage, 
  },
  {
    path: "/resume/professional-summary",
    Component: ProfessionalSummaryPage,
  },
  {
    path: "/resume/additional-info",
    Component: AdditionalInfoPage,
  },
  {
    path: "/resume/preview",
    Component: ResumePreviewPage,
  },
  {
    path: "/resume/analysis",
    Component: ResumeAnalysisPage,
  },
  {
    path: "/interview",
    Component: InterviewLandingPage,
  },
  {
    path: "/interview/setup",
    Component: InterviewSetupPage,
  },
  {
    path: "/interview/session",
    Component: InterviewSessionPage,
  },
  {
    path: "/interview/summary",
    Component: InterviewSummaryPage,
  },
  {
    path: "/settings",
    Component: SettingsPage,
  },
  {
    path: "/university/dashboard",
    Component: UniversityDashboardWrapper,
  },
  {
    path: "/community",
    Component: CommunityPage,
  },
  {
    path: "/chat/:id",
    Component: ChatPage,
  },
  // AI pages merged into single dashboard page (embedded)
]);