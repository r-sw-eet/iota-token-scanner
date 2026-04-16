import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ProjectLogo from '~/components/ProjectLogo.vue'

describe('ProjectLogo', () => {
  it('renders an img when the name is in the logo map', async () => {
    const wrapper = await mountSuspended(ProjectLogo, { props: { name: 'TLIP (Trade)' } })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/logos/tlip.svg')
  })

  it('falls back to initials when the name is not in the logo map', async () => {
    const wrapper = await mountSuspended(ProjectLogo, { props: { name: 'Unknown Project' } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toBe('UP')
  })

  it('builds initials from first letters of up to two words, skipping separators', async () => {
    const wrapper = await mountSuspended(ProjectLogo, { props: { name: 'foo (bar)/baz' } })
    expect(wrapper.text()).toBe('FB')
  })

  it('applies the lg size class when size=lg', async () => {
    const wrapper = await mountSuspended(ProjectLogo, { props: { name: 'X', size: 'lg' } })
    expect(wrapper.html()).toContain('w-16 h-16')
  })

  it('applies the sm size class when size=sm', async () => {
    const wrapper = await mountSuspended(ProjectLogo, { props: { name: 'X', size: 'sm' } })
    expect(wrapper.html()).toContain('w-8 h-8')
  })
})
