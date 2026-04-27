import { PrismaClient } from '@prisma/client';
import { getFlowPaymentStatus } from './src/lib/flow.ts'; // wait, no, I'll copy the getFlowPaymentStatus logic or just use flowService directly.

// Flow API logic
import crypto from 'crypto';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const apiKey = process.env.FLOW_API_KEY || '';
const secretKey = process.env.FLOW_SECRET_KEY || '';
const apiUrl = process.env.FLOW_API_URL || 'https://sandbox.flow.cl/api';

function sign(params) {
    const keys = Object.keys(params).sort();
    const toSign = keys.map(key => `${key}${params[key]}`).join('');
    return crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
}

async function getStatus(token) {
    const params = { apiKey, token };
    const s = sign(params);
    const url = `${apiUrl}/payment/getStatus?apiKey=${apiKey}&token=${token}&s=${s}`;
    
    console.log('Fetching:', url);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error: ${await response.text()}`);
    }
    return await response.json();
}

async function main() {
    // get the token for the order somehow? We don't have the token.
    // Flow webhook sends the token, but we don't save the token in DB.
    // However, we can use the `payment/getStatusByCommerceId` endpoint in Flow if we know the orderId!
    
    const commerceId = 'RC-V0D8M16O8';
    const params = { apiKey, commerceId };
    const s = sign(params);
    const url = `${apiUrl}/payment/getStatusByCommerceId?apiKey=${apiKey}&commerceId=${commerceId}&s=${s}`;
    
    console.log('Fetching by commerceId:', url);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error: ${await response.text()}`);
    }
    const status = await response.json();
    console.log('Status:', status);
}

main().catch(console.error).finally(() => prisma.$disconnect());
