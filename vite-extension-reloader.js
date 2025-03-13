// vite-extension-reloader.js
import { exec } from 'child_process';
// import path from 'path';

/**
 * Vite plugin for automatically reloading browser extensions
 * @param {Object} options Plugin options
 * @param {string} options.browserType The browser to target ('chrome', 'firefox', 'edge')
 * @param {string} options.extensionId Optional extension ID (required for Edge)
 * @param {boolean} options.reloadOnHmr Whether to reload on Vite's HMR events
 * @returns {Object} Vite plugin
 */
export default function viteExtensionReloader(options = {}) {
  const {
    browserType = 'chrome',
    extensionId = '',
    reloadOnHmr = true
  } = options;

  // Map of browser types to reload commands
  const COMMAND_MAP = {
    'chrome': 'chrome-cli update',
    'firefox': 'web-ext reload',
    'edge': `msedge --reload-extension=${extensionId}`
  };

  // Ensure browser type is valid
  if (!Object.keys(COMMAND_MAP).includes(browserType)) {
    throw new Error(`Invalid browser type '${browserType}'. Valid options: ${Object.keys(COMMAND_MAP).join(', ')}`);
  }

  // Function to reload the extension
  const reloadExtension = () => {
    const command = COMMAND_MAP[browserType];
    
    // console.log('\n🔄 Extension change detected. Reloading...');
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error reloading extension: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`⚠️ Reload stderr: ${stderr}`);
      }
      // console.log(`✅ Extension reloaded successfully at ${new Date().toLocaleTimeString()}`);
      if (stdout) console.log(stdout);
    });
  };

  return {
    name: 'vite-extension-reloader',
    apply: 'build', // Apply this plugin during build
    
    configureServer(server) {
      if (reloadOnHmr) {
        // Reload extension when HMR update is sent
        server.hot.on('vite:afterUpdate', () => {
          reloadExtension();
        });
      }
    },
    
    // Reload on initial build completion
    writeBundle() {
      reloadExtension();
    }
  };
}

