import { Suspense } from "react";
import GestioneUtentiClient from "./GestioneUtentiClient";

export default function GestioneUtentiPage() {
  return (
    <Suspense fallback={<div>Caricamento pagina...</div>}>
      <GestioneUtentiClient />
    </Suspense>
  );
}
