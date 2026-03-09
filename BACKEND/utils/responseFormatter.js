/**
 * Format the response for the ask-jiji endpoint
 * @param {string} answer - The text explanation
 * @param {Array} resources - Array of resource objects
 * @returns {Object} Formatted response
 */
export const formatJijiResponse = (answer, resources = []) => {
  return {
    answer,
    resources: resources.map((resource) => ({
      title: resource.title,
      type: resource.type,
      url: resource.file_url,
    })),
  };
};

/**
 * Format success response
 * @param {Object} data - Response data
 * @param {string} message - Optional success message
 * @returns {Object} Formatted success response
 */
export const successResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Format error response
 * @param {string} error - Error message
 * @param {Object} details - Optional error details
 * @returns {Object} Formatted error response
 */
export const errorResponse = (error, details = null) => {
  return {
    success: false,
    error,
    ...(details && { details }),
  };
};
