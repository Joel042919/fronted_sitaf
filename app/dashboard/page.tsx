"use client";

import { useEffect, useState } from "react";

interface SismedItem {
  codigo: string;
  nombre: string;
  stockActual: number;
  ubicacion: string;
}

interface PredictionData {
  recommended_quantity: number;
  confidence: number;
  model: string;
}

export default function Dashboard() {
  const [stockItems, setStockItems] = useState<SismedItem[]>([]);
  const [predictions, setPredictions] = useState<Record<string, PredictionData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Fetch real stock data from Spring Boot
        const stockResponse = await fetch("http://localhost:8080/api/sismed/stock");
        if (!stockResponse.ok) {
          throw new Error("No se pudo conectar con el backend de Spring Boot.");
        }
        const stockData: SismedItem[] = await stockResponse.json();
        setStockItems(stockData);

        // 2. Fetch AI predictions from FastAPI for each item
        const newPredictions: Record<string, PredictionData> = {};
        for (const item of stockData) {
          try {
            const predictResponse = await fetch("http://localhost:8000/predict/stock", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sismed_code: item.codigo, hospital_unit: "General" }),
            });
            if (predictResponse.ok) {
              const predictData = await predictResponse.json();
              newPredictions[item.codigo] = predictData;
            }
          } catch (err) {
            console.error("FastAPI unreachable for item:", item.codigo);
          }
        }
        setPredictions(newPredictions);

      } catch (err: any) {
        setError(err.message || "Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-text-heading mb-8">Dashboard Gerencial (IA)</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <a href="#" className="border-accent text-accent whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg">
            Stock Crítico
          </a>
          <a href="#" className="border-transparent text-text-secondary hover:text-text-main hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors">
            Caducidades
          </a>
          <a href="#" className="border-transparent text-text-secondary hover:text-text-main hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors">
            Alertas de Seguridad
          </a>
        </nav>
      </div>

      {loading && <p className="text-text-secondary text-lg">Cargando datos desde los backends...</p>}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-accent p-4 mb-6">
          <p className="text-accent">{error}</p>
          <p className="text-sm text-text-secondary mt-2">Asegúrate de que Spring Boot (puerto 8080) y FastAPI (puerto 8000) estén corriendo.</p>
        </div>
      )}

      {/* Indicadores / Barras de progreso */}
      {!loading && !error && (
        <div className="space-y-6">
          {stockItems.map((item) => {
            const prediction = predictions[item.codigo];
            const maxCapacity = 5000; // Simulated capacity
            const percentage = Math.min(100, Math.round((item.stockActual / maxCapacity) * 100));
            const isCritical = percentage < 20;

            return (
              <div key={item.codigo} className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-text-main">{item.nombre} (SISMED: {item.codigo})</h3>
                  <span className={`text-2xl font-bold ${isCritical ? 'text-accent' : 'text-chart-primary'}`}>{percentage}%</span>
                </div>
                <p className="text-text-secondary mb-4">
                  Stock actual: {item.stockActual} uni. en {item.ubicacion} 
                  {prediction && ` | Recomendación IA (${prediction.model}): Pedir ${prediction.recommended_quantity} uni.`}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full ${isCritical ? 'bg-accent' : 'bg-chart-primary'}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
