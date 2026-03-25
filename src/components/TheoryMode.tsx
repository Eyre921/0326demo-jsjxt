import { motion } from 'motion/react';

export default function TheoryMode() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto font-sans text-base leading-relaxed space-y-12 pb-20"
    >
      <section>
        <motion.h2 variants={itemVariants} className="text-2xl font-semibold text-foreground mb-6">1. 精度错觉：整数与浮点数的碰撞</motion.h2>
        <motion.p variants={itemVariants} className="mb-6 text-muted-foreground">
          整数和浮点数对现实的表达方式截然不同。整数精确但有界；浮点数广阔但近似。当它们相互转换时，往往会发生意想不到的扭曲。
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="border border-border rounded-xl p-6 bg-card shadow-sm transition-all duration-300">
            <h3 className="font-medium text-lg text-foreground mb-2">A. 精确转换</h3>
            <p className="text-xs font-mono text-muted-foreground mb-4 bg-muted p-2 rounded inline-block">int32 (100) → float32 (100.0)</p>
            <p className="text-muted-foreground text-sm"><strong>原因：</strong> 整数 100 具有简单的二进制表示（1100100），可以轻松放入 32 位浮点数的 24 位尾数（有效数字）中。没有任何信息丢失。</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="border border-border rounded-xl p-6 bg-card shadow-sm transition-all duration-300">
            <h3 className="font-medium text-lg text-foreground mb-2">B. 精度丢失</h3>
            <p className="text-xs font-mono text-muted-foreground mb-4 bg-muted p-2 rounded inline-block">int32 (16777217) → float32 (16777216.0)</p>
            <p className="text-muted-foreground text-sm"><strong>原因：</strong> 32 位浮点数只有 24 位用于尾数。数字 16,777,217 需要 25 位才能精确表示。最低位被截断，导致系统在不报错的情况下默默丢失了精度。</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="border border-border rounded-xl p-6 bg-card shadow-sm transition-all duration-300">
            <h3 className="font-medium text-lg text-foreground mb-2">C. 溢出</h3>
            <p className="text-xs font-mono text-muted-foreground mb-4 bg-muted p-2 rounded inline-block">float64 (1e40) → int32 (未定义/极值)</p>
            <p className="text-muted-foreground text-sm"><strong>原因：</strong> 有符号 32 位整数的最大值约为 21.4 亿。像 1e40 这样的浮点数是天文数字。试图将其强制转换为 int32 会超出物理内存边界，导致溢出。</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="border border-border rounded-xl p-6 bg-card shadow-sm transition-all duration-300">
            <h3 className="font-medium text-lg text-foreground mb-2">D. 舍入</h3>
            <p className="text-xs font-mono text-muted-foreground mb-4 bg-muted p-2 rounded inline-block">float32 (3.14) → int32 (3)</p>
            <p className="text-muted-foreground text-sm"><strong>原因：</strong> 整数无法表示小数部分。将带有小数的浮点数转换为整数时，系统必须丢弃小数部分（截断）或四舍五入到最接近的整数。</p>
          </motion.div>
        </div>
      </section>

      <section>
        <motion.h2 variants={itemVariants} className="text-2xl font-semibold text-foreground mb-6">2. 设计更安全的系统</motion.h2>
        <motion.p variants={itemVariants} className="mb-6 text-muted-foreground">
          目前，系统在发生溢出或舍入时往往不会给出提示。如果需要设计一个能避免此类情况的系统，我们可以从以下几个层面采取措施：
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="border border-border rounded-xl p-6 bg-card shadow-sm transition-all duration-300">
            <h3 className="font-medium text-lg text-foreground mb-4 border-b border-border pb-3">CPU 层面</h3>
            <ul className="space-y-3 text-muted-foreground text-sm list-disc list-inside">
              <li><strong>硬件异常标志：</strong> 引入专门的硬件状态寄存器。如果转换导致位截断或溢出，自动触发硬件中断（Trap）。</li>
              <li><strong>动态位宽寄存器：</strong> 当算术运算溢出时，寄存器自动扩展（例如从 64 位扩展到 128 位），而不是发生环绕（Wrap-around）。</li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="border border-border rounded-xl p-6 bg-card shadow-sm transition-all duration-300">
            <h3 className="font-medium text-lg text-foreground mb-4 border-b border-border pb-3">操作系统层面</h3>
            <ul className="space-y-3 text-muted-foreground text-sm list-disc list-inside">
              <li><strong>严格的信号处理：</strong> 操作系统可以捕获硬件陷阱（如 SIGFPE），并在发生未处理的精度丢失时默认终止进程，强制开发者修复。</li>
              <li><strong>原生安全数学库：</strong> 在系统层提供任意精度算术（如 BigInt）的 API，作为关键应用的标准底层支持。</li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="border border-border rounded-xl p-6 bg-card shadow-sm transition-all duration-300">
            <h3 className="font-medium text-lg text-foreground mb-4 border-b border-border pb-3">编译器层面</h3>
            <ul className="space-y-3 text-muted-foreground text-sm list-disc list-inside">
              <li><strong>禁止隐式转换：</strong> 严格禁止浮点数和整数之间的隐式转换。要求开发者使用显式语法，并在其中注入运行时的边界检查代码。</li>
              <li><strong>静态代码分析：</strong> 编译器利用符号执行（Symbolic Execution）在编译期证明变量是否可能超出边界，若有风险则直接抛出编译错误。</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
