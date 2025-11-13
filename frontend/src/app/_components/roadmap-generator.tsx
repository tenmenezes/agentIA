"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RoadMapData } from "@/types/roadmap-data.type";
import { ArrowLeft, FileDown, LoaderIcon, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface RoadMapGeneratorProps {
  data: RoadMapData;
  onBack: () => void;
}

export function RoadMapGenerator({ data, onBack }: RoadMapGeneratorProps) {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // função que faz a requisição com a API
  async function startStreaming() {
    const controller = new AbortController();
    controllerRef.current = controller;

    setOutput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        // Permite cancelar a requisição a qualquer momento
        signal: controller.signal,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        setOutput((prev) => prev + decoder.decode(value));
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("REQUEST CANCELADA");
        return;
      }

      console.log(err);
    } finally {
      setIsStreaming(false);
      controllerRef.current = null;
    }
  }

  async function handleGenerate() {
    if (isStreaming) {
      controllerRef.current?.abort();
      setIsStreaming(false);
      return;
    }
    await startStreaming();
  }

  async function handleGeneratePDF() {
    if (!output) return;

    const { jsPDF } = await import("jspdf");
    const { marked } = await import("marked");

    // Cria documento PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    doc.setFont("courier", "normal");

    const margin = 40;
    const maxWidth = 520;
    const pageHeight = doc.internal.pageSize.height;
    let y = margin;

    // Converte Markdown em HTML e depois limpa o texto
    let rawHtml = await marked.parse(output, { breaks: true });
    rawHtml = rawHtml.replace(/[^\x00-\x7F]/g, "");
    
    const plainText = rawHtml
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Define fonte e estilo base
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const lineHeight = 16;

    for (const line of plainText) {
      // Nova página se chegar ao fim
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      // --- Títulos ---
      if (/^#\s/.test(line)) {
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(line.replace(/^#\s*/, ""), margin, y);
        y += lineHeight * 1.5;
      }

      // --- Subtítulos ---
      else if (/^##\s/.test(line)) {
        doc.setFontSize(15);
        doc.setFont("helvetica", "bold");
        doc.text(line.replace(/^##\s*/, ""), margin, y);
        y += lineHeight * 1.3;
      }

      // --- Listas ---
      else if (/^[-*•]\s/.test(line)) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const wrapped = doc.splitTextToSize(
          "• " + line.replace(/^[-*•]\s*/, ""),
          maxWidth
        );
        doc.text(wrapped, margin + 10, y);
        y += wrapped.length * lineHeight;
      }

      // --- Texto normal ---
      else {
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const wrapped = doc.splitTextToSize(line, maxWidth);
        doc.text(wrapped, margin, y);
        y += wrapped.length * lineHeight;
      }

      // Espaço extra entre blocos
      y += 6;
    }

    // Salva com nome seguro
    const nomeArquivo = (data?.nome || "roadmap").replace(/[^\w\s-]/g, "");
    doc.save(`${nomeArquivo}-roadmap.pdf`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-4xl border-0 p-4 md:p-6">
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            className="cursor-pointer gap-2"
            size="lg"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <Button
            className="cursor-pointer gap-2"
            size="lg"
            onClick={handleGenerate}
          >
            {isStreaming ? (
              <LoaderIcon className="animate-spin delay-100 transition" />
            ) : (
              <Sparkles className="w-6 h-6 delay-100 transition" />
            )}
            {isStreaming ? "Parar" : "Gerar RoadMap"}
          </Button>

          {output && (
            <Button
              variant="outline"
              className="cursor-pointer gap-2"
              size="lg"
              onClick={handleGeneratePDF}
            >
              <FileDown className="w-5 h-5" />
            </Button>
          )}
        </div>

        {output && (
          <div
            ref={outputRef}
            className="bg-carg rounded-lg p-6 border border-border max-h-[500px] overflow-y-auto"
          >
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl font-bold text-gray-700 my-1"
                      {...props}
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-2xl font-bold text-blue-900 mb-1"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-lg font-bold text-blue-900 mb-1"
                      {...props}
                    />
                  ),
                  hr: () => (
                    <hr className="my-6 border-t-2 border-red-700/40 rounded-full" />
                  ),
                }}
              >
                {output}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
