export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-slate-900">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-gray-500 text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}