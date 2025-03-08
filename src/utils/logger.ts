/**
 * Custom logger with colored output and timestamps
 */
export const logger = {
    info: (message: string, ...args: unknown[]) => {
      console.log(
        `%c[INFO][${new Date().toISOString()}] ${message}`, 
        'color: #0284c7', 
        ...args
      );
    },
    
    warn: (message: string, ...args: unknown[]) => {
      console.log(
        `%c[WARN][${new Date().toISOString()}] ${message}`, 
        'color: #f59e0b; font-weight: bold', 
        ...args
      );
    },
    
    error: (message: string, ...args: unknown[]) => {
      console.log(
        `%c[ERROR][${new Date().toISOString()}] ${message}`, 
        'color: #dc2626; font-weight: bold', 
        ...args
      );
    },
    
    success: (message: string, ...args: unknown[]) => {
      console.log(
        `%c[SUCCESS][${new Date().toISOString()}] ${message}`, 
        'color: #059669; font-weight: bold', 
        ...args
      );
    }
  };