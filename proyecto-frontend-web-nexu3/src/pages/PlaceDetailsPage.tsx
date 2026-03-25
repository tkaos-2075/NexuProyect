import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlacesToEatResponseDto } from "@interfaces/placesToEat/PlacesToEatResponseDto";
import { PlacesToFunResponseDto } from "@interfaces/placesToFun/PlacesToFunResponseDto";
import { ReviewResponseDto } from "@interfaces/reviews/ReviewResponseDto";
import { getPlaceToEatById } from "@services/placesToEat/getPlaceToEatById";
import { getPlaceToFunById } from "@services/placesToFun/getPlaceToFunById";
import { getReviewsByPlaceId } from "@services/reviews/getReviewsByPlaceId";
import { createReview } from "@services/reviews/createReview";
import { getPlacePictures } from "@services/pictures/getPlacePictures";
import { uploadReviewPictures } from "@services/pictures/uploadReviewPictures";
import PlaceCard from '@components/places/PlaceCard';
import { PlaceTabs } from "@components/places";
import { Labels } from "@components/labels";
import { ImageModal } from "@components/places";
import { uploadPlacePictures } from "@services/pictures/uploadPlacePictures";
import { InteractiveGallery } from "@components/places";
import { InfoSection } from "@components/places";
import { ReviewsSection } from "@components/places";
import { HeaderPlaceDetails } from "@components/places";
import { NotFoundPlace } from "@components/places";
import { LoadingPlaceDetails } from "@components/places";
import AssignLabelToPlace from '@components/labels/AssignLabelToPlace';
import { useToast } from '@components/ui/SimpleToast';


export default function PlaceDetailsPage() {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<PlacesToEatResponseDto | PlacesToFunResponseDto | null>(null);
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [placePictures, setPlacePictures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Estados para el formulario de review
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    comment: '',
    rating: 5,
    pictures: [] as File[]
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isUploadingPlaceImages, setIsUploadingPlaceImages] = useState(false);
  // Estado para el toast
  const { showToast, ToastContainer } = useToast();
  const [showAssignLabel, setShowAssignLabel] = useState(false);

  useEffect(() => {
    const loadPlaceDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const placeId = parseInt(id);
        
        // Cargar detalles del lugar
        let placeResponse;
        if (type === 'eat') {
          placeResponse = await getPlaceToEatById(placeId);
        } else {
          placeResponse = await getPlaceToFunById(placeId);
        }
        
        setPlace(placeResponse.data);

        // Cargar reviews del lugar
        try {
          const reviewsResponse = await getReviewsByPlaceId(placeId);
          setReviews(reviewsResponse.data || []);
        } catch {
          setReviews([]);
        }

        // Cargar fotos del lugar
        try {
          const picturesResponse = await getPlacePictures(placeId.toString());
          setPlacePictures(picturesResponse || []);
        } catch {
          // Si falla la carga de fotos específicas, intentar usar las del lugar
          if (placeResponse.data.pictureUrls && placeResponse.data.pictureUrls.length > 0) {
            setPlacePictures(placeResponse.data.pictureUrls);
          } else {
            setPlacePictures([]);
          }
        }
      } catch {
        alert("Error al cargar los detalles del lugar");
      } finally {
        setIsLoading(false);
      }
    };

    loadPlaceDetails();
  }, [id, type]);

  const handleSubmitReview = async () => {
    if (!place || !reviewForm.comment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const reviewData = {
        comment: reviewForm.comment,
        rating: reviewForm.rating,
        placeId: place.id
      };
      // Crear la review y obtener el id
      const reviewId = await createReview(reviewData);
      
      // Si hay imágenes, subirlas
      if (reviewForm.pictures.length > 0) {
        setIsUploadingImages(true);
        try {
          await uploadReviewPictures(String(reviewId), reviewForm.pictures);
          // Esperar un poco para que el backend procese las imágenes
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch {
          showToast("Error al subir las imágenes de la review", "error");
          setIsSubmittingReview(false);
          setIsUploadingImages(false);
          return;
        } finally {
          setIsUploadingImages(false);
        }
      }
      
      // Recargar reviews con múltiples intentos para asegurar que las imágenes aparezcan
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          const reviewsResponse = await getReviewsByPlaceId(place.id);
          setReviews(reviewsResponse.data || []);
          
          // Si hay imágenes y es el primer intento, esperar un poco más
          if (reviewForm.pictures.length > 0 && attempts === 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
          break;
        } catch {
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      setReviewForm({ comment: '', rating: 5, pictures: [] });
      setShowReviewForm(false);
      showToast("¡Review creada exitosamente!", "success");
    } catch {
      showToast("Error al crear la review", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleUploadPlaceImages = async (files: File[]) => {
    if (!place) return;
    
    setIsUploadingPlaceImages(true);
    try {
      await uploadPlacePictures(place.id.toString(), files);
      
      // Esperar un poco para que el backend procese las imágenes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Recargar los detalles del lugar para obtener las nuevas pictureUrsl
      try {
        const placeId = parseInt(place.id.toString());
        let placeResponse;
        if (type === 'eat') {
          placeResponse = await getPlaceToEatById(placeId);
        } else {
          placeResponse = await getPlaceToFunById(placeId);
        }
        setPlace(placeResponse.data);
      } catch {
        // Error al recargar el lugar
      }
      
      // También recargar las imágenes del endpoint específico
      try {
        const picturesResponse = await getPlacePictures(place.id.toString());
        setPlacePictures(picturesResponse || []);
      } catch {
        // Si falla, usar las imágenes del lugar recargado
        if (place.pictureUrls && place.pictureUrls.length > 0) {
          setPlacePictures(place.pictureUrls);
        }
      }
      
      showToast("¡Imágenes subidas exitosamente!", "success");
    } catch {
      showToast("Error al subir las imágenes", "error");
    } finally {
      setIsUploadingPlaceImages(false);
    }
  };

  // Refrescar detalles del lugar (para usar tras asignar etiqueta)
  const refreshPlace = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const placeId = parseInt(id);
      let placeResponse;
      if (type === 'eat') {
        placeResponse = await getPlaceToEatById(placeId);
      } else {
        placeResponse = await getPlaceToFunById(placeId);
      }
      setPlace(placeResponse.data);
    } catch {
      // error
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingPlaceDetails />;
  }

  if (!place) {
    return <NotFoundPlace onBack={() => navigate('/dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <HeaderPlaceDetails name={place.name} onBack={() => navigate('/dashboard')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {place && <PlaceCard place={place} detailed />}
            <PlaceTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              reviewsCount={reviews.length}
              infoContent={<InfoSection place={place} />}
              reviewsContent={
                <ReviewsSection
                  reviews={reviews}
                  showReviewForm={showReviewForm}
                  setShowReviewForm={setShowReviewForm}
                  reviewForm={reviewForm}
                  setReviewForm={setReviewForm}
                  isSubmittingReview={isSubmittingReview}
                  isUploadingImages={isUploadingImages}
                  handleSubmitReview={handleSubmitReview}
                  renderStars={renderStars}
                  formatDate={formatDate}
                  setSelectedImage={setSelectedImage}
                />
              }
            />
          </div>

          {/* Columna derecha - Información adicional */}
          <div className="space-y-6">
            <InteractiveGallery
              title="Galería del Lugar"
              urls={(() => {
                // Primero intentar usar las imágenes del endpoint específico
                if (placePictures && placePictures.length > 0) {
                  return placePictures;
                }
                // Si no hay imágenes del endpoint, usar las del lugar
                const placePictureUrls = place?.pictureUrls || [];
                if (placePictureUrls.length > 0) {
                  return placePictureUrls;
                }
                return [];
              })()}
              onImageClick={setSelectedImage}
              onUploadImages={handleUploadPlaceImages}
              isUploading={isUploadingPlaceImages}
              canUpload={true}
            />
            {/* Botón para agregar label */}
            <button
              className="w-full bg-blue-600 text-white py-2 rounded mb-2 hover:bg-blue-700 transition"
              onClick={() => setShowAssignLabel(true)}
            >
              + Agregar label
            </button>
            {/* Modal simple para asignar label */}
            {showAssignLabel && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg min-w-[320px] relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    onClick={() => setShowAssignLabel(false)}
                  >
                    ✕
                  </button>
                  <AssignLabelToPlace
                    placeId={place.id}
                    onAssigned={() => {
                      setShowAssignLabel(false);
                      refreshPlace();
                    }}
                  />
                </div>
              </div>
            )}
            <Labels labels={place.labelNames || []} />
          </div>
        </div>
      </div>
      <ImageModal url={selectedImage || ''} onClose={() => setSelectedImage(null)} />
      <ToastContainer />
    </div>
  );
} 