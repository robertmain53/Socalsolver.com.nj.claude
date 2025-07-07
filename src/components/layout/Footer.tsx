import React from 'react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Calculators</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/calculators/finance">Finance</Link></li>
              <li><Link href="/calculators/math">Math</Link></li>
              <li><Link href="/calculators/science">Science</Link></li>
              <li><Link href="/calculators/health">Health</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Learn</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/learn/concepts">Concepts</Link></li>
              <li><Link href="/learn/tutorials">Tutorials</Link></li>
              <li><Link href="/learn/challenges">Challenges</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/api">API</Link></li>
              <li><Link href="/embed">Embed</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/help">Help</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Calculator Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
