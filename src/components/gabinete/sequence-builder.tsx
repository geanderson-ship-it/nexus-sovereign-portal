'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './studio.module.css';
import { AnnounceType } from '@/hooks/use-announcer';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical } from 'lucide-react';

export interface SequenceItem {
  id: string;
  type: AnnounceType;
  label?: string;
  text?: string;
  audioUrl?: string;
  duration?: number; // Duration in seconds
  voiceOverride?: 'female' | 'male';
}

interface Props {
  onEnqueueSequence: (items: SequenceItem[]) => void;
  existingQueue?: any[];
}

export default function SequenceBuilder({ onEnqueueSequence, existingQueue = [] }: Props) {
  const [items, setItems] = useState<SequenceItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const dragIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Form states for manual insertion
  const [type, setType] = useState<AnnounceType>('custom');
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [voiceOverride, setVoiceOverride] = useState<'female' | 'male' | ''>('');

  useEffect(() => {
    const handleAddFile = async (e: any) => {
      const file = e.detail as File;
      const label = `🎧 ${file.name}`;
      
      if (isDuplicate(label)) {
        const confirmed = window.confirm(`A faixa "${file.name}" já está programada. Deseja adicionar novamente?`);
        if (!confirmed) return;
      }

      const url = URL.createObjectURL(file);
      const duration = await getAudioDuration(url);
      
      const newItem: SequenceItem = {
        id: Math.random().toString(36).slice(2, 9),
        type: 'music',
        audioUrl: url,
        duration,
        label,
      };

      setItems(prev => [...prev, newItem]);
    };

    window.addEventListener('nexus-add-file', handleAddFile);
    return () => window.removeEventListener('nexus-add-file', handleAddFile);
  }, [items, existingQueue]); // Re-bind when state changes for isDuplicate closure

  const normalizeLabel = (label: string) => {
    // Remove icons and common prefixes to get the core name
    return label
      .replace(/^[🎧🎶📢⏰🌡️🌦️📡]\s*/, '') // Remove starting icons
      .replace(/^(Música:|Vinheta:|Anúncio:)\s*/, '') // Remove prefixes
      .trim()
      .toLowerCase();
  };

  const isDuplicate = (label: string) => {
    const target = normalizeLabel(label);
    // Check in local items
    const inTimeline = items.some(i => normalizeLabel(i.label) === target);
    // Check in active queue
    const inQueue = existingQueue.some(q => normalizeLabel(q.label) === target);
    return inTimeline || inQueue;
  };

  const getAudioDuration = (url: string): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.addEventListener('error', () => resolve(0));
      // Safety timeout
      setTimeout(() => resolve(0), 1000);
    });
  };

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    
    let files: File[] = Array.from(e.dataTransfer.files);
    
    // Check for internal drag from FileExplorer
    if (files.length === 0 && (window as any).__nexus_dragging_file) {
      files = [(window as any).__nexus_dragging_file];
      (window as any).__nexus_dragging_file = null; // Clear after use
    }
    
    const audioExtensions = ['.mp3', '.mpeg', '.mp4', '.m4a', '.wav', '.ogg', '.wma', '.aac', '.flac'];
    const filteredFiles = files.filter(f => {
      const extension = '.' + f.name.split('.').pop()?.toLowerCase();
      return f.type.startsWith('audio/') || f.type.startsWith('video/') || audioExtensions.includes(extension);
    });
    
    if (filteredFiles.length === 0) return;

    const newItems: SequenceItem[] = [];
    
    for (const file of filteredFiles) {
      const label = `🎧 ${file.name}`;
      
      // Check for duplicate
      if (isDuplicate(label)) {
        const confirmed = window.confirm(`A faixa "${file.name}" já está programada (na timeline ou no ar). Deseja adicionar novamente?`);
        if (!confirmed) continue;
      }

      const url = URL.createObjectURL(file);
      const duration = await getAudioDuration(url);
      
      newItems.push({
        id: Math.random().toString(36).slice(2, 9),
        type: 'music',
        audioUrl: url,
        duration,
        label,
      });
    }

    if (newItems.length > 0) {
      setItems(prev => [...prev, ...newItems]);
    }
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

  async function insertManualItem() {
    if (insertIndex === null) return;

    let estimatedDuration = 5; // Default for jingles/manual
    if (type === 'custom') {
      const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
      estimatedDuration = Math.max(3, wordCount * 0.5); // 0.5s per word, min 3s
    } else if (['time', 'temp', 'forecast', 'station-id'].includes(type)) {
      estimatedDuration = 7; // Average for automatic blocks
    } else if (type === 'music' || type === 'jingle') {
      if (audioUrl.startsWith('blob:')) {
         estimatedDuration = await getAudioDuration(audioUrl);
      } else {
         estimatedDuration = 15; // Placeholder for remote URLs if duration unknown
      }
    }

    const label = getLabelForType(type, text, audioUrl);

    // Check for duplicate
    if (isDuplicate(label)) {
      const confirmed = window.confirm(`O bloco "${label}" já está programada (na timeline ou no ar). Deseja adicionar novamente?`);
      if (!confirmed) return;
    }

    const newItem: SequenceItem = {
      id: Math.random().toString(36).slice(2, 9),
      type,
      text: type === 'custom' ? text : undefined,
      audioUrl: (type === 'jingle' || type === 'music') ? audioUrl : undefined,
      duration: estimatedDuration,
      voiceOverride: voiceOverride || undefined,
      label,
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

  // Auto-scroll logic during drag
  const handleDragUpdate = (event: any, info: any) => {
    const container = document.querySelector(`.${styles.centerCol}`);
    if (!container) return;

    const { y } = info.point;
    const threshold = 150; // Distance from edge to start scrolling
    const containerRect = container.getBoundingClientRect();

    if (dragIntervalRef.current) clearInterval(dragIntervalRef.current);

    const scrollSpeed = 15;

    if (y < containerRect.top + threshold) {
      dragIntervalRef.current = setInterval(() => {
        container.scrollTop -= scrollSpeed;
      }, 16);
    } else if (y > containerRect.bottom - threshold) {
      dragIntervalRef.current = setInterval(() => {
        container.scrollTop += scrollSpeed;
      }, 16);
    }
  };

  const stopAutoScroll = () => {
    if (dragIntervalRef.current) {
      clearInterval(dragIntervalRef.current);
      dragIntervalRef.current = null;
    }
  };

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
          📥 Arraste arquivos de áudio aqui<br/>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>(.mp3, .mp4, .wav, .wma, .mpeg, .m4a, etc)</span><br/>
          <span style={{ fontSize: '14px' }}>(ou clique para selecionar do PC)</span>
        </span>
        <input 
          id="file-upload" 
          type="file" 
          multiple 
          accept=".mp3,.mpeg,.mp4,.m4a,.wav,.ogg,.wma,.aac,.flac,audio/*,video/mp4" 
          style={{ display: 'none' }} 
          onChange={async (e) => {
              const audioExtensions = ['.mp3', '.mpeg', '.mp4', '.m4a', '.wav', '.ogg', '.wma', '.aac', '.flac'];
              const files = Array.from(e.target.files || []).filter(f => {
                 const extension = '.' + f.name.split('.').pop()?.toLowerCase();
                 return f.type.startsWith('audio/') || f.type.startsWith('video/') || audioExtensions.includes(extension);
              });
              if(files.length === 0) return;

              const newItems: SequenceItem[] = [];

              for (const file of files) {
                const label = `🎧 ${file.name}`;
                if (isDuplicate(label)) {
                  const confirmed = window.confirm(`A faixa "${file.name}" já está programada (na timeline ou no ar). Deseja adicionar novamente?`);
                  if (!confirmed) continue;
                }
                const url = URL.createObjectURL(file);
                const duration = await getAudioDuration(url);
                newItems.push({
                  id: Math.random().toString(36).slice(2, 9),
                  type: 'music',
                  audioUrl: url,
                  duration,
                  label,
                });
              }

              if (newItems.length > 0) {
                setItems(prev => [...prev, ...newItems]);
              }
              e.target.value = '';
          }} 
        />
      </div>

      <Reorder.Group axis="y" values={items} onReorder={setItems} style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            Nenhum arquivo na timeline.
          </div>
        ) : items.map((item, index) => (
          <Reorder.Item 
            key={item.id} 
            value={item}
            onDrag={(e, info) => handleDragUpdate(e, info)}
            onDragEnd={stopAutoScroll}
          >
            
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
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between', 
                padding: '12px', 
                background: 'var(--bg-card)', 
                borderRadius: '8px', 
                border: '1px solid var(--border)',
                borderLeft: `4px solid ${item.type === 'music' ? '#3b82f6' : '#FDB813'}`,
                cursor: 'grab'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <GripVertical size={16} style={{ opacity: 0.3 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                  <span style={{ wordBreak: 'break-word', paddingRight: '15px', fontSize: '14px' }}>
                    <strong>{index + 1}.</strong> {item.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 'bold' }}>
                      ⏱️ {Math.floor((item.duration || 0) / 60)}:{(Math.floor(item.duration || 0) % 60).toString().padStart(2, '0')}
                    </span>
                    {item.voiceOverride && (
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '4px' }}>
                        Voz: {item.voiceOverride === 'female' ? 'Camila' : 'Thiago'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => removeItem(index)} style={{ background: 'transparent', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: '16px', padding: '4px' }} title="Remover bloco">✕</button>
            </div>

          </Reorder.Item>
        ))}
      </Reorder.Group>

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

      {/* Summary Box */}
      {items.length > 0 && (
        <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Músicas:</span>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#3b82f6' }}>
                {(() => {
                  const musicItems = items.filter(i => i.type === 'music');
                  const total = musicItems.reduce((acc, i) => acc + (i.duration || 0), 0);
                  return `${Math.floor(total / 60)}m ${Math.floor(total % 60)}s`;
                })()}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Intervenções/IA:</span>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--accent)' }}>
                {(() => {
                  const talkItems = items.filter(i => i.type !== 'music');
                  const total = talkItems.reduce((acc, i) => acc + (i.duration || 0), 0);
                  return `${Math.floor(total / 60)}m ${Math.floor(total % 60)}s`;
                })()}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: '#fff' }}>TEMPO TOTAL ESTIMADO:</span>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#FDB813' }}>
              {(() => {
                let total = items.reduce((acc, i) => acc + (i.duration || 0), 0);
                // Subtract 5s for each music-to-music transition (crossfade)
                items.forEach((item, idx) => {
                   if (idx > 0 && item.type === 'music' && items[idx-1].type === 'music') {
                      total -= 5;
                   }
                });
                return `${Math.floor(total / 60)}:${(Math.floor(total % 60)).toString().padStart(2, '0')}`;
              })()}
            </div>
          </div>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginTop: '5px', textAlign: 'right' }}>
            *Considerando crossfade de 5s entre músicas
          </div>
        </div>
      )}

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
