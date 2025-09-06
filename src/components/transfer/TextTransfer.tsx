// components/transfer/TextTransfer.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Send, 
  Copy, 
  Check, 
  Code, 
  Type, 
  Loader2, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import { useRealtime } from '@/lib/realtime'
import { detectCodeLanguage, getLanguageDisplayName, formatCodeForDisplay } from '@/utils/codeDetection'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface TextTransferProps {
  sessionKey?: string
  className?: string
}

export default function TextTransfer({ sessionKey, className }: TextTransferProps) {
  const { sendTransfer, loading: realtimeLoading } = useRealtime(sessionKey)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [detection, setDetection] = useState<{
    isCode: boolean
    language: string | null
    confidence: number
  }>({ isCode: false, language: null, confidence: 0 })
  const [manualCodeMode, setManualCodeMode] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Real-time code detection
  useEffect(() => {
    if (text.trim().length > 10) {
      const result = detectCodeLanguage(text)
      setDetection(result)
      
      // Auto-enable code mode if confidence is high
      if (result.confidence > 0.7 && result.isCode) {
        setManualCodeMode(true)
      }
    } else {
      setDetection({ isCode: false, language: null, confidence: 0 })
    }
  }, [text])

  const handleSend = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to send')
      return
    }

    setSending(true)

    try {
      const transferType = (detection.isCode || manualCodeMode) ? 'code' : 'text'
      const content = transferType === 'code' ? formatCodeForDisplay(text, detection.language || 'plain') : text

      await sendTransfer({
        type: transferType,
        content,
        metadata: {
          language: detection.language,
          confidence: detection.confidence,
          manual_code_mode: manualCodeMode,
          character_count: text.length,
          line_count: text.split('\n').length
        },
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      })

      toast.success(`${transferType === 'code' ? 'Code' : 'Text'} sent successfully!`)
      setText('')
      setManualCodeMode(false)
      setPreviewMode(false)
    } catch (error: any) {
      toast.error('Failed to send: ' + error.message)
    } finally {
      setSending(false)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setText(text)
      toast.success('Text pasted from clipboard')
    } catch (error) {
      toast.error('Failed to access clipboard')
    }
  }

  const toggleCodeMode = () => {
    setManualCodeMode(!manualCodeMode)
  }

  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {(detection.isCode || manualCodeMode) ? (
                <Code className="w-5 h-5 text-blue-600" />
              ) : (
                <Type className="w-5 h-5 text-green-600" />
              )}
              Send Text or Code
            </CardTitle>
            <CardDescription>
              Type or paste your content. Code will be automatically detected.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePaste}
              className="text-xs"
            >
              <Copy className="w-3 h-3 mr-1" />
              Paste
            </Button>
            {text.trim() && (
              <Button
                variant="outline"
                size="sm"
                onClick={togglePreview}
                className="text-xs"
              >
                {previewMode ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
            )}
          </div>
        </div>

        {/* Detection Info */}
        {text.trim() && (
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant={detection.isCode ? "default" : "secondary"}>
              {detection.isCode ? 'Code Detected' : 'Text Mode'}
            </Badge>
            
            {detection.language && (
              <Badge variant="outline">
                {getLanguageDisplayName(detection.language)} 
                ({Math.round(detection.confidence * 100)}%)
              </Badge>
            )}

            <Badge variant="outline" className="text-xs">
              {text.length} chars, {text.split('\n').length} lines
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCodeMode}
              className="text-xs h-6"
            >
              <Code className="w-3 h-3 mr-1" />
              {manualCodeMode ? 'Text Mode' : 'Code Mode'}
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input/Preview Area */}
        <div className="relative">
          {previewMode ? (
            <div className="min-h-32 max-h-96 overflow-y-auto border rounded-md p-3 bg-gray-50">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {(detection.isCode || manualCodeMode) ? formatCodeForDisplay(text, detection.language || 'plain') : text}
              </pre>
            </div>
          ) : (
            <Textarea
              placeholder="Type or paste your text/code here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={cn(
                "min-h-32 max-h-96 resize-none",
                (detection.isCode || manualCodeMode) && "font-mono text-sm"
              )}
              disabled={sending}
            />
          )}
        </div>

        {/* Confidence Alert */}
        {detection.isCode && detection.confidence > 0.5 && !manualCodeMode && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This looks like {getLanguageDisplayName(detection.language || 'code')} code. 
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal underline ml-1"
                onClick={toggleCodeMode}
              >
                Switch to code mode
              </Button>
              for better formatting.
            </AlertDescription>
          </Alert>
        )}

        {/* Send Button */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {sessionKey ? (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Session: {sessionKey.slice(-8)}
              </span>
            ) : (
              'Sending to your other devices'
            )}
          </div>

          <Button
            onClick={handleSend}
            disabled={!text.trim() || sending || realtimeLoading}
            className="min-w-24"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Syntax Highlighting Component (using Prism.js patterns)
export function SyntaxHighlighter({ 
  code, 
  language, 
  className 
}: { 
  code: string
  language: string
  className?: string 
}) {
  // Simple syntax highlighting for common patterns
  const highlightCode = (code: string, lang: string) => {
    if (!lang) return code

    const highlighted = code
    
    // Basic highlighting patterns
    const patterns = {
      javascript: [
        { pattern: /\b(function|const|let|var|if|else|for|while|return|import|export|class|extends)\b/g, class: 'keyword' },
        { pattern: /\/\/.*$/gm, class: 'comment' },
        { pattern: /\/\*[\s\S]*?\*\//g, class: 'comment' },
        { pattern: /'([^'\\]|\\.)*'/g, class: 'string' },
        { pattern: /"([^"\\]|\\.)*"/g, class: 'string' },
        { pattern: /`([^`\\]|\\.)*`/g, class: 'string' },
      ],
      python: [
        { pattern: /\b(def|class|import|from|if|elif|else|for|while|return|try|except|with|as)\b/g, class: 'keyword' },
        { pattern: /#.*$/gm, class: 'comment' },
        { pattern: /'([^'\\]|\\.)*'/g, class: 'string' },
        { pattern: /"([^"\\]|\\.)*"/g, class: 'string' },
      ]
    }

    return highlighted
  }

  return (
    <pre className={cn("overflow-x-auto p-4 bg-gray-900 text-gray-100 rounded-md text-sm", className)}>
      <code className={`language-${language}`}>
        {code}
      </code>
    </pre>
  )
}