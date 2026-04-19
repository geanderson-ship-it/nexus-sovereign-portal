'use client';
import { useEffect } from 'react';

export default function Error({ error }: { error: Error }) {
  useEffect(() => { console.error("VIX DIAGNOSTIC:", error); }, [error]);
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black text-white p-10 text-center">
      <h2 className="text-2xl font-bold mb-4">Ajustando Lentes de Inteligência...</h2>
      <p className="text-gray-400 max-w-md">{error.message || "Erro de renderização detectado."}</p>
      <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
        Tentar Novamente
      </button>
    </div>
  );
}
