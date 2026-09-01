*** Begin Patch
*** Update File: src/components/AddPromptForm.jsx
@@
-import { useState, useRef } from 'react'
+import { useState, useRef } from 'react'
+import Papa from 'papaparse'
@@
-export default function AddPromptForm({ onAdd, onBulkAdd }) {
+export default function AddPromptForm({ onAdd, onBulkAdd, extraCategories = [] }) {
@@
-  const categories = ['Research', 'Writing', 'AI', 'Productivity', 'Education', 'Creative', 'Health & Fitness', 'Tech & Coding', 'Social Media', 'Product & Strategy', 'Ideation & Brainstorm']
+  const defaultCategories = ['Research', 'Writing', 'AI', 'Productivity', 'Education', 'Creative', 'Health & Fitness', 'Tech & Coding', 'Social Media', 'Product & Strategy', 'Ideation & Brainstorm']
+  const categories = Array.from(new Set([...defaultCategories, ...extraCategories]))
@@
-  const handleCSVFile = (e) => {
-    const file = e.target.files[0]
-    if (!file) return
-    const reader = new FileReader()
-    reader.onload = (ev) => {
-      try {
-        const lines = ev.target.result.split('\n').filter(Boolean)
-        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
-        const items = lines.slice(1).map(line => {
-          const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
-          const obj = {}
-          headers.forEach((h, i) => { obj[h] = values[i] || '' })
-          return obj
-        })
-        processPrompts(items)
-      } catch { setImportError('Invalid CSV file.') }
-    }
-    reader.readAsText(file)
-  }
+  const handleCSVFile = (e) => {
+    const file = e.target.files[0]
+    if (!file) return
+    Papa.parse(file, {
+      header: true,
+      skipEmptyLines: true,
+      transformHeader: (h) => h.trim().toLowerCase(),
+      complete: (results) => {
+        if (results && results.data) processPrompts(results.data)
+        else setImportError('Invalid CSV file.')
+      },
+      error: () => setImportError('Invalid CSV file.')
+    })
+  }
@@
-    try {
-      const lines = text.split('\n').filter(Boolean)
-      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
-      if (headers.includes('title') && headers.includes('prompt')) {
-        const items = lines.slice(1).map(line => {
-          const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
-          const obj = {}
-          headers.forEach((h, i) => { obj[h] = values[i] || '' })
-          return obj
-        })
-        processPrompts(items); return
-      }
-    } catch {}
-    setImportError('Could not parse content. Please use valid JSON or CSV format.')
+    // Try JSON first
+    try { const parsed = JSON.parse(text); processPrompts(Array.isArray(parsed) ? parsed : [parsed]); return } catch {}
+    // Try CSV via Papa.parse (from string)
+    Papa.parse(text, {
+      header: true,
+      skipEmptyLines: true,
+      transformHeader: (h) => h.trim().toLowerCase(),
+      complete: (results) => {
+        if (results && results.data && results.data.length > 0) processPrompts(results.data)
+        else setImportError('Could not parse content. Please use valid JSON or CSV format.')
+      },
+      error: () => setImportError('Could not parse content. Please use valid JSON or CSV format.')
+    })
   }
*** End Patch
