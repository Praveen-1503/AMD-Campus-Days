export default function Atelier() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32 text-center h-[70vh] flex flex-col justify-center">
      <h1 className="text-6xl font-display font-bold mb-6 tracking-tighter">The Atelier.</h1>
      <p className="text-secondary font-body max-w-2xl mx-auto text-lg leading-relaxed">
        Your synthetic workshop is calibrating your personalized style matrices. Please stand by.
      </p>
      <div className="mt-12 flex justify-center">
        <div className="w-16 h-16 border-4 border-surface_container_highest border-t-primary rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
