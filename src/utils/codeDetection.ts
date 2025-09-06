// utils/codeDetection.ts

export interface CodePattern {
    language: string
    patterns: RegExp[]
    keywords: string[]
    extensions: string[]
  }
  
  // Define code patterns for different languages
  const codePatterns: CodePattern[] = [
    {
      language: 'javascript',
      patterns: [
        /function\s+\w+\s*\(/,
        /const\s+\w+\s*=/,
        /let\s+\w+\s*=/,
        /var\s+\w+\s*=/,
        /=>\s*{/,
        /console\.log\(/,
        /require\(['"`]/,
        /import\s+.*from/,
        /export\s+(default\s+)?/
      ],
      keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'import', 'export'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    {
      language: 'python',
      patterns: [
        /def\s+\w+\s*\(/,
        /import\s+\w+/,
        /from\s+\w+\s+import/,
        /if\s+__name__\s*==\s*['"`]__main__['"`]/,
        /print\s*\(/,
        /class\s+\w+/,
        /^\s*#.*$/m
      ],
      keywords: ['def', 'class', 'import', 'from', 'if', 'elif', 'else', 'for', 'while', 'return', 'try', 'except'],
      extensions: ['.py', '.pyw']
    },
    {
      language: 'java',
      patterns: [
        /public\s+class\s+\w+/,
        /public\s+static\s+void\s+main/,
        /System\.out\.println/,
        /private\s+\w+\s+\w+/,
        /public\s+\w+\s+\w+\s*\(/,
        /import\s+java\./
      ],
      keywords: ['public', 'private', 'protected', 'class', 'interface', 'static', 'void', 'int', 'String'],
      extensions: ['.java']
    },
    {
      language: 'cpp',
      patterns: [
        /#include\s*<.*>/,
        /int\s+main\s*\(/,
        /std::/,
        /cout\s*<</, 
        /cin\s*>>/,
        /using\s+namespace\s+std/
      ],
      keywords: ['#include', 'int', 'char', 'float', 'double', 'void', 'class', 'public', 'private', 'protected'],
      extensions: ['.cpp', '.cc', '.cxx', '.c++', '.c']
    },
    {
      language: 'html',
      patterns: [
        /<html.*?>/,
        /<head.*?>/,
        /<body.*?>/,
        /<div.*?>/,
        /<script.*?>/,
        /<style.*?>/,
        /<!DOCTYPE\s+html>/i
      ],
      keywords: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'script', 'style'],
      extensions: ['.html', '.htm']
    },
    {
      language: 'css',
      patterns: [
        /\w+\s*{[^}]*}/,
        /\.\w+\s*{/,
        /#\w+\s*{/,
        /@media\s+/,
        /background-color:/,
        /font-family:/
      ],
      keywords: ['color', 'background', 'font', 'margin', 'padding', 'border', 'width', 'height'],
      extensions: ['.css', '.scss', '.sass', '.less']
    },
    {
      language: 'sql',
      patterns: [
        /SELECT\s+.*\s+FROM/i,
        /INSERT\s+INTO/i,
        /UPDATE\s+.*\s+SET/i,
        /DELETE\s+FROM/i,
        /CREATE\s+TABLE/i,
        /ALTER\s+TABLE/i
      ],
      keywords: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP'],
      extensions: ['.sql']
    },
    {
      language: 'json',
      patterns: [
        /^\s*{[\s\S]*}$/,
        /^\s*\[[\s\S]*\]$/,
        /"[\w-]+"\s*:\s*"[^"]*"/,
        /"[\w-]+"\s*:\s*\d+/,
        /"[\w-]+"\s*:\s*(true|false|null)/
      ],
      keywords: [],
      extensions: ['.json']
    },
    {
      language: 'xml',
      patterns: [
        /<\?xml.*?\?>/,
        /<\w+.*?>[\s\S]*?<\/\w+>/,
        /<\w+.*?\/>/
      ],
      keywords: [],
      extensions: ['.xml']
    }
  ]
  
  export function detectCodeLanguage(text: string, filename?: string): {
    isCode: boolean
    language: string | null
    confidence: number
  } {
    const cleanText = text.trim()
    
    // Check if it's likely not code (too short or looks like natural language)
    if (cleanText.length < 10) {
      return { isCode: false, language: null, confidence: 0 }
    }
  
    // Check by file extension first
    if (filename) {
      const ext = '.' + filename.split('.').pop()?.toLowerCase()
      for (const pattern of codePatterns) {
        if (pattern.extensions.includes(ext)) {
          return { isCode: true, language: pattern.language, confidence: 0.9 }
        }
      }
    }
  
    // Score each language based on pattern matches
    const scores: { [key: string]: number } = {}
    let maxScore = 0
    let bestLanguage = null
  
    for (const pattern of codePatterns) {
      let score = 0
      
      // Check regex patterns
      for (const regex of pattern.patterns) {
        if (regex.test(cleanText)) {
          score += 2
        }
      }
      
      // Check keywords (case-insensitive for most, case-sensitive for others)
      const words = cleanText.toLowerCase().split(/\W+/)
      for (const keyword of pattern.keywords) {
        const keywordLower = keyword.toLowerCase()
        if (words.includes(keywordLower)) {
          score += 1
        }
      }
  
      scores[pattern.language] = score
  
      if (score > maxScore) {
        maxScore = score
        bestLanguage = pattern.language
      }
    }
  
    // Calculate confidence based on score
    const confidence = Math.min(maxScore / 5, 1) // Normalize to 0-1
  
    // Determine if it's code based on confidence threshold
    const isCode = confidence >= 0.3 || maxScore >= 2
  
    return {
      isCode,
      language: isCode ? bestLanguage : null,
      confidence
    }
  }
  
  // Additional helper functions
  export function getLanguageDisplayName(language: string): string {
    const displayNames: { [key: string]: string } = {
      javascript: 'JavaScript',
      python: 'Python',
      java: 'Java',
      cpp: 'C++',
      html: 'HTML',
      css: 'CSS',
      sql: 'SQL',
      json: 'JSON',
      xml: 'XML',
      typescript: 'TypeScript',
      php: 'PHP',
      ruby: 'Ruby',
      go: 'Go',
      rust: 'Rust',
      kotlin: 'Kotlin',
      swift: 'Swift'
    }
    
    return displayNames[language] || language.charAt(0).toUpperCase() + language.slice(1)
  }
  
  export function isLikelyCode(text: string): boolean {
    // Quick heuristics for code detection
    const codeIndicators = [
      /[{}();]/g, // Common code symbols
      /function|class|def|public|private/i, // Common keywords
      /import|include|require/i, // Import statements
      /console\.log|print|echo/i, // Output statements
      /=>\s*{|=\s*function/i, // Arrow functions, function assignments
    ]
  
    let matches = 0
    for (const indicator of codeIndicators) {
      if (indicator.test(text)) {
        matches++
      }
    }
  
    return matches >= 2 || text.split('\n').length > 5 && matches >= 1
  }
  
  export function formatCodeForDisplay(code: string, language: string): string {
    // Remove excessive whitespace but preserve indentation
    const lines = code.split('\n')
    const nonEmptyLines = lines.filter(line => line.trim())
    
    if (nonEmptyLines.length === 0) return code
  
    // Find minimum indentation
    const minIndent = Math.min(
      ...nonEmptyLines.map(line => line.match(/^\s*/)?.[0].length || 0)
    )
  
    // Remove common leading whitespace
    return lines
      .map(line => line.slice(minIndent))
      .join('\n')
      .trim()
  }