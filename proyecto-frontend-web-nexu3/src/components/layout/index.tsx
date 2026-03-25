import { useNavigation } from '@hooks/useNavigation';
import ThemeToggle from '@components/ui/ThemeToggle';
import NavLinks from './NavLinks';
import ProfileButton from './ProfileButton';
import AuthButtons from './AuthButtons';
import ViewerWarningModal from './ViewerWarningModal';
import Logo from '@components/common/Logo';

export default function Navbar() {
  const {
    showViewerWarning,
    setShowViewerWarning,
    isViewer,
    handleLogout,
    handleLogin,
    handleProfileClick,
    handleLogoClick,
    navigateToDashboard,
    navigateToPlaces,
    navigateToLabels,
  } = useNavigation();

  const handleGoToLogin = () => {
    setShowViewerWarning(false);
    handleLogin();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo NexU */}
            <Logo 
              size="md"
              onClick={handleLogoClick}
            />
            
            {/* Controles y navegación */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              <NavLinks
                onDashboard={navigateToDashboard}
                onPlaces={navigateToPlaces}
                onLabels={navigateToLabels}
              />
              
              {/* Perfil y login/logout */}
              <div className="flex items-center space-x-3">
                <ProfileButton
                  isViewer={isViewer}
                  onProfileClick={handleProfileClick}
                />
                
                <AuthButtons
                  isViewer={isViewer}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Modal de advertencia para viewers */}
      <ViewerWarningModal
        isOpen={showViewerWarning}
        onClose={() => setShowViewerWarning(false)}
        onGoToLogin={handleGoToLogin}
      />
    </>
  );
} 