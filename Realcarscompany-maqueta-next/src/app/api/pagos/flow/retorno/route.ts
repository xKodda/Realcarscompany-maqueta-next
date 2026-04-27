import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const url = new URL(req.url);
    const ordenId = url.searchParams.get('orden');

    if (!ordenId) {
        return NextResponse.redirect(new URL('/', req.url), 303);
    }

    // 303 See Other is crucial here to convert the POST request from Flow
    // into a GET request when redirecting to the Next.js page.
    return NextResponse.redirect(new URL(`/pago/exito?orden=${ordenId}`, req.url), 303);
}

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const ordenId = url.searchParams.get('orden');

    if (!ordenId) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.redirect(new URL(`/pago/exito?orden=${ordenId}`, req.url));
}
