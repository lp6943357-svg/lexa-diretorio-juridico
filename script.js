document.addEventListener("DOMContentLoaded", () => {
  const config = window.SITE_CONFIG || {};
  const officeImage = document.querySelector(".aside-image");
  const lawyerImage = document.querySelector(".feature-visual");
  if (officeImage) officeImage.style.backgroundImage = `url("${config.images.office}")`;
  if (lawyerImage) lawyerImage.style.backgroundImage = `url("${config.images.lawyer}")`;
  document.querySelector("#year").textContent = String(new Date().getFullYear());

  const starterProfiles = [
    { id: "p-helena", name: "Helena Vasconcelos Advocacia", type: "Escritório", specialties: ["Direito Empresarial", "Contratos"], city: "São Paulo — SP", address: "Av. Brigadeiro Faria Lima, 1656 · Pinheiros", phone: "(11) 3030-1840", whatsapp: "5511998765432", hours: "Seg — Sex · 09:00 — 18:00", description: "Estratégia jurídica para empresas que estão construindo o próximo capítulo. Atendimento próximo e visão preventiva.", photo: config.images.lawyer, featured: true },
    { id: "p-marcelo", name: "Marcelo Nogueira Advocacia", type: "Advogado autônomo", specialties: ["Direito Civil", "Imobiliário"], city: "Rio de Janeiro — RJ", address: "Rua Visconde de Pirajá, 550 · Ipanema", phone: "(21) 3232-0909", whatsapp: "5521987654321", hours: "Seg — Qui · 08:30 — 17:30", description: "Atuação clara e cuidadosa em contratos, negócios imobiliários e resolução de conflitos.", photo: config.images.lawyerTwo, featured: true },
    { id: "p-clara", name: "Clara Ribeiro Direito de Família", type: "Advogada autônoma", specialties: ["Direito de Família", "Sucessões"], city: "Belo Horizonte — MG", address: "Rua Sergipe, 925 · Savassi", phone: "(31) 3264-1100", whatsapp: "5531991122334", hours: "Seg — Sex · 09:00 — 18:00", description: "Acolhimento e orientação responsável para decisões familiares que pedem sensibilidade e segurança.", photo: config.images.lawyer, featured: false },
    { id: "p-andre", name: "André Costa Advocacia Trabalhista", type: "Escritório", specialties: ["Direito Trabalhista", "Previdenciário"], city: "Curitiba — PR", address: "Al. Dr. Carlos de Carvalho, 431 · Centro", phone: "(41) 3344-2211", whatsapp: "5541994455667", hours: "Seg — Sex · 08:00 — 18:00", description: "Experiência para orientar relações de trabalho com transparência, preparo e agilidade.", photo: config.images.lawyerTwo, featured: false },
    { id: "p-luiza", name: "Luiza Campos Consultoria Jurídica", type: "Advogada autônoma", specialties: ["LGPD", "Direito Digital"], city: "Recife — PE", address: "Av. Boa Viagem, 120 · Boa Viagem", phone: "(81) 3123-4040", whatsapp: "5581997788990", hours: "Ter — Sex · 09:00 — 17:00", description: "Consultoria para negócios digitais que precisam transformar complexidade regulatória em decisões possíveis.", photo: config.images.lawyer, featured: false },
    { id: "p-ricardo", name: "Ricardo Azevedo Criminal", type: "Advogado autônomo", specialties: ["Direito Penal", "Tribunal do Júri"], city: "Porto Alegre — RS", address: "Rua Mostardeiro, 333 · Moinhos de Vento", phone: "(51) 3012-7766", whatsapp: "5551996655443", hours: "Atendimento com hora marcada", description: "Defesa técnica, presença e estratégia em momentos que exigem experiência e serenidade.", photo: config.images.lawyerTwo, featured: false }
  ];

  const storageKey = "lexa-profiles-v1";
  let profiles = [...starterProfiles];
  try { profiles = [...starterProfiles, ...JSON.parse(localStorage.getItem(storageKey) || "[]")]; } catch (error) { /* mantém os perfis iniciais */ }

  const $ = (selector) => document.querySelector(selector);
  const searchInput = $("#searchInput");
  const specialtyFilter = $("#specialtyFilter");
  const cityFilter = $("#cityFilter");
  const grid = $("#directoryGrid");
  const emptyState = $("#emptyState");
  const resultsCount = $("#resultsCount");

  const uniqueSorted = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const hydrateFilters = () => {
    const selectedSpecialty = specialtyFilter.value;
    const selectedCity = cityFilter.value;
    specialtyFilter.innerHTML = '<option value="all">Todas as áreas</option>' + uniqueSorted(profiles.flatMap((profile) => profile.specialties)).map((specialty) => `<option value="${escapeHtml(specialty)}">${escapeHtml(specialty)}</option>`).join("");
    cityFilter.innerHTML = '<option value="all">Todo o Brasil</option>' + uniqueSorted(profiles.map((profile) => profile.city)).map((city) => `<option value="${escapeHtml(city)}">${escapeHtml(city)}</option>`).join("");
    if ([...specialtyFilter.options].some((option) => option.value === selectedSpecialty)) specialtyFilter.value = selectedSpecialty;
    if ([...cityFilter.options].some((option) => option.value === selectedCity)) cityFilter.value = selectedCity;
  };

  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
  const formatSpecialties = (specialties) => specialties.slice(0, 2).map((specialty) => `<span>${escapeHtml(specialty)}</span>`).join("");
  const cardTemplate = (profile, index) => `<article class="lawyer-card ${profile.featured ? "is-featured" : ""}" data-testid="profile-card-${profile.id}" style="--card-delay:${index * 55}ms">
    <button class="card-open" type="button" data-profile-id="${escapeHtml(profile.id)}" data-testid="profile-open-button-${profile.id}" aria-label="Ver perfil de ${escapeHtml(profile.name)}"><div class="card-photo" style="background-image:url('${escapeHtml(profile.photo)}')"><span class="card-badge">${profile.featured ? "EM DESTAQUE" : "PERFIL LEXA"}</span><span class="view-profile">Ver perfil <b>↗</b></span></div><div class="card-body"><div class="card-kicker"><span>${escapeHtml(profile.type)}</span><span class="availability"><i></i> disponível</span></div><h3>${escapeHtml(profile.name)}</h3><p class="card-location">⌖ ${escapeHtml(profile.city)}</p><div class="specialties">${formatSpecialties(profile.specialties)}</div></div></button>
    <div class="card-foot"><a href="tel:${escapeHtml(profile.phone.replace(/\D/g, ""))}" data-testid="profile-phone-link-${profile.id}">${escapeHtml(profile.phone)}</a><button class="mini-whatsapp" type="button" data-whatsapp-id="${escapeHtml(profile.id)}" data-testid="profile-whatsapp-button-${profile.id}">WhatsApp <span aria-hidden="true">↗</span></button></div>
  </article>`;

  const renderProfiles = () => {
    const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
    const specialty = specialtyFilter.value;
    const city = cityFilter.value;
    const filtered = profiles.filter((profile) => {
      const searchable = [profile.name, profile.city, profile.address, ...profile.specialties].join(" ").toLocaleLowerCase("pt-BR");
      return (!term || searchable.includes(term)) && (specialty === "all" || profile.specialties.includes(specialty)) && (city === "all" || profile.city === city);
    });
    resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? "perfil encontrado" : "perfis encontrados"}`;
    grid.innerHTML = filtered.map(cardTemplate).join("");
    grid.hidden = filtered.length === 0;
    emptyState.hidden = filtered.length !== 0;
    grid.querySelectorAll("[data-profile-id]").forEach((button) => button.addEventListener("click", () => openDetail(button.dataset.profileId)));
    grid.querySelectorAll("[data-whatsapp-id]").forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); openWhatsApp(button.dataset.whatsappId); }));
  };

  const getProfile = (id) => profiles.find((profile) => profile.id === id);
  const whatsappUrl = (profile, customMessage) => `https://wa.me/${String(profile.whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(customMessage || `Olá! Encontrei o perfil de ${profile.name} na Lexa e gostaria de agendar uma conversa.`)}`;
  const openWhatsApp = (id) => { const profile = getProfile(id); if (!profile) return; window.open(whatsappUrl(profile), "_blank", "noopener,noreferrer"); showToast("WhatsApp aberto com a mensagem pronta para revisão."); };
  const openDetail = (id) => {
    const profile = getProfile(id); if (!profile) return;
    const dialog = $("#detailDialog");
    $("#detailContent").innerHTML = `<div class="detail-layout"><div class="detail-image" style="background-image:url('${escapeHtml(profile.photo)}')" role="img" aria-label="Foto de ${escapeHtml(profile.name)}" data-testid="detail-profile-image"><span class="detail-image-label">LEXA / PERFIL</span></div><div class="detail-copy"><div class="detail-topline"><span class="eyebrow">${escapeHtml(profile.type)}</span><button class="dialog-close" type="button" aria-label="Fechar perfil" data-testid="close-detail-button">×</button></div><h2 id="detail-title" data-testid="detail-profile-name">${escapeHtml(profile.name)}</h2><p class="detail-location" data-testid="detail-profile-city">⌖ ${escapeHtml(profile.city)}</p><p class="detail-description" data-testid="detail-profile-description">${escapeHtml(profile.description)}</p><div class="detail-tags" data-testid="detail-profile-specialties">${profile.specialties.map((specialty) => `<span>${escapeHtml(specialty)}</span>`).join("")}</div><div class="detail-info"><div><small>ENDEREÇO</small><strong data-testid="detail-profile-address">${escapeHtml(profile.address)}</strong></div><div><small>HORÁRIO</small><strong data-testid="detail-profile-hours">${escapeHtml(profile.hours)}</strong></div><div><small>TELEFONE</small><a href="tel:${escapeHtml(profile.phone.replace(/\D/g, ""))}" data-testid="detail-profile-phone">${escapeHtml(profile.phone)}</a></div></div><div class="detail-actions"><button class="btn btn-whatsapp" type="button" data-detail-whatsapp="${escapeHtml(profile.id)}" data-testid="detail-whatsapp-button">Conversar no WhatsApp <span aria-hidden="true">↗</span></button><a class="btn btn-dark" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address + ", " + profile.city)}" data-testid="detail-map-link">Ver localização</a></div><p class="api-note" data-testid="whatsapp-mode-notice">Integração WhatsApp Business: <strong>MODO MOCKED</strong> · mensagem preparada para você revisar antes de enviar.</p></div></div>`;
    dialog.showModal();
    $("[data-testid='close-detail-button']").addEventListener("click", () => dialog.close());
    $("[data-detail-whatsapp]").addEventListener("click", () => openWhatsApp(id));
  };

  const showToast = (message) => { const toast = $("#toast"); toast.textContent = message; toast.classList.add("visible"); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 3600); };
  hydrateFilters(); renderProfiles();
  [searchInput, specialtyFilter, cityFilter].forEach((element) => element.addEventListener("input", renderProfiles));
  $("#clearFilters").addEventListener("click", () => { searchInput.value = ""; specialtyFilter.value = "all"; cityFilter.value = "all"; renderProfiles(); });
  $("#emptyClearButton").addEventListener("click", () => { $("#clearFilters").click(); });

  const profileDialog = $("#profileDialog");
  const closeProfile = () => profileDialog.close();
  $("#openProfileForm").addEventListener("click", () => profileDialog.showModal());
  $("#closeProfileForm").addEventListener("click", closeProfile); $("#cancelProfileForm").addEventListener("click", closeProfile);
  $("#profileForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget; const data = new FormData(form); const file = data.get("photo"); let photo = config.images.lawyer;
    if (file && file.size) photo = await new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(file); });
    const profile = { id: `custom-${Date.now()}`, name: String(data.get("name")), type: String(data.get("type")), specialties: String(data.get("specialties")).split(",").map((item) => item.trim()).filter(Boolean), city: String(data.get("city")), address: String(data.get("address")), phone: String(data.get("phone")), whatsapp: String(data.get("whatsapp")), hours: "Atendimento com hora marcada", description: String(data.get("description")), photo, featured: false };
    const customProfiles = profiles.filter((item) => item.id.startsWith("custom-")); customProfiles.push(profile); profiles = [...starterProfiles, ...customProfiles];
    try { localStorage.setItem(storageKey, JSON.stringify(customProfiles)); } catch (error) { /* continua durante a sessão */ }
    hydrateFilters(); renderProfiles(); form.reset(); closeProfile(); showToast("Perfil publicado e adicionado ao diretório."); document.querySelector("#encontrar").scrollIntoView({ behavior: "smooth" });
  });
  $("#detailDialog").addEventListener("click", (event) => { if (event.target === event.currentTarget) event.currentTarget.close(); });
  const menu = $("#menu"); const nav = $("#nav"); menu.addEventListener("click", () => { const open = nav.classList.toggle("open"); menu.setAttribute("aria-expanded", String(open)); }); nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => nav.classList.remove("open")));
});