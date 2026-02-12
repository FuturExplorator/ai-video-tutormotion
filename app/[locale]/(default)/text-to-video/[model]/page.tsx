"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { authEventBus } from "@/lib/auth-event";
import { Upload, X, Play, Download, Wand2 } from "lucide-react";

// Reuse Google Auth Handler
function GoogleAuthHandler() {
  const t = useTranslations('ai_image');
  const [searchParams] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  useEffect(() => {
    sessionStorage.removeItem('google_oauth_in_progress');
    sessionStorage.removeItem('user_opened_sign_modal');

    const authToken = searchParams.get('auth_token');
    const refreshToken = searchParams.get('refresh_token');

    if (authToken) {
      console.log('[GoogleAuthHandler] Found auth token in URL params');
      localStorage.setItem("aiHubToken", authToken);
      localStorage.setItem("aiHubToken_full", JSON.stringify({
        token: authToken,
        refreshToken: refreshToken || '',
        expire: 7200,
        refreshExpire: 604800,
        loginTime: Date.now()
      }));

      toast.success(t('login_success'));

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('auth_token');
      newUrl.searchParams.delete('refresh_token');
      window.history.replaceState({}, '', newUrl.pathname);
      window.location.reload();
    }
  }, [searchParams]);

  return null;
}

export default function TutorialGeneratorPage() {
  const t = useTranslations('ai_image'); // Keeping 'ai_image' namespace for now to avoid breaking translations
  const locale = useLocale();
  const { data: session } = useSession();

  const [prompt, setPrompt] = useState("");
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  // Save redirect URL for login
  const saveRedirectUrl = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('loginRedirectUrl', window.location.pathname);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setReferenceImage(null);
    setReferenceImagePreview(null);
  };

  const handleGenerate = async () => {
    if (!session) {
      saveRedirectUrl();
      toast.error(t('login_to_get_credits'));
      authEventBus.emit({ type: 'login-expired', message: t('login_to_get_credits') });
      return;
    }

    if (!referenceImage) {
      toast.error("Please upload a screenshot first.");
      return;
    }

    setIsGenerating(true);
    setGeneratedVideo(null);

    try {
      // In a real app, we would upload the image to S3/Storage first and get a URL.
      // For this MVP mock, we'll convert the image to base64 or just pretend to use it.

      // Let's assume we send the base64 for now if small, or just mock it.
      // For the API call, we'll send the prompt and a placeholder for the image.

      console.log('Starting Tutorial Generation...', { prompt, image: referenceImage.name });

      const response = await fetch('/api/ai/text-to-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'language': locale,
        },
        body: JSON.stringify({
          prompt,
          image_name: referenceImage.name, // Mocking image handling
          duration: "5",
          aspectRatio: "16:9",
          motion_bucket_id: "127",
        }),
      });

      const result = await response.json();

      if (response.status === 401 || result.code === 401) {
        authEventBus.emit({
          type: 'login-expired',
          message: result.message || t('login_expired')
        });
        toast.error(result.message || t('login_expired'));
        return;
      }

      if (result.code === 1000 && result.data?.videoUrl) {
        setGeneratedVideo(result.data.videoUrl);
        toast.success(t('generation_success'));
      } else {
        toast.error(result.message || t('generation_failed'));
      }

    } catch (error: any) {
      console.error('Generation Error:', error);
      toast.error(error.message || t('generation_error'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <GoogleAuthHandler />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="container mx-auto px-4 pt-10 pb-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-semibold uppercase tracking-wide">
              Beta
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
              Screenshot to Video Tutorial
            </h1>
            <p className="text-muted-foreground">
              Upload a screenshot of your UI and let AI animate usage instructions.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Input Column */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">1</span>
                  Upload Screenshot
                </h3>

                {!referenceImagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 hover:border-purple-500 transition-all bg-muted/10">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-4 bg-background rounded-full mb-3 shadow-sm text-purple-600">
                        <Upload className="w-8 h-8" />
                      </div>
                      <p className="mb-2 text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 5MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-border group">
                    <img src={referenceImagePreview} alt="Preview" className="w-full h-auto max-h-[400px] object-contain bg-black/5" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">2</span>
                  Describe Interaction
                </h3>
                <div className="relative">
                  <Textarea
                    placeholder="E.g. The mouse cursor moves to the 'Settings' button and clicks it, opening the dropdown menu."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-none text-base p-4 border-border focus:ring-purple-500/20 focus:border-purple-500"
                  />
                  <div className="absolute bottom-3 right-3">
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-purple-600">
                      <Wand2 className="w-3 h-3 mr-1" /> Enhance
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!referenceImage || isGenerating}
                className="w-full h-14 text-lg font-medium rounded-xl shadow-lg shadow-purple-500/20 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Animating Screenshot...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play className="w-5 h-5 fill-current" /> Generate Video Tutorial
                  </span>
                )}
              </Button>
              {!session && (
                <p className="text-sm text-center text-muted-foreground mt-2">
                  Sign in to save your generation history
                </p>
              )}
            </div>

            {/* Output Column */}
            <div className="lg:h-full">
              <div className={`h-full bg-muted/20 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-8 transition-colors ${generatedVideo ? 'bg-card border-solid border-purple-500/20' : ''}`}>
                {isGenerating ? (
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-muted/30"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl animate-pulse">✨</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-medium text-foreground mb-2">Creating Magic</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                      AI is analyzing your UI elements and generating smooth transitions...
                    </p>
                  </div>
                ) : generatedVideo ? (
                  <div className="w-full space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black aspect-video group">
                      <video
                        src={generatedVideo}
                        controls
                        autoPlay
                        loop
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        className="flex-1" variant="outline"
                        onClick={() => window.open(generatedVideo, '_blank')}
                      >
                        Open New Tab
                      </Button>
                      <Button
                        className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = generatedVideo;
                          link.download = `tutormotion-${Date.now()}.mp4`;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" /> Download MP4
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground opacity-50">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Preview Area</h3>
                    <p className="text-sm">Your generated tutorial will appear here</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}
