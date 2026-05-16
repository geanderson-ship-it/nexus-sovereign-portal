'use client';

import React, { useState, useEffect } from 'react';
import styles from './studio.module.css';
import { useAnnouncer, StationConfig, AnnounceType } from '@/hooks/use-announcer';
import SequenceBuilder, { SequenceItem } from './sequence-builder';
import Image from 'next/image';
import { Play, Pause, SkipForward, SkipBack, Square } from 'lucide-react';

const DEFAULT_STATION: StationConfig = {
  name: 'Rádio Encanto FM',
  frequency: '100.1 FM',
  city: '95960-000',
  slogan: 'O vale é 100',
  gender: 'female',
  manualTemp: null,
};

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = time.getHours().toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const ss = time.getSeconds().toString().padStart(2, '0');
  const date = time.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className={styles.clockBlock}>
      <div className={styles.clockTime}>
        <span>{hh}</span>
        <span className={styles.clockColon}>:</span>
        <span>{mm}</span>
        <span className={styles.clockColon}>:</span>
        <span className={styles.clockSec}>{ss}</span>
      </div>
      <div className={styles.clockDate}>{date}</div>
    </div>
  );
}

function WeatherMini({ weather, manualTemp }: { weather: any; manualTemp: number | null }) {
  const temp = manualTemp !== null ? manualTemp : (weather?.current?.temp || '--');

  return (
    <div className={styles.miniWeatherRow}>
      <div className={styles.miniWeatherCard} title="Temperatura Atual">
        <span className={styles.miniWeatherIcon}>🌡️</span>
        <div className={styles.miniWeatherInfo}>
          <span className={styles.miniWeatherVal}>{temp}°C</span>
          <span className={styles.miniWeatherLabel}>TERMÔMETRO</span>
        </div>
      </div>
      <div className={styles.miniWeatherCard} title={weather?.current?.description || 'Clima'}>
        <span className={styles.miniWeatherIcon}>🌦️</span>
        <div className={styles.miniWeatherInfo}>
          <span className={styles.miniWeatherVal}>{weather?.current?.humidity || '--'}%</span>
          <span className={styles.miniWeatherLabel}>UMIDADE</span>
        </div>
      </div>
    </div>
  );
}

function FileExplorer() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const audioFiles = selectedFiles.filter(f =>
      f.type.startsWith('audio/') ||
      /\.(mp3|wav|ogg|m4a)$/i.test(f.name)
    );
    setFiles(audioFiles);
  };

  const handleDragStart = (e: React.DragEvent, file: File) => {
    // Store the file in a global-ish way that the SequenceBuilder can access
    // because DataTransfer.files only works for external OS drops.
    (window as any).__nexus_dragging_file = file;
    e.dataTransfer.setData('application/nexus-internal-file', file.name);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className={styles.explorerPanel}>
      <div className={styles.explorerHeader}>
        <span>📂 Arquivos Locais</span>
        <label className={styles.loadFolderBtn}>
          Carregar Pasta
          <input
            type="file"
            // @ts-ignore - atributos não-padrão para seleção de diretório
            webkitdirectory="true"
            directory="true"
            multiple
            style={{ display: 'none' }}
            onChange={handleFolderSelect}
          />
        </label>
      </div>
      <div className={styles.explorerList}>
        {files.length === 0 ? (
          <div className={styles.explorerEmpty}>
            Nenhuma pasta carregada.<br />Clique em "Carregar Pasta" para indexar suas músicas.
          </div>
        ) : (
          files.map((file, i) => (
            <div
              key={i}
              className={styles.explorerItem}
              draggable
              onDragStart={(e) => handleDragStart(e, file)}
            >
              <div className={styles.explorerItemInfo}>
                <span className={styles.explorerItemIcon}>🎵</span>
                <span className={styles.explorerItemName}>{file.name}</span>
              </div>
              <button
                className={styles.explorerAddBtn}
                onClick={() => {
                  // Dispatch a custom event that StudioNexusPro can listen to
                  const event = new CustomEvent('nexus-add-file', { detail: file });
                  window.dispatchEvent(event);
                }}
              >
                +
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function QueuePanel({ queue, isSpeaking, onStop, playbackTime, playbackStatus, onTogglePause, onSkip, onRestart }: {
  queue: any[];
  isSpeaking: boolean;
  onStop: () => void;
  playbackTime: { current: number; duration: number };
  playbackStatus: 'playing' | 'paused' | 'stopped';
  onTogglePause: () => void;
  onSkip: () => void;
  onRestart: () => void;
}) {
  const statusColors: Record<string, string> = {
    pending: 'rgba(255, 255, 255, 0.4)',
    speaking: '#FDB813',
    done: '#22c55e',
    error: '#ef4444',
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const remainingTime = Math.max(0, playbackTime.duration - playbackTime.current);
  const currentItem = queue.find(q => q.status === 'speaking');

  return (
    <div className={styles.queuePanel}>
      <div className={styles.panelHeader}>
        <span>🎙️ Master Control Deck</span>
        {isSpeaking && (
          <button className={styles.stopBtn} onClick={onStop} title="Parar tudo">■ Stop</button>
        )}
      </div>

      {/* Now Playing Visualizer / Player */}
      <div className={styles.playerCard}>
        <div className={styles.tapeCounter}>
          <div className={styles.tapeLabel}>REMAINING TIME</div>
          <div className={styles.tapeDigits}>{formatTime(remainingTime)}</div>
        </div>

        <div className={styles.nowPlayingInfo}>
          <div className={styles.nowPlayingLabel}>NOW ON AIR</div>
          <div className={styles.nowPlayingTitle}>
            {currentItem ? (
              <span className={styles.marqueeText}>{currentItem.label}</span>
            ) : (
              <span style={{ opacity: 0.3, fontSize: '14px' }}>STANDBY - WAITING QUEUE</span>
            )}
          </div>
        </div>

        <div className={styles.playerControls}>
          <button
            className={styles.playerBtn}
            onClick={onRestart}
            title="Reiniciar faixa"
            style={{ opacity: isSpeaking ? 1 : 0.35 }}
          >
            <SkipBack size={24} fill="currentColor" />
          </button>

          <button
            className={`${styles.playerBtn} ${styles.playPauseBtn}`}
            onClick={onTogglePause}
            title={playbackStatus === 'playing' ? 'Pausar' : 'Play'}
            style={{ opacity: isSpeaking ? 1 : 0.35 }}
          >
            {playbackStatus === 'playing' ? (
              <Pause size={32} fill="currentColor" />
            ) : (
              <Play size={32} fill="currentColor" />
            )}
          </button>

          <button
            className={styles.playerBtn}
            onClick={onSkip}
            title="Próxima faixa"
            style={{ opacity: isSpeaking ? 1 : 0.35 }}
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(playbackTime.current / (playbackTime.duration || 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className={styles.queueSubHeader}>PRÓXIMOS NA FILA</div>

      {queue.length === 0 ? (
        <div className={styles.queueEmpty}>Nenhum anúncio na fila</div>
      ) : (
        <div className={styles.queueList}>
          {queue.map((item) => (
            <div key={item.id} className={styles.queueItem} style={{ opacity: item.status === 'speaking' ? 1 : 0.6 }}>
              <span className={styles.queueDot} style={{ background: statusColors[item.status] }} />
              <span className={styles.queueLabel}>{item.label}</span>
              <span className={styles.queueStatus}>
                {item.status === 'speaking' && '▶ ON AIR'}
                {item.status === 'pending' && 'WAITING'}
                {item.status === 'done' && '✓ SENT'}
                {item.status === 'error' && '✗ FAIL'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LogPanel({ log }: { log: Array<{ time: string; text: string; type: string }> }) {
  const typeIcon: Record<string, string> = {
    music: '🎧',
    jingle: '🎶',
    time: '⏰',
    temp: '🌡️',
    forecast: '🌦️',
    'station-id': '📡',
    custom: '📢',
    'next-track': '🎵',
  };

  const typeColor: Record<string, string> = {
    music: '#3b82f6',
    jingle: '#a855f7',
    time: '#FDB813',
    temp: '#f97316',
    forecast: '#06b6d4',
    'station-id': '#10b981',
    custom: '#ec4899',
    'next-track': '#60a5fa',
  };

  return (
    <div className={styles.logPanel}>
      <div className={styles.panelHeader}>
        <span>📊 Histórico de Execução</span>
        {log.length > 0 && (
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 'normal', textTransform: 'none', letterSpacing: 0 }}>
            {log.length} item{log.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      {log.length === 0 ? (
        <div className={styles.queueEmpty}>
          📢 Nenhuma faixa executada ainda
        </div>
      ) : (
        <div className={styles.logList}>
          {log.map((entry, i) => {
            const icon = typeIcon[entry.type] || '🔹';
            const color = typeColor[entry.type] || 'var(--accent)';
            return (
              <div key={i} className={styles.logItem} style={{ borderLeftColor: color }}>
                <div className={styles.logItemHeader}>
                  <span className={styles.logIcon}>{icon}</span>
                  <span className={styles.logTime}>{entry.time}</span>
                  <span className={styles.logBadge} style={{ background: color + '22', color }}>
                    {entry.type?.toUpperCase()}
                  </span>
                </div>
                <span className={styles.logText}>{entry.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function StudioNexusPro() {
  const [station, setStation] = useState<StationConfig>(DEFAULT_STATION);
  const [showSettings, setShowSettings] = useState(false);
  const [manualTemp, setManualTemp] = useState<number | null>(null);
  const [tempStation, setTempStation] = useState<StationConfig>(DEFAULT_STATION);
  const [stationLogo, setStationLogo] = useState<string | null>(null);
  const [softwareLogo, setSoftwareLogo] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedStationLogo = localStorage.getItem('nexus_station_logo');
    if (savedStationLogo) setStationLogo(savedStationLogo);

    const savedSoftwareLogo = localStorage.getItem('nexus_software_logo');
    if (savedSoftwareLogo) setSoftwareLogo(savedSoftwareLogo);
  }, []);

  function handleStationLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setStationLogo(base64);
      localStorage.setItem('nexus_station_logo', base64);
    };
    reader.readAsDataURL(file);
  }

  function handleSoftwareLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSoftwareLogo(base64);
      localStorage.setItem('nexus_software_logo', base64);
    };
    reader.readAsDataURL(file);
  }

  const activeStation: StationConfig = { ...station, manualTemp };
  const {
    queue, weather, isSpeaking, log, enqueue, stop,
    playbackTime, playbackStatus, togglePause, skipNext, restartTrack
  } = useAnnouncer(activeStation);

  const quickButtons: Array<{ type: AnnounceType; label: string; color: string }> = [
    { type: 'time', label: '⏰ Hora Agora', color: '#3b82f6' },
    { type: 'temp', label: '🌡️ Temperatura', color: '#f59e0b' },
    { type: 'forecast', label: '🌦️ Previsão', color: '#a855f7' },
    { type: 'station-id', label: '📡 ID da Rádio', color: '#10b981' },
  ];

  function saveSettings() {
    setStation({ ...tempStation });
    setShowSettings(false);
  }

  function handleEnqueueSequence(items: SequenceItem[]) {
    items.forEach(item => {
      enqueue(item.type, {
        text: item.text,
        audioUrl: item.audioUrl,
        voiceOverride: item.voiceOverride,
        label: item.label
      });
    });
  }

  if (!mounted) return null;

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header} style={{ height: '100px', display: 'grid', gridTemplateColumns: '320px 1fr 320px', alignItems: 'center', padding: '0 30px', gap: '20px' }}>

        {/* Left: Station Info */}
        <div className={styles.headerLeft} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div
            onClick={() => document.getElementById('station-logo-upload')?.click()}
            style={{
              width: '90px',
              height: '90px',
              background: stationLogo ? 'transparent' : 'rgba(255,255,255,0.05)',
              border: '2px dashed rgba(255,255,255,0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            {stationLogo ? (
              <img src={stationLogo} alt="Logo da Emissora" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>+ Logo</span>
            )}
            <input id="station-logo-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleStationLogoUpload} />
          </div>

          <div className={styles.stationInfo}>
            <span className={styles.stationName} style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>{station.name}</span>
            <span className={styles.stationFreq} style={{ color: '#60a5fa' }}>{station.frequency}</span>
          </div>
        </div>

        {/* Center: Main Title */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{
            color: '#FDB813',
            fontSize: '2.2rem',
            fontWeight: '950',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            textShadow: '0 4px 15px rgba(253, 184, 19, 0.4)',
            whiteSpace: 'nowrap'
          }}>
            Radio Automatizer.
          </span>
          <div className={styles.onAirBadge} style={{
            padding: '4px 12px',
            fontSize: '0.8rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)'
          }}>
            <span className={styles.pulseDot} />
            <span>ON AIR</span>
          </div>
        </div>

        {/* Right: Logos & Settings */}
        <div className={styles.headerRight} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <span className={styles.voiceLabel} style={{ fontSize: '11px', padding: '4px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.2' }}>
              <span style={{ fontSize: '14px' }}>🎙️</span>
              <span style={{ whiteSpace: 'nowrap' }}>{station.gender === 'female' ? 'Camila' : 'Thiago'} · Neural</span>
            </span>
            <button className={styles.settingsBtn} style={{ fontSize: '11px', padding: '6px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.2' }} onClick={() => { setTempStation(station); setShowSettings(true); }}>
              <span style={{ fontSize: '14px' }}>⚙️</span>
              <span style={{ whiteSpace: 'nowrap' }}>Configurações</span>
            </button>
          </div>

          <div
            onClick={() => document.getElementById('software-logo-upload')?.click()}
            style={{
              height: '90px',
              width: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              marginLeft: '10px'
            }}
          >
            <Image
              src={softwareLogo || "/Nexus Intelligence Studio/Nexus studio chumbo.png"}
              alt="Studio Nexus Logo"
              width={180}
              height={80}
              style={{
                objectFit: 'contain',
                transform: 'translateY(-12px)',
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))'
              }}
            />
            <input id="software-logo-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleSoftwareLogoUpload} />
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className={styles.main}>
        <div className={styles.leftCol}>
          <Clock />
          <WeatherMini weather={weather} manualTemp={manualTemp} />
          <FileExplorer />
          <button
            className={styles.manualTempBtn}
            onClick={() => {
              const val = window.prompt("Digite a temperatura local (°C):", manualTemp?.toString() || "");
              if (val !== null) setManualTemp(val === "" ? null : parseFloat(val));
            }}
          >
            🌡️ Ajustar Termômetro
          </button>
        </div>

        <div className={styles.centerCol}>
          <SequenceBuilder
            onEnqueueSequence={handleEnqueueSequence}
            existingQueue={queue}
          />
          <div className={styles.card}>
            <div className={styles.cardTitle}>Anúncios Rápidos Soltos</div>
            <div className={styles.quickGrid}>
              {quickButtons.map(btn => (
                <button
                  key={btn.type}
                  className={styles.quickBtn}
                  style={{ color: btn.color, borderColor: btn.color } as any}
                  onClick={() => enqueue(btn.type)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <QueuePanel
            queue={queue}
            isSpeaking={isSpeaking}
            onStop={stop}
            playbackTime={playbackTime}
            playbackStatus={playbackStatus}
            onTogglePause={togglePause}
            onSkip={skipNext}
            onRestart={restartTrack}
          />
          <LogPanel log={log} />
        </div>
      </main>

      {showSettings && (
        <div className={styles.modalOverlay} onClick={() => setShowSettings(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span>⚙️ Configurações da Rádio</span>
              <button className={styles.modalClose} onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              {/* Simplified settings for brevity, similar to original */}
              <label className={styles.formLabel}>Nome da Emissora</label>
              <input className={styles.input} value={tempStation.name} onChange={e => setTempStation(p => ({ ...p, name: e.target.value }))} />
              <label className={styles.formLabel}>Cidade (para clima)</label>
              <input className={styles.input} value={tempStation.city} onChange={e => setTempStation(p => ({ ...p, city: e.target.value }))} />
              <div className={styles.voiceSelect}>
                <button className={`${styles.voiceOption} ${tempStation.gender === 'female' ? styles.voiceActive : ''}`} onClick={() => setTempStation(p => ({ ...p, gender: 'female' }))}>🎙️ Camila</button>
                <button className={`${styles.voiceOption} ${tempStation.gender === 'male' ? styles.voiceActive : ''}`} onClick={() => setTempStation(p => ({ ...p, gender: 'male' }))}>🎙️ Thiago</button>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.saveBtn} onClick={saveSettings}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
