import { useEffect } from 'react'

/**
 * PageMetadata
 *
 * Sets <title> and meta description tags for the active page.
 */
export default function PageMetadata({ title, description }) {
  useEffect(() => {
    if (title) document.title = title
    if (description) {
      let el = document.querySelector('meta[name="description"]')
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('name', 'description')
        document.head.appendChild(el)
      }
      el.setAttribute('content', description)
    }
  }, [title, description])
  return null
}
