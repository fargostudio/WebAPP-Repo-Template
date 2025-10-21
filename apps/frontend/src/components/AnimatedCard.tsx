import { motion } from 'framer-motion';

interface AnimatedCardProps {
  title: string;
  description: string;
  icon: string;
  delay?: number;
}

const AnimatedCard = ({ title, description, icon, delay = 0 }: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        y: -10,
        transition: { duration: 0.2 },
      }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

      <div className="relative glass p-8 rounded-2xl border-2 border-border hover:border-primary/50 transition-all duration-300 h-full">
        <motion.div
          className="text-6xl mb-4"
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {icon}
        </motion.div>

        <h3 className="text-2xl font-bold mb-3">{title}</h3>

        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>

        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500"
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default AnimatedCard;
