import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'RealCars Company - Automotora Premium'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #0F1226, #161b39, #2C0B0C)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* Decorative elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-150px',
                        right: '-100px',
                        width: '600px',
                        height: '600px',
                        background: 'rgba(128, 34, 35, 0.15)',
                        filter: 'blur(100px)',
                        borderRadius: '50%',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-150px',
                        left: '-100px',
                        width: '500px',
                        height: '500px',
                        background: 'rgba(29, 36, 71, 0.4)',
                        filter: 'blur(80px)',
                        borderRadius: '50%',
                    }}
                />

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                    {/* Logo Text Emulation */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <img
                            src="https://realcarscompany.cl/images/brand/realcarscompanylogo.png"
                            width="400"
                            height="140"
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '24px',
                    color: 'rgba(255,255,255,0.7)',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                }}>
                    www.realcarscompany.cl
                </div>
            </div>
        ),
        // ImageResponse options
        {
            // For convenience, we can re-use the exported opengraph-image size config
            ...size,
        }
    )
}
