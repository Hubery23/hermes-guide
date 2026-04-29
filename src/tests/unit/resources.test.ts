import { describe, it, expect } from 'vitest'
import { resources, RESOURCE_CATEGORIES, CATEGORY_CONFIG } from '@/data/resources'

describe('resources data integrity', () => {
  it('every resource has required non-empty fields', () => {
    for (const r of resources) {
      expect(r.title.length, `title empty: ${JSON.stringify(r)}`).toBeGreaterThan(0)
      expect(r.url.length, `url empty: ${r.title}`).toBeGreaterThan(0)
      expect(r.desc.length, `desc empty: ${r.title}`).toBeGreaterThan(0)
      expect(r.descEn.length, `descEn empty: ${r.title}`).toBeGreaterThan(0)
      expect(r.tags.length, `tags empty: ${r.title}`).toBeGreaterThan(0)
    }
  })

  it('every resource url starts with https://', () => {
    for (const r of resources) {
      expect(r.url, `bad url: ${r.title}`).toMatch(/^https:\/\//)
    }
  })

  it('every resource has a valid category', () => {
    const valid = new Set(RESOURCE_CATEGORIES)
    for (const r of resources) {
      expect(valid.has(r.category), `invalid category "${r.category}" on: ${r.title}`).toBe(true)
    }
  })

  it('CATEGORY_CONFIG covers all categories', () => {
    for (const cat of RESOURCE_CATEGORIES) {
      expect(CATEGORY_CONFIG[cat], `missing config for: ${cat}`).toBeDefined()
      expect(CATEGORY_CONFIG[cat].iconSvg.length).toBeGreaterThan(0)
    }
  })

  it('total resource count is 15', () => {
    expect(resources).toHaveLength(15)
  })
})
