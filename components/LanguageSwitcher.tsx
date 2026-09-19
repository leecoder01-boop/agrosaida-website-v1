"use client";

import { useEffect, useRef, useState } from "react";

type Lang = "pt" | "es" | "en";

const translations: Record<string, { es: string; en: string }> = {
  "Sobre": { es: "Nosotros", en: "About" },
  "Soluções": { es: "Soluciones", en: "Solutions" },
  "Catálogo": { es: "Catálogo", en: "Catalog" },
  "Contato": { es: "Contacto", en: "Contact" },
  "DA TERRA NASCE O FUTURO": { es: "DE LA TIERRA NACE EL FUTURO", en: "THE FUTURE GROWS FROM THE LAND" },
  "Explorar soluções": { es: "Explorar soluciones", en: "Explore solutions" },
  "SOBRE A AGROSAIDA": { es: "SOBRE AGROSAIDA", en: "ABOUT AGROSAIDA" },
  "Produtos agropecuários e veterinários, rações, ferramentas, selaria e muito mais!": { es: "Productos agropecuarios y veterinarios, alimentos, herramientas, talabartería y mucho más.", en: "Farm and veterinary products, animal feed, tools, saddlery and much more." },
  "Há mais de 20 anos no mercado, a Agrosaida é referência em soluções completas para o produtor rural. Oferecemos uma linha ampla de produtos de qualidade, desde rações balanceadas até equipamentos de proteção, sempre com o compromisso de entregar o melhor para sua propriedade.": { es: "Con más de 20 años en el mercado, Agrosaida es referente en soluciones completas para el productor rural. Ofrecemos una amplia línea de productos de calidad para su propiedad.", en: "With more than 20 years in the market, Agrosaida is a trusted source of complete solutions for rural producers. We offer a wide range of quality products for your property." },
  "Nossa equipe está pronta para atender você com consultoria técnica e suporte especializado, garantindo que você encontre exatamente o que precisa para cada fase do ciclo produtivo.": { es: "Nuestro equipo está listo para atenderle con asesoría técnica y soporte especializado en cada etapa del ciclo productivo.", en: "Our team is ready to help with technical guidance and specialized support at every stage of the production cycle." },
  "Falar com a Agrosaida": { es: "Hablar con Agrosaida", en: "Talk to Agrosaida" },
  "MINI CATÁLOGO": { es: "MINI CATÁLOGO", en: "MINI CATALOG" },
  "Soluções para cada rotina no campo.": { es: "Soluciones para cada rutina en el campo.", en: "Solutions for every routine in the field." },
  "Rações": { es: "Alimentos", en: "Animal feed" },
  "Remédios": { es: "Medicamentos", en: "Medicine" },
  "Equipamentos": { es: "Equipos", en: "Equipment" },
  "LINHA DE RAÇÕES": { es: "LÍNEA DE ALIMENTOS", en: "ANIMAL FEED RANGE" },
  "Nutrição de ponta para cada animal.": { es: "Nutrición de primera para cada animal.", en: "Premium nutrition for every animal." },
  "Deslize e conheça rações, sachês e petiscos para cães e gatos disponíveis na Agrosaida.": { es: "Deslice y conozca alimentos, sobres y snacks para perros y gatos disponibles en Agrosaida.", en: "Browse feed, pouches and treats for dogs and cats available at Agrosaida." },
  "MEDICAMENTOS": { es: "MEDICAMENTOS", en: "MEDICINE" },
  "Saúde do seu rebanho em primeiro lugar.": { es: "La salud de su rebaño en primer lugar.", en: "Your herd's health comes first." },
  "Vermífugos, antiparasitários e suplementos para manter seus animais sempre saudáveis.": { es: "Desparasitantes y suplementos para mantener sanos a sus animales.", en: "Dewormers, antiparasitics and supplements to keep your animals healthy." },
  "BOTAS & CHAPÉUS": { es: "BOTAS Y SOMBREROS", en: "BOOTS & HATS" },
  "Equipado para o trabalho no campo.": { es: "Equipado para el trabajo en el campo.", en: "Equipped for work in the field." },
  "Botas e chapéus de qualidade, feitos para durar e proteger você em cada jornada.": { es: "Botas y sombreros de calidad, hechos para durar y protegerle cada día.", en: "Quality boots and hats, made to last and protect you every day." },
  "PEDIR ORÇAMENTO": { es: "PEDIR PRESUPUESTO", en: "REQUEST A QUOTE" },
  "FALE COM A AGROSAIDA": { es: "HABLE CON AGROSAIDA", en: "TALK TO AGROSAIDA" },
  "Estamos perto de quem vive o campo.": { es: "Estamos cerca de quienes viven el campo.", en: "We stay close to those who live the land." },
  "Visite nossa loja ou fale com a equipe para encontrar produtos e orientações para sua rotina.": { es: "Visite nuestra tienda o hable con el equipo para encontrar productos y orientación.", en: "Visit our store or talk to our team to find products and guidance for your routine." },
  "CONTATOS DEMONSTRATIVOS": { es: "CONTACTOS DE DEMOSTRACIÓN", en: "DEMO CONTACTS" },
  "Telefone": { es: "Teléfono", en: "Phone" },
  "Como chegar": { es: "Cómo llegar", en: "Directions" },
  "Clique no mapa para abrir a rota no Google Maps.": { es: "Haga clic en el mapa para abrir la ruta en Google Maps.", en: "Click the map to open directions in Google Maps." },
};

const originalText = new WeakMap<Text, string>();

function translatePage(lang: Lang) {
  document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode() as Text | null;
  while (node) {
    const parent = node.parentElement;
    if (parent && !parent.closest("script,style,[data-no-translate]")) {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue || "");
      const original = originalText.get(node) || "";
      const trimmed = original.trim();
      const translated = lang === "pt" ? trimmed : translations[trimmed]?.[lang] || trimmed;
      if (trimmed && translated !== trimmed) node.nodeValue = original.replace(trimmed, translated);
      else if (lang === "pt") node.nodeValue = original;
    }
    node = walker.nextNode() as Text | null;
  }
}

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<Lang>("pt");
  const langRef = useRef<Lang>("pt");

  useEffect(() => {
    const saved = (localStorage.getItem("agrosaida-language") as Lang | null) || "pt";
    langRef.current = saved;
    setLang(saved);
    translatePage(saved);
    const observer = new MutationObserver(() => translatePage(langRef.current));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const choose = (next: Lang) => {
    langRef.current = next;
    setLang(next);
    localStorage.setItem("agrosaida-language", next);
    translatePage(next);
  };

  return (
    <div data-no-translate className="absolute right-0 top-[calc(100%+8px)] flex gap-1.5 rounded-full border border-white/15 bg-[#07110b]/95 p-1.5 shadow-xl backdrop-blur-md" aria-label="Idioma">
      {([['pt', '🇧🇷', 'Português'], ['es', '🇪🇸', 'Español'], ['en', '🇺🇸', 'English']] as const).map(([code, flag, label]) => (
        <button key={code} type="button" onClick={() => choose(code)} title={label} aria-label={label} className={`flex h-8 w-10 items-center justify-center rounded-full text-base transition ${lang === code ? "bg-[#4a7c38] scale-105" : "hover:bg-white/10"}`}>
          {flag}
        </button>
      ))}
    </div>
  );
}
