import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ClaimCard from '~/components/ClaimCard.vue'

describe('ClaimCard', () => {
  it('renders title, claimed, and reality', async () => {
    const wrapper = await mountSuspended(ClaimCard, {
      props: {
        title: 'Weekly Storage',
        claimed: '5.8M IOTA',
        reality: '100 IOTA',
      },
    })
    expect(wrapper.text()).toContain('Weekly Storage')
    expect(wrapper.text()).toContain('5.8M IOTA')
    expect(wrapper.text()).toContain('100 IOTA')
  })

  it('omits the ratio/verdict footer when neither is provided', async () => {
    const wrapper = await mountSuspended(ClaimCard, {
      props: { title: 'X', claimed: 'a', reality: 'b' },
    })
    expect(wrapper.text()).not.toContain('Overstatement')
  })

  it('shows ratio when provided', async () => {
    const wrapper = await mountSuspended(ClaimCard, {
      props: { title: 'X', claimed: 'a', reality: 'b', ratio: '58x overstated' },
    })
    expect(wrapper.text()).toContain('Overstatement')
    expect(wrapper.text()).toContain('58x overstated')
  })

  it('shows verdict when provided', async () => {
    const wrapper = await mountSuspended(ClaimCard, {
      props: { title: 'X', claimed: 'a', reality: 'b', verdict: 'Not even close.' },
    })
    expect(wrapper.text()).toContain('Not even close.')
  })
})
