"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Upload, X, Star, StarOff, Trash2, ImagePlus,
  AlertCircle, CheckCircle, Loader2, GripVertical,
} from "lucide-react";
import { validateImageFile, fileToDataUrl, cn } from "@/lib/utils";
import { uploadProductImage, deleteProductImage } from "@/lib/imageStorage";
import type { ProductImage } from "@/types";
import { IMAGE_CONSTRAINTS } from "@/types";

interface Props {
  productId:  number;
  images:     ProductImage[];
  onChange:   (images: ProductImage[]) => void;
  maxImages?: number;
}

interface UploadState {
  id:       string;
  file:     File;
  preview:  string;
  progress: number;
  status:   "pending" | "uploading" | "done" | "error";
  error?:   string;
}

export function ImageUploader({
  productId,
  images,
  onChange,
  maxImages = IMAGE_CONSTRAINTS.maxPerProduct,
}: Props) {
  const [uploads, setUploads]   = useState<UploadState[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Upload handler ────────────────────────────────────────
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files);
    const remaining = maxImages - images.length - uploads.filter(u => u.status !== "error").length;
    const toProcess = list.slice(0, Math.max(0, remaining));

    if (toProcess.length === 0) {
      alert(`Maximum ${maxImages} images per product.`);
      return;
    }

    // Build initial states with previews
    const newStates: UploadState[] = await Promise.all(
      toProcess.map(async (file) => {
        const validation = validateImageFile(file);
        const preview    = await fileToDataUrl(file).catch(() => "");
        return {
          id:       `up_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          file,
          preview,
          progress: 0,
          status:   validation.valid ? ("pending" as const) : ("error" as const),
          error:    validation.error,
        };
      })
    );

    setUploads(prev => [...prev, ...newStates]);

    // Upload valid files
    for (const state of newStates) {
      if (state.status === "error") continue;

      setUploads(prev => prev.map(u => u.id === state.id
        ? { ...u, status: "uploading", progress: 10 } : u));

      try {
        const isPrimary = images.length === 0 &&
          newStates.filter(s => s.status !== "error").indexOf(state) === 0;

        // Simulate progress ticks
        const ticker = setInterval(() => {
          setUploads(prev => prev.map(u =>
            u.id === state.id && u.progress < 85
              ? { ...u, progress: u.progress + 15 }
              : u
          ));
        }, 200);

        const uploaded = await uploadProductImage(productId, state.file, isPrimary);
        clearInterval(ticker);

        setUploads(prev => prev.map(u =>
          u.id === state.id ? { ...u, status: "done", progress: 100 } : u
        ));

        // Add to images list
        onChange([...images, uploaded]);

        // Clean up done state after 1.5 s
        setTimeout(() => {
          setUploads(prev => prev.filter(u => u.id !== state.id));
        }, 1500);

      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setUploads(prev => prev.map(u =>
          u.id === state.id ? { ...u, status: "error", progress: 0, error: msg } : u
        ));
      }
    }
  }, [images, uploads, maxImages, productId, onChange]);

  // ── Drag and drop ─────────────────────────────────────────
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  // ── Set primary ────────────────────────────────────────────
  function setPrimary(id: string) {
    onChange(images.map(img => ({ ...img, isPrimary: img.id === id })));
  }

  // ── Delete ────────────────────────────────────────────────
  async function handleDelete(img: ProductImage) {
    setDeleting(img.id);
    try {
      await deleteProductImage(productId, img);
      const next = images.filter(i => i.id !== img.id);
      // If deleted was primary, make first remaining primary
      if (img.isPrimary && next.length > 0) next[0].isPrimary = true;
      onChange(next);
    } catch (err) {
      alert("Delete failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setDeleting(null);
    }
  }

  // ── Reorder (swap) ────────────────────────────────────────
  function moveImage(fromIdx: number, toIdx: number) {
    const next = [...images];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    onChange(next.map((img, i) => ({ ...img, order: i })));
  }

  const canUpload = images.length + uploads.filter(u => u.status !== "error").length < maxImages;

  return (
    <div className="space-y-4">

      {/* ── Existing images grid ── */}
      {images.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color:"var(--text-muted)" }}>
            Uploaded Images ({images.length}/{maxImages})
          </p>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={img.id}
                className={cn(
                  "relative group rounded-xl overflow-hidden border-2 transition-all",
                  img.isPrimary ? "border-[var(--gold)]" : "border-transparent hover:border-gray-200"
                )}
                style={{ aspectRatio:"1" }}
              >
                {/* Image */}
                <Image
                  src={img.url}
                  alt={`Product image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                  unoptimized={img.url.startsWith("data:")} // base64 bypass optimization
                />

                {/* Primary badge */}
                {img.isPrimary && (
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1"
                    style={{ background:"var(--gold)", color:"#fff" }}>
                    <Star size={8} />PRIMARY
                  </div>
                )}

                {/* Order indicator */}
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center"
                  style={{ background:"rgba(0,0,0,0.5)", color:"#fff" }}>
                  {idx + 1}
                </div>

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background:"rgba(0,0,0,0.55)" }}>
                  {!img.isPrimary && (
                    <button onClick={() => setPrimary(img.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-white transition-colors hover:bg-yellow-500/80"
                      style={{ background:"rgba(255,255,255,0.15)" }}>
                      <Star size={10} />Set Primary
                    </button>
                  )}
                  {idx > 0 && (
                    <button onClick={() => moveImage(idx, idx - 1)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-white hover:bg-white/20"
                      style={{ background:"rgba(255,255,255,0.12)" }}>
                      ← Move Left
                    </button>
                  )}
                  {idx < images.length - 1 && (
                    <button onClick={() => moveImage(idx, idx + 1)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-white hover:bg-white/20"
                      style={{ background:"rgba(255,255,255,0.12)" }}>
                      Move Right →
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(img)}
                    disabled={deleting === img.id}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-white hover:bg-red-500/80 transition-colors"
                    style={{ background:"rgba(220,38,38,0.6)" }}>
                    {deleting === img.id
                      ? <Loader2 size={10} className="spin" />
                      : <Trash2 size={10} />}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── In-progress uploads ── */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map(u => (
            <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background:"var(--bg-subtle)", border:"1px solid var(--border)" }}>
              {/* Thumb */}
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative" style={{ background:"var(--bg-muted)" }}>
                {u.preview && (
                  <Image src={u.preview} alt="Uploading" fill className="object-cover" sizes="48px" unoptimized />
                )}
              </div>

              {/* Name + status */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color:"var(--text)" }}>{u.file.name}</p>
                <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>
                  {(u.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {u.status === "uploading" && (
                  <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background:"var(--bg-muted)" }}>
                    <div className="h-full rounded-full transition-all duration-300"
                      style={{ width:`${u.progress}%`, background:"var(--gold)" }} />
                  </div>
                )}
                {u.status === "error" && (
                  <p className="text-[10px] text-red-500 mt-0.5">{u.error}</p>
                )}
              </div>

              {/* Status icon */}
              <div className="flex-shrink-0">
                {u.status === "uploading" && <Loader2 size={16} className="spin text-gold-500" style={{ color:"var(--gold)" }} />}
                {u.status === "done"      && <CheckCircle size={16} className="text-emerald-500" />}
                {u.status === "error"     && (
                  <button onClick={() => setUploads(p => p.filter(x => x.id !== u.id))}>
                    <X size={16} className="text-red-400 hover:text-red-600" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Drop zone ── */}
      {canUpload && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200",
            dragOver
              ? "border-[var(--gold)] bg-[var(--gold-pale)] scale-[1.01]"
              : "border-gray-200 hover:border-[var(--gold)] hover:bg-[var(--gold-pale)]/40"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={IMAGE_CONSTRAINTS.allowedExts.join(",")}
            multiple
            className="hidden"
            onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
          />

          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: dragOver ? "var(--gold)" : "var(--gold-pale)" }}>
            <ImagePlus size={22} style={{ color: dragOver ? "#fff" : "var(--gold)" }} />
          </div>

          <p className="text-sm font-semibold mb-1" style={{ color:"var(--text)" }}>
            {dragOver ? "Drop to upload" : "Click to upload or drag & drop"}
          </p>
          <p className="text-xs" style={{ color:"var(--text-muted)" }}>
            JPG, PNG, WebP, AVIF · Max {IMAGE_CONSTRAINTS.maxSizeMB} MB each · Up to {maxImages} images
          </p>

          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Upload size={12} style={{ color:"var(--gold)" }} />
            <span className="text-xs font-medium" style={{ color:"var(--gold)" }}>
              {maxImages - images.length} slot{maxImages - images.length !== 1 ? "s" : ""} remaining
            </span>
          </div>
        </div>
      )}

      {/* ── Full capacity notice ── */}
      {!canUpload && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-xs"
          style={{ background:"var(--gold-pale)", border:"1px solid #E8D5A3" }}>
          <AlertCircle size={14} style={{ color:"var(--gold)" }} />
          <span style={{ color:"var(--text-sec)" }}>
            Maximum {maxImages} images reached. Delete an image to upload more.
          </span>
        </div>
      )}

      {/* ── Tips ── */}
      {images.length > 0 && (
        <div className="text-[10px] space-y-0.5" style={{ color:"var(--text-faint)" }}>
          <p>✦ Hover over any image to set it as primary, reorder, or delete it.</p>
          <p>✦ The primary image is shown in product cards and search results.</p>
          <p>✦ Image order determines the gallery display sequence.</p>
        </div>
      )}
    </div>
  );
}
