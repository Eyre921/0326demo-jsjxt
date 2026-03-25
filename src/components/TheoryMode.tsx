export default function TheoryMode() {
  return (
    <div className="max-w-4xl font-sans text-lg leading-relaxed space-y-16 pb-20">
      <section>
        <h2 className="font-display text-5xl text-[#00FF00] uppercase mb-8 tracking-wide">1. The Illusion of Precision</h2>
        <p className="mb-6 text-xl text-white/90">
          Integers and floating-point numbers represent reality differently. Integers are exact but bounded; floats are expansive but approximate. When they collide, reality distorts.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="border border-white/20 p-8 bg-white/5 hover:border-[#00FF00]/50 transition-colors">
            <h3 className="font-mono text-2xl text-[#00FF00] mb-2">A. Exact Conversion</h3>
            <p className="text-sm font-mono text-white/50 mb-4 bg-black/50 p-2 inline-block">int32 (100) → float32 (100.0)</p>
            <p className="text-white/80"><strong>Reason:</strong> The integer 100 has a simple binary representation (1100100) that easily fits within the 24-bit significand (mantissa) of a 32-bit float. No information is lost.</p>
          </div>

          <div className="border border-white/20 p-8 bg-white/5 hover:border-[#00FF00]/50 transition-colors">
            <h3 className="font-mono text-2xl text-[#00FF00] mb-2">B. Precision Loss</h3>
            <p className="text-sm font-mono text-white/50 mb-4 bg-black/50 p-2 inline-block">int32 (16777217) → float32 (16777216.0)</p>
            <p className="text-white/80"><strong>Reason:</strong> A 32-bit float only has 24 bits for its significand. The number 16,777,217 requires 25 bits to represent exactly. The lowest bit is truncated, causing silent precision loss.</p>
          </div>

          <div className="border border-white/20 p-8 bg-white/5 hover:border-[#00FF00]/50 transition-colors">
            <h3 className="font-mono text-2xl text-[#00FF00] mb-2">C. Overflow</h3>
            <p className="text-sm font-mono text-white/50 mb-4 bg-black/50 p-2 inline-block">float64 (1e40) → int32 (Undefined)</p>
            <p className="text-white/80"><strong>Reason:</strong> The maximum value of a signed 32-bit integer is ~2.14 billion. A float like 1e40 is astronomically larger. Attempting to force it into an int32 exceeds the physical memory bounds, causing an overflow.</p>
          </div>

          <div className="border border-white/20 p-8 bg-white/5 hover:border-[#00FF00]/50 transition-colors">
            <h3 className="font-mono text-2xl text-[#00FF00] mb-2">D. Rounding</h3>
            <p className="text-sm font-mono text-white/50 mb-4 bg-black/50 p-2 inline-block">float32 (3.14) → int32 (3)</p>
            <p className="text-white/80"><strong>Reason:</strong> Integers cannot represent fractional values. When converting a float with a fractional part to an integer, the system must discard the fraction (truncation) or round to the nearest whole number.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-5xl text-[#00FF00] uppercase mb-8 tracking-wide">2. Designing a Safer System</h2>
        <p className="mb-6 text-xl text-white/90">
          Currently, systems often fail silently during overflows or precision loss. How do we build a system that refuses to lie?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="border border-white/20 p-8 hover:border-[#00FF00]/50 transition-colors">
            <h3 className="font-mono text-2xl text-[#00FF00] mb-6 border-b border-[#00FF00]/30 pb-4">CPU Level</h3>
            <ul className="space-y-4 text-white/80 text-base">
              <li><strong className="text-white">Hardware Traps:</strong> Introduce dedicated status flags for precision loss. If a conversion truncates bits, a hardware trap/interrupt is triggered automatically.</li>
              <li><strong className="text-white">Dynamic Registers:</strong> Registers that automatically expand (e.g., 64-bit to 128-bit) when an arithmetic operation overflows, rather than wrapping around.</li>
            </ul>
          </div>

          <div className="border border-white/20 p-8 hover:border-[#00FF00]/50 transition-colors">
            <h3 className="font-mono text-2xl text-[#00FF00] mb-6 border-b border-[#00FF00]/30 pb-4">OS Level</h3>
            <ul className="space-y-4 text-white/80 text-base">
              <li><strong className="text-white">Strict Signal Handling:</strong> The OS could catch hardware traps (like SIGFPE) and terminate the process by default if unhandled precision loss occurs.</li>
              <li><strong className="text-white">Safe Math Libraries:</strong> Provide OS-level arbitrary-precision arithmetic APIs (like BigInt) as the default standard for critical applications.</li>
            </ul>
          </div>

          <div className="border border-white/20 p-8 hover:border-[#00FF00]/50 transition-colors">
            <h3 className="font-mono text-2xl text-[#00FF00] mb-6 border-b border-[#00FF00]/30 pb-4">Compiler Level</h3>
            <ul className="space-y-4 text-white/80 text-base">
              <li><strong className="text-white">Mandatory Explicit Casting:</strong> Forbid implicit conversions between floats and ints. Require syntax that injects runtime boundary checks.</li>
              <li><strong className="text-white">Static Analysis:</strong> Compilers could use symbolic execution to prove that a variable might exceed bounds, throwing a compilation error.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
