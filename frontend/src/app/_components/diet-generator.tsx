"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DietData } from "@/types/diet-data.type";
import { LoaderIcon, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";


export function DietGenerator({ data }: { data: DietData }) {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const outputRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);
  
  const controllerRef = useRef<AbortController | null>(null);

  // função que faz a requisição com a API
  async function startStreaming() {
    const controller = new AbortController();
    controllerRef.current = controller;

    setOutput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/plan", {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-4xl border-0 p-4 md:p-6">
        <div className="flex justify-between gap-4">
          <Button
            className="cursor-pointer gap-2"
            size="lg"
            onClick={handleGenerate}
          >
            {isStreaming ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
            {isStreaming ? "Parar" : "Gerar dieta"}
          </Button>
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
                      className="text-xl font-bold text-green-700 my-1"
                      {...props}
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-2xl font-bold text-zinc-900 mb-1"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-lg font-bold text-zinc-900 mb-1"
                      {...props}
                    />
                  ),
                  hr: () => (
                    <hr className="my-6 border-t-2 border-green-700/40 rounded-full" />
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
