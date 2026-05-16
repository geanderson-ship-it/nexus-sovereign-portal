'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';

interface NicknameModalProps {
  open: boolean;
  defaultName: string;
  onSave: (nickname: string) => void;
}

export function NicknameModal({ open, defaultName, onSave }: NicknameModalProps) {
  const [value, setValue] = useState('');

  const handleSave = () => {
    onSave(value.trim() || defaultName);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm bg-zinc-950 border-primary/30 text-white" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-headline text-center">
            Olá, {defaultName.split(' ')[0]}! 👋
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Como prefere ser chamado aqui na Nexus?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Input
            placeholder={`Ex: ${defaultName.split(' ')[0]}, Comandante...`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="bg-black/30 border-zinc-700 text-white placeholder:text-zinc-500 text-center text-lg h-12"
            autoFocus
          />
          <p className="text-xs text-zinc-500 text-center">
            Só aparece aqui no site. Pode mudar quando quiser no seu perfil.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-zinc-700 text-zinc-400 hover:text-white"
              onClick={() => onSave(defaultName.split(' ')[0])}
            >
              Usar {defaultName.split(' ')[0]}
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleSave}
              disabled={!value.trim()}
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
