// src/pages/Support.jsx
import { asset } from "../utils/asset";

export default function Support() {
  return (
    <main className="container">
      <div className="support-card">
        <div className="support-header">
          <img src={asset("logo-pe.png")} alt="" width={40} height={40} style={{borderRadius:8}}/>
          <div>
            <h1>Soporte técnico</h1>
            <p>CABA / GBA · Lun–Sáb 9:00–19:00</p>
          </div>
        </div>

        <h3>Néstor Raúl Verón</h3>
        <ul className="bullets">
          <li>Colocación e instalación de aires acondicionados</li>
          <li>Mantenimiento y carga de gas</li>
          <li>Reparación de heladeras y freezers</li>
          <li>Diagnóstico a domicilio</li>
        </ul>

        <div className="btn-row">
          <a className="btn btn--primary" href="tel:+5491122334455">Llamar: +54 9 11 2233-4455</a>
          <a className="btn btn--wa" href="https://wa.me/5491122334455" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>
    </main>
  );
}
