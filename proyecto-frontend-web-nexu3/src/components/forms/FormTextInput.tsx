
interface ValidationErrorsProps {
  errors: string[] | { [key: string]: string };
}

export default function ValidationErrors({ errors }: ValidationErrorsProps) {
  if (!errors || (Array.isArray(errors) && errors.length === 0) || (typeof errors === "object" && Object.keys(errors).length === 0)) {
    return null;
  }
  return (
    <div className="text-red-500 text-sm mb-2">
      {Array.isArray(errors)
        ? errors.map((err, i) => <div key={i}>{err}</div>)
        : Object.values(errors).map((err, i) => <div key={i}>{err}</div>)}
    </div>
  );
} 