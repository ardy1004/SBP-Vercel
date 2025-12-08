// Structured error handling system
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error codes for consistent error handling
export const ERROR_CODES = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Database
  DATABASE_ERROR: 'DATABASE_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

  // External services
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',

  // File operations
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',

  // General
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

// Error response interface
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

// Success response interface
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

// Generic API response
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// Error logger with structured logging
export class ErrorLogger {
  static log(error: Error | AppError, context?: any) {
    const logData = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error instanceof AppError && {
          code: error.code,
          statusCode: error.statusCode,
          details: error.details,
        }),
      },
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    // In production, send to error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: send to Sentry, LogRocket, etc.
      console.error('[PRODUCTION ERROR]', logData);
    } else {
      console.error('[DEVELOPMENT ERROR]', logData);
    }
  }

  static logApiError(error: any, endpoint: string, method: string = 'GET') {
    this.log(error, { endpoint, method, type: 'API_ERROR' });
  }
}

// Helper function to create error responses
export function createErrorResponse(
  code: string,
  message: string,
  statusCode: number = 500,
  details?: any
): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    },
  };
}

// Helper function to create success responses
export function createSuccessResponse<T>(
  data: T,
  message?: string
): SuccessResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

// Async error wrapper for API routes
export function withErrorHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<ApiResponse<R>> => {
    try {
      const result = await fn(...args);
      return createSuccessResponse(result);
    } catch (error) {
      if (error instanceof AppError) {
        ErrorLogger.log(error);
        return createErrorResponse(error.code, error.message, error.statusCode, error.details);
      }

      // Handle unknown errors
      const appError = new AppError(
        'An unexpected error occurred',
        ERROR_CODES.INTERNAL_ERROR,
        500,
        false,
        error instanceof Error ? error.message : String(error)
      );

      ErrorLogger.log(appError);
      return createErrorResponse(appError.code, appError.message, appError.statusCode);
    }
  };
}

// Client-side error handler
export function handleClientError(error: any, context?: string) {
  if (error instanceof AppError) {
    ErrorLogger.log(error, { context, type: 'CLIENT_ERROR' });
    return error;
  }

  const appError = new AppError(
    error?.message || 'Client error occurred',
    ERROR_CODES.INTERNAL_ERROR,
    500,
    false,
    { originalError: error, context }
  );

  ErrorLogger.log(appError);
  return appError;
}