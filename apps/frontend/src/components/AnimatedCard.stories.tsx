import type { Meta, StoryObj } from '@storybook/react';
import AnimatedCard from './AnimatedCard';

const meta = {
  title: 'Components/AnimatedCard',
  component: AnimatedCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AnimatedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Design Moderno',
    description: 'Interfacce pulite e moderne con attenzione ai dettagli',
    icon: '✨',
    delay: 0,
  },
};

export const WithAnimation: Story = {
  args: {
    title: 'Animazioni Fluide',
    description: 'Transizioni naturali con Framer Motion e GSAP',
    icon: '🎬',
    delay: 0.2,
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      <AnimatedCard
        title="Design Moderno"
        description="Interfacce pulite e moderne"
        icon="✨"
        delay={0}
      />
      <AnimatedCard
        title="Animazioni Fluide"
        description="Transizioni naturali"
        icon="🎬"
        delay={0.1}
      />
      <AnimatedCard
        title="3D & WebGL"
        description="Effetti tridimensionali"
        icon="🌊"
        delay={0.2}
      />
    </div>
  ),
};
