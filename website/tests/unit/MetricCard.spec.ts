import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MetricCard from '~/components/MetricCard.vue'

describe('MetricCard', () => {
  it('renders label, value, and subtitle', async () => {
    const wrapper = await mountSuspended(MetricCard, {
      props: { label: 'Active users', value: '1,234', subtitle: 'last 24h' },
    })
    expect(wrapper.text()).toContain('Active users')
    expect(wrapper.text()).toContain('1,234')
    expect(wrapper.text()).toContain('last 24h')
  })

  it('omits subtitle when not provided', async () => {
    const wrapper = await mountSuspended(MetricCard, {
      props: { label: 'Active users', value: '1,234' },
    })
    expect(wrapper.text()).not.toContain('last 24h')
  })
})
