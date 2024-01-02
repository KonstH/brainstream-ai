"use client";

import { useEffect, useState } from "react";
import ProModal from "@/components/ProModal";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true) }, [])

  if (!isMounted) return null;

  return (
    <>
      <ProModal />
    </>
  )
}
