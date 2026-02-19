import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '@/components/header';

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  globals: {
    authState: 'loggedOut',
  },
};

export const LoggedIn: Story = {
  globals: {
    authState: 'loggedIn',
  },
};
