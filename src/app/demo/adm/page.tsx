"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Tv, Smartphone, RefreshCw, CheckCircle2, Image as ImageIcon, Plus, Trash2, Upload } from "lucide-react";

export default function AdminSignage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    fetch("/api/signage")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch("/api/signage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        setSaveMessage("Vitrine atualizada com sucesso!");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage("Erro ao atualizar vitrine.");
      }
    } catch (error) {
      setSaveMessage("Erro de conexão.");
    }
    setSaving(false);
  };

  const handleFileUpload = async (file: File, callback: (url: string) => void) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        callback(result.url);
      } else {
        alert(result.error);
      }
    } catch (e) {
      alert("Erro ao fazer upload da imagem.");
    }
  };

  const handleThemeChange = (field: string, value: any) => {
    const newData = { ...data };
    newData.theme = { ...newData.theme, [field]: value };
    setData(newData);
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const newData = { ...data };
    newData.products[index][field] = value;
    setData(newData);
  };

  const handleAddProduct = () => {
    const newData = { ...data };
    newData.products.push({
      id: Date.now(),
      category: "",
      name: "",
      tag: "",
      url: "",
      images: [""]
    });
    setData(newData);
  };

  const handleRemoveProduct = (index: number) => {
    const newData = { ...data };
    newData.products.splice(index, 1);
    setData(newData);
  };

  const handleAddImage = (productIndex: number) => {
    const newData = { ...data };
    newData.products[productIndex].images.push("");
    setData(newData);
  };

  const handleRemoveImage = (productIndex: number, imgIndex: number) => {
    const newData = { ...data };
    newData.products[productIndex].images.splice(imgIndex, 1);
    setData(newData);
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Carregando painel...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Tv className="w-8 h-8 text-[#00A34A]" /> CMS Vitrine Digital
            </h1>
            <p className="text-gray-400 mt-1">Gerencie os produtos exibidos na tela da loja em tempo real.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {saveMessage && (
              <span className="text-[#00ffaa] text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {saveMessage}
              </span>
            )}
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-[#00A34A] hover:bg-[#008f40] transition-colors text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,163,74,0.3)] disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? "Salvando..." : "Publicar na TV"}
            </button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold border-b border-white/10 pb-2">Configurações da Loja</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Logotipo / Nome (Texto)</label>
              <input 
                type="text" 
                value={data.theme?.logo || ""}
                onChange={(e) => handleThemeChange("logo", e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00A34A] transition-colors"
                placeholder="Ex: Afubra"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Imagem do Logo (Upload Opcional)</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  {data.theme?.logoImage ? data.theme.logoImage.split('/').pop() : "Nenhuma imagem selecionada"}
                </div>
                <label className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 text-sm font-bold text-white shrink-0">
                  <Upload className="w-4 h-4" /> Enviar Arquivo
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0], (url) => handleThemeChange("logoImage", url));
                    }
                  }} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.products.map((product: any, index: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={product.id} 
              className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4 relative"
            >
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button 
                  onClick={() => handleRemoveProduct(index)}
                  className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-full flex items-center justify-center transition-colors border border-red-500/30"
                  title="Remover Slot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center font-bold text-gray-400 text-xs border border-white/10">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-lg font-bold border-b border-white/10 pb-2 mb-4">Slot de Produto {index + 1}</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Nome do Produto</label>
                  <input 
                    type="text" 
                    value={product.name}
                    onChange={(e) => handleProductChange(index, "name", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00A34A] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Categoria</label>
                    <input 
                      type="text" 
                      value={product.category}
                      onChange={(e) => handleProductChange(index, "category", e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00A34A] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Tag (Selo)</label>
                    <input 
                      type="text" 
                      value={product.tag}
                      onChange={(e) => handleProductChange(index, "tag", e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00A34A] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Smartphone className="w-3 h-3" /> Link do E-commerce (Gera o QR Code)
                  </label>
                  <input 
                    type="text" 
                    value={product.url}
                    onChange={(e) => handleProductChange(index, "url", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00A34A] transition-colors text-xs"
                  />
                </div>
                
                {/* Imagens */}
                <div className="pt-2 border-t border-white/5 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Imagens
                    </label>
                    <button 
                      onClick={() => handleAddImage(index)}
                      className="text-xs flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Adicionar
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {product.images.map((img: string, imgIndex: number) => (
                      <div key={imgIndex} className="flex items-center gap-2">
                        <div className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-gray-400 text-[11px] overflow-hidden text-ellipsis whitespace-nowrap">
                          {img ? img.split('/').pop() : 'Nenhum arquivo selecionado'}
                        </div>
                        <label className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20 cursor-pointer flex items-center gap-1" title="Enviar Arquivo">
                          <Upload className="w-3 h-3" /> <span className="text-[10px] uppercase font-bold px-1">Enviar</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(e.target.files[0], (url) => {
                                const newImages = [...product.images];
                                newImages[imgIndex] = url;
                                handleProductChange(index, "images", newImages);
                              });
                            }
                          }} />
                        </label>
                        <button 
                          onClick={() => handleRemoveImage(index, imgIndex)}
                          className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-lg transition-colors border border-red-500/30"
                          title="Remover Imagem"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">*Faça o upload dos arquivos (PNG, JPEG). O link web só é necessário para o QR Code.</p>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center pt-4">
          <button 
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            <Plus className="w-5 h-5" /> Adicionar Novo Slot de Produto
          </button>
        </div>
        
      </div>
    </div>
  );
}
