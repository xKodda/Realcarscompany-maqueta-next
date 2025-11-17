'use client'

import dynamic from 'next/dynamic'

const HeroSlider = dynamic(() => import('@/components/HeroSlider'), {
  loading: () => (
    <div className="h-[85vh] md:h-[72vh] min-h-[500px] md:min-h-[520px] bg-gradient-to-br from-[#0A0F2C] via-[#141A36] to-[#541313]" />
  ),
  ssr: false,
})

export default function HeroSliderWrapper() {
  return <HeroSlider />
}

