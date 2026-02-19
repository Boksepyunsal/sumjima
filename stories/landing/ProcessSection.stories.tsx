import type { Meta, StoryObj } from '@storybook/react';
import { ProcessSection } from '@/components/landing/process-section';

const meta = {
  title: 'Landing/ProcessSection',
  component: ProcessSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProcessSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
