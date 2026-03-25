import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { getAllLabels } from "@services/labels/getAllLabels";
import { LabelsResponseDto } from "@interfaces/labels/LabelsResponseDto";
import { createPlaceToEat } from "@services/placesToEat/createPlaceToEat";
import { createPlaceToFun } from "@services/placesToFun/createPlaceToFun";
import { useToast } from '@components/ui/SimpleToast';
import AuthorizationGuard from '@components/common/AuthorizationGuard';
import CommonFields from './CommonFields';
import PlaceTypeSelector from './PlaceTypeSelector';
import EatFields from './EatFields';
import FunFields from './FunFields';
import LabelSelector from './LabelSelector';
import ValidationErrors from './FormTextInput';
import { statusOptions, wifiOptions, priceRangeOptions, deliveryOptions, typeRestaurantOptions, typeCoffeeOptions, sizeParkOptions } from './options';
import { validateAddPlaceForm } from './validate';
import { buildPlaceToEatPayload, buildPlaceToFunPayload } from './payloads';
import SaveButton from './SaveButton';
import { assignLabelToPlace } from '@services/labels/assignLabelToPlace';

interface AddPlaceFormProps {
	onClose?: () => void;
	lat?: number;
	lng?: number;
}

// Estado inicial del formulario
const initialState = {
	// Comunes
	name: '',
	address: '',
	latitude: '',
	longitude: '',
	payment: '',
	openTime: '',
	closeTime: '',
	description: '',
	wifi: '',
	priceRange: '',
	estimatedPrice: '',
	capacity: '',
	status: '',
	labelIds: [] as number[],
	menu: '',
	delivery: '',
	// Específicos
	placeType: '', // eat | fun
	subType: '', // COFFEE, RESTAURANT, PARK, GAMES
	typeCoffee: '',
	typeRestaurant: '',
	placeCategoryToFun: '',
	games: '', // Coma separados
	priceFicha: '',
	sizePark: '',
	haveGames: '',
	placeCategoryToEat: '',
};

export default function AddPlaceForm({ onClose, lat, lng }: AddPlaceFormProps) {
	// Estado y hooks principales
	const [form, setForm] = useState({
		...initialState,
		latitude: lat !== undefined ? String(lat) : '',
		longitude: lng !== undefined ? String(lng) : '',
	});
	const [errors, setErrors] = useState<{ [k: string]: string }>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [labels, setLabels] = useState<LabelsResponseDto[]>([]);
	const [loadingLabels, setLoadingLabels] = useState(true);
	const { showToast, ToastContainer } = useToast();
	
	// Cargar etiquetas al montar
	useEffect(() => {
		setLoadingLabels(true);
		getAllLabels()
			.then(res => setLabels(res.data || []))
			.catch(() => setLabels([]))
			.finally(() => setLoadingLabels(false));
	}, []);

	// Manejo de cambios en los campos
	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value, type } = e.target;
		let newValue: any = value;
		if (type === 'checkbox' && 'checked' in e.target) {
			newValue = (e.target as HTMLInputElement).checked;
		}
		setForm(prev => {
			let updated = { ...prev, [name]: newValue };
			// Si el método de pago es GRATIS, limpiar los campos de precio
			if (name === 'payment' && value === 'GRATIS') {
				updated.priceRange = '';
				updated.estimatedPrice = '';
			}
			// Si el campo haveGames es 'false', limpiar games
			if (name === 'haveGames' && value === 'false') {
				updated.games = '';
			}
			if (name === 'subType') {
				if (prev.placeType === 'eat') {
					updated.placeCategoryToEat = value;
				} else if (prev.placeType === 'fun') {
					updated.placeCategoryToFun = value;
				}
			}
			return updated;
		});
		setErrors(prev => ({ ...prev, [name]: '' }));
	};

	// Opciones para react-select
	const labelOptions = labels.map(et => ({
		value: et.id,
		label: et.name,
		color: et.color
	}));

	// Manejo de etiquetas (react-select multi)
	const handleLabelChange = (selected: any) => {
		setForm(prev => ({ ...prev, labelIds: selected ? selected.map((s: any) => s.value) : [] }));
		setErrors(prev => ({ ...prev, labelIds: '' }));
	};

	// Validación del formulario (usando función extraída)
	const validate = () => validateAddPlaceForm(form);

	// Envío del formulario
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const v = validate();
		setErrors(v);
		if (Object.keys(v).length > 0) return;
		setIsSubmitting(true);
		try {
			let placeId: number | null = null;
			if (form.placeType === "eat") {
				const response = await createPlaceToEat(buildPlaceToEatPayload(form));
				placeId = response.data?.id;
			} else if (form.placeType === "fun") {
				const response = await createPlaceToFun(buildPlaceToFunPayload(form));
				placeId = response.data?.id;
			}
			if (placeId && form.labelIds.length > 0) {
				await Promise.all(form.labelIds.map((labelId: number) => assignLabelToPlace(labelId, placeId!)));
			}
			showToast('¡Lugar agregado correctamente!', 'success');
			if (onClose) setTimeout(onClose, 1200);
		} catch {
			showToast('Error al agregar el lugar. Intenta de nuevo.', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};



	return (
		<AuthorizationGuard requiredRole="VIEWER">
			<div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-xl w-full mx-auto font-sans">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white">Agregar Lugar</h2>
				{onClose && (
					<button onClick={onClose} className="text-gray-300 hover:text-white">✕</button>
				)}
			</div>
			<form onSubmit={handleSubmit} className="space-y-4">
				<PlaceTypeSelector value={form.placeType} onChange={handleChange} />
				{form.placeType && (
					<div className="mb-4">
						<label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">Categoría</label>
						<select
							name="subType"
							value={form.subType}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-[#F8FAFC] text-black dark:bg-gray-800 dark:text-white font-sans"
							required
						>
							<option value="" disabled>Selecciona una categoría</option>
							{form.placeType === 'eat' && [
								<option key="COFFEE" value="COFFEE">Café</option>,
								<option key="RESTAURANT" value="RESTAURANT">Restaurante</option>
							]}
							{form.placeType === 'fun' && [
								<option key="PARK" value="PARK">Parque</option>,
								<option key="GAMES" value="GAMES">Arcade/Juegos</option>
							]}
						</select>
						<ValidationErrors errors={errors.subType ? [errors.subType] : []} />
					</div>
				)}
				{form.subType && (
					<>
						<CommonFields
							form={form}
							errors={errors}
							onChange={handleChange}
							statusOptions={statusOptions}
							wifiOptions={wifiOptions}
							priceRangeOptions={priceRangeOptions}
							hidePriceFields={form.payment === 'GRATIS'}
						/>
						{/* Campos específicos según tipo de lugar */}
						{form.placeType === 'eat' && (
							<EatFields
								form={form}
								errors={errors}
								onChange={handleChange}
								deliveryOptions={deliveryOptions}
								typeRestaurantOptions={typeRestaurantOptions}
								typeCoffeeOptions={typeCoffeeOptions}
							/>
						)}
						{form.placeType === 'fun' && (
							<FunFields
								form={form}
								errors={errors}
								onChange={handleChange}
								sizeParkOptions={sizeParkOptions}
								forceHaveGames={form.subType === 'GAMES'}
							/>
						)}
						{/* Selector de etiquetas */}
						<div>
							<label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">Etiquetas</label>
							<LabelSelector
								labels={labelOptions}
								selected={form.labelIds}
								onChange={handleLabelChange}
								isMulti={true}
								isLoading={loadingLabels}
								error={errors.labelIds}
							/>
						</div>
						{/* Botón de submit */}
						<div className="pt-4">
							<SaveButton loading={isSubmitting} text="Agregar Lugar" />
						</div>
					</>
				)}
			</form>
			<ToastContainer />
		</div>
		</AuthorizationGuard>
	);
} 