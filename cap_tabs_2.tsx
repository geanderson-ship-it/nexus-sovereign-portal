                          <td className="px-4 py-4 text-center">
                            <p className="text-lg font-black text-amber-400">
                              {activeCapTab === 'corte' ? Math.round(linha.capHora / linha.pecasPorCiclo) : Math.round(linha.capHora)}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <p className="text-lg font-black text-emerald-400">
                              {activeCapTab === 'corte' ? Math.round(linha.capTurno / linha.pecasPorCiclo) : Math.round(linha.capTurno)}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* RODAPÉ */}
                <div className="p-5 border-t border-violet-500/10 flex flex-wrap items-center gap-6 text-[9px] text-gray-600 uppercase tracking-widest">
                  {['CORTE','ACABAMENTO','SOLDA','MONTAGEM'].map(s => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full border", setorColor[s])} />
                      <span>{s}</span>
                    </div>
                  ))}
                  <span className="ml-auto">
                    {activeCapTab === 'corte' 
                      ? "Cap/h (Pacotes) = 53 min / Tempo Base  |  Cap/Turno = Cap/h * Horas do Turno" 
                      : "Cap/h (Peças) = (53 min / Tempo Base) * Peças/Ciclo  |  Cap/Turno = Cap/h * Horas do Turno"}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
