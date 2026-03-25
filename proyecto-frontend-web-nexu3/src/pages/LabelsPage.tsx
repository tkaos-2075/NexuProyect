import { useState, useEffect } from "react";
import { getAllLabels } from "@services/labels/getAllLabels";
import { createLabel } from "@services/labels/createLabel";
import { updateLabel } from "@services/labels/updateLabel";
import { deleteLabel as deleteLabelService } from "@services/labels/deleteLabel";
import { LabelsRequestDto } from "@interfaces/labels/LabelsRequestDto";
import { LabelsResponseDto } from "@interfaces/labels/LabelsResponseDto";
import { useRoleCheck } from "@hooks/useRoleCheck";
import { useToast } from "@components/ui/SimpleToast";
import LabelForm from "@components/forms/LabelForm";

export default function LabelsPage() {
	const [labels, setLabels] = useState<LabelsResponseDto[]>([]);
	const [editing, setEditing] = useState<LabelsResponseDto | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { isAdmin } = useRoleCheck();
	const { showToast, ToastContainer } = useToast();

	const fetchLabels = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await getAllLabels();
			setLabels(res.data);
		} catch (err) {
			console.error('❌ fetchLabels - Error:', err);
			setError("Error al cargar etiquetas");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLabels();
	}, []);

	const handleCreate = async (data: Omit<LabelsRequestDto, "id">) => {
		if (!isAdmin) {
			showToast("Solo los administradores pueden crear, editar o eliminar etiquetas.", "error");
			return;
		}

		setLoading(true);
		setError(null);
		try {
			await createLabel(data);
			await fetchLabels();
			setShowForm(false);
			showToast("Etiqueta creada exitosamente.", "success");
		} catch (err) {
			console.error('❌ handleCreate - Error:', err);
			setError("Error al crear etiqueta");
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = async (data: Omit<LabelsRequestDto, "id">) => {
		if (!isAdmin) {
			showToast("Solo los administradores pueden crear, editar o eliminar etiquetas.", "error");
			return;
		}

		if (!editing) return;
		setLoading(true);
		setError(null);
		try {
			await updateLabel(editing.id, data);
			await fetchLabels();
			setEditing(null);
			setShowForm(false);
			showToast("Etiqueta actualizada exitosamente.", "success");
		} catch (err) {
			console.error('❌ handleEdit - Error:', err);
			setError("Error al editar etiqueta");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		if (!isAdmin) {
			showToast("Solo los administradores pueden crear, editar o eliminar etiquetas.", "error");
			return;
		}

		setLoading(true);
		setError(null);
		try {
			await deleteLabelService(id);
			await fetchLabels();
			showToast("Etiqueta eliminada exitosamente.", "success");
		} catch (err) {
			console.error('❌ handleDelete - Error:', err);
			setError("Error al eliminar etiqueta");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateClick = () => {
		if (!isAdmin) {
			showToast("Solo los administradores pueden crear, editar o eliminar etiquetas.", "error");
			return;
		}
		setShowForm(true);
	};

	const handleEditClick = (label: LabelsResponseDto) => {
		if (!isAdmin) {
			showToast("Solo los administradores pueden crear, editar o eliminar etiquetas.", "error");
			return;
		}
		setEditing(label);
		setShowForm(true);
	};

	return (
		<>
			<div className="min-h-screen flex flex-col items-center justify-start py-12 px-2 pt-20 bg-[var(--color-background)] fade-in-up">
				<div className="w-full max-w-3xl">
					<div className="flex items-center justify-between mb-8">
						<h1 className="text-3xl font-bold gradient-text">Etiquetas</h1>
						{!showForm && !editing && (
							<button
								className="btn-primary hover-lift shadow-lg"
								onClick={handleCreateClick}
							>
								+ Nueva etiqueta
							</button>
						)}
					</div>
					{(showForm || editing) && (
						<LabelForm
							onSave={editing ? handleEdit : handleCreate}
							label={editing || undefined}
							onCancel={() => {
								setEditing(null);
								setShowForm(false);
							}}
						/>
					)}
					<div className="card glass-card fade-in-up p-0 overflow-x-auto">
						{loading && (
							<div className="text-center py-8 text-gray-400">Cargando...</div>
						)}
						{error && (
							<div className="text-center py-4 text-red-500">{error}</div>
						)}
						{!loading && !error && (
							<table className="w-full text-left text-base">
								<thead>
									<tr className="border-b border-gray-100 dark:border-gray-700">
										<th className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Nombre</th>
										<th className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Descripción</th>
										<th className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Color</th>
										<th className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Estado</th>
										<th className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300 text-center">Acciones</th>
									</tr>
								</thead>
								<tbody>
									{labels.map((label) => (
										<tr key={label.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-[var(--color-secondary-light)] dark:hover:bg-[var(--color-secondary-dark)] transition-colors">
											<td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{label.name}</td>
											<td className="py-4 px-4 text-gray-600 dark:text-gray-300">{label.description}</td>
											<td className="py-4 px-4">
												<span className="inline-block w-8 h-8 rounded-full align-middle mr-2 border-2 border-white shadow" style={{ background: label.color }}></span>
												<span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{label.color}</span>
											</td>
											<td className="py-4 px-4">
												<span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${label.status === "ACTIVE" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`}>
													{label.status === "ACTIVE" ? "Activo" : "Inactivo"}
												</span>
											</td>
											<td className="py-4 px-4 text-center space-x-2">
												<button
													className="btn-secondary p-2 rounded-full hover-scale"
													title="Editar"
													onClick={() => handleEditClick(label)}
												>
													<span role="img" aria-label="Editar">✏️</span>
												</button>
												<button
													className="btn-secondary p-2 rounded-full hover-scale"
													title="Eliminar"
													onClick={() => handleDelete(label.id)}
												>
													<span role="img" aria-label="Eliminar">🗑️</span>
												</button>
											</td>
										</tr>
									))}
									{labels.length === 0 && (
										<tr>
											<td colSpan={5} className="text-center py-10 text-gray-400">No hay etiquetas registradas.</td>
										</tr>
									)}
								</tbody>
							</table>
						)}
					</div>
				</div>
			</div>
			<ToastContainer />
		</>
	);
}
