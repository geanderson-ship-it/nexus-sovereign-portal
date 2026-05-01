'use client';

import { useState } from 'react';
import styles from './studio.module.css';
import { AnnounceType } from '@/hooks/use-announcer';

export interface SequenceItem {
  id: string;
  type: AnnounceType;
  label?: string;
  text?: string;
  audioUrl?: string;
  voiceOverride?: 'female' | 'male';
}

interface Props {
  onEnqueueSequence: (items: SequenceItem[]) => void;
}

export default function SequenceBuilder({ onEnqueueSequence }: Props) {
  const [items, setItems] = useState<SequenceItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  // Form states for manual insertion
  const [type, setType] = useState<AnnounceType>('custom');
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [voiceOverride, setVoiceOverride] = useState<'female' | 'male' | ''>('');

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'));
    
    if (files.length === 0) return;

    const newItems: SequenceItem[] = files.map(file => {
      const url = URL.createObjectURL(file);
      return {
        id: Math.random().toString(36).slice(2, 9),
        type: 'music',
        audioUrl: url,
        label: `🎧 ${file.name}`,
      };
    });

    // Append to the end
    setItems(prev => [...prev, ...newItems]);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function getLabelForType(t: AnnounceType, txt: string, url: string) {
    if (t === 'custom') return `📢 Anúncio: ${txt.slice(0, 40)}...`;
    if (t === 'jingle') return `🎶 Vinheta: ${url.split('/').pop()}`;
    if (t === 'music') return `🎧 Música: ${url.split('/').pop()}`;
    if (t === 'time') return '⏰ Hora Certa';
    if (t === 'temp') return '🌡️ Temperatura';
    if (t === 'forecast') return '🌦️ Previsão';
    if (t === 'station-id') return '📡 ID da Rádio';
    return t;
  }

  function insertManualItem() {
    if (insertIndex === null) return;

    const newItem: SequenceItem = {
      id: Math.random().toString(36).slice(2, 9),
      type,
      text: type === 'custom' ? text : undefined,
      audioUrl: (type === 'jingle' || type === 'music') ? audioUrl : undefined,
      voiceOverride: voiceOverride || undefined,
      label: getLabelForType(type, text, audioUrl),
    };

    setItems(prev => {
      const copy = [...prev];
      copy.splice(insertIndex, 0, newItem);
      return copy;
    });

    setInsertIndex(null);
    setText('');
    setAudioUrl('');
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  function handlePlaySequence() {
    if (items.length === 0) return;
    onEnqueueSequence(items);
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>🛠️ Construtor de Programação (Timeline)</div>
      
      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: isDragging ? '2px dashed var(--accent)' : '2px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '20px 20px',
          textAlign: 'center',
          marginBottom: '15px',
          background: isDragging ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)',
          transition: 'all 0.2s',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <span style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
          📥 Arraste dezenas de arquivos .mp3 aqui<br/>
          <span style={{ fontSize: '14px' }}>(ou clique para selecionar do PC)</span>
        </span>
        <input 
          id="file-upload" 
          type="file" 
          multiple 
          accept="audio/*" 
          style={{ display: 'none' }} 
          onChange={(e) => {
             const files = Array.from(e.target.files || []);
             if(files.length === 0) return;
             const newItems: SequenceItem[] = files.map(file => ({
                id: Math.random().toString(36).slice(2, 9),
                type: 'music',
                audioUrl: URL.createObjectURL(file),
                label: `🎧 ${file.name}`,
             }));
             setItems(prev => [...prev, ...newItems]);
             e.target.value = '';
          }} 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            Nenhum arquivo na timeline.
          </div>
        ) : items.map((item, index) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Botão de Inserção Acima do Bloco */}
            <div 
              style={{ textAlign: 'center', margin: '4px 0', opacity: insertIndex === index ? 1 : 0.2 }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = insertIndex === index ? '1' : '0.2'}
            >
              <button 
                onClick={() => setInsertIndex(insertIndex === index ? null : index)}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '15px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer', color: 'var(--text)', transition: 'background 0.2s' }}
              >
                + Inserir locução/vinheta aqui
              </button>
            </div>

            {/* Formulário de Inserção */}
            {insertIndex === index && (
              <InsertionForm 
                type={type} setType={setType} 
                text={text} setText={setText} 
                audioUrl={audioUrl} setAudioUrl={setAudioUrl}
                voiceOverride={voiceOverride} setVoiceOverride={setVoiceOverride}
                onAdd={insertManualItem} 
                onCancel={() => setInsertIndex(null)}
              />
            )}

            {/* Item do Bloco */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg)', borderRadius: '6px', borderLeft: `4px solid ${item.type === 'music' ? 'var(--blue)' : 'var(--accent)'}` }}>
              <span style={{ wordBreak: 'break-word', paddingRight: '15px' }}>
                <strong>{index + 1}.</strong> {item.label}
                {item.voiceOverride && <span style={{ fontSize: '11px', marginLeft: '8px', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>Voz Forçada: {item.voiceOverride === 'female' ? 'Camila' : 'Thiago'}</span>}
              </span>
              <button onClick={() => removeItem(index)} style={{ background: 'transparent', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '16px' }} title="Remover bloco">✕</button>
            </div>

          </div>
        ))}

        {/* Botão de Inserção no Fim da Lista */}
        {items.length > 0 && (
          <>
            <div 
              style={{ textAlign: 'center', margin: '4px 0', opacity: insertIndex === items.length ? 1 : 0.2 }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = insertIndex === items.length ? '1' : '0.2'}
            >
              <button 
                onClick={() => setInsertIndex(insertIndex === items.length ? null : items.length)}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '15px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer', color: 'var(--text)' }}
              >
                + Inserir locução/vinheta no final
              </button>
            </div>
            {insertIndex === items.length && (
              <InsertionForm 
                type={type} setType={setType} 
                text={text} setText={setText} 
                audioUrl={audioUrl} setAudioUrl={setAudioUrl}
                voiceOverride={voiceOverride} setVoiceOverride={setVoiceOverride}
                onAdd={insertManualItem} 
                onCancel={() => setInsertIndex(null)}
              />
            )}
          </>
        )}
      </div>

      <button 
        onClick={handlePlaySequence}
        disabled={items.length === 0}
        className={styles.actionBtn}
        style={{ '--btn-color': 'var(--green)', marginTop: '20px', opacity: items.length === 0 ? 0.5 : 1, padding: '15px', fontSize: '16px', fontWeight: 'bold' } as React.CSSProperties}
      >
        ▶ ENVIAR PROGRAMAÇÃO PARA O AR ({items.length} itens)
      </button>

    </div>
  );
}

// Sub-component for the insertion form
function InsertionForm({ type, setType, text, setText, audioUrl, setAudioUrl, voiceOverride, setVoiceOverride, onAdd, onCancel }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-secondary)', padding: '15px', borderRadius: '8px', margin: '8px 0', border: '1px solid var(--accent)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ color: 'var(--accent)' }}>Configurar Novo Bloco Manual</strong>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <select 
          style={{ flex: 1, minWidth: '200px', padding: '10px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }} 
          value={type} 
          onChange={e => setType(e.target.value as AnnounceType)}
        >
          <option value="custom">📢 Texto da IA (Controle Total)</option>
          <option value="jingle">🎶 Vinheta Rápida (Caminho Arquivo)</option>
          <option value="time">⏰ Hora Certa Automática</option>
          <option value="temp">🌡️ Temperatura Local Automática</option>
          <option value="forecast">🌦️ Previsão do Tempo Automática</option>
          <option value="station-id">📡 ID da Rádio (Nome/Frequência)</option>
        </select>

        {(type === 'custom' || type === 'time' || type === 'temp' || type === 'forecast' || type === 'station-id') && (
          <select 
            style={{ width: '150px', padding: '10px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
            value={voiceOverride}
            onChange={e => setVoiceOverride(e.target.value)}
          >
            <option value="">Voz Padrão</option>
            <option value="female">Feminina (Camila)</option>
            <option value="male">Masculina (Thiago)</option>
          </select>
        )}
      </div>

      {type === 'custom' && (
        <textarea
          style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', fontFamily: 'inherit' }}
          placeholder="Digite exatamente o que o locutor deve ler. Ex: 'E agora na rádio Encanto, Michel Teló!'"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
        />
      )}

      {(type === 'jingle') && (
        <input
          style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
          placeholder="/vinhetas/sua-vinheta.mp3"
          value={audioUrl}
          onChange={e => setAudioUrl(e.target.value)}
        />
      )}

      <button 
        onClick={onAdd}
        style={{ padding: '10px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '5px', fontWeight: 'bold' }}
      >
        ✔ Confirmar Inserção na Grade
      </button>
    </div>
  );
}
