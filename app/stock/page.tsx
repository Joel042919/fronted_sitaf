"use client";

import { useState, useEffect } from "react";
import { AlertCircle, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StockControlPage() {
  const [activeTab, setActiveTab] = useState("Predicciones");
  const [stockPredictions, setStockPredictions] = useState<any>(null);
  const [anomalyData, setAnomalyData] = useState<any>(null);
  const [expirationAlerts, setExpirationAlerts] = useState<any>(null);
  const [ordenEnviada, setOrdenEnviada] = useState<any>(null);

  useEffect(() => {
    // Carga de predicciones desde Spring Boot
    fetch("http://localhost:8080/api/stock/prediccion/00123")
      .then(r => r.json())
      .then(data => setStockPredictions(data))
      .catch(e => console.error(e));

    // Carga de anomalías desde Spring Boot
    fetch("http://localhost:8080/api/stock/anomalias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: "MED-001", sismed_code: "00123", quantity_dispensed: 50, timestamp: new Date().toISOString() })
    })
      .then(r => r.json())
      .then(data => setAnomalyData(data))
      .catch(e => console.error(e));

    // Carga de alertas de caducidad desde Spring Boot
    fetch("http://localhost:8080/api/stock/alertas/caducidad")
      .then(r => r.json())
      .then(data => setExpirationAlerts(data.predictions || []))
      .catch(e => console.error(e));
  }, []);

  const enviarOrdenSIGA = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/stock/orden-compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ codigoSismed: stockPredictions?.sismed_code, cantidad: stockPredictions?.recommended_quantity }] })
      });
      if (response.ok) {
        const result = await response.json();
        setOrdenEnviada(result);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const chartData = [
    { name: 'Semana 1', Demanda: 400 },
    { name: 'Semana 2', Demanda: 300 },
    { name: 'Semana 3', Demanda: 550 },
    { name: 'Semana 4 (Predicción)', Demanda: stockPredictions?.recommended_quantity || 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 bg-[#f8fafc] min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-[#c41c1d]"></div>
          <span className="text-xs font-bold text-[#c41c1d] tracking-widest uppercase">MÓDULO 3</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1e293b]">Control Inteligente de Stock</h1>
        <p className="text-gray-500 text-sm mt-2">
          RF-11 · RF-12 · RF-13 · RF-14 — Predicción de demanda, Caducidades y Anomalías
        </p>
      </div>

      <div className="flex border-b border-gray-200 mb-6 space-x-2">
        {["Predicciones", "Anomalias", "Caducidades"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[#c41c1d] text-[#1e293b]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab === "Predicciones" && "Demanda (IA)"}
            {tab === "Anomalias" && "Monitoreo Anomalías"}
            {tab === "Caducidades" && "Riesgo Caducidad"}
          </button>
        ))}
      </div>

      {activeTab === "Predicciones" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="text-sm text-gray-500 font-medium mb-1">Medicamento Analizado</p>
              <h3 className="text-2xl font-bold text-gray-900">Paracetamol 500mg</h3>
              <p className="text-xs text-gray-400 mt-1">SISMED: 00123</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-1">Stock Actual</p>
              <h3 className="text-3xl font-bold text-gray-900">1,500 <span className="text-base font-normal text-gray-500">und</span></h3>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: "20%" }}></div>
              </div>
              <p className="text-xs text-orange-600 mt-2 font-medium">Nivel crítico bajo</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5">
                <TrendingUp className="w-32 h-32" />
              </div>
              <p className="text-sm text-gray-500 font-medium mb-1">Predicción a 30 días (IA)</p>
              <h3 className="text-3xl font-bold text-[#c41c1d]">
                {stockPredictions ? stockPredictions.recommended_quantity : "..."} <span className="text-base font-normal text-gray-500">und</span>
              </h3>
              <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 inline-block px-2 py-1 rounded">
                Confianza: {stockPredictions ? (stockPredictions.confidence * 100).toFixed(0) : "0"}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-80">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Evolución y Predicción</h3>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} />
                        <Bar dataKey="Demanda" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Acción Recomendada</h3>
              <p className="text-gray-600 text-sm mb-6 flex-1">
                El modelo <strong>{stockPredictions?.model || "IA"}</strong> sugiere un posible quiebre de stock basado en la estacionalidad e histórico de consumo. Se recomienda emitir una orden de compra automática a SIGA.
              </p>
              
              {!ordenEnviada ? (
                <button 
                  onClick={enviarOrdenSIGA}
                  className="bg-[#c41c1d] hover:bg-red-800 text-white px-6 py-3 rounded-lg text-sm font-medium flex justify-center items-center gap-2 transition-colors shadow-sm w-full"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Aprobar Orden (SIGA)
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm font-bold text-green-800">Orden enviada a SIGA</p>
                    <p className="text-xs text-green-600">Estado: {ordenEnviada.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Anomalias" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Patrones de Consumo Anómalos</h3>
              <p className="text-sm text-gray-500">Modelo: {anomalyData?.model || "Cargando..."}</p>
            </div>
            {anomalyData?.is_anomaly && (
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded flex items-center gap-1 border border-red-200">
                <AlertCircle className="w-3 h-3" /> Riesgo Detectado
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Fecha</th>
                  <th className="px-6 py-3">Medicamento</th>
                  <th className="px-6 py-3">Profesional</th>
                  <th className="px-6 py-3">Cantidad</th>
                  <th className="px-6 py-3">Score Riesgo</th>
                  <th className="px-6 py-3 rounded-tr-lg">Acción del Sistema</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{new Date().toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">00123 - Paracetamol</td>
                  <td className="px-6 py-4">MED-001</td>
                  <td className="px-6 py-4 font-bold text-red-600">50 (Anómalo)</td>
                  <td className="px-6 py-4">
                    {anomalyData ? (
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 w-16">
                          <div 
                            className={`h-1.5 rounded-full ${anomalyData.risk_score > 0.8 ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${anomalyData.risk_score * 100}%` }}
                          ></div>
                        </div>
                        <span className={anomalyData.risk_score > 0.8 ? "text-red-600 font-bold" : "text-green-600 font-medium"}>
                          {(anomalyData.risk_score * 100).toFixed(0)}
                        </span>
                      </div>
                    ) : "..."}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium border ${anomalyData?.action === 'BLOCK' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                      {anomalyData?.action || "..."}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Caducidades" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Alertas Preventivas de Caducidad</h3>
              <p className="text-sm text-gray-500">Priorización por IA de medicamentos próximos a vencer</p>
            </div>
            <div className="bg-blue-50 text-blue-700 p-2 rounded-lg flex items-center gap-2">
               <Clock className="w-4 h-4" />
               <span className="text-sm font-semibold">{expirationAlerts?.length || 0} lotes analizados</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expirationAlerts ? expirationAlerts.map((alert: any, idx: number) => (
              <div key={idx} className={`p-4 rounded-xl border ${alert.risk_level === 'ALTO' ? 'bg-red-50 border-red-100' : alert.risk_level === 'MEDIO' ? 'bg-orange-50 border-orange-100' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900">SISMED: {alert.sismed_code}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${alert.risk_level === 'ALTO' ? 'bg-red-100 text-red-800' : alert.risk_level === 'MEDIO' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                    Riesgo {alert.risk_level}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Lote: {alert.lote}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xs font-medium text-gray-500">
                    <span className={`font-bold ${alert.days_left <= 30 ? 'text-red-600' : ''}`}>{alert.days_left} días</span> restantes
                  </div>
                  <div className="text-xs font-semibold text-gray-700">
                    Acción: {alert.recommended_action.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center text-gray-500 py-8">Cargando análisis de caducidad...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
