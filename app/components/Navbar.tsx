import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="bg-surface border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/escudo_text_gobpe_bicentenario.svg" 
                alt="Logo Gobierno del Perú" 
                width={200} 
                height={50} 
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-text-main hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Inicio
            </Link>
            <Link href="/trazabilidad" className="text-text-main hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Trazabilidad (Blockchain)
            </Link>
            <Link href="/dashboard" className="text-text-main hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Indicadores
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
