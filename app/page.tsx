export default function Home() {
  const tramites = [
    { title: "Consultar Stock (SIGA)", desc: "Ver disponibilidad de medicamentos.", icon: "💊" },
    { title: "Dispensación", desc: "Registrar entrega a paciente.", icon: "📝" },
    { title: "Historial Blockchain", desc: "Trazabilidad completa de un lote.", icon: "🔗" },
    { title: "Alertas Vencimiento", desc: "Revisar medicamentos próximos a caducar.", icon: "⚠️" },
    { title: "Reabastecimiento IA", desc: "Predicciones de demanda.", icon: "📈" },
    { title: "Auditoría", desc: "Reportes inmutables y anomalías.", icon: "📊" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Bienvenido al Sistema de Trazabilidad
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Encuentra información sobre stock, trazabilidad y control inteligente de medicamentos.
          </p>
          <div className="max-w-2xl mx-auto bg-white rounded-full p-2 flex shadow-lg">
            <input 
              type="text" 
              placeholder="Busca lo que necesites..." 
              className="flex-1 px-6 py-3 rounded-l-full text-text-main focus:outline-none text-lg"
            />
            <button className="bg-accent hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* Catálogo de Trámites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-text-heading mb-10 text-center">
          Catálogo de Trámites y Servicios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tramites.map((item, index) => (
            <div 
              key={index} 
              className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-hover-border transition-all cursor-pointer group"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-primary mb-2 group-hover:underline">
                {item.title}
              </h3>
              <p className="text-text-secondary">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
