import { RouterProvider } from 'react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { router } from './routes';
import { ResumeProvider } from './contexts/ResumeContext';
import { InterviewProvider } from './contexts/InterviewContext';
import { UploadAnalysisProvider } from './contexts/UploadAnalysisContext';
import { useEffect } from 'react';
import { migrateLegacyAuth } from './utils/authStorage';
import { ConfirmDialogProvider } from './components/ui/ConfirmDialogProvider';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function App() {
  useEffect(() => {
    migrateLegacyAuth();
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ResumeProvider>
        <InterviewProvider>
          <UploadAnalysisProvider>
            <ConfirmDialogProvider>
              <RouterProvider router={router} />
            </ConfirmDialogProvider>
          </UploadAnalysisProvider>
        </InterviewProvider>
      </ResumeProvider>
    </GoogleOAuthProvider>
  );
}