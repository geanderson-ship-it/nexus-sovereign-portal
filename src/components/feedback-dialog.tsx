'use client';

import { useState, useRef, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  MessageSquarePlus, 
  Mic, 
  Square, 
  Trash2, 
  Camera as CameraIcon, 
  X, 
  Loader2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLocale } from '@/hooks/use-locale';

export function FeedbackDialog() {
  const { t } = useLocale();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording", err);
      toast({
        variant: "destructive",
        title: t('common.error' as any) || "Erro",
        description: t('feedback.toast.recordError'),
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!text && !audioBase64 && images.length === 0) {
      toast({
        variant: "destructive",
        title: t('common.error' as any) || "Erro",
        description: t('feedback.toast.empty'),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!firestore) throw new Error("Firestore not initialized");

      await addDoc(collection(firestore, 'feedbacks'), {
        userId: user?.uid || 'anonymous',
        userName: user?.displayName || 'Anônimo',
        userEmail: user?.email || '',
        text,
        audioBase64,
        images,
        module: 'dante-safra',
        status: 'new',
        createdAt: serverTimestamp(),
      });

      setIsSubmitted(true);
      toast({
        title: t('common.success' as any) || "Sucesso",
        description: t('feedback.toast.success'),
      });
      
      // Reset after 2 seconds and close
      setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 2000);

    } catch (err: any) {
      console.error("Error submitting feedback", err);
      toast({
        variant: "destructive",
        title: t('common.error' as any) || "Erro",
        description: err.message || "Ocorreu um erro ao enviar seu feedback.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setText('');
    setImages([]);
    setAudioBase64(null);
    setIsSubmitted(false);
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) resetForm(); }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20">
          <MessageSquarePlus className="h-5 w-5" />
          <span className="sr-only">{t('feedback.trigger')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-emerald-800 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-emerald-400 flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5" />
            {t('feedback.title')}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {t('feedback.description')}
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-in zoom-in duration-300" />
            <p className="text-xl font-medium">{t('feedback.success.title')}</p>
            <p className="text-gray-400 text-center">{t('feedback.success.description')}</p>
          </div>
        ) : (
          <div className="grid gap-4 py-4 overflow-hidden">
            <div className="grid gap-2">
              <Label htmlFor="feedback-text" className="text-sm font-medium">{t('feedback.form.text')}</Label>
              <Textarea 
                id="feedback-text" 
                placeholder={t('feedback.form.textPlaceholder')} 
                className="bg-black/50 border-gray-700 focus:border-emerald-600 min-h-[100px] text-gray-200 w-full"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">{t('feedback.form.voice')}</Label>
              <div className="flex items-center gap-3 bg-black/30 p-3 rounded-md border border-gray-800">
                {isRecording ? (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={stopRecording}
                    className="flex items-center gap-2 animate-pulse"
                  >
                    <Square className="h-4 w-4 fill-current" />
                    {t('feedback.form.stop')} ({formatDuration(recordingDuration)})
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={startRecording}
                    className="flex items-center gap-2 border-emerald-700 text-emerald-400 hover:bg-emerald-950/30"
                    disabled={!!audioBase64}
                  >
                    <Mic className="h-4 w-4" />
                    {audioBase64 ? t('feedback.form.recorded') : t('feedback.form.record')}
                  </Button>
                )}
                
                {audioBase64 && !isRecording && (
                  <div className="flex items-center gap-2 flex-1">
                    <audio src={audioBase64} controls className="h-8 flex-1" />
                    <Button variant="ghost" size="icon" onClick={() => setAudioBase64(null)} className="h-8 w-8 text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-medium">{t('feedback.form.images')}</Label>
              <div className="flex flex-wrap gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 border border-gray-700 rounded-md overflow-hidden group">
                    <img src={img} alt={`Feedback ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 border-2 border-dashed border-gray-700 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-emerald-600 hover:bg-emerald-950/10 transition-colors">
                  <CameraIcon className="h-6 w-6 text-gray-500" />
                  <span className="text-[10px] text-gray-500 mt-1">{t('feedback.form.attach')}</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="border-t border-gray-800 pt-4">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting}>{t('feedback.cta.cancel')}</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || isSubmitted || (!text && !audioBase64 && images.length === 0)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white min-w-[100px]"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('feedback.cta.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
