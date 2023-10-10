/**
 * Levels - RFC 5424
 ** Code: 0 - Severity: Emergency ( System is unusable)
 ** Code: 1 - Severity: Alert (Action must be taken immediately)
 ** Code: 2 - Severity: Critical (Critical conditions)
 ** Code: 3 - Severity: Error (Error conditions)
 ** Code: 4 - Severity: Warning (Warning conditions)
 ** Code: 5 - Severity: Notice (Normal but significant condition)
 ** Code: 6 - Severity: Informational (Informational messages)
 ** Code: 7 - Severity: Debug (Debug-level messages)
 */
 export enum Levels {
    EMERGENCY = 'emergency',
    ALERT = 'alert',
    CRITICAL = 'critical',
    ERROR = 'error',
    WARNING = 'warn',
    NOTICE = 'notice',
    INFO = 'info',
    DEBUG = 'debug',
  }
  
  export const colors = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m',
  };
  
  export const colorLevel = {
    [Levels.EMERGENCY]: colors.red,
    [Levels.ALERT]: colors.red,
    [Levels.CRITICAL]: colors.red,
    [Levels.ERROR]: colors.red,
    [Levels.WARNING]: colors.yellow,
    [Levels.NOTICE]: colors.blue,
    [Levels.INFO]: colors.green,
    [Levels.DEBUG]: colors.white,
  };
  
  export const customLevels = {
    [Levels.EMERGENCY]: 0,
    [Levels.ALERT]: 1,
    [Levels.CRITICAL]: 2,
    [Levels.ERROR]: 3,
    [Levels.WARNING]: 4,
    [Levels.NOTICE]: 5,
    [Levels.INFO]: 6,
    [Levels.DEBUG]: 7,
  };
  
  export const LOGGER_OPTIONS = 'LOGGER_OPTIONS';
  
  