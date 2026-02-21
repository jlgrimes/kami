import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'paper',
      values: [
        { name: 'paper', value: '#f8f4ef' },
        { name: 'dark', value: '#0e0c1a' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
};

export default preview;
