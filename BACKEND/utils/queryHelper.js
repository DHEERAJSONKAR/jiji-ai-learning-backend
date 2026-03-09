/**
 * Extract keywords from a query string
 * @param {string} query - User query
 * @returns {string[]} Array of keywords
 */
export const extractKeywords = (query) => {
  // Remove common stop words and return meaningful keywords
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'under', 'again',
    'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
    'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    'just', 'and', 'but', 'if', 'or', 'because', 'until', 'while', 'about',
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am',
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
    'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she',
    'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their',
    'theirs', 'themselves', 'learn', 'tell', 'explain', 'show', 'help',
  ]);

  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
};

/**
 * Generate a simple answer based on query and resources
 * @param {string} query - User query
 * @param {Array} resources - Found resources
 * @returns {string} Generated answer
 */
export const generateAnswer = (query, resources) => {
  if (resources.length === 0) {
    return `I couldn't find specific resources for "${query}". Try rephrasing your question or exploring different topics.`;
  }

  const resourceTypes = [...new Set(resources.map((r) => r.type))];
  const typeText = resourceTypes.join(' and ');
  
  return `I found ${resources.length} ${typeText} resource${resources.length > 1 ? 's' : ''} that can help you learn about this topic. Check out the resources below for detailed explanations and examples.`;
};
