import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import type { Document, Canvas, Diagram } from "../types";

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [docs, cvs, dgms] = await Promise.all([
        api.get<Document[]>("/documents"),
        api.get<Canvas[]>("/canvases"),
        api.get<Diagram[]>("/diagrams"),
      ]);
      setDocuments(docs);
      setCanvases(cvs);
      setDiagrams(dgms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { documents, canvases, diagrams, loading, error, refetch: fetchAll };
}
