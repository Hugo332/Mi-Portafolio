"use client";

import { useCallback, useState } from "react";

export type CertificateModalItem = {
  imageUrl: string;
  title: string;
  institution?: string;
  date?: string;
};

export function useCertificateModal() {
  const [item, setItem] = useState<CertificateModalItem | null>(null);

  const open = useCallback((next: CertificateModalItem) => {
    setItem(next);
  }, []);

  const close = useCallback(() => {
    setItem(null);
  }, []);

  return { item, isOpen: item !== null, open, close };
}
