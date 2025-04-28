import { createRoot } from 'react-dom/client';
import vkBridge from '@vkontakte/vk-bridge';
import { AppConfig } from './AppConfig.js';

// Initialize VK Mini App
vkBridge.send('VKWebAppInit');

createRoot(document.getElementById('root')).render(<AppConfig />);

// Enable development tools in development mode
// if (import.meta.env.MODE === 'development') {
//   import('./eruda.js');
// }
