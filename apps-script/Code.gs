/**
 * Registro de visitas y resultados del juego (Departamento de TIC - UPEC)
 *
 * PASOS PARA CONFIGURAR:
 * 1. Crea una Hoja de cálculo de Google (privada) con el nombre "Registro Escudo Digital".
 * 2. En la hoja: Extensiones → Apps Script. Pega este código y guarda.
 * 3. Implementar → Nueva implementación → Tipo: Aplicación web.
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier usuario
 * 4. Copia la URL que termina en /exec y pégala en script.js en SHEET_ENDPOINT.
 *
 * Las hojas "Visitas" y "Juego" se crean solas al primer registro.
 * Para ver un resumen, agrega en otra hoja estas fórmulas:
 *   Total de visitas:        =COUNTA(Visitas!B2:B)
 *   Personas distintas:      =COUNTA(UNIQUE(Visitas!B2:B))
 *   Resultados guardados:    =COUNTA(Juego!A2:A)
 *
 * Privacidad: solo se guarda lo que la persona escribe en el formulario de resultado
 * (nombre, nivel, movimientos, segundos) más un identificador aleatorio del navegador.
 * No se guardan correos, IP ni otros datos personales.
 */

const HOJA_VISITAS = 'Visitas';
const HOJA_JUEGO = 'Juego';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const fecha = limpiar_(data.fecha, 40);

    if (data.tipo === 'visita') {
      const hoja = obtenerHoja_(ss, HOJA_VISITAS, ['fecha', 'visitorId', 'pagina']);
      hoja.appendRow([fecha, limpiar_(data.visitorId, 64), limpiar_(data.pagina, 120)]);
    } else if (data.tipo === 'juego') {
      const hoja = obtenerHoja_(ss, HOJA_JUEGO, [
        'fecha', 'nombre', 'nivel', 'movimientos', 'segundos', 'visitorId',
      ]);
      hoja.appendRow([
        fecha,
        limpiar_(data.nombre, 40),
        limpiar_(data.nivel, 20),
        Number(data.movimientos) || 0,
        Number(data.segundos) || 0,
        limpiar_(data.visitorId, 64),
      ]);
    } else {
      return respuesta_({ ok: false, error: 'tipo desconocido' });
    }
    return respuesta_({ ok: true });
  } catch (err) {
    return respuesta_({ ok: false, error: String(err) });
  }
}

function obtenerHoja_(ss, nombre, encabezados) {
  let hoja = ss.getSheetByName(nombre);
  if (!hoja) {
    hoja = ss.insertSheet(nombre);
    hoja.appendRow(encabezados);
    hoja.setFrozenRows(1);
  }
  return hoja;
}

/** Quita caracteres de control, limita el largo y evita que Sheets ejecute fórmulas. */
function limpiar_(valor, maximo) {
  let texto = String(valor || '').replace(/[\u0000-\u001F\u007F]/g, '').slice(0, maximo);
  if (/^[=+\-@]/.test(texto)) texto = "'" + texto;
  return texto;
}

function respuesta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
