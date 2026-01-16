export const BRAND_MODELS: Record<string, string[]> = {
    'Aston Martin': ['DB11', 'DBX', 'Vantage', 'DBS', 'Valhalla', 'Valkyrie'],
    'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'R8', 'e-tron', 'e-tron GT', 'RS3', 'RS5', 'RS6', 'RS7', 'RS Q8'],
    'Bentley': ['Bentayga', 'Continental GT', 'Flying Spur', 'Bacalar'],
    'BMW': ['Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5', 'Serie 7', 'Serie 8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'XM', 'Z4', 'M2', 'M3', 'M4', 'M5', 'M8', 'i4', 'iX'],
    'Cadillac': ['Escalade', 'CT4', 'CT5', 'XT4', 'XT5', 'XT6', 'Lyriq'],
    'Ferrari': ['296 GTB', '296 GTS', 'SF90 Stradale', 'SF90 Spider', 'Roma', 'Portofino M', 'F8 Tributo', 'F8 Spider', '812 GTS', '812 Competizione', 'Daytona SP3', 'Purosangue'],
    'Ford': ['Mustang', 'F-150', 'F-150 Raptor', 'Bronco', 'Bronco Sport', 'Explorer', 'Edge', 'Territory', 'Ranger', 'Maverick'],
    'Jaguar': ['F-PACE', 'E-PACE', 'I-PACE', 'F-TYPE', 'XE', 'XF'],
    'Jeep': ['Wrangler', 'Grand Cherokee', 'Gladiator', 'Compass', 'Renegade', 'Wagoneer', 'Grand Wagoneer'],
    'Lamborghini': ['Urus', 'Urus Performante', 'Urus S', 'Huracán EVO', 'Huracán Tecnica', 'Huracán Sterrato', 'Revuelto', 'Aventador'],
    'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque'],
    'Lexus': ['UX', 'NX', 'RX', 'GX', 'LX', 'IS', 'ES', 'LS', 'LC', 'RC'],
    'Maserati': ['Grecale', 'Levante', 'Ghibli', 'Quattroporte', 'MC20', 'MC20 Cielo', 'GranTurismo'],
    'McLaren': ['Artura', '720S', '765LT', 'GT', '750S', 'Senna', 'Elva', 'Speedtail'],
    'Mercedes-Benz': ['Clase A', 'Clase C', 'Clase E', 'Clase S', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'Clase G', 'AMG GT', 'SL', 'EQA', 'EQB', 'EQE', 'EQS'],
    'Porsche': ['911', 'Cayenne', 'Cayenne Coupé', 'Macan', 'Panamera', 'Taycan', '718 Cayman', '718 Boxster', '718 Spyder'],
    'Range Rover': ['Vogue', 'Autobiography', 'Sport', 'Velar', 'Evoque'], // Often treated as separate brand in this list
    'Rolls-Royce': ['Phantom', 'Ghost', 'Cullinan', 'Wraith', 'Dawn', 'Spectre'],
    'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
    'Volvo': ['XC40', 'XC60', 'XC90', 'C40', 'S60', 'S90', 'V60', 'V90', 'EX30', 'EX90']
}

export const COMMON_FEATURES = [
    'Aire Acondicionado',
    'Climatizador Dual',
    'Asientos de Cuero',
    'Asientos Calefaccionados',
    'Asientos Ventilados',
    'Techo Panorámico',
    'Sunroof',
    'Apple CarPlay',
    'Android Auto',
    'Sistema de Navegación (GPS)',
    'Bluetooth',
    'Sistema de Sonido Premium',
    'Cámara de Retroceso',
    'Cámara 360°',
    'Sensores de Estacionamiento',
    'Asistente de Estacionamiento',
    'Velocidad Crucero',
    'Velocidad Crucero Adaptativa',
    'Alerta de Cambio de Carril',
    'Monitor de Punto Ciego',
    'Frenos ABS',
    'Control de Estabilidad',
    'Airbags Frontales',
    'Airbags Laterales',
    'Airbags de Cortina',
    'Llantas de Aleación',
    'Faros LED',
    'Faros de Xenón',
    'Acceso Keyless (Sin Llave)',
    'Botón de Encendido',
    'Suspensión Neumática',
    'Tracción 4x4',
    'Tracción AWD',
    'Head-Up Display',
    'Cargador Inalámbrico',
    'Volante Multifunción',
    'Portalón Eléctrico',
    'Vidrios Eléctricos',
    'Espejos Eléctricos'
]

export const generateDescription = (data: any, features: string[]) => {
    const brand = data.marca || 'Vehículo';
    const model = data.modelo || '';
    const year = data.anio || '';
    const version = ''; // We don't have a specific version field, but model often contains it

    const intro = `Espectacular ${brand} ${model} año ${year}, disponible para entrega inmediata.`;

    let highlight = '';
    if (data.kilometraje < 15000) {
        highlight = 'Unidad con muy bajo kilometraje y en estado de conservación igual a nuevo.';
    } else if (data.estado === 'disponible') {
        highlight = 'Unidad seleccionada, inspeccionada y garantizada.';
    }

    const featuresText = features.length > 0
        ? `Cuenta con un equipamiento tope de línea que incluye: ${features.slice(0, 5).join(', ')}${features.length > 5 ? ' y mucho más.' : '.'}`
        : '';

    const engine = data.litrosMotor ? `Motorización ${data.litrosMotor} con transmisión ${data.transmision?.toLowerCase()}.` : `Transmisión ${data.transmision?.toLowerCase()}.`;

    const financing = 'Contamos con opciones de financiamiento y recibimos tu auto en parte de pago.';

    return `${intro}\n\n${highlight}\n\n${engine}\n${featuresText}\n\n${financing}\n\n¡Coordina tu visita para conocerlo!`;
}
