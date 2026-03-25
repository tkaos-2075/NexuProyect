import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@components/ui/ThemeToggle';
import { useAuthContext } from '@contexts/AuthContext';
import { useAuth } from '@hooks/useAuth';
import '@styles/welcome-page.css';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { session, isLoading: authIsLoading } = useAuthContext();
  const { loginAsViewer, isLoading, error } = useAuth();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      title: "Exploración sin registro",
      description: "Consulta lugares disponibles sin necesidad de registrarte",
      icon: "🔍"
    },
    {
      title: "Planes colaborativos",
      description: "Crea planes personales, públicos o grupales para organizar visitas",
      icon: "📅"
    },
    {
      title: "Mapa interactivo",
      description: "Visualiza los lugares en un mapa dinámico con Google Maps",
      icon: "🗺️"
    },
    {
      title: "Comentarios y fotos",
      description: "Deja opiniones y sube imágenes de los lugares que visitas",
      icon: "📸"
    },
    {
      title: "Etiquetas personalizadas",
      description: "Encuentra lugares según tus intereses: económico, pet-friendly, etc.",
      icon: "🏷️"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Navegar automáticamente cuando se obtiene el token
  useEffect(() => {
    if (session && !authIsLoading) {
      navigate('/dashboard');
    }
  }, [session, authIsLoading, navigate]);

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleRegister = () => {
    navigate('/auth/register');
  };

  const handleViewerAccess = () => {
    loginAsViewer();
  };

  // Mostrar error si ocurre durante el login
  useEffect(() => {
    if (error) {
      console.error('Error al acceder como viewer:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen hero-background floating-particles">
      {/* Header con botones de navegación */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">NexU</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={handleViewerAccess}
                disabled={isLoading}
                className="btn-secondary bg-green-600 hover:bg-green-700 text-white border-green-600"
              >
                {isLoading ? 'Entrando...' : 'Entrar al mapa'}
              </button>
              <button
                onClick={handleLogin}
                className="btn-secondary"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={handleRegister}
                className="btn-primary"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`loading-fade transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Título principal con máxima prominencia */}
            <div className="mb-16">
              <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text">
                NexU
              </h1>
            </div>
            
            {/* Información descriptiva separada */}
            <div className="space-y-8">
              <p className="text-2xl md:text-3xl text-white/90 font-semibold max-w-4xl mx-auto">
                La guía universitaria para ahorrar tiempo, dinero y descubrir nuevos lugares
              </p>
              <p className="text-lg md:text-xl text-white/80 max-w-5xl mx-auto leading-relaxed">
                Conecta con estudiantes y docentes para encontrar lugares cercanos, accesibles y recomendados por la misma comunidad universitaria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Qué puedes hacer con <span className="gradient-text">NexU</span>?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Descubre todas las funcionalidades que te ayudarán a optimizar tu experiencia universitaria
            </p>
          </div>

          {/* Feature Carousel */}
          <div className="max-w-4xl mx-auto">
            <div className="feature-card">
              <div className="text-center">
                <div className="feature-icon">
                  {features[currentFeature].icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {features[currentFeature].title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {features[currentFeature].description}
                </p>
              </div>
              
              {/* Feature Indicators */}
              <div className="flex justify-center mt-8 space-x-3">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`feature-indicator ${
                      index === currentFeature ? 'active' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                El problema que resolvemos
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                En el entorno universitario, tanto estudiantes como profesores enfrentan dificultades para encontrar información confiable y actualizada sobre lugares económicos y accesibles para comer, socializar o relajarse cerca del campus.
              </p>
              <div className="problem-solution-card problem-card">
                <p className="text-red-700 dark:text-red-300 font-medium">
                  Las aplicaciones tradicionales no siempre están diseñadas pensando en las necesidades específicas de la comunidad universitaria.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Nuestra solución
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                NexU es una plataforma colaborativa que conecta a estudiantes y docentes con lugares cercanos, accesibles y recomendados por la misma comunidad universitaria.
              </p>
              <div className="problem-solution-card solution-card">
                <p className="text-green-700 dark:text-green-300 font-medium">
                  Facilitamos el descubrimiento, la valoración y la recomendación de opciones para optimizar tiempo y dinero.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 cta-section bg-black">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para descubrir nuevos lugares?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Únete a la comunidad universitaria y comienza a explorar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleViewerAccess}
              disabled={isLoading}
              className="btn-secondary bg-green-600 hover:bg-green-700 text-white border-green-600"
            >
              {isLoading ? 'Entrando...' : 'Entrar al mapa'}
            </button>
            <button
              onClick={handleRegister}
              className="btn-primary"
            >
              Crear cuenta gratuita
            </button>
            <button
              onClick={handleLogin}
              className="btn-secondary bg-white text-orange-600 border-white hover:bg-gray-100"
            >
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 dark:text-gray-500">
            © 2025 NexU - CS 2031 Desarrollo Basado en Plataformas
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-600 mt-2">
            Desarrollado por: Paulo Miranda, Juan Ticlia, Elmer Villegas, Jhogan Pachacutec
          </p>
        </div>
      </footer>
    </div>
  );
}