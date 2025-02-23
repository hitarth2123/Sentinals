import { type ClassValue, clsx } from 'clsx'

import { twMerge } from 'tailwind-merge'
import qs from 'query-string'

import { UrlQueryParams, RemoveUrlQueryParams } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  }

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }

  const formattedDateTime: string = new Date(dateString).toLocaleString('en-US', dateTimeOptions)

  const formattedDate: string = new Date(dateString).toLocaleString('en-US', dateOptions)

  const formattedTime: string = new Date(dateString).toLocaleString('en-US', timeOptions)

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  }
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file)

export const formatPrice = (price: string) => {
  const amount = parseFloat(price)
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

  return formattedPrice
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

export function removeKeysFromQuery({ params, keysToRemove }: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params)

  keysToRemove.forEach(key => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

// Define error types
export type ErrorResponse = {
  message: string;
  type: 'SERVER_ERROR' | 'CLIENT_ERROR' | 'VALIDATION_ERROR' | 'UNKNOWN_ERROR';
  status?: number;
  details?: unknown;
}

// Function to check if an object is an API error response
export const isApiError = (error: unknown): error is { message: string; status: number } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
}

export const handleError = (error: unknown): ErrorResponse => {
  // Log the original error for debugging
  console.error('Original error:', error);

  let errorResponse: ErrorResponse = {
    message: 'An unexpected error occurred',
    type: 'UNKNOWN_ERROR',
    details: error
  };

  if (error instanceof Response) {
    errorResponse = {
      message: `Server error: ${error.status} ${error.statusText}`,
      type: 'SERVER_ERROR',
      status: error.status,
      details: error
    };
  } else if (isApiError(error)) {
    errorResponse = {
      message: error.message,
      type: error.status >= 500 ? 'SERVER_ERROR' : 'CLIENT_ERROR',
      status: error.status,
      details: error
    };
  } else if (error instanceof Error) {
    errorResponse = {
      message: error.message,
      type: 'CLIENT_ERROR',
      details: error
    };
  } else if (typeof error === 'string') {
    errorResponse = {
      message: error,
      type: 'CLIENT_ERROR',
      details: error
    };
  } else if (error && typeof error === 'object') {
    try {
      errorResponse = {
        message: JSON.stringify(error),
        type: 'UNKNOWN_ERROR',
        details: error
      };
    } catch {
      errorResponse = {
        message: 'Failed to stringify error object',
        type: 'UNKNOWN_ERROR',
        details: error
      };
    }
  }

  // Throw the structured error response
  throw errorResponse;
}

// Helper function to safely handle errors in async functions
export const tryCatch = async <T>(
  promise: Promise<T>
): Promise<[T | null, ErrorResponse | null]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error instanceof Error ? handleError(error) : handleError('Unknown error occurred')];
  }
}

