import { useCallback, useEffect, useState } from 'react'
import Cursor from '@/components/Cursor'
import Intro from '@/components/Intro'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Manifesto from '@/components/Manifesto'
import ExperimentLab from '@/components/ExperimentLab'
import Projects from '@/components/Projects'
import Hackathons from '@/components/Hackathons'
import Workbench from '@/components/Workbench'
import Ribbon from '@/components/Ribbon'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Terminal from '@/components/Terminal'
import ReviewPage from '@/components/ReviewPage'
import { useFitHeadings, useRevealObserver } from '@/lib/motion'
import { initScroll, lockScroll, prefersReducedMotion, scrollToTarget } from '@/lib/scroll'

const reviewSlug = () => location.hash.match(/^#\/tested\/([\w-]+)$/)?.[1] ?? null

// The intro plays once per page load, not every time the home view remounts.
let introSeen = false

export default function App() {
  const [ready, setReady] = useState(introSeen)
  const [showIntro, setShowIntro] = useState(!introSeen)
  const [review, setReview] = useState<string | null>(() => reviewSlug())
  useRevealObserver()
  useFitHeadings()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    initScroll()
    if (!prefersReducedMotion()) lockScroll(true)
  }, [])

  // Once the intro has played, drop it when leaving the home view so it can't replay on return.
  useEffect(() => {
    if (review && introSeen) setShowIntro(false)
  }, [review])

  // Hash routing: #/tested/<slug> shows a review page; any other hash returns home.
  useEffect(() => {
    const onHash = () => {
      const slug = reviewSlug()
      setReview(slug)
      if (slug) {
        scrollToTarget(0, true)
        window.scrollTo(0, 0)
      } else {
        // wait for the home sections to remount before jumping to the target
        const id = location.hash.slice(1)
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            const el = id && id !== 'top' ? document.getElementById(id) : null
            scrollToTarget(el ? el.getBoundingClientRect().top + window.scrollY : 0, true)
          }),
        )
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const onIntroDone = useCallback(() => {
    introSeen = true
    setReady(true)
    lockScroll(false)
  }, [])

  if (review) {
    return (
      <>
        <Cursor />
        <ReviewPage slug={review} />
        <div aria-hidden className="grain" />
      </>
    )
  }

  return (
    <>
      {showIntro ? <Intro onDone={onIntroDone} /> : null}
      <Cursor />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Manifesto />
        <ExperimentLab />
        <Projects />
        <Hackathons />
        <Workbench />
        <Ribbon />
        <About />
        <Contact />
      </main>
      <Footer />
      <Terminal />
      <div aria-hidden className="grain" />
    </>
  )
}
