
interface SubmitButtonProps {
  loading: boolean;
  text: string;
  disabled?: boolean;
}

export default function SubmitButton({ loading, text, disabled }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-700 transition"
      disabled={disabled || loading}
    >
      {loading ? "Cargando..." : text}
    </button>
  );
} 