export default function Gradient() {
  return (
    <div className="overflow-hidden fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-rose-400 to-rose-600 opacity-20 blur-3xl" />

      {/* Accent blob bottom-right */}
      <div className="absolute bottom-[-120px] right-[-100px] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-pink-400 to-rose-500 opacity-25 blur-3xl" />
    </div>
  );
}
