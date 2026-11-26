"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, Eye, Save, X } from "lucide-react";
import { StepperPills } from "@/components/add-journey/stepper-pills";
import { StepDestination } from "@/components/add-journey/step-destination";
import { StepExperiences } from "@/components/add-journey/step-experiences";
import { StepMemories } from "@/components/add-journey/step-memories";
import { LivePreviewCard } from "@/components/add-journey/live-preview-card";
import { SuccessScreen } from "@/components/add-journey/success-screen";
import { DraftPatch, JourneyDraft, emptyDraft } from "@/components/add-journey/journey-draft";
import { usePlaces, useCreateJourney } from "@/lib/api";
import { placeProvince } from "@/lib/province-map";
import { provinces } from "@/lib/vietnam-provinces";
import { journeyStats } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

export function AddJourneyWizard({ isModal }: { isModal: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<JourneyDraft>(emptyDraft);
  const [previewOpen, setPreviewOpen] = useState(true);
  const { data: places } = usePlaces();
  const createJourney = useCreateJourney();

  const visitedNames = useMemo(
    () => new Set((places ?? []).map((p) => placeProvince[p.id]).filter((v): v is string => Boolean(v))),
    [places],
  );

  const isNewProvince = useMemo(() => {
    if (!draft.province) return false;
    const asciiName = provinces.find((p) => p.name === draft.province)?.asciiName;
    return Boolean(asciiName) && !visitedNames.has(asciiName!);
  }, [draft.province, visitedNames]);

  function patchDraft(patch: DraftPatch) {
    setDraft((d) => ({ ...d, ...(typeof patch === "function" ? patch(d) : patch) }));
  }

  function close() {
    if (isModal) router.back();
    else router.push("/");
  }

  function reset() {
    createJourney.reset();
    setDraft(emptyDraft);
    setStep(1);
  }

  async function handleSave() {
    await createJourney.mutateAsync(draft);
  }

  const canContinueStep1 = draft.province !== null && draft.placeName.trim().length > 0;

  if (createJourney.data) {
    return (
      <ModalFrame onBackdropClick={close} onClose={close}>
        <SuccessScreen
          place={createJourney.data.place}
          isNewProvince={isNewProvince}
          checklistCreatedCount={createJourney.data.checklistCreatedCount}
          onAddAnother={reset}
          onViewMap={() => router.push("/map")}
        />
      </ModalFrame>
    );
  }

  const headerEyebrow = `CHƯƠNG MỚI · HÀNH TRÌNH #${journeyStats.destinationsCount + 1}`;
  const stepLabel = step === 1 ? "Điểm đến" : step === 2 ? "Trải nghiệm" : "Kỷ niệm";

  const stepContent =
    step === 1 ? (
      <StepDestination draft={draft} onChange={patchDraft} visitedNames={visitedNames} />
    ) : step === 2 ? (
      <StepExperiences draft={draft} onChange={patchDraft} />
    ) : (
      <StepMemories draft={draft} onChange={patchDraft} />
    );

  return (
    <>
      {/* ---------- DESKTOP ---------- */}
      <div className="fixed inset-0 z-50 hidden items-center justify-center bg-background/80 p-4 backdrop-blur-md md:flex lg:p-8" onClick={close}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[88vh] w-full max-w-[960px] flex-col overflow-hidden rounded-3xl bg-card shadow-2xl"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_50%_0%,rgba(255,90,60,0.16)_0%,rgba(0,0,0,0)_75%)]" />

          <header className="relative flex shrink-0 flex-col gap-4 bg-secondary/40 px-8 pb-5 pt-7">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_#ff5a3c]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">{headerEyebrow}</span>
                </div>
                <h2 className="mt-1 font-heading text-3xl tracking-tight">Thêm chuyến đi</h2>
              </div>
              <button
                aria-label="Đóng hộp thoại"
                onClick={close}
                className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex items-center justify-between pt-1">
              <StepperPills current={step} />
              <span className="font-mono text-xs tracking-wider text-muted-foreground">Bước {step}/3</span>
            </div>
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-12 overflow-y-auto">
            <section className="col-span-7 space-y-6 px-8 py-6">{stepContent}</section>
            <aside className="col-span-5 flex flex-col justify-between bg-muted/30 px-6 py-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="size-2 animate-pulse rounded-full bg-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Xem trước thẻ hành trình</span>
                </div>
                <LivePreviewCard draft={draft} step={step} />
              </div>
            </aside>
          </div>

          <footer className="relative flex shrink-0 items-center justify-between bg-secondary/40 px-8 py-4">
            <button className="flex items-center gap-1.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <Save className="size-4" />
              Lưu nháp
            </button>
            <div className="flex items-center gap-3">
              {step === 1 ? (
                <button onClick={close} className="rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground">
                  Hủy
                </button>
              ) : (
                <button
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="flex items-center gap-1.5 rounded-full bg-muted px-5 py-2.5 text-sm font-medium transition-all hover:bg-muted/70"
                >
                  <ArrowLeft className="size-4" />
                  Quay lại
                </button>
              )}
              {step < 3 ? (
                <button
                  disabled={step === 1 && !canContinueStep1}
                  onClick={() => setStep((s) => (s + 1) as Step)}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-entity-shared px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(255,90,60,0.4)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Tiếp tục sang {step === 1 ? "Trải nghiệm" : "Kỷ niệm"}
                  <ArrowRight className="size-4" />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={createJourney.isPending}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-entity-shared px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(255,90,60,0.4)] transition-all hover:brightness-110 disabled:opacity-60"
                >
                  <Check className="size-4" />
                  {createJourney.isPending ? "Đang lưu..." : "Lưu chuyến đi"}
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>

      {/* ---------- MOBILE ---------- */}
      <div className="fixed inset-0 z-50 flex items-end bg-background/70 backdrop-blur-md md:hidden" onClick={close}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-card shadow-2xl"
        >
          <div className="flex flex-col items-center gap-3 bg-card/95 pb-2 pt-3 backdrop-blur-lg">
            <span className="h-1 w-10 rounded-full bg-border" />
            <div className="flex w-full items-center justify-between px-5">
              <span className="text-sm font-semibold text-muted-foreground">Bước {step}/3: {stepLabel}</span>
              <button onClick={close} className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-28">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{headerEyebrow}</span>
            </div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">Thêm chuyến đi</h1>
            <div className="mt-2 flex items-center gap-1.5">
              {[1, 2, 3].map((n) => (
                <span key={n} className={cn("h-1.5 rounded-full", n === step ? "w-7 bg-primary shadow-[0_0_12px_rgba(255,90,60,0.45)]" : "w-2 bg-muted")} />
              ))}
            </div>

            <section className="mt-4 overflow-hidden rounded-2xl bg-muted/50 p-3 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                  <Eye className="size-4 text-primary" />
                  Xem trước thẻ
                </span>
                <button
                  onClick={() => setPreviewOpen((o) => !o)}
                  className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {previewOpen ? "Thu gọn" : "Mở rộng"}
                  <ChevronDown className={cn("size-3.5 transition-transform", previewOpen && "rotate-180")} />
                </button>
              </div>
              {previewOpen && <LivePreviewCard draft={draft} step={step} />}
            </section>

            <div className="mt-5">{stepContent}</div>
          </div>

          <div className="sticky bottom-0 z-10 flex flex-col gap-2 border-t border-border bg-card/95 px-5 pb-safe pt-3 backdrop-blur-lg">
            {step < 3 ? (
              <button
                disabled={step === 1 && !canContinueStep1}
                onClick={() => setStep((s) => (s + 1) as Step)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-entity-shared text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(255,90,60,0.4)] transition-transform active:scale-[0.98] disabled:opacity-40"
              >
                Tiếp tục sang {step === 1 ? "Trải nghiệm" : "Kỷ niệm"}
                <ArrowRight className="size-[18px]" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={createJourney.isPending}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-entity-shared text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(255,90,60,0.4)] transition-transform active:scale-[0.98] disabled:opacity-60"
              >
                <Check className="size-[18px]" />
                {createJourney.isPending ? "Đang lưu..." : "Tạo chuyến đi mới"}
              </button>
            )}
            <div className="flex items-center justify-between pb-2">
              {step > 1 ? (
                <button onClick={() => setStep((s) => (s - 1) as Step)} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowLeft className="size-3.5" />
                  Quay lại
                </button>
              ) : (
                <span />
              )}
              <button onClick={close} className="flex items-center gap-1 text-xs text-muted-foreground">
                <Bookmark className="size-3.5" />
                Lưu nháp &amp; Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ModalFrame({
  children,
  onBackdropClick,
  onClose,
}: {
  children: React.ReactNode;
  onBackdropClick: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
      onClick={onBackdropClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-[740px] flex-col overflow-y-auto rounded-3xl bg-card shadow-2xl"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_50%_0%,rgba(255,90,60,0.2)_0%,rgba(0,0,0,0)_75%)]" />
        <button
          aria-label="Đóng cửa sổ"
          onClick={onClose}
          className="absolute right-6 top-6 z-20 flex size-10 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
