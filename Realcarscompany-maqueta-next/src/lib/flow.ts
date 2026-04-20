import CryptoJS from 'crypto-js';

export async function createFlowPayment(params: any) {
    const apiKey = process.env.FLOW_API_KEY;
    const secretKey = process.env.FLOW_SECRET_KEY;
    const url = process.env.FLOW_URL;

    if (!apiKey || !secretKey || !url) {
        throw new Error('Flow API keys not configured');
    }

    // Add mandatory params
    const flowParams = {
        apiKey,
        ...params,
    };

    // Sort keys alphabetically
    const keys = Object.keys(flowParams).sort();

    // Create signature string
    let signString = '';
    keys.forEach(key => {
        signString += `${key}${flowParams[key]}`;
    });

    // Calculate HMAC-SHA256 signature
    const signature = CryptoJS.HmacSHA256(signString, secretKey).toString();

    // Add signature to params
    const finalParams = new URLSearchParams();
    keys.forEach(key => finalParams.append(key, flowParams[key]));
    finalParams.append('s', signature);

    const response = await fetch(`${url}/payment/create`, {
        method: 'POST',
        body: finalParams,
    });

    return await response.json();
}

export async function getFlowPaymentStatus(token: string) {
    const apiKey = process.env.FLOW_API_KEY;
    const secretKey = process.env.FLOW_SECRET_KEY;
    const url = process.env.FLOW_URL;

    if (!apiKey || !secretKey || !url) {
        throw new Error('Flow API keys not configured');
    }

    const params: any = {
        apiKey,
        token
    };

    const keys = Object.keys(params).sort();
    let signString = '';
    keys.forEach(key => {
        signString += `${key}${params[key]}`;
    });

    const signature = CryptoJS.HmacSHA256(signString, secretKey).toString();

    const urlParams = new URLSearchParams();
    keys.forEach(key => urlParams.append(key, params[key]));
    urlParams.append('s', signature);

    const fullUrl = `${url}/payment/getStatus?${urlParams.toString()}`;

    const response = await fetch(fullUrl, {
        method: 'GET'
    });

    return await response.json();
}
