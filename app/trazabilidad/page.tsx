"use client";

import { useState } from "react";

interface Movimiento {
  docType: string;
  timestamp: string;
  responsable: string;
  pacienteId?: string;
  lote: string;
  codigoSismed: string;
  cantidad: number;
  ubicacion: string;
  estadoDefectuoso: boolean;
}

export default function Trazabilidad() {
  const [lote, setLote] = useState("");
  const [historial, setHistorial] = useState<Movimiento[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marcaSuccess, setMarcaSuccess] = useState<string | null>(null);

  const buscarHistorial = async () => {
    if (!lote) return;
    setLoading(true);
    setError(null);
    setMarcaSuccess(null);
    setHistorial(null);

    try {
      const response = await fetch(`http://localhost:8080/api/trazabilidad/lote/${lote}`);
      if (!response.ok) throw new Error("No se pudo obtener el historial del lote");
      const data = await response.json();
      // Sort by timestamp if possible (assuming ISO strings)
      data.sort((a: Movimiento, b: Movimiento) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setHistorial(data);
    } catch (err: any) {
      setError(err.message || "Error al buscar el lote.");
    } finally {
      setLoading(false);
    }
  };

  const reportarDefectuoso = async () => {
    if (!lote) return;
    try {
      const response = await fetch(`http://localhost:8080/api/trazabilidad/defecto/${lote}`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Fallo al marcar como defectuoso");
      setMarcaSuccess("Lote marcado como defectuoso exitosamente.");
      buscarHistorial(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-text-heading mb-6">Explorador de Blockchain (Trazabilidad)</h1>
      <p className="text-text-secondary mb-8">Consulte la historia inmutable de cualquier lote de medicamentos desde que ingresa al almacén hasta que es dispensado al paciente.</p>

      {/* Buscador */}
      <div className="flex gap-4 mb-10">
        <input 
          type="text" 
          placeholder="Ingrese el número de Lote (Ej: LOTE-123)" 
          value={lote}
          onChange={(e) => setLote(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
        />
        <button 
          onClick={buscarHistorial}
          disabled={loading || !lote}
          className="bg-primary hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Buscar Lote"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-accent p-4 mb-6">
          <p className="text-accent font-semibold">{error}</p>
        </div>
      )}

      {marcaSuccess && (
        <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6">
          <p className="text-green-700 font-semibold">{marcaSuccess}</p>
        </div>
      )}

      {/* Resultados - Línea de tiempo */}
      {historial && historial.length > 0 && (
        <div className="bg-surface rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-semibold text-primary">Historial del Lote: {lote}</h2>
            <button 
              onClick={reportarDefectuoso}
              className="bg-accent text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition"
            >
              Reportar Lote Defectuoso
            </button>
          </div>

          <div className="relative border-l border-gray-200 ml-3 space-y-8">
            {historial.map((mov, idx) => (
              <div key={idx} className="mb-8 ml-6">
                <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white ${mov.estadoDefectuoso ? 'bg-accent' : 'bg-chart-primary'}`}></span>
                <h3 className="flex items-center mb-1 text-lg font-semibold text-text-heading">
                  {mov.ubicacion} 
                  {mov.estadoDefectuoso && <span className="bg-accent text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded ml-3">Defectuoso</span>}
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-text-secondary">
                  {new Date(mov.timestamp).toLocaleString()}
                </time>
                <div className="text-base font-normal text-text-main mt-2">
                  <p><strong>Responsable:</strong> {mov.responsable}</p>
                  <p><strong>Cantidad:</strong> {mov.cantidad} unidades</p>
                  {mov.pacienteId && <p><strong>Paciente (Hash):</strong> {mov.pacienteId}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {historial && historial.length === 0 && (
        <div className="text-center py-10 bg-surface rounded-xl border border-gray-200">
          <p className="text-text-secondary text-lg">No se encontraron registros para el lote: {lote}</p>
        </div>
      )}
    </div>
  );
}
