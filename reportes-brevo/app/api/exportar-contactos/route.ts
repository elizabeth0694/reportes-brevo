import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';

const pausa = (milisegundos: number) =>
  new Promise((resolver) => setTimeout(resolver, milisegundos));

function detectarSeparador(linea: string) {
  if (linea.includes(';')) return ';';
  if (linea.includes('\t')) return '\t';
  return ',';
}

function separarLineaCsv(linea: string, separador: string) {
  const resultado: string[] = [];
  let actual = '';
  let dentroComillas = false;

  for (let i = 0; i < linea.length; i++) {
    const caracter = linea[i];
    const siguiente = linea[i + 1];

    if (caracter === '"' && dentroComillas && siguiente === '"') {
      actual += '"';
      i++;
    } else if (caracter === '"') {
      dentroComillas = !dentroComillas;
    } else if (caracter === separador && !dentroComillas) {
      resultado.push(actual);
      actual = '';
    } else {
      actual += caracter;
    }
  }

  resultado.push(actual);
  return resultado;
}

function limpiarValorCsv(valor: string | undefined) {
  return String(valor ?? '')
    .replace(/^\uFEFF/, '')
    .replace(/^"|"$/g, '')
    .trim();
}

function extraerEmailsDelCsv(csvOriginal: string) {
  const lineas = csvOriginal
    .split(/\r?\n/)
    .filter((linea) => linea.trim() !== '');

  if (lineas.length === 0) return [];

  const separador = detectarSeparador(lineas[0]);
  const encabezados = separarLineaCsv(lineas[0], separador);

  const indiceEmail = encabezados.findIndex((columna) => {
    const normalizada = limpiarValorCsv(columna).toLowerCase();
    return normalizada === 'email' || normalizada === 'email_id' || normalizada === 'email id';
  });

  if (indiceEmail === -1) {
    throw new Error('No se encontro columna de email en el archivo exportado por Brevo');
  }

  return lineas
    .slice(1)
    .map((linea) => {
      const columnas = separarLineaCsv(linea, separador);
      return limpiarValorCsv(columnas[indiceEmail]);
    })
    .filter(Boolean);
}

async function obtenerDetalleContacto(email: string, apiKey: string) {
  const respuesta = await fetch(
    `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
    {
      method: 'GET',
      headers: {
        'api-key': apiKey,
        Accept: 'application/json',
      },
    }
  );

  if (!respuesta.ok) {
    return {
      nombre: '',
      emailBlacklisted: false,
      smsBlacklisted: false,
    };
  }

  const contacto = await respuesta.json();
  const atributos = contacto.attributes || {};

  const nombre = [
    atributos.FIRSTNAME || atributos.NOMBRE || atributos.NAME || '',
    atributos.LASTNAME || atributos.APELLIDO || '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    nombre,
    emailBlacklisted: Boolean(contacto.emailBlacklisted),
    smsBlacklisted: Boolean(contacto.smsBlacklisted),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get('campaignId');
  const type = searchParams.get('type') || 'openers';
  const apiSource = searchParams.get('apiSource');
  const campaignName = searchParams.get('campaignName') || '';

  const apiKey =
    apiSource === 'B'
      ? process.env.BREVO_API_KEY_MARCA_B
      : apiSource === 'A'
        ? process.env.BREVO_API_KEY_MARCA_A
        : undefined;

  console.log('-> SOLICITUD DE DESCARGA:', {
    campaignId,
    type,
    apiSource,
    tieneApiKey: !!apiKey,
  });

  if (!campaignId || campaignId === 'undefined' || !apiSource || !apiKey) {
    return NextResponse.json(
      { error: 'Faltan parametros o ID invalido' },
      { status: 400 }
    );
  }

  try {
    const urlExport = `https://api.brevo.com/v3/emailCampaigns/${campaignId}/exportRecipients`;

    const respuestaExport = await fetch(urlExport, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        recipientsType: type,
      }),
    });

    if (!respuestaExport.ok) {
      const errorTexto = await respuestaExport.text();
      console.log('ERROR AL INICIAR EXPORTACION EN BREVO:', respuestaExport.status, errorTexto);

      return NextResponse.json(
        { error: 'Error al iniciar exportacion', detalle: errorTexto },
        { status: 500 }
      );
    }

    const datosExport = await respuestaExport.json();
    const processId = datosExport.processId;

    let exportUrl = '';
    let intentos = 0;

    while (!exportUrl && intentos < 30) {
      await pausa(5000);
      intentos++;

      const respuestaProceso = await fetch(
        `https://api.brevo.com/v3/processes/${processId}`,
        {
          method: 'GET',
          headers: {
            'api-key': apiKey,
            Accept: 'application/json',
          },
        }
      );

      if (respuestaProceso.ok) {
        const datosProceso = await respuestaProceso.json();

        if (datosProceso.status === 'completed') {
          exportUrl = datosProceso.export_url;
        }
      }
    }

    if (!exportUrl) {
      return NextResponse.json(
        { error: 'Brevo tardo demasiado generando el archivo. Intenta de nuevo en unos minutos.' },
        { status: 504 }
      );
    }

    const respuestaArchivo = await fetch(exportUrl);

    if (!respuestaArchivo.ok) {
      return NextResponse.json(
        { error: 'No se pudo descargar el archivo generado por Brevo' },
        { status: 500 }
      );
    }

    const arrayBuffer = await respuestaArchivo.arrayBuffer();
    const csvOriginal = new TextDecoder('utf-8').decode(arrayBuffer);
    const emails = extraerEmailsDelCsv(csvOriginal);

    const filas = [];

    for (const email of emails) {
      const detalle = await obtenerDetalleContacto(email, apiKey);

      filas.push({
        campaignName,
        email,
        nombre: detalle.nombre,
        desuscritoEmail: detalle.emailBlacklisted ? 'Si' : 'No',
        bloqueadoEmail: detalle.emailBlacklisted ? 'Si' : 'No',
        bloqueadoSms: detalle.smsBlacklisted ? 'Si' : 'No',
      });


      await pausa(100);
    }

    const libro = new ExcelJS.Workbook();
    const hoja = libro.addWorksheet('Contactos');

    hoja.columns = [
      { header: 'Nombre Campaña', key: 'campaignName', width: 45 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Nombre Contacto', key: 'nombre', width: 28 },
      { header: 'Desuscrito Email', key: 'desuscritoEmail', width: 20 },
      { header: 'En Lista Bloqueada Email', key: 'bloqueadoEmail', width: 28 },
      { header: 'En Lista Bloqueada SMS', key: 'bloqueadoSms', width: 26 },
    ];


    filas.forEach((fila) => {
      hoja.addRow(fila);
    });

    hoja.getRow(1).font = { bold: true };

    hoja.eachRow((fila, numeroFila) => {
      if (numeroFila === 1) return;

      fila.eachCell((celda) => {
        if (String(celda.value).toLowerCase() === 'si') {
          celda.font = { color: { argb: 'FFFF0000' }, bold: true };
        }
      });
    });

    const buffer = await libro.xlsx.writeBuffer();


    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="contactos-${type === 'openers' ? 'aperturas' : 'clics'}.xlsx"`,
      },
    });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Fallo desconocido';
    console.log('ERROR EXPORTANDO CONTACTOS:', mensaje);

    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}