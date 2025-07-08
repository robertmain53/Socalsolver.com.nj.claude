import type { AppProps } from 'next/app'
import Head from 'next/head'
import { createContext, useContext, useState } from 'react'
import '../styles/globals.css'

// Theme Context for sunset coastal design
const ThemeContext = createContext({
  theme: 'sunset',
  setTheme: (theme: string) => {},
})

// Language Context for multi-language support
const LanguageContext = createContext({
  language: 'en',
  setLanguage: (lang: string) => {},
})

export const useTheme = () => useContext(ThemeContext)
export const useLanguage = () => useContext(LanguageContext)

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState('sunset')
  const [language, setLanguage] = useState('en')

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FFD166" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </Head>
      
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <Component {...pageProps} />
        </LanguageContext.Provider>
      </ThemeContext.Provider>
    </>
  )
}
