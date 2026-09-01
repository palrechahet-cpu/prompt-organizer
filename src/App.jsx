*** Begin Patch
*** Update File: src/App.jsx
@@
-import { useState, useEffect } from 'react'
+import { useState, useEffect } from 'react'
@@
-function ShareModal({ prompt, onClose }) {
-  const [copied, setCopied] = useState(false)
-  const shareUrl = (() => {
-    const encoded = btoa(encodeURIComponent(JSON.stringify({ title: prompt.title, category: prompt.category, prompt: prompt.prompt, tags: prompt.tags })))
-    const url = new URL(window.location.href)
-    url.search = ''
-    url.searchParams.set('share', encoded)
-    return url.toString()
-  })()
-  const copyLink = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }
-  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }
-  return (
-    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={handleBackdrop}>
-      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
-        <div className="flex items-center justify-between">
-          <div className="flex items-center gap-2"><span className="text-xl">🔗</span><h2 className="font-bold text-gray-900 dark:text-white text-lg">Share Prompt</h2></div>
-          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none transition-colors">✕</button>
-        </div>
-        <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 border border-gray-100 dark:border-zinc-700">
-          <p className="font-semibold text-gray-800 dark:text-white text-sm mb-1">{prompt.title}</p>
-          <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-2">{prompt.prompt}</p>
-        </div>
-        <div className="flex gap-2 items-center">
-          <input readOnly value={shareUrl} className="flex-1 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-gray-500 dark:text-gray-400[...]"
-          <button onClick={copyLink} className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${copied ? 'bg-green-500 text-white' : 'text[...]`}
-        </div>
-        <p className="text-xs text-gray-400 dark:text-gray-600 text-center">Anyone with this link can view and import this prompt.</p>
-      </div>
-    </div>
-  )
-}
+function ShareModal({ prompt, onClose, onCopyText }) {
+  const [copied, setCopied] = useState(false)
+  const shareUrlInfo = (() => {
+    const payload = JSON.stringify({ title: prompt.title, category: prompt.category, prompt: prompt.prompt, tags: prompt.tags })
+    const encoded = btoa(encodeURIComponent(payload))
+    const url = new URL(window.location.href)
+    url.search = ''
+    url.searchParams.set('share', encoded)
+    return { url: url.toString(), payload }
+  })()
+
+  const copyLink = async () => {
+    try {
+      await navigator.clipboard.writeText(shareUrlInfo.url)
+      setCopied(true)
+      setTimeout(() => setCopied(false), 2000)
+    } catch (err) {
+      // fallback: copy payload JSON
+      try {
+        await onCopyText(shareUrlInfo.payload)
+        setCopied(true)
+        setTimeout(() => setCopied(false), 2000)
+      } catch (e) {
+        console.error('Copy failed', e)
+      }
+    }
+  }
+
+  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }
+  return (
+    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={handleBackdrop}>
+      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
+        <div className="flex items-center justify-between">
+          <div className="flex items-center gap-2"><span className="text-xl">🔗</span><h2 className="font-bold text-gray-900 dark:text-white text-lg">Share Prompt</h2></div>
+          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none transition-colors">✕</button>
+        </div>
+        <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 border border-gray-100 dark:border-zinc-700">
+          <p className="font-semibold text-gray-800 dark:text-white text-sm mb-1">{prompt.title}</p>
+          <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-2">{prompt.prompt}</p>
+        </div>
+        <div className="flex gap-2 items-center">
+          <input readOnly value={shareUrlInfo.url} className="flex-1 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-gray-500 dark:text-gray-400[...]]" />
+          <button onClick={copyLink} className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${copied ? 'bg-green-500 text-white' : 'text[...]`}>Copy</button>
+        </div>
+        <p className="text-xs text-gray-400 dark:text-gray-600 text-center">Anyone with this link can view and import this prompt. If the link is too large, the prompt JSON will be copied instead.</p>
+      </div>
+    </div>
+  )
+}
*** End Patch
